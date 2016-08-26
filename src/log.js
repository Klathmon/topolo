import { white, cyan, magenta, gray, black } from 'chalk'
import moment from 'moment'

export function startCommand (name) {
  const startTime = process.hrtime()
  _consoleLog(white('Starting \'') + cyan(name) + white('\'...'))

  return function endCommand () {
    const [ seconds, nanoseconds ] = process.hrtime(startTime)
    _consoleLog(white('Finished \'') + cyan(name) + white('\' after ') + magenta(_formatTime(seconds, nanoseconds)))
  }
}

export function logError (err) {
  let errToThrow = err
  if (typeof err === 'string') {
    errToThrow = new Error(err)
  }

  _consoleLog(white.bgRed('ERROR: ' + errToThrow.message))
  console.log()
  console.log(errToThrow)

  throw errToThrow
}

export function logVerbose (message) {
  if (global.verbose === true) {
    const verbose = black.bgWhite('VERBOSE:') + white(' ')
    if (typeof message === 'string') {
      _consoleLog(verbose + white(message))
    } else {
      _consoleLog(verbose + white(JSON.stringify(message, undefined, 2)))
    }
  }
}

function _consoleLog (message) {
  console.log(white('[') + gray(_getTime()) + white(']') + ' ' + message)
}

function _getTime () {
  return moment().format('HH:mm:ss.SSS')
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
