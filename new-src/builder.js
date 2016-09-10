
export const taskObject = {}

export function addTask (taskName, task) {
  taskObject[taskName] = task
  taskObject[taskName].opt = 'stuff'
}
