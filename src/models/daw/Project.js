import uuid from 'uuid/v4'
import * as Rx from 'rxjs'
import { Composition } from './Composition'

export class Project {
  constructor () {
    Object.defineProperty(this, 'id', {
      value: uuid(),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'name', {
      value: new Rx.BehaviorSubject('New Project'),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'composition', {
      value: new Rx.BehaviorSubject(new Composition()),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'tracks', {
      value: new Rx.BehaviorSubject([]),
      writable: false,
      enumerable: true,
      configurable: false
    })
  }

  addTrack (track) {
    let tracks = [...this.tracks.value, track]
    this.tracks.next(tracks)
  }

  render () {
    const Tone = require('tone')
    let node = new Tone.AudioNode()

    for (let track of this.tracks.value) {
      let trackNode = track.renderNode()
      trackNode.connect(node)
    }

    return node
  }
}
