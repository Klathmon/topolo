#!/usr/bin/env node
import { basename } from 'path'
import yargs from 'yargs'
import capitalize from 'capitalize'
import Liftoff from 'liftoff'
import { jsVariants } from 'interpret'
import { isEmpty } from 'lodash'

import { setVerboseMode, logVerbose, fatalError } from './events'
import expandConfig from './expandConfig'
import buildRequiredTaskList from './buildRequiredTaskList'
import buildTaskDependencyGraph from './buildTaskDependencyGraph'
import sortTasks from './sort'
import runTasks from './runner'

const APP_NAME = basename(__filename).split('.')[0]

const {
  _: launchTasks,
  config,
  verbose
} = yargs
  .usage(`Usage: ${APP_NAME} [task...]`)
  .example(`\`${APP_NAME} build clean\``, 'runs both the build and the clean task in maximum concurrency')
  .help('h')
  .version()
  .alias('h', 'help')
  .alias('v', 'version')
  .demand(1)
  .option('V', {
    description: 'Enables verbose logging',
    alias: 'verbose',
    type: 'boolean',
    default: false
  })
  .option('c', {
    description: 'Set the config file to a specific file/path (relative to the current working directory)',
    alias: 'config',
    type: 'string',
    normalize: true
  })
  .argv

const liftoff = new Liftoff({
  processTitle: capitalize(APP_NAME),
  moduleName: APP_NAME,
  configName: `${APP_NAME}.config`,
  extensions: jsVariants
})

// Apply options passed in
setVerboseMode(verbose)
if (verbose) {
  logVerbose('Verbose mode enabled.')
}
const launchOptions = {}
if (!isEmpty(config)) {
  launchOptions.configPath = config
}

logVerbose('Launch Options: ' + JSON.stringify(launchOptions, undefined, 2))

liftoff.launch(launchOptions, async function ({ configPath }) {
  if (isEmpty(configPath)) {
    fatalError(`Could not find ${capitalize(APP_NAME)} config file`)
  }

  logVerbose(`Using config file at ${configPath}`)
  const config = require(configPath)
  logVerbose('Config: ' + JSON.stringify(config, undefined, 2))
  const tasks = expandConfig(config)
  logVerbose('Expanded Tasks Object: ' + JSON.stringify(tasks, undefined, 2))
  const taskNameSet = buildRequiredTaskList(tasks, launchTasks)
  logVerbose('TaskName Set: ' + JSON.stringify(taskNameSet, undefined, 2))
  const taskDepGraph = buildTaskDependencyGraph(tasks, taskNameSet)
  logVerbose('Task Dependency Graph: ' + JSON.stringify(taskDepGraph, undefined, 2))
  const sortedTasks = sortTasks(taskDepGraph, taskNameSet)
  logVerbose('Sorted Task Array: ' + JSON.stringify(sortedTasks, undefined, 2))
  await runTasks(sortedTasks)
  logVerbose('Done all tasks.')
})
