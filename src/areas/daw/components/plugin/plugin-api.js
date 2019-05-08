function log (type, plugin, ...data) {
  let color = ''
  switch (type) {
    case 'error':
      color = '#ed2210'
      break
    case 'warn':
      color = '#ffbf0f'
      break
    case 'info':
    default:
      color = '#0062ff'
      break
  }
  console.log(
    `%c${type.toUpperCase()}%c${plugin.name} %c${plugin.version}%o`,
    `
      font-weight: bold;
      text-transform: uppercase;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 10px;
      line-height: 10px;
      background-color: ${color};
      color: #fff;
      padding: 6px 8px;
      border-radius: 4px 0 0 4px;
    `,
    `
      background-color: #eee;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 10px;
      font-weight: bold;
      line-height: 10px;
      padding: 6px 8px;
      color: #222;
    `,
    `
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      line-height: 10px;
      background-color: #ccc;
      color: #222;
      padding: 6px 8px;
      border-radius: 0 4px 4px 0;
      margin-right: 8px;
    `,
    ...data
  )
}

async function getMIDIDevices () {
  if (navigator.requestMIDIAccess) {
    try {
      return await navigator.requestMIDIAccess({
        sysex: true
      })
    } catch (err) {
      console.warn('Not recognising MIDI controller', err)
    }
  } else {
    console.warn('No MIDI support in your browser')
  }
}

const managedDevices = {}

export async function bindPluginAPI (plugin, props) {
  return {
    project: props.project,
    devices: {
      usb: navigator.usb,
      midi: await getMIDIDevices(),
      managed: managedDevices,
      registerManagedDevice (key, device) {
        log('info', plugin, `Device "${key}" registered.`)
        managedDevices[key] = device
      }
    },
    plugin: {
      ...plugin,
      get input () {
        return props.sourceNode
      },
      get output () {
        return props.destinationNode
      }
    },
    log: {
      info (...data) {
        log('info', plugin, ...data)
      },
      error (...data) {
        log('error', plugin, ...data)
        console.trace()
      },
      warn (...data) {
        log('warn', plugin, ...data)
      }
    }
  }
}
