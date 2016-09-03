import { isEmpty, isString, isError } from 'lodash'
import { white, cyan, magenta, gray, green } from 'chalk'
import prettyHrtime from 'pretty-hrtime'
import { format } from 'fecha'

const localConsoleLog = (process.env.NODE_ENV === 'testing' ? () => null : console.log)
let verboseMode = false

const VERBOSE = Symbol('VERBOSE')
const LOG = Symbol('LOG')

export function setVerboseMode (mode) {
  verboseMode = !!mode
}

export function logVerbose (message) {
  if (isString(message)) {
    log(VERBOSE, message)
  } else {
    log(VERBOSE, JSON.stringify(message, undefined, 2))
  }
}

export function fatalError (err) {
  if (isError(err)) {
    logAndThrowErr(err)
  } else {
    logAndThrowErr(new Error(err))
  }
}

export function startTask (taskName) {
  const startTime = process.hrtime()
  return function logTask (taskName, command) {
    log(LOG, white('Starting \'') + cyan(taskName) + white('\'...'))
    if (!isEmpty(command)) {
      log(LOG, green(command))
    }
    return function endTask () {
      const timeSpent = prettyHrtime(process.hrtime(startTime))
      log(LOG, white('Finished \'') + cyan(taskName) + white('\' after ') + magenta(timeSpent))
    }
  }
}

function log (logLevel, message) {
  if (!verboseMode && logLevel === VERBOSE) return // Skip if verbose mode isn't turned on

  localConsoleLog(_getTimestamp() + white(message))
}

function logAndThrowErr (err) {
  localConsoleLog(_getTimestamp() + white.bgRed(err.message))
  localConsoleLog(err)
  throw err
}

function _getTimestamp () {
  return white('[') + gray(format(new Date(), 'longTime')) + white(']') + ' '
}
