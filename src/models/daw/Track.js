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
      value: new Rx.BehaviorSubject([]),
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

  getActiveClip () {
    return this.clips[0] // TODO:
  }

  render () {
    const Tone = require('tone')
    let node = new Tone.AudioNode()

    return node
  }

  scheduleEvents () {
    const Tone = require('tone')
    let events = new Tone.Part()

    for (let item of this.arrangement) {
      let clip = this.clips[item.clipId]
      let events = clip.events

      let offset = item.offset
      let duration = item.duration

      let part = new Tone.Part((time, event) => {
        this.device.triggerAttackRelease(event.note, event.duration, time, event.velocity)
      }, events)
        .start(0)
        .stop(duration)

      events.add(offset, part)
    }

    return events
  }
}
