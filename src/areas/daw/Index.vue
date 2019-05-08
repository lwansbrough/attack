<template>
  <div id="app">
    <div v-if="project">
      <div>
        {{ projectName }} ({{ project.id }})
      </div>
      <playback-controls/>
      <tracks/>
      <piano-roll
        v-if="currentClip"
        :clip="currentClip"
        class="sequencer"
      />
      <plugin
        :project="project"
        :destination-node="destinationNode"
        :data="plugins.abletonPush2"
      />
      <plugin
        :project="project"
        :destination-node="destinationNode"
        :data="plugins.test"
      />
    </div>
  </div>
</template>

<script>
// import { Composition } from '../../models/daw/Composition'
// import { Track } from '../../models/daw/Track'
// import { Clip } from '../../models/daw/Clip'
// import Tone from 'tone'
import PianoRoll from './components/piano-roll/PianoRoll'
import PlaybackControls from './components/playback-controls/PlaybackControls'
import Plugin from './components/plugin/Plugin'
import Tracks from './components/tracks/Tracks'

export default {
  name: 'DAW',
  components: {
    PianoRoll,
    PlaybackControls,
    Plugin,
    Tracks
  },
  data () {
    return {
      destinationNode: null,
      projectName: null,
      plugins: {
        abletonPush2: {
          name: 'Ableton Push 2',
          version: '1.0.0',
          src: 'http://localhost:8080/ableton-push-2.html'
        },
        test: {
          name: 'Push 2 Test',
          version: '1.0.0',
          src: 'http://localhost:8080/push2-test.html'
        }
      }
    }
  },
  computed: {
    project () { return this.$store.getters['daw/workspace/project'] },
    currentClip () { return this.$store.getters['daw/workspace/currentClip'] }
  },
  watch: {
    project (to, from) {
      if (from && this.projectNameSubscription) {
        this.projectNameSubscription.unsubscribe()
      }
      if (to) {
        this.projectNameSubscription = to.name.subscribe(name => {
          this.projectName = name
        })
      }
    }
  },
  created () {
    // let comp = new Composition()
    // let device = new Tone.FMOscillator('Ab3', 'sine', 'square')
    // let track = new Track(device)
    this.$store.dispatch('daw/workspace/loadProject', '123')
  },
  mounted () {
    const Tone = require('tone')
    this.destinationNode = Tone.Master
  },
  beforeDestroy () {
    this.projectNameSubscription.unsubscribe()
  }
}
</script>

<style lang="scss" scoped>
#app {
  user-select: none;

  .sequencer {
    height: 300px;
    width: 100%;
  }
}
</style>
