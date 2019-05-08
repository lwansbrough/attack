const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProduction = process.env.NODE_ENV === 'production'
const resolve = dir => path.join(__dirname, '..', dir)

const config = {
  devtool: isProduction ? false : '#cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: 'js/[name].[chunkhash:8].js'
  },
  resolve: {
    modules: [resolve('src'), 'node_modules'],
    extensions: ['.mjs', '.jsx', '.js', '.vue', '.json', '.txt', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '..'),
      '@src': resolve('src'),
      '@public': resolve('public'),
      '@assets': resolve('assets'),
      '@areas': path.resolve(__dirname, '../src/areas'),
      '@views': path.resolve(__dirname, '../src/views'),
      '@models': path.resolve(__dirname, '../src/models'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@services': path.resolve(__dirname, '../src/services'),
      '@stores': path.resolve(__dirname, '../src/stores')
    }
  },
  module: {
    rules: [
      { test: /\.flow$/, loader: 'ignore-loader' },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'img/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 256,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: isProduction ? 'warning' : false
  },
  plugins: [
    new VueLoaderPlugin(),
    ...isProduction ? [
      new webpack.optimize.ModuleConcatenationPlugin()
    ] : [
      new FriendlyErrorsPlugin()
    ]
  ]
}

module.exports = config
