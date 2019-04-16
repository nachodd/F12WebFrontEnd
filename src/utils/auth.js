import Cookies from "js-cookie"

const tokenKey = "f12-token"
const refreshTokenKey = "f12-refresh-token"

export function getToken() {
  return Cookies.get(tokenKey)
}
export function getRefreshToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token, refreshToken = null) {
  Cookies.set(tokenKey, token)
  if (refreshToken) {
    Cookies.set(refreshTokenKey, refreshToken)
  }
}
export function removeToken(removeRefreshToken = true) {
  Cookies.remove(tokenKey)
  if (removeRefreshToken) {
    Cookies.remove(refreshTokenKey)
  }
}
export function removeRefreshToken() {
  Cookies.remove(refreshTokenKey)
}

export function mapRoles(roles) {
  const permissions = roles.map(role => {
    return role.Permisos.map(permission => permission.Nombre)
  })

  const merged = [].concat(...permissions)
  // same as: const merged = [].concat.apply([], arrays);
  return merged
}
