// assert模块是Node的内置模块，主要用于断言。如果表达式不符合预期，就抛出一个错误。该模块提供11个方法，但只有少数几个是常用的
// let assert = require('assert');
// assert(value, message); 当第一个参数对应的布尔值为true时，不会有任何提示，返回undefined。当第一个参数对应的布尔值为false时，会抛出一个错误，该错误的提示信息就是第二个参数设定的字符串
// assert.ok(value, message) assert方法的另一个名字，与assert方法完全一样
// assert.equal(actual, expected, [message]) 接受三个参数，第一个参数是实际值，第二个是预期值，第三个是错误的提示信息。
// assert.notEqual(actual, expected, [message]) 用法与equal方法类似，但只有在实际值等于预期值时，才会抛出错误。
// assert.deepEqual(actual, expected, [message]) 比较两个对象。只要它们的属性一一对应，且值都相等，就认为两个对象相等，否则抛出一个错误。
// assert.notDeepEqual(actual, expected, [message]) 与deepEqual方法正好相反，用来断言两个对象是否不相等。
// assert.strictEqual(actual, expected, [message]) 使用严格相等运算符（===），比较两个表达式。
// assert.notStrictEqual(actual, expected, [message]) 使用严格不相等运算符（!==），比较两个表达式。
// assert.throws(block, [error], [message]) 预期某个代码块会抛出一个错误，且抛出的错误符合指定的条件。
// assert.doesNotThrow(block, [message]) 与throws方法正好相反，预期某个代码块不抛出错误。
// assert.ifError(value) 断言某个表达式是否false，如果该表达式对应的布尔值等于true，就抛出一个错误。它对于验证回调函数的第一个参数十分有用，如果该参数为true，就表示有错误。
// assert.fail(actual, expected, message, operator) 不管参数是什么值，它总是抛出一个错误。如果message的布尔值不为false，抛出的错误信息就是message，否则错误信息就是“实际值 + 分隔符 + 预期值”。

const path = require('path')
const isProduction = process.env.NODE_ENV !== 'development'
const GenerateAssetPlugin = require('generate-asset-webpack-plugin'); 
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const port = process.env.port || process.env.npm_config_port || 8080 // dev port

function getVersion() {
  return 'var = 版本号1.0'
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  runtimeCompiler: true,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    // proxy: {
    //   '/api/': {
    //     target: 'http://127.0.0.1:3000',
    //     changeOrigin: true, // 如果接口跨域，需要进行该参数配置
    //     pathRewrite: {
    //       '^/api/': '/'
    //     }
    //   }
    // }
  },
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.tsx?$/,
  //         loader: 'ts-loader',
  //         exclude: /node_modules/,
  //         options: {
  //           appendTsSuffixTo: [/\.vue$/],
  //         }
  //       }
  //     ]
  //   }
  // },
  configureWebpack: config => {
    if (isProduction) {
      config.plugins.push(
        // 创建版本文件
        new GenerateAssetPlugin({
          filename: 'static/js/version.js',
          fn: (compilation, cb) => {
            cb(null, getVersion(compilation));
          },
          extraFiles: []
        })
      )
    }
    config.plugins.push(
      // 创建版本文件
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
      })
    )
    Object.assign(config, {
      resolve: {  
        extensions: [".ts", ".tsx", ".js", ".json"],   //在resolve.extensions中增加.ts，目的是在代码中引入ts文件不用写.ts后缀
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      }
    })
  },
  chainWebpack(config) {
    config.entry('main').add('babel-polyfill'),
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '标题'
        return args
      })
    // config.module
    //   .rule('tsx')
    //   .test(/\.tsx?$/)
    //   .use('ts-loader')
    //     .loader('ts-loader')
    //     .options({
    //       appendTsSuffixTo: [/\.vue$/],   
    //     })
    //     .tap(options => {
    //       // 修改它的选项...
    //       return options
    //     })
    // config.module
    //   .rule('sass')
    //   .test(/\.scss$/)
    //   .use('sass-loader')
    //     .loader('sass-loader')
  }
}
