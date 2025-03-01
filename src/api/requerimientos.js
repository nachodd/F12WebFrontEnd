import request from "utils/request"

export function createRequerimiento() {
  return request({
    url: "v1/f12/requerimientos/create",
    method: "get",
  })
}

export function storeRequerimiento(data) {
  // const __handleErrorsInResponse = false
  return request({
    url: "v1/f12/requerimientos",
    method: "post",
    data,
    // __handleErrorsInResponse,
  })
}

export function updateRequerimiento(data, requerimientoId) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}`,
    method: "put",
    data,
  })
}

export function listRequerimientos(userId, filtros) {
  let query = { ...filtros }
  query.requerimiento_estado = query.requerimiento_estado
    ? JSON.stringify(query.requerimiento_estado)
    : null
  return request({
    url: `v1/f12/${userId}/requerimientos`,
    method: "get",
    params: query,
  })
}

export async function getRequerimiento(requerimientoId) {
  // return
  try {
    const res = await request({
      url: `v1/f12/requerimientos/${requerimientoId}`,
      method: "get",
    })
    if (res && res.data && res.data.data) {
      return res.data.data
    } else {
      throw `Error al obtener el detalle del Requerimiento #${requerimientoId}`
    }
  } catch (e) {
    throw e
  }
}

export function refuseRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/rechazo`,
    method: "put",
    data,
  })
}

export function deleteRequerimiento(requerimientoId) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}`,
    method: "DELETE",
  })
}

export function getRequerimientosByUserAndEstado(userId, estadoId) {
  return request({
    url: `v1/f12/${userId}/requerimientos/estados/${estadoId}`,
    method: "get",
  })
}

export function updateRequerimientosEstados(userId, data) {
  return request({
    url: `v1/f12/${userId}/requerimientos/proceso`,
    method: "put",
    data,
  })
}

export function getRequerimientosForPanelPriorizacion(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/requerimientos/priorizacion`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener la Requerimientos Pendientes de Priorizacion")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getRequerimientosForPanelAsignacion(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/requerimientos/asignacion`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener la Requerimientos Pendientes de Asignación")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getRequerimientosAsignadosByUser(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/requerimientos/asignados`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener la Requerimientos Pendientes de Asignación")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function ejecutarRequerimiento($requerimientoId) {
  return request({
    url: `v1/f12/requerimientos/${$requerimientoId}/ejecucion`,
    method: "put",
  })
}

export function cancelaEjecucionRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/cancelaejecucion`,
    method: "put",
    data,
  })
}

export function finalizarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/finalizacion`,
    method: "put",
    data,
  })
}

export function preaprobarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/preaprobacion`,
    method: "put",
    data,
  })
}

export function asignarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/asignacion`,
    method: "put",
    data,
  })
}

export function desasignarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/desasignacion`,
    method: "put",
    data,
  })
}

export function pasarAProcesosRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/pasoprocesos`,
    method: "put",
    data,
  })
}

export function enviarAPriorizarRequerimiento(requerimientoId, comentario) {
  const data = {
    requerimiento_tipo: 2,
    requerimiento_estado: 1,
    comentario,
  }
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/cambioTipo`,
    method: "put",
    data,
  })
}

export function enviarATestingRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/testing`,
    method: "put",
    data,
  })
}

export function cancelarTestingRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/cancelartesting`,
    method: "put",
    data,
  })
}

export function pausarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/pausar`,
    method: "put",
    data,
  })
}

export function reanudarRequerimiento(requerimientoId, data) {
  return request({
    url: `v1/f12/requerimientos/${requerimientoId}/reanudar`,
    method: "put",
    data,
  })
}

export function getGerentes() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/gerentes`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener la Gerentes")
      }
    } catch (e) {
      reject(e)
    }
  })
}
