import Vue from 'vue'
import VueRx from 'vue-rx'
import NoSSR from 'vue-no-ssr'
import { sync } from 'vuex-router-sync'

import { createI18n } from './setup/i18n'
import { createRouter } from './setup/router'
import { createStore } from './store'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRx)
Vue.component('no-ssr', NoSSR)

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export async function createApp (ssrContext) {
  const locale = ssrContext.locale || 'en'
  const fallbackLocale = 'en'

  // create i18n, store and router instances
  const i18n = await createI18n({ locale, fallbackLocale })
  const router = createRouter()
  const store = createStore()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    i18n,
    ssrContext,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}
