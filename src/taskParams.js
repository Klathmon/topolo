
const SEP = ':'

export function getCannonicalName (name) {
  return name.split(SEP)[0]
}

export function getParams (name) {
  return name.split(SEP).slice(1)
}

export function expandParams (str, params, defaultParams) {
  let expandedString = str

  params.forEach((value, index) => {
    expandedString = expandedString.replace(new RegExp(`\$(${index}`), value)
  })

  defaultParams.forEach((value, index) => {
    expandedString = expandedString.replace(new RegExp(`\$(${index}`), value)
  })

  return expandedString
}
