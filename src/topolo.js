import commander from 'commander'

import { packageJson } from './packageJson'
import { logVerbose, logError } from './log'
import { getUnorderedTaskNames, getOrderedTasks, buildTaskList } from './sortingFunctions'
import readConfig from './readConfig'
import runTasks from './runner'

commander
  .version(packageJson.version)
  .usage('<task ...>')
  .option('-c, --config <config>', 'select the config file', './package.json')
  .option('--verbose', 'enable verbose logging mode', false)
  .command('* [command...]')
  .description('run the given task')
  .action(run)

commander.parse(process.argv)

async function run (launchTaskNames) {
  try {
    const {
      config,
      verbose = false
    } = commander.opts()

    global.verbose = verbose
    if (verbose) logVerbose('Verbose logging enabled')

    const tasks = await readConfig(config)
    logVerbose('Tasks from config:')
    logVerbose(tasks)

    const unorderedTaskNames = getUnorderedTaskNames(tasks, launchTaskNames)
    const taskList = buildTaskList(tasks, unorderedTaskNames)
    const orderedTaskList = getOrderedTasks(taskList, unorderedTaskNames)

    await runTasks(orderedTaskList)

    logVerbose('Done all tasks')
  } catch (err) {
    logError(err)
  } finally {
    logVerbose('Exiting')
  }
}
