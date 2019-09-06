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
}

/**
 * Actualiza notificaciones, sidebar (dashboard) y la seccion Mis Requerimientos
 * @param {Object} ctx: store context (app)
 * @param {Object} requerimiento: requerimiento actualizado
 */
const updateNotificacionesDashboardMisReqs = _.debounce(
  (ctx, requerimiento, showMessage = true) => {
    ctx.dispatch("checkNotificacionesYDashboard")

    ctx.dispatch(
      "requerimientos/pusherUpdateMisRequerimientos",
      { requerimiento, showMessage },
      root,
    )
  },
  2500,
)

const processPriorizarRequerimiento = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)
  // USERS: usuario_cadena (siguiente en la cadena)

  ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("addOrUpdate", data.requerimiento),
    root,
  )
}

const processPriorizarRequerimientoAprobado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  const currentUserId = store.getters["auth/userId"]
  const userCreadorId = _.get(data.requerimiento, "usuario.id", false)
  const esElUltimoDeLaCadenaDeMando = store.getters["auth/esElUltimoDeLaCadenaDeMando"]

  if (currentUserId === userCreadorId && esElUltimoDeLaCadenaDeMando) {
    // Si entro aca, es porque un requerimiento que el usuario logueado creó, fue aprobado.
    // Entonces se debe sacar del listado de reqs
    // USERS: usuario_anterior_cadena
    ctx.commit(
      "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("delete", data.requerimiento),
      root,
    )
  } else {
    // USERS: usuario_actual
    ctx.commit(
      "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

const processAgregaRequerimientoCreadoPriorizacion = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  const currentUserId = store.getters["auth/userId"]
  const userCreadorId = _.get(data.requerimiento, "usuario.id", false)

  if (currentUserId === userCreadorId) {
    // USERS: usuario_creador (el data.requerimiento viene con el estado correspondiente a cada usuario)
    ctx.commit(
      "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

const processRequerimientoAprobado = async (ctx, data) => {
  // paso showMessage: false ya que el mensaje se disparará desde acá
  // USERS: usuario_creador
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento, false)

  // ctx.dispatch(
  //   "requerimientos/pusherUpdateMisRequerimientos",
  //   { requerimiento: data.requerimiento, showMessage: false },
  //   root,
  // )

  // Lo notifico solo si es el usuario creador (debería, este evento en teoria lo recibe solo el)
  const currentUserId = store.getters["auth/userId"]
  const userCreadorId = _.get(data.requerimiento, "usuario.id", false)
  if (currentUserId === userCreadorId) {
    info({ message: `El requerimiento #${data.requerimiento.id} fue APROBADO` })
  }
}

const processAsignarRequerimiento = async (ctx, data) => {
  // Actualiza notificaciones, sidebar (dashboard) y la seccion "Mis Requerimientos"
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // Agrega (o updatea si existe) el req en "Asignar Requerimientos"
  // USERS: responsables_sistemas
  ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("addOrUpdate", data.requerimiento),
    root,
  )
}

const processRequerimientoEnviadoAProcesos = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)
  // Puede que el usuario que lo envio lo haya hecho desde la cadena de priorizacion (el gerente). Entonces, debe eliiminarlo de ese store

  // USERS: usuario_envio | responsables_sistemas
  ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
}

const processRequerimientoAsignado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // Si le llega al "primero" de la cadena (al mas alto, el gerente) lo debe eliminar de priorizarRequerimientos
  // USERS: usuario_cadena_ultimo
  const userEsGerente = store.getters["auth/esGerente"]
  if (userEsGerente) {
    ctx.commit(
      "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("delete", data.requerimiento),
      root,
    )
  }

  // Agrega (o updatea si existe) el req en "Asignar Requerimientos", solo si es responsable (tiene acceso al panel de asignar reqs)
  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }

  // Si el usuario asignado al req (o el asignado a testing), es el usuario logueado, agrega/updatea el req en el listado correspondiente
  // USERS: usuario_sistemas_asignado | usuario_testing_asignado
  const currentUserId = store.getters["auth/userId"]
  const userAsignadoId = _.get(data.requerimiento, "estado.asignacion.usuario_id", false)
  const userTestingAsignadoId = _.get(
    data.requerimiento,
    "estado.asignacion_testing.usuario_id",
    false,
  )
  if ([userAsignadoId, userTestingAsignadoId].includes(currentUserId)) {
    ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

const processRequerimientoDesasignado = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }

  // USERS: usuario_sistemas_asignado
  ctx.commit(
    "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
}

const processEjecutarOCancelarEjecucionRequerimiento = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }

  // USERS: usuario_sistemas_asignado | usuario_testing_asignado
  const currentUserId = store.getters["auth/userId"]
  const userAsignadoId = _.get(data.requerimiento, "estado.asignacion.usuario_id", false)
  if ([userAsignadoId].includes(currentUserId)) {
    ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

const processCancelaTestingRequerimiento = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }

  // USERS: usuario_sistemas_asignado | usuario_testing_asignado
  const currentUserId = store.getters["auth/userId"]
  const userAsignadoId = _.get(data.requerimiento, "estado.asignacion.usuario_id", false)
  // Si soy el usuario asignado, lo actualizo de estado
  if ([userAsignadoId].includes(currentUserId)) {
    ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  } else {
    // Si no soy el usuario asignado, se debe eliminar
    ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("delete", data.requerimiento),
      root,
    )
  }
}

const processCambioTipoRequerimiento = async (ctx, data) => {
  // USERS: usuario_creador
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  //ctx.dispatch(
  //  "requerimientos/pusherUpdateMisRequerimientos",
  //  { requerimiento: data.requerimiento },
  //  root,
  //)

  // Intento actualizar el listado de priorizar requerimientos, si lo encuentra lo updatea
  ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("update", data.requerimiento),
    root,
  )

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("update", data.requerimiento),
      root,
    )
  }
}

const processRequerimientoFinalizado = async (ctx, data) => {
  // USERS: usuario_creador
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("delete", data.requerimiento),
      root,
    )
  }

  // ctx.dispatch(
  //   "requerimientos/pusherUpdateMisRequerimientos",
  //   { requerimiento: data.requerimiento },
  //   root,
  // )

  // USERS: usuario_sistemas_asignado | usuario_testing_asignado
  ctx.commit(
    "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
}

const processRequerimientoRechazado = async (ctx, data) => {
  // USERS: usuario_creador
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento, false)
  // Se borra de todos los listados, si es que está
  ctx.commit(
    "priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  ctx.commit(
    "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )
  ctx.commit(
    "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
    getPayload("delete", data.requerimiento),
    root,
  )

  // ctx.dispatch(
  //   "requerimientos/pusherUpdateMisRequerimientos",
  //   { requerimiento: data.requerimiento, showMessage: false },
  //   root,
  // )

  // Lo notifico solo si es el usuario creador (debería, este evento en teoria lo recibe solo el)
  const currentUserId = store.getters["auth/userId"]
  const userCreadorId = _.get(data.requerimiento, "usuario.id", false)
  if (currentUserId === userCreadorId) {
    info({
      message: `El requerimiento #${data.requerimiento.id} fue RECHAZADO`,
    })
  }
}

const processPausarReanudarRequerimiento = async (ctx, data) => {
  updateNotificacionesDashboardMisReqs(ctx, data.requerimiento)

  // USERS: responsables_sistemas
  const userEsResponsable = store.getters["auth/userEsResponsable"]
  if (userEsResponsable) {
    ctx.commit(
      "asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }

  // USERS: usuario_sistemas_asignado
  const currentUserId = store.getters["auth/userId"]
  const userAsignadoId = _.get(data.requerimiento, "estado.asignacion.usuario_id", false)
  if ([userAsignadoId].includes(currentUserId)) {
    ctx.commit(
      "requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO",
      getPayload("addOrUpdate", data.requerimiento),
      root,
    )
  }
}

export {
  getPusherChannel,
  destroyPusherChannel,
  processAsignarRequerimiento,
  processRequerimientoEnviadoAProcesos,
  processRequerimientoAsignado,
  processRequerimientoDesasignado,
  processEjecutarOCancelarEjecucionRequerimiento,
  processCancelaTestingRequerimiento,
  processCambioTipoRequerimiento,
  processRequerimientoFinalizado,
  processPriorizarRequerimiento,
  processPriorizarRequerimientoAprobado,
  processAgregaRequerimientoCreadoPriorizacion,
  processRequerimientoAprobado,
  processRequerimientoRechazado,
  processPausarReanudarRequerimiento,
}
