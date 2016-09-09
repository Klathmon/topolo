# Topolo

This is all very experimental and VERY unfinished. If you stumble across this library for any
reason, don't use it. It will break, it will change, it probably won't even work. Just don't.

### V0.2 idea:

Example
```js
import { tasks, seq, par } from 'topolo'

tasks.clean = () => 'rimraf dist coverage'
tasks.sayDone = () => console.log('All done!')
tasks.test = (watch = false) => seq(tasks.clean.opt, `mocha ${(watch ? '--watch' : '')}`, tasks.sayDone)
tasks.testWatch = () => tasks.test(true)
tasks.build = (target = 'web') => seq(tasks.clean, tasks.test, `webpack --env=${target === 'web' ? 'web' : 'cordova'}`)

```
a task is a function that return an array. each item in the array will be done sequentially, an array in the array will be done in parallel. (maybe extract these out into parallel and sequential functions like gulp4?).

you can reference other tasks by invoking their task name in a topolo task object (or something similar, depending on implementation). By invoking the function, it basically returns the task's "array" (or array-like structure for holding sequences-of/parallel tasks). This lets you pass in optional parameters to a task to alter how it runs based on the caller (so you can make a test `test` task that can add the `--watch` flag when called with true as it's first parameter).
