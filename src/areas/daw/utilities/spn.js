// via https://github.com/saebekassebil/scientific-notation

export function parseSPN (pitch) {
  let format = /^([a-h])(x|#|bb|b?)(-?\d*)/i

  let parser = pitch.match(format)
  if (!(parser && pitch === parser[0] && parser[3].length)) return

  let note = parser[1]
  let octave = +parser[3]
  let accidental = parser[2].length ? parser[2].toLowerCase() : ''

  return {
    note: note + accidental,
    octave
  }
}
