<template>
  <div>
    <input
      :value="bpm"
      placeholder="BPM"
      type="text"
      @change="changeBPM">
    <button @click="play">▶️</button>
    <button @click="stop">⏹️</button>
  </div>
</template>

<script>
export default {
  name: 'PlaybackControls',
  computed: {
    bpm () { return this.$store.getters['daw/playback/bpm'] }
  },
  methods: {
    play () {
      this.$store.dispatch('daw/playback/start')
    },
    stop () {
      this.$store.dispatch('daw/playback/stop')
    },
    changeBPM (e) {
      let bpm = parseFloat(e.target.value) || 120
      this.$store.dispatch('daw/playback/setBPM', bpm)
    }
  }
}
</script>
