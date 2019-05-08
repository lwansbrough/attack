import uuid from 'uuid/v4'
import * as Rx from 'rxjs'

export class Clip {
  constructor () {
    this.id = uuid()
    this.name = new Rx.BehaviorSubject('New Clip')
    this.events = new Rx.BehaviorSubject([])
  }

  addEvent (note, duration, time, velocity = 1) {
    let events = [...this.events.value, {
      note,
      duration,
      time,
      velocity
    }]
    this.events.next(events)
  }
}
