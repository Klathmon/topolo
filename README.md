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
      before: 'a',
      after: 'b',
      optionalBefore: 'c',
      optionalAfter: 'd',
      anytime: 'e'
    }
  }
}

```
