<template>
  <no-ssr>
    <div class="piano-roll-container">
      <div
        :style="{
          backgroundSize: `${gridX}px ${gridY}px`,
          height: `${octaveCount * 12 * gridY}px`
        }"
        class="piano-roll"
        tabindex="0"
        @click.exact="addNote"
        @contextmenu.prevent
        @click.right="removeNote"
        @keyup.delete="removeActiveNote">
        <draggable-resizable
          v-for="note in notes"
          :key="note.id"
          :grid="[gridX, gridY]"
          :handles="['ml', 'mr']"
          :parent="true"
          :x="note.x * gridX"
          :y="note.y * gridY"
          :h="gridY"
          :w="gridX"
          :min-height="gridY"
          :min-width="gridX"
          class="note"
          @click.stop
          @resizing="onResize(note.id, ...arguments)"
          @dragging="onDrag(note.id, ...arguments)"
          @resizestop="onResizeStop(note.id, ...arguments)"
          @dragstop="onDragStop(note.id, ...arguments)"
          @activated="activeNote = note.id"
          @deactivated="activeNote = null"
        />
      </div>
    </div>
  </no-ssr>
</template>

<script>
import uuid from 'uuid/v4'

export default {
  name: 'PianoRoll',
  props: {
    clip: {
      type: Object,
      required: true
    },
    octaves: {
      type: Array,
      default: () => [-2, 8]
    }
  },
  data () {
    return {
      gridX: 16,
      gridY: 8,
      notes: [],
      activeNote: null
    }
  },
  computed: {
    octaveCount () { return this.octaves[1] - this.octaves[0] }
  },
  methods: {
    onDrag (id, left, top) {
      let x = left / this.gridX
      let y = top / this.gridY

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y
    },
    onDragStop (id, left, top) {
      let x = left / this.gridX
      let y = top / this.gridY

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y

      let replacedNote = this.notes.findIndex(n => n.x === x && n.y === y && n.id !== id)
      if (replacedNote > -1) {
        this.notes.splice(replacedNote, 1)
      }
    },
    onResize (id, left, top, width, height) {
      let x = left / this.gridX
      let y = top / this.gridY
      // let w = width / this.gridX
      // let h = height / this.gridY

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y
    },
    onResizeStop (id, left, top, width, height) {
      let x = left / this.gridX
      let y = top / this.gridY

      let note = this.notes.find(n => n.id === id)
      note.x = x
      note.y = y

      let replacedNote = this.notes.findIndex(n => n.x === x && n.y === y && n.id !== id)
      if (replacedNote > -1) {
        this.notes.splice(replacedNote, 1)
      }
    },
    addNote (e) {
      if (e.target !== this.$el.querySelector('.piano-roll')) {
        return
      }

      let [x, y] = this.getGridCoordinatesFromMouseEvent(e)

      this.notes.push({
        id: uuid(),
        x,
        y
      })
    },
    removeNote (e) {
      e.preventDefault()

      let [x, y] = this.getGridCoordinatesFromMouseEvent(e)
      let noteIndex = this.notes.findIndex(n => n.x === x && n.y === y)

      if (noteIndex > -1) {
        this.notes.splice(noteIndex, 1)
      }
    },
    removeActiveNote () {
      let noteIndex = this.notes.findIndex(n => n.id === this.activeNote)
      if (noteIndex > -1) {
        this.notes.splice(noteIndex, 1)
      }
    },
    getGridCoordinatesFromMouseEvent (e) {
      let rect = this.$el.querySelector('.piano-roll').getBoundingClientRect()
      let x = Math.floor((e.clientX - rect.left) / this.gridX)
      let y = Math.floor((e.clientY - rect.top) / this.gridY)
      return [x, y]
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
