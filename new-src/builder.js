
export const tasks = {}

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
 * non-blocking?
 *
 */

const defaultFlags = {
  optional: false,
  silent: false
}

export function addTask (taskName, taskGenerator) {
  const task = function (...args) {
    task.task = taskGenerator(...args)
  }
  task.flags = {
    ...defaultFlags
  }
  task.optional = function () {
    this.flags.optional = true
    return this
  }
  // Object.defineProperties(task, {
  //   flags: {
  //     ...defaultFlags
  //   },
  //   get optional () {
  //     this.flags.optional = true
  //     return this
  //   },
  //   get silent () {
  //     this.flags.silent = true
  //     return this
  //   }
  // })

  tasks[taskName] = task
}
