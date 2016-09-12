/**
* Task Types:
* string - command
* parallel-array-obj - run in parallel
* seq-array-obj - run in seq
*/

/**
* Task option flags:
* optional
* silent/quiet
* no-error
*
*/

const defaultFlags = {
  optional: false,
  silent: false,
  ignoreErrors: false
}

export const taskStorage = {
}

export function addTask (taskName, taskGenerator, flags) {
  const task = createTask(taskGenerator, flags)

  taskStorage[taskName] = task
}

function createTask (taskGenerator, flags = {}) {
  const task = function (...args) {
    task.task = taskGenerator(...args)
  }
  task.flags = {
    ...defaultFlags,
    ...flags
  }

  for (let flag in defaultFlags) {
    Object.defineProperty(task, flag, {
      get: function () {
        this.flags[flag] = true
        return this
      }
    })
  }
  return task
}
