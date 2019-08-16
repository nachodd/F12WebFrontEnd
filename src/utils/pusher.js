import Pusher from "pusher-js"
import { info } from "utils/helpers"
import store from "store/index"

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
  if (pusher) {
    pusher.unsubscribe(channelName)
    channel = null
  }
}

// Helpers para opraciones de commit en los stores
const root = { root: true }
const getPayload = (operation, data) => {
  return {
    operation,
    req: data,
  }
} /*
const updateMisRequerimientosSection = (ctx, requerimiento) => {
  ctx.dispatch(
    "requerimientos/pusherUpdateMisRequerimientos",
    requerimiento,
    root,
  )
  // Cuando se hace una action desde el modal, el detalleRequerimientoItem esta abierto.
  // entonces, estaría mal actualizarlo, ya que cuando se termina la accion el detalle se le asigna {}
  // ctx.dispatch(
  //   "requerimientos/pusherUpdateDetalleRequerimientoItem",
  //   requerimiento,
  //   root,
  // )
} */
/**
 * Actualiza notificaciones, sidebar (dashboard) y la seccion Mis Requerimientos
 * @param {Object} ctx: store context (app)
 * @param {Object} requerimiento: requerimiento actualizado
 */
const updateNotificacionesDashboardMisReqs = (ctx, requerimiento) => {
  ctx.dispatch("checkNotificacionesYDashboard")

  ctx.dispatch(
    "requerimientos/pusherUpdateMisRequerimientos",
    { requerimiento },
    root,
  )
}

const processPriorizarRequerimiento = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)
  await ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("addOrUpdate", data.requerimiento),
    root,
  )
}

const processRequerimientoAprobado = async (ctx, data) => {
  ctx.dispatch("checkNotificacionesYDashboard")
  // paso showMessage: false ya que el mensaje se disparará desde acá
  ctx.dispatch(
    "requerimientos/pusherUpdateMisRequerimientos",
    { requerimiento: data.requerimiento, showMessage: false },
    root,
  )

  info({ message: `El requerimiento #${data.requerimiento.id} fue APROBADO` })
}

const processAsignarRequerimiento = async (ctx, data) => {
  // Actualiza notificaciones, sidebar (dashboard) y la seccion "Mis Requerimientos"
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // Agrega (o updatea si existe) el req en "Asignar Requerimientos"
  await ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("addOrUpdate", data.requerimiento),
    root,
  )
}

const processCambioTipoRequerimiento = async (ctx, data) => {
  // updatea solo notificaciones, en el dashboard nada va a haber cambiado
  await ctx.dispatch("checkNotificaciones")
  ctx.dispatch(
    "requerimientos/pusherUpdateMisRequerimientos",
    { requerimiento: data.requerimiento },
    root,
  )
}

const processRequerimientoAsignado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // Agrega (o updatea si existe) el req en "Asignar Requerimientos"
  await ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("addOrUpdate", data.requerimiento),
    root,
  )

  // Si el usuario asignado al req, es el usuario logueado, agrega/updatea el req en el listado correspondiente
  const currentUserId = store.getters["auth/userId"]
  const reqUserAsignadoId = _.get(
    data.requerimiento,
    "estado.asignacion.usuario_id",
    false,
  )
  if (currentUserId === reqUserAsignadoId) {
    await ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

const processRequerimientoFinalizado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)
  // FIXME: aca no estaría notificando a andres, solo al que creo el req original, por lo que no tiene mucho sentido que updatee: asignacionRequerimientos
  await ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
}

const processRequerimientoRechazado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)
  // Se borra de todos los listados, si es que está
  await ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  await ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  await ctx.commit(
    "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  info({ message: `El requerimiento #${data.requerimiento.id} fue RECHAZADO` })
}

export {
  getPusherChannel,
  destroyPusherChannel,
  processAsignarRequerimiento,
  processRequerimientoAsignado,
  processCambioTipoRequerimiento,
  processRequerimientoFinalizado,
  processPriorizarRequerimiento,
  processRequerimientoAprobado,
  processRequerimientoRechazado,
}
