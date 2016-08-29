import { resolve } from 'path'
import { readFile } from 'fs'
import { mapValues } from 'lodash'
import promisify from 'es6-promisify'

import {
  COMMAND,
  ENV,
  DEFAULT_VALUES,
  REQ_ANYTIME,
  REQ_BEFORE,
  OPT_BEFORE,
  REQ_AFTER,
  OPT_AFTER
} from './configKeys'
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
  const rawConfig = JSON.parse(await readFileAsync(configFileFullPath, 'utf8'))
  // Pull out the sub-object from a package.json if we are reading one, otherwise use the whole file
  const config = (programName in rawConfig ? rawConfig[programName] : rawConfig)
  // map over the config's values and set defaults for any missing params
  return mapValues(config, (task, taskName) => ({
    // These will be overwritten by spreading task below them
    [COMMAND]: null,
    [ENV]: [],
    [DEFAULT_VALUES]: [],
    [REQ_ANYTIME]: [],
    [REQ_BEFORE]: [],
    [OPT_BEFORE]: [],
    [REQ_AFTER]: [],
    [OPT_AFTER]: [],
    ...task
  }))
}
