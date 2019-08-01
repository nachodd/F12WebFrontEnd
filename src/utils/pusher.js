import Pusher from "pusher-js"

if (process.env.DEV) {
  // Pusher.logToConsole = true
}

let pusher = null
let channel = null

const getPusherChannel = channelName => {
  if (channel !== null) return channel

  if (pusher !== null) {
    channel = pusher.subscribe(channelName)
    return channel
  } else {
    try {
      pusher = new Pusher(process.env.PUSHER_APP_KEY, {
        cluster: "us2",
        forceTLS: true,
      })
      channel = pusher.subscribe(channelName)
      return channel
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

const destroyPusherChannel = channelName => {
  debugger
  if (pusher) {
    pusher.unsubscribe(channelName)
    channel = null
  }
}

const processAsignarRequerimiento = (ctx, data) => {
  ctx.dispatch("checkNotificacionesYDashboard")

  const commitData = {
    operation: "add",
    req: data.requerimiento,
  }
  const root = { root: true }
  ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    commitData,
    root,
  )

  // TODO: setear una bandera en el store de "mis requerimientos" que indique que "hay requerimientos nuevos / actualizados disponibles"
}

export { getPusherChannel, destroyPusherChannel, processAsignarRequerimiento }
