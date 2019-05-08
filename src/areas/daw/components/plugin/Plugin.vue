<template>
  <div class="plugin" />
</template>

<script>
import { bindPluginAPI } from './plugin-api'
import * as Rx from 'rxjs'

export default {
  name: 'Plugin',
  props: {
    data: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      default: null
    },
    sourceNode: {
      type: Object,
      default: null
    },
    destinationNode: {
      type: Object,
      default: null
    }
  },
  watch: {
    sourceNode (from, to) {
      this.boundAPIProperties.sourceNode = this.sourceNode
    },
    destinationNode (from, to) {
      this.boundAPIProperties.destinationNode = this.destinationNode
    }
  },
  async mounted () {
    this.boundAPIProperties = {
      project: this.project,
      sourceNode: this.sourceNode,
      destinationNode: this.destinationNode
    }

    const CAJA_URI_POLICY = {
      fetch: caja.policy.net.fetcher.USE_XHR,
      rewrite: caja.policy.net.rewriter.ALL
    }

    const Tone = require('tone')

    const API = await bindPluginAPI(this.data, this.boundAPIProperties)

    caja.load(this.$el, CAJA_URI_POLICY, frame => {
      caja.markReadOnlyRecord(API)
      // caja.markFunction(Attack.currentPlugin.output)

      frame.code(this.data.src, 'text/html')
        .api({
          Attack: API,
          Number,
          Promise,
          Tone,
          Rx
        })
        .run()
    })
  }
}
</script>

<style lang="scss">
@import '../../../../scss/variables.scss';

.plugin {
  --background-color: #{$background-color};
  --color-primary: #{$color-primary};
}
</style>
