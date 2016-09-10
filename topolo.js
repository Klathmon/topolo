import { task, tasks, parallel as p, sequential as s } from 'topolo'

task('clean', () => 'rimraf lib .nyc_output coverage')
task('test', (watch = false) => s(
  tasks.clean.opt(),
  `nyc mocha test/test.js ${(watch === true ? '--watch' : '')}`
))
task('build', () => s(
  p(task.clean.opt(), task.test.opt(false)),
  'babel ./src --out-dir ./lib'
))
task('showCoverage', (port = 8080) => s(
  p(task.clean.opt(), task.test.opt(true), task.test.opt(false)),
  p(task.opn(port), `http-server ./coverage -p ${port} -c-1`)
))
task('opn', (port = 8080) => `opn http://localhost:${port}`)
