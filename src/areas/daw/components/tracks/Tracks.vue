<template>
  <div>
    <div
      v-for="track in tracks"
      :key="track.id"
      @click="setCurrentTrack(track.id)">
      {{ track.id }}
    </div>
    <button @click="addTrack">Add Track</button>
  </div>
</template>

<script>
import { Track } from '@models/daw/Track'

export default {
  name: 'Tracks',
  data () {
    return {
      tracks: []
    }
  },
  computed: {
    project () { return this.$store.getters['daw/workspace/project'] }
  },
  watch: {
    project (to, from) {
      if (this.tracksSubscription) {
        this.tracksSubscription.unsubscribe()
      }
      if (to) {
        this.tracksSubscription = to.tracks.subscribe(tracks => {
          console.log(tracks)
          this.tracks = tracks
        })
      }
    }
  },
  created () {
    this.tracksSubscription = this.project.tracks.subscribe(tracks => {
      this.tracks = tracks
    })
  },
  methods: {
    addTrack () {
      let track = new Track()
      this.project.addTrack(track)
      this.$store.dispatch('daw/workspace/setCurrentTrack', track.id)
    },
    setCurrentTrack (trackId) {
      this.$store.dispatch('daw/workspace/setCurrentTrack', trackId)
    }
  }
}
</script>
