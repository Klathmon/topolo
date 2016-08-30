# Topolo

### Stuff to do:
* implement "before", "after", "optionalBefore", and "optionalAfter"
* implement allowing command to be an array
* allow commonjs export config file
* better error messages
* documentation
* full test coverage


```js
// Ideal stanza?

export default {
  build: {
    command: 'webpack',
    dependencies: {
      before: ['a'],
      after: 'b',
      optionalBefore: 'c',
      optionalAfter: 'd',
      anytime: 'e'
    }
  }
}

```

### Description

Similar to grunt/gulp in that it is a task runner, except everything is command-line based.

Tasks:
each task has a name, and an object/string for a value. The name is the key, it's what you will call the task with. The value can either be a "command", or an object with more definitions.


Command:
A command is a command-line command to be run for this task. A command can be:
* a string. This will be executed in a cross-platform(ish) way, and it will "complete" when it's done
* an array of strings. This will run each string within as a "string command" sequentially ([2] will only be run after [1] completes)
* a function. This will be invoked just before the command needs to be run, and it should return a string. Function is invoked with the "params" of the call (parameters are defined as anything after a colon in a "calling" task name)

Env:
Environment variables can be provide for this task. They will apply to all commands (if more than one) in the task, and will not apply to any other tasks (before, after, or during)

Deps:

Dependencies are defined on the "deps" or "dependencies" key (they are merged and treated the same). They can be:

* a string. This taks will be run *before* the task you are defining
* an array. The task names in the array will be run *before* the task you are defining. This does not define order, just that they should be run before this task.
* an object. The object can include a complex definition for what will run before, after, and even during this task. It can contain the following keys:
  * before: a string or an array of strings which can define tasks to run *before* this task
  * after: a string or an array of strings which can define tasks to run *after* this task
  * any: a string or an array of strings which can define tasks that *must* run, but can run at any time in comparison to this task
  * optionalBefore: a string or an array of strings which can define tasks that should run *before* this task, but only if another task (or the user) requires it
  * optionalAfter: a string or an array of strings which can define tasks that should run *after* this task, but only if another task (or the user) requires it


### Arch:

Systems:

the "read" pass - this will read in the config file either from the default location, or from the command line flag passed in.

the "expand" pass - this will take any "shortcut" definitions (ex. a string as a "dep" value) and will expand it to a fully defined task object with empty arrays/sensable defaults. (don't mess with the "command" key, as that should be invoked if it's a function, then reconciled right before execution)

the "collect" pass - this will run through the given "start tasks" and will create a list of "required" tasks that must be run (in no specific order).

the "graphbuilding" pass - this will convert all of the different dependencies into "before" dependencies (which may or may not be a DAG at this point)

the "sort" pass - this will topologically sort the tasks to ensure there are no cyclical dependencies and to make sure that the DAG resolves correctly.

the "run" pass - this will run each task with maximum concurrency, returning (via promise) when complete.
