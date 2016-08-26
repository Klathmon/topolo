import { resolve } from 'path'
import { readFile } from 'fs'
import { mapValues } from 'lodash'

import promisify from 'es6-promisify'
import { packageJson } from './packageJson'
import { logVerbose } from './log'

const readFileAsync = promisify(readFile)
const programName = packageJson.name

/**
 * Reads the given configFile and returns the "task" object with sensable defaults
 * @param  {String} configFile The filename or path to the file (will be converted to a full path based on the pwd)
 * @return {Object}            The task object with sensable defaults
 */
export default async function readConfig (configFile) {
  const configFileFullPath = resolve(configFile)
  logVerbose(`Using config file at ${configFileFullPath}`)
  const rawConfig = JSON.parse(await readFileAsync(configFileFullPath))
  // Pull out the sub-object from a package.json if we are reading one, otherwise use the whole file
  const config = (programName in rawConfig ? rawConfig[programName] : rawConfig)
  // map over the config's values and add the task name as a property, this returns an object
  return mapValues(config, (task, taskName) => ({
    env: [], // These will be overwritten by spreading task below them
    command: null, // These will be overwritten by spreading task below them
    dependencies: [], // These will be overwritten by spreading task below them
    optionalDependencies: [], // These will be overwritten by spreading task below them
    ...task,
    name: taskName // This will overwrite anything in task
  }))
}
