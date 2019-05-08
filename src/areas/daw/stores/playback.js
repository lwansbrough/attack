import * as playbackService from '../services/playback'

const state = {
  bpm: 120
}

const actions = {
  stop (context) {
    context.commit('stop')
  },
  start (context) {
    context.commit('start')
  },
  setBPM (context, bpm) {
    context.commit('setBPM', bpm)
  }
}

const mutations = {
  stop (state) {
    playbackService.stop()
  },
  start (state) {
    playbackService.start()
  },
  setBPM (state, bpm) {
    state.bpm = bpm
    playbackService.setBPM(bpm)
  }
}

const getters = {
  bpm: state => state.bpm
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
