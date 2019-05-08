import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import { createApp } from './app'

Vue.component('draggable-resizable', VueDraggableResizable)

// Get the applications locale from the document lang tag so that we can
// use it to initialize the application later on, defaulting to english.
let locale = 'en'
if (document.documentElement.lang) {
  locale = document.documentElement.lang
}

createApp({ locale }).then(({ app, router, store }) => {
  if (window.__INITIAL_STATE__) {
    // If SSR injected the initial state, we get it
    // and replace the stores current state.
    store.replaceState(window.__INITIAL_STATE__)
  }

  Vue.mixin({
    // With this mixin we make sure the asyncData method is
    // called when we navigate but stay on the same route.
    beforeRouteUpdate (to, from, next) {
      const { asyncData } = this.$options
      if (asyncData) {
        asyncData({
          store: this.$store,
          route: to
        }).then(next).catch(next)
      } else {
        next()
      }
    }
  })

  router.onReady(() => {
    // Add router hook for handling asyncData.
    // Doing it after initial route is resolved so that we don't double-fetch
    // the data that we already have. Using `router.beforeResolve()` so that all
    // async components are resolved.
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)

      // we only care about non-previously-rendered components,
      // so we compare them until the two matched lists differ
      let diffed = false
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      })

      if (!activated.length) {
        return next()
      }

      // TODO: Trigger Loading Indicator

      Promise.all(activated.map(c => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to })
        }
      })).then(() => {
        // TODO: Stop Loading Indicator

        next()
      }).catch(next)
    })

    app.$mount('#app')
  })
})
