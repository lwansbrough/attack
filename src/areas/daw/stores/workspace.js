import Vue from 'vue'
import * as projectService from '../services/project'

const state = {
  project: null,
  currentTrack: null,
  currentClip: null
}

const actions = {
  async loadProject (context, id) {
    let project = await projectService.load(id)
    context.commit('setProject', project)
  },
  async saveProject (context, id, project) {
    let savedProject = await projectService.save(id, project)
    context.commit('setProject', savedProject)
  },
  setCurrentTrack ({ commit, state }, trackId) {
    let track = state.project.tracks.value.find(track => track.id === trackId)
    let activeClip = track.clips.value[0]
    commit('setCurrentTrack', track)
    commit('setCurrentClip', activeClip)
  },
  setCurrentClip ({ commit, state }, trackId, clipId) {
    let track = state.project.tracks.value.find(t => t.id === trackId)
    let clip = track.clips.value.find(c => c.id === clipId)
    commit('setCurrentTrack', track)
    commit('setCurrentClip', clip)
  }
}

const mutations = {
  setProject (state, project) {
    state.project = project
  },
  setCurrentTrack (state, track) {
    Vue.set(state, 'currentTrack', track)
  },
  setCurrentClip (state, clip) {
    Vue.set(state, 'currentClip', clip)
  }
}

const getters = {
  project: state => state.project,
  currentTrack: state => state.currentTrack,
  currentClip: state => state.currentClip
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
