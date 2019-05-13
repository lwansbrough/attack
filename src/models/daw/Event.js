import uuid from 'uuid/v4'
import * as Rx from 'rxjs'

export class Event {
  constructor (pitch, duration, time, velocity) {
    Object.defineProperty(this, 'id', {
      value: uuid(),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'pitch', {
      value: new Rx.BehaviorSubject(pitch),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'duration', {
      value: new Rx.BehaviorSubject(duration),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'time', {
      value: new Rx.BehaviorSubject(time),
      writable: false,
      enumerable: true,
      configurable: false
    })

    Object.defineProperty(this, 'velocity', {
      value: new Rx.BehaviorSubject(velocity),
      writable: false,
      enumerable: true,
      configurable: false
    })
  }
}
