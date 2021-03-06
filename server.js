const fs = require('fs')
const path = require('path')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const locale = require('locale')
const cookieParser = require('cookie-parser')

const isProduction = process.env.NODE_ENV === 'production'
const resolve = (file) => path.resolve(__dirname, file)

const app = express()
const template = fs.readFileSync(resolve('./public/index.template.html'), 'utf-8')

const createRenderer = (bundle, options) => {
  return require('vue-server-renderer').createBundleRenderer(bundle, Object.assign(options, {
    template,
    basedir: resolve('./dist'),
    runInNewContext: false
  }))
}

const serve = (path, cache) => {
  return express.static(resolve(path))
}

let renderer
let readyPromise

if (isProduction) {
  // In production: create server renderer using built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const bundle = require('./dist/vue-ssr-server-bundle.json')

  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    clientManifest
  })
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options)
  })
}

// Initialize some express plugins
app.use(locale(require('./i18n/_supported.json'), 'en'))
app.use(compression({ threshold: 0 }))
app.use(cookieParser())

// Map some of the root paths to their appropiate location.
app.use(favicon('./public/icons/icon192.png'))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/robots.txt', serve('./public/robots.txt', true))
app.use('/humans.txt', serve('./public/humans.txt', true))
app.use('/ads.txt', serve('./public/ads.txt', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

const render = (req, res, context) => {
  const s = Date.now()

  !isProduction && console.log(`Rendering: ${req.url}`)

  res.setHeader('Content-Type', 'text/html')

  const errorHandler = (err) => {
    // TODO: Render Error Page
    console.error(`Fatal error when rendering : ${req.url}`)
    console.error(err)

    res.status(500)
    res.end(`500 | Fatal error: ${err}`)

    !isProduction && console.log(`Whole request: ${Date.now() - s}ms`)
  }

  renderer.renderToString(context, (err, html) => {
    if (err) return errorHandler(err)

    // Override the responses status code with
    // one provided by a view component.
    res.status(context.httpStatusCode || 200)
    res.end(html)

    !isProduction && console.log(`Whole request: ${Date.now() - s}ms`)
  })
}

app.get('*', (req, res) => {
  const context = {
    url: req.url,
    locale: req.cookies.locale || req.locale || 'en'
  }

  isProduction
    ? render(req, res, context)
    : readyPromise.then(() => render(req, res, context))
})

const port = process.env.PORT || 8000
let server = app.listen(port, () => {
  console.log(`Server started at localhost:${port}`)
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
