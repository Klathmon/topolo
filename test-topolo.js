import { tasks, addTask } from './new-src/topolo'

addTask('test1', (thing) => thing)
addTask('test2', () => [tasks.test1.silent()])

console.log(tasks.test1)
console.log(tasks.test2)
