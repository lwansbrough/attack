import Vue from 'vue'
import Vuex from 'vuex'
import dawPlayback from '@areas/daw/stores/playback'
import dawWorkspace from '@/src/areas/daw/stores/workspace'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    modules: {
      'daw/playback': dawPlayback,
      'daw/workspace': dawWorkspace
    }
  })
}
