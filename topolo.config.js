
module.exports = {
  clean: 'rimraf lib .nyc_output coverage',
  build: {
    command: 'babel ./src --out-dir ./lib',
    env: {
      NODE_ENV: 'production'
    },
    dependencies: 'clean'
  }
}
