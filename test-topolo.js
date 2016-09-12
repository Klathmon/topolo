import { tasks, addTask } from './new-src/builder'

addTask('test1', (thing) => thing)
// console.log(tasks.task1)
addTask('test2', tasks.test1.optional()('123'))
console.log(tasks.test1.flags)
