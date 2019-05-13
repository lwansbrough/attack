import uuid from 'uuid/v4'
import * as Rx from 'rxjs'
import { Clip } from './Clip'

export class Track {
  constructor (device) {
    Object.defineProperty(this, 'id', {
      value: uuid(),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'name', {
      value: new Rx.BehaviorSubject('New Track'),
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

    Object.defineProperty(this, 'deviceChain', {
      value: new Rx.BehaviorSubject([device]),
      writable: false,
      enumerable: true,
      configurable: false
    })

    let defaultClip = new Clip()
    this.addClip(defaultClip)
  }

  addClip (clip) {
    let clips = [...this.clips.value, clip]
    this.clips.next(clips)
  }

  get activeClip () {
    return this.clips.value[0] // TODO:
  }

  render () {
    const Tone = require('tone')
    let node = new Tone.AudioNode()

    return node
  }
}
