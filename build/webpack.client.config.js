const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const config = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js',
    vendor: ['axios', 'vue', 'vue-analytics', 'vue-i18n', 'vue-meta', 'vue-router', 'vuex', 'vuex-router-sync']
  },
  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: function (module) {
          // a module is extracted into the vendor chunk if...
          return (
          // it's inside node_modules
            /node_modules/.test(module.context) &&
              // and not a CSS file (due to extract-text-webpack-plugin limitation)
              !/\.css$/.test(module.request)
          )
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          !isProduction
            ? 'vue-style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    // This plugins generates `vue-ssr-client-manifest.json` in the
    // output directory.
    new VueSSRClientPlugin(),
    new MiniCssExtractPlugin({
      filename: 'common.[chunkhash].css'
    })
  ]
})

if (isProduction) {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'project',
      filename: 'service-worker.js',
      minify: true,

      staticFileGlobs: [
        'dist/**.css',
        'dist/**.js',
        'dist/img/**/*',
        'dist/fonts/**/*'
      ],

      runtimeCaching: [{
        urlPattern: /\/.*/,
        handler: 'networkFirst'
      }],

      dontCacheBustUrlsMatching: /./,
      navigateFallback: '/'
    })
  )
}

module.exports = config
