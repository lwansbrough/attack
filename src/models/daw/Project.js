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

  scheduleEvents (time = 0) {
    const Tone = require('tone')
    let parts = []
    for (let track of this.tracks.value) {
      let device = track.deviceChain.value.reduce((chain, d) => chain.connect(d), new Tone.AudioNode())
      let part = track.activeClip.getPart(device)
      parts.push(part)
    }

    for (let part of parts) {
      part.start(time)
    }
  }
}
