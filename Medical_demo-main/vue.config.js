const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// const { resolve } = require('core-js/fn/promise')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // 代理配置
    proxy: {

      '/api': {
        // target: 'http://localhost:8085', // 我们要代理的地址
        target: 'http://10.16.59.160:8085', // 我们要代理的地址
        // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {

          '^/api': ''
        }
      },
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
})
