import request from "utils/request"

export function login({ usuario, password }) {
  const data = {
    usuario,
    password,
    cliente_id: process.env.APP_CLIENT_ID,
    cliente_secret: process.env.APP_CLIENT_SECRET,
  }
  return request({
    url: "login",
    method: "post",
    data,
  })
}

export function getUserInfo() {
  return request({
    url: "v1/usuario",
    method: "get",
  })
}

// export function getRoles() {
//   return request({
//     url: "v1/usuario/roles",
//     method: "get",
//   })
// }

export function logout() {
  return request({
    url: "logout",
    method: "post",
  })
}

export function refresh(refreshToken) {
  const data = {
    refresh_token: refreshToken,
    cliente_id: process.env.APP_CLIENT_ID,
    cliente_secret: process.env.APP_CLIENT_SECRET,
  }
  return request({
    url: "refresh",
    method: "post",
    data,
    // withCredentials: true,
  })
}

export function getVinculacion(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/usuarios/${userId}/vinculacion`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener la Vinculación")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getResponsabilidades(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/responsable`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener los modulos Responsables")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getUsuarioGestion() {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/usuario`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener los modulos Responsables")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getUsuariosFiltro(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/usuariosFiltro`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener los Usuarios Para el Filtro")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function getDashboardData(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/dashboard`,
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

export function checkNotificaciones(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/notificaciones`,
        method: "get",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener las notificaciones")
      }
    } catch (e) {
      reject(e)
    }
  })
}

export function readNotificaciones(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request({
        url: `v1/f12/${userId}/notificaciones/read`,
        method: "put",
      })
      if (res && res.data && res.data.data) {
        resolve(res.data.data)
      } else {
        reject("Error al obtener las notificaciones")
      }
    } catch (e) {
      reject(e)
    }
  })
}
