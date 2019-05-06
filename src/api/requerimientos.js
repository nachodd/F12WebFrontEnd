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

export function listRequerimientos(userId) {
  return request({
    url: `/v1/f12/${userId}/requerimientos`,
    method: "get",
  })
}

export function getRequerimiento(requerimientoId) {
  return request({
    url: `/v1/f12/requerimientos/${requerimientoId}`,
    method: "get",
  })
}
