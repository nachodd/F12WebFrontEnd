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

// Helpers para opraciones de commit en los stores
const root = { root: true }
const getOperationPayload = (operation, data) => {
  return {
    operation,
    req: data,
  }
}

// Operaciones a ejecutar cuando actualiza
const processAsignarRequerimiento = async (ctx, data) => {
  // Actualiza notificaciones y sidebar (dashboard)
  ctx.dispatch("checkNotificacionesYDashboard")

  // Agrega a
  await ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getOperationPayload("add", data.requerimiento),
    root,
  )

  // TODO: setear una bandera en el store de "mis requerimientos" que indique que "hay requerimientos nuevos / actualizados disponibles"
}
/*
const processRequerimientoAsignado = (ctx, data) => {
  // Actualiza notificaciones y sidebar (dashboard)
  ctx.dispatch("checkNotificacionesYDashboard")

  // Agrega a
  ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getOperationPayload("add", data.requerimiento),
    root,
  )

  // TODO: setear una bandera en el store de "mis requerimientos" que indique que "hay requerimientos nuevos / actualizados disponibles"
} */

export {
  getPusherChannel,
  destroyPusherChannel,
  processAsignarRequerimiento,
  // processRequerimientoAsignado,
}
