export function setBPM (bpm) {
  const Tone = require('tone')
  Tone.Transport.bpm.value = bpm
}

export function start (time = 0, offset = 0) {
  const Tone = require('tone')
  Tone.Transport.start(time, offset)
}

export function stop (time = 0) {
  const Tone = require('tone')
  Tone.Transport.stop(time)
}
