import { EventEmitter } from 'events'
import { isString, isError } from 'lodash'
import { white, cyan, magenta, gray } from 'chalk'
import prettyHrtime from 'pretty-hrtime'
import { format } from 'fecha'

const localConsoleLog = console.log
const localVerboseMode = global.verbose

const VERBOSE = Symbol('VERBOSE')
const LOG = Symbol('LOG')

class LoggingEvents extends EventEmitter {}
const eventBus = new LoggingEvents()

export function logVerbose (message) {
  if (isString(message)) {
    eventBus.emit('log', VERBOSE, message)
  } else {
    eventBus.emit('log', VERBOSE, JSON.stringify(message, undefined, 2))
  }
}

export function fatalError (err) {
  if (isError(err)) {
    eventBus.emit('err', err)
  } else {
    eventBus.emit('err', new Error(err))
  }
}

export function startTask (taskName) {
  const startTime = process.hrtime()
  eventBus.emit('log', LOG, white('Starting \'') + cyan(taskName) + white('\'...'))

  return function endTask () {
    const timeSpent = prettyHrtime(process.hrtime(startTime))
    eventBus.emit('log', LOG, white('Finished \'') + cyan(taskName) + white('\' after ') + magenta(timeSpent))
  }
}

eventBus.on('log', (logLevel, message) => {
  if (!localVerboseMode && logLevel === VERBOSE) return // Skip if verbose mode isn't turned on

  localConsoleLog(_getTimestamp() + white(message))
})

eventBus.on('err', (err) => {
  localConsoleLog(_getTimestamp() + white.bgRed(err.message))
  localConsoleLog(err)
  throw err
})

function _getTimestamp () {
  return white('[') + gray(format(new Date(), 'longTime')) + white(']') + ' '
}
