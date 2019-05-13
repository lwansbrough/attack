<template>
  <no-ssr>
    <div class="piano-roll-container">
      <div
        :style="{
          backgroundSize: `${gridUnitPixels}px ${GRID_UNIT_HEIGHT}px`,
          height: `${octaveCount * NOTES_PER_OCTAVE * GRID_UNIT_HEIGHT}px`
        }"
        class="piano-roll"
        tabindex="0"
        @click.exact="addNote"
        @contextmenu.prevent
        @click.right="removeNote"
        @keyup.delete="removeActiveEvent">
        <draggable-resizable
          v-for="event in clipEvents"
          :key="event.id"
          :grid="[gridUnitPixels, GRID_UNIT_HEIGHT]"
          :handles="['ml', 'mr']"
          :parent="true"
          :x="getGridCoordinatesFromClipEvent(event).x * gridUnitPixels"
          :y="getGridCoordinatesFromClipEvent(event).y * GRID_UNIT_HEIGHT"
          :h="GRID_UNIT_HEIGHT"
          :w="gridUnitPixels"
          :min-height="GRID_UNIT_HEIGHT"
          :min-width="gridUnitPixels"
          class="note"
          @click.stop
          @resizing="onResize(event.id, ...arguments)"
          @dragging="onDrag(event.id, ...arguments)"
          @resizestop="onResizeStop(event.id, ...arguments)"
          @dragstop="onDragStop(event.id, ...arguments)"
          @activated="activeEvent = event.id"
          @deactivated="activeEvent = null"
        />
      </div>
    </div>
  </no-ssr>
</template>

<script>
import { parseSPN } from '@areas/daw/utilities/spn'
import { Clip } from '@models/daw/Clip'
let Tone
if (process.env.VUE_ENV !== 'server') {
  Tone = require('tone')
}

const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTES_PER_OCTAVE = CHROMATIC_SCALE.length
const GRID_UNIT_HEIGHT = 8

export default {
  name: 'PianoRoll',
  props: {
    clip: {
      type: Clip,
      required: true
    },
    octaves: {
      type: Array,
      default: () => [-2, 8]
    }
  },
  subscriptions () {
    return {
      clipEvents: this.clip.events
    }
  },
  data () {
    return {
      GRID_UNIT_HEIGHT,
      gridZoom: 1,
      gridUnit: '16n',
      NOTES_PER_OCTAVE,
      activeEvent: null
    }
  },
  computed: {
    octaveCount () { return this.octaves[1] - this.octaves[0] },
    gridUnitPixels () { return this.gridZoom * Tone.Time(this.gridUnit).toTicks() }
  },
  methods: {
    onDrag (id, left, top) {
      let x = left / this.gridUnitPixels
      let y = top / GRID_UNIT_HEIGHT

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y
    },
    onDragStop (id, left, top) {
      let x = left / this.gridUnitPixels
      let y = top / GRID_UNIT_HEIGHT

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y

      let replacedNote = this.notes.findIndex(n => n.x === x && n.y === y && n.id !== id)
      if (replacedNote > -1) {
        this.notes.splice(replacedNote, 1)
      }
    },
    onResize (id, left, top, width, height) {
      let x = left / this.gridUnitPixels
      let y = top / GRID_UNIT_HEIGHT
      // let w = width / this.gridUnitPixels
      // let h = height / GRID_UNIT_HEIGHT

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y
    },
    onResizeStop (id, left, top, width, height) {
      let x = left / this.gridUnitPixels
      let y = top / GRID_UNIT_HEIGHT

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y

      let replacedNote = this.notes.findIndex(n => n.x === x && n.y === y && n.id !== id)
      if (replacedNote > -1) {
        this.notes.splice(replacedNote, 1)
      }
    },
    addNote (e, snapToGrid = true) {
      if (e.target !== this.$el.querySelector('.piano-roll')) {
        return
      }

      let [x, y] = this.getGridCoordinatesFromMouseEvent(e, snapToGrid)
      let xPixels = x * this.gridUnitPixels

      let ticks = xPixels

      let octave = this.octaves[1] - Math.floor(y / NOTES_PER_OCTAVE)
      let note = CHROMATIC_SCALE[NOTES_PER_OCTAVE - y % NOTES_PER_OCTAVE - 1]
      let pitch = `${note}${octave}` // convert to SPN

      let duration = this.gridUnit // default for a single click
      let time = Tone.Time(`${ticks}i`)

      this.clip.addEvent(pitch, duration, time)

      // this.notes.push({
      //   id: uuid(),
      //   x,
      //   y
      // })
    },
    removeNote (e) {
      e.preventDefault()

      let [x, y] = this.getGridCoordinatesFromMouseEvent(e)
      let noteIndex = this.notes.findIndex(n => n.x === x && n.y === y)

      if (noteIndex > -1) {
        this.notes.splice(noteIndex, 1)
      }
    },
    removeActiveEvent () {
      let noteIndex = this.notes.findIndex(n => n.id === this.activeEvent)
      if (noteIndex > -1) {
        this.notes.splice(noteIndex, 1)
      }
    },
    getGridCoordinatesFromMouseEvent (e, snapToGrid) {
      let rect = this.$el.querySelector('.piano-roll').getBoundingClientRect()
      let x = snapToGrid ? Math.floor((e.clientX - rect.left) / this.gridUnitPixels) : ((e.clientX - rect.left) / this.gridUnitPixels)
      let y = snapToGrid ? Math.floor((e.clientY - rect.top) / GRID_UNIT_HEIGHT) : ((e.clientY - rect.top) / GRID_UNIT_HEIGHT)
      return [x, y]
    },
    getGridCoordinatesFromClipEvent (event) {
      // X
      let timeTicks = Tone.Time(event.time.value).toTicks()
      let x = this.gridZoom * timeTicks / this.gridUnitPixels

      // Y
      let { note, octave } = parseSPN(event.pitch.value)
      let y = (this.octaves[1] - octave) * NOTES_PER_OCTAVE + (NOTES_PER_OCTAVE - CHROMATIC_SCALE.indexOf(note) - 1)

      return { x, y }
    }
  }
}
</script>

<style lang="scss" scoped>
.piano-roll-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.piano-roll {
  position: relative;
  outline: none;
  cursor: crosshair;
  min-width: 100%;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

.note {
  background-color: red;
  cursor: move;

  &.vdr {
    /deep/ .handle {
      background: none;
      border: 2px solid #fff;
      width: 4px;
      height: 100%;

      &.handle-ml {
        position: absolute;
        border-right: 2px solid transparent;
        left: -3px;
        cursor: w-resize;
      }

      &.handle-mr {
        position: absolute;
        border-left: 2px solid transparent;
        right: -3px;
        cursor: e-resize;
      }
    }
  }
}
</style>
