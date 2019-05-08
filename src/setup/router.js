import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import { routes } from '@src/config'

Vue.use(Router)
Vue.use(Meta, {
  keyName: 'metaInfo',
  attribute: 'data-vm',
  ssrAttribute: 'data-vm-ssr',
  tagIDKeyName: 'vmid'
})

export function createRouter () {
  // push as last element because the wildcard match will catch all the unknown urls
  routes.push({ path: '*', component: () => import('@views/not-found/NotFound.vue') })

  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
}
