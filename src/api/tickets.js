import request from "src/utils/request"

export function getOptionsForTicketCreate() {
  return request({
    url: "/v1/f12/requerimientos/create",
    method: "get",
  })
}
