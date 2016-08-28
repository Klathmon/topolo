require('babel-register')
global.verbose = true

var readConfig = require('../src/readConfig').default
var getUnorderedTaskNames = require('../src/sortingFunctions').getUnorderedTaskNames
var buildTaskList = require('../src/sortingFunctions').buildTaskList

readConfig(__dirname + '/testfil2.json').then((tasks) => {
  const unorderedTaskNames = getUnorderedTaskNames(tasks, ['test', 'showCoverage'])
  buildTaskList(tasks, unorderedTaskNames)
})
