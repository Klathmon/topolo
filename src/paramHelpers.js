
export const SEP = ':'

export function getRootTaskName (taskName) {
  return taskName.split(SEP)[0]
}
