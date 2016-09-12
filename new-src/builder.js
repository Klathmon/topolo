
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

export function addTask (taskName, taskGenerator) {
  const task = function (...args) {
    this.task = taskGenerator(...args)
  }
  Object.defineProperties(task, {
    get optional () {
      this.flags.optional = true
      return this
    },
    get silent () {
      this.flags.silent = true
      return this
    }
  })

  tasks[taskName] = task
}
