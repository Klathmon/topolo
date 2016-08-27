import { memoize } from 'lodash'

import { logVerbose } from './log'

const SEP = ':'

const buildRegexMemoized = memoize(buildRegex)

export function getCannonicalName (name) {
  return name.split(SEP)[0]
}

export function getParams (name) {
  return name.split(SEP).slice(1)
}

export function expandParams (str, params, defaultParams) {
  logVerbose(`Starting Command: "${str}"`)
  let expandedString = str

  params.forEach((value, index) => {
    expandedString = expandedString.replace(buildRegexMemoized(index), value)
  })

  defaultParams.forEach((value, index) => {
    expandedString = expandedString.replace(buildRegexMemoized(index), value)
  })

  logVerbose(`Expanded Command: "${expandedString}"`)
  return expandedString
}

function buildRegex (index) {
  return new RegExp(`(\\\$${index + 1})`)
}
