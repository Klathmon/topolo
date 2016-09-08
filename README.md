# Topolo

This is all very experimental and VERY unfinished. If you stumble across this library for any
reason, don't use it. It will break, it will change, it probably won't even work. Just don't.

### V0.2 idea:

Example
```js
import { tasks } from 'topolo'

tasks.clean = 'rimraf dist coverage'
tasks.sayDone = console.log('All done!')
tasks.test = (watch = false) => [tasks.clean.opt, `mocha ${(watch ? '--watch' : '')}`, tasks.sayDone]
tasks.testWatch = tasks.test(true)
tasks.build = (target = 'web') => [tasks.clean, tasks.test, `webpack --env=${target === 'web' ? 'web' : 'cordova'}`]

```
