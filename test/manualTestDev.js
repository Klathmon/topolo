require('babel-register')
global.verbose = true

var readConfig = require('../src/readConfig').default
var getUnorderedTaskNames = require('../src/sortingFunctions').getUnorderedTaskNames
var buildTaskList = require('../src/sortingFunctions').buildTaskList
var getOrderedTasks = require('../src/sortingFunctions').getOrderedTasks

readConfig(__dirname + '/testfil2.json').then((tasks) => {
  const unorderedTaskNames = getUnorderedTaskNames(tasks, ['test', 'showCoverage'])
  const taskList = buildTaskList(tasks, unorderedTaskNames)
  const orderedTaskList = getOrderedTasks(taskList, unorderedTaskNames)
})
