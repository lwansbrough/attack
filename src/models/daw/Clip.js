import uuid from 'uuid/v4'
import * as Rx from 'rxjs'
import { Event } from './Event'

export class Clip {
  constructor () {
    this.id = uuid()
    this.name = new Rx.BehaviorSubject('New Clip')
    this.events = new Rx.BehaviorSubject([])
    this.loop = new Rx.BehaviorSubject(true)
  }

  addEvent (pitch, duration, time, velocity = 1) {
    let events = [...this.events.value, new Event(pitch, duration, time, velocity)]
    this.events.next(events)
  }

  getPart (device) {
    const Tone = require('tone')
    let part = new Tone.Part((time, event) => {
      device.triggerAttackRelease(event.pitch, event.duration, time, event.velocity)
    }, this.events.value.map(event => ({
      pitch: event.pitch.value,
      time: event.time.value,
      duration: event.duration.value,
      velocity: event.velocity.value
    })))
    part.loop = this.loop.value
    return part
  }
}
