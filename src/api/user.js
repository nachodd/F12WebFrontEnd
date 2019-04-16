import request from "src/utils/request"

export function login({ usuario, password }) {
  const data = {
    usuario,
    password,
    cliente_id: process.env.VUE_APP_CLIENT_ID,
    cliente_secret: process.env.VUE_APP_CLIENT_SECRET,
  }
  return request({
    url: "/login",
    method: "post",
    data,
  })
}

export function getInfo() {
  return request({
    url: "/v1/usuario",
    method: "get",
  })
}

export function getRoles() {
  return request({
    url: "/v1/usuario/roles",
    method: "get",
  })
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post",
  })
}

export function refresh() {
  return request({
    url: "/refresh",
    method: "post",
    withCredentials: true,
  })
}
