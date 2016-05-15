const webpack = require("webpack");

module.exports = [
  {
    entry: ['./src-client/boot.ts'],
    output: {
      filename: './bundles/webpack.bundle.js'
    },
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin() // minify enabled
    ],
    module: {
      loaders: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'babel-loader!ts-loader' // first ts-loader(with tsconfig.json), second babel-loader        
        }
      ]
    },
    devtool: 'source-map', // output source map
  }, {
    entry: ['./src-client/store/index.ts'],
    output: {
      filename: './bundles/store.bundle.js'
    },
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    plugins: [
      // new webpack.optimize.UglifyJsPlugin() // minify enabled
    ],
    module: {
      loaders: [
        {
          test: /\.ts$/,
          exclude: [/node_modules/],
          loader: 'babel-loader!ts-loader' // first ts-loader(with tsconfig.json), second babel-loader        
        }
      ]
    },
    devtool: 'source-map', // output source map
  }
]