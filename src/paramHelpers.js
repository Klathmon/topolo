
export const SEP = ':'

export function getRootTaskName (taskName) {
  return taskName.split(SEP)[0]
}

export function getParams (taskName) {
  return taskName.split(SEP).slice(1)
}
