import { createApp } from './app'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  // since there could potentially be asynchronous route hooks or components,
  // we will be returning a Promise so that the server can wait until
  // everything is ready before rendering.
  return new Promise(async (resolve, reject) => {
    const { app, router, store } = await createApp({
      locale: context.locale
    })

    // set server-side router's location
    router.push(context.url)
    context.meta = app.$meta()

    // app.$i18n.locale = context.locale
    // axios.defaults.headers.common['Accept-Language'] = context.locale

    // wait until router has resolved possible async components and hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        // eslint-disable-next-line
        return reject({ code: 404 })
      }

      // Custom `httpStatusCode` property on the vue-meta metaInfo property
      // that allows us to set the HTTP response code during SSR.
      if (matchedComponents[0].metaInfo) {
        context.httpStatusCode = matchedComponents[0].metaInfo.httpStatusCode || 200
      }

      // call `asyncData()` on all matched route components
      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // When we attach the state to the context, and the `template` option
        // is used for the renderer, the state will automatically be
        // serialized and injected into the HTML as `window.__INITIAL_STATE__`.

        // context.state = store.state

        // the Promise should resolve to the app instance so it can be rendered
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
