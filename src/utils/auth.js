import Cookies from "js-cookie"

const tokenKey = "f12-token"
const tokenExpiresKey = "f12-token-expires"
const refreshTokenKey = "f12-refresh-token"

export function getToken() {
  return Cookies.get(tokenKey) || ""
}
export function getExpiresIn() {
  return Cookies.get(tokenExpiresKey) || ""
}
export function getRefreshToken() {
  return Cookies.get(tokenKey) || ""
}

export function setToken(token, expires_in, refreshToken = null) {
  Cookies.set(tokenKey, token)
  Cookies.set(tokenExpiresKey, expires_in)
  if (refreshToken) {
    Cookies.set(refreshTokenKey, refreshToken)
  }
}
export function removeToken(removeRefreshToken = true) {
  Cookies.remove(tokenKey)
  if (removeRefreshToken) {
    Cookies.remove(refreshTokenKey)
  }
  Cookies.remove(tokenExpiresKey)
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

/**
 * Get unix timestamp of when the token is going to expire
 * @param {integer} expiresIn seconds from now when the token expires
 */
export function expiresToUnixTS(expiresIn) {
  const now = new Date()
  now.setSeconds(now.getSeconds() + expiresIn)
  return now.getTime()
}
