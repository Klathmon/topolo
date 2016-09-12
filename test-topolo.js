import { taskStorage, addTask } from './new-src/builder'

addTask('test1', (thing) => thing)
addTask('test2', () => [taskStorage.test1.optional.silent])

console.log(taskStorage.test1)
console.log(taskStorage.test2)
