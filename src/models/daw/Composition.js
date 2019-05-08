import * as Rx from 'rxjs'

export class Composition {
  constructor () {
    Object.defineProperty(this, 'name', {
      value: new Rx.BehaviorSubject('New Composition'),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'clips', {
      value: new Rx.BehaviorSubject([]),
      writable: false,
      enumerable: true,
      configurable: false
    })
  }

  addClip (clip) {
    let clips = [...this.clips.value, clip]
    this.clips.next(clips)
  }

  render () {
    const Tone = require('tone')
    let node = new Tone.AudioNode()

    for (let track of this.tracks) {
      let trackNode = track.renderNode()
      trackNode.connect(node)
    }

    return node
  }
}
