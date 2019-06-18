import request from "@utils/request"

export function createRequerimiento() {
  return request({
    url: "/v1/f12/requerimientos/create",
    method: "get",
  })
}

export function storeRequerimiento(data) {
  // const __handleErrorsInResponse = false
  return request({
    url: "/v1/f12/requerimientos",
    method: "post",
    data,
    // __handleErrorsInResponse,
  })
}

export function updateRequerimiento(data, requerimientoId) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}`,
    method: "put",
    data,
  })
}

export function listRequerimientos(userId, filtros) {
  return request({
    url: `/v1/f12/${userId}/requerimientos`,
    method: "get",
    params: filtros,
  })
}

export function getRequerimiento(requerimientoId) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}`,
    method: "get",
  })
}

export function refuseRequerimiento(requerimientoId, data) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}/rechazo`,
    method: "put",
    data,
  })
}

export function deleteRequerimiento(requerimientoId) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}`,
    method: "DELETE",
  })
}

export function getRequerimientosByUserAndEstado(userId, estadoId) {
  return request({
    url: `/v1/f12/${userId}/requerimientos/estados/${estadoId}`,
    method: "get",
  })
}

export function updateRequerimientosEstados(userId, requerimientosList) {
  return request({
    url: `/v1/f12/${userId}/requerimientos/proceso`,
    method: "put",
    data: requerimientosList,
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
  return request({
    url: `/v1/f12/${userId}/requerimientos/asignados`,
    method: "get",
  })
}

export function ejecutarRequerimiento($requerimientoId) {
  return request({
    url: `/v1/f12/requerimientos/${$requerimientoId}/ejecucion`,
    method: "put",
  })
}

export function cancelaEjecucionRequerimiento(requerimientoId, data) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}/cancelaejecucion`,
    method: "put",
    data,
  })
}

export function finalizarRequerimiento(requerimientoId, data) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}/finalizacion`,
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
