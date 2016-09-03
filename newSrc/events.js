import { EventEmitter } from 'events'
import { isString, isError } from 'lodash'
import { white, cyan, magenta, gray } from 'chalk'
import moment from 'moment'

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

export function throwError (err) {
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
    const timeSpent = _formatTime(...process.hrtime(startTime))
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
  return white('[') + gray(moment().format('HH:mm:ss.SSS')) + white(']') + ' '
}

function _formatTime (seconds, nanoseconds) {
  const microseconds = Math.floor(nanoseconds / 1000)
  const milliseconds = Math.floor(microseconds / 1000)
  const fractionalSecond = Math.floor(milliseconds / 10) // if it was 1.34 seconds, this will be 34
  const minutes = Math.floor(seconds / 60)

  if (minutes >= 1) {
    return minutes + ' min'
  } else if (seconds >= 10) {
    return seconds + ' s'
  } else if (seconds >= 1) {
    return seconds + '.' + ('00' + fractionalSecond).substr(-2, 2) + ' s'
  } else if (milliseconds >= 1) {
    return milliseconds + ' ms'
  } else if (microseconds >= 1) {
    return microseconds + ' μs'
  } else {
    return nanoseconds + ' ns'
  }
}
