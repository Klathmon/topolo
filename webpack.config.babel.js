import webpack from 'webpack'
import path from 'path'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'

export default {
  target: 'node',
  entry: path.resolve(__dirname, 'src', 'topolo.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'topolo.js'
  },
  externals: {
    'spawn-sync': 'commonjs spawn-sync',
    'vertx': 'commonjs vertx'
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.LoaderOptionsPlugin({ debug: false, minimize: true }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
        unsafe: true,
        collapse_vars: true,
        pure_getters: true,
        keep_fargs: false
      },
      output: {
        comments: false
      }
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/i,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        'plugins': [
          'transform-runtime'
        ],
        presets: [
          ['es2015', { modules: false, loose: true }],
          'stage-2'
        ]
      }
    }, {
      test: /\.json$/i,
      exclude: /node_modules/,
      loader: 'json-loader'
    }]
  }
}
