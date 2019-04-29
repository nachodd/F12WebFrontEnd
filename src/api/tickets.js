import request from "src/utils/request"

export function createRequerimiento() {
  return request({
    url: "/v1/f12/requerimientos/create",
    method: "get",
  })
}

export function storeRequerimiento() {
  return request({
    url: "/v1/f12/requerimientos",
    method: "post",
  })
}
