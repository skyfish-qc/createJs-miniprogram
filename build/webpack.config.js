const fs = require('fs')
const path = require('path')
const StringReplacePlugin = require("string-replace-webpack-plugin");

function resolveCreateJsModule() {
  const code = fs.readFileSync(path.resolve('./src/createjs.js'), 'utf8')
  return code
}

module.exports = {
  entry: path.join(__dirname, '../src/index'),
  target: 'web',
  output: {
    path: path.join(__dirname, '../dist/'),
    // path: path.join(__dirname, '../example/libs/'),
    filename: 'createjs.miniprogram.js',
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            "@babel/preset-env",
          ],
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      },
      { 
        test: /\index.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /__INJECT_CREATEJS__/ig,
              replacement: () => {
                return resolveCreateJsModule()
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
      new StringReplacePlugin()
  ],
  optimization:{
    minimize: true,
  }
}
