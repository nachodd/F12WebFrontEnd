import axios from "axios"
import store from "src/store"
import router from "src/router"
import jwt_decode from "jwt-decode"

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 30000, // request timeout,
})

// Add headers to every request:
service.defaults.headers.common["Content-Type"] = "application/json"
service.defaults.headers.common["Accept"] = "application/json"

// request interceptor
service.interceptors.request.use(
  async request => {
    // If one of these specific pages that doesn't need a token, use current token (possibly none),
    // If NOT one of these specific, try to get the current token or request a new one
    if (
      request.url.includes("login") ||
      request.url.includes("refresh") ||
      request.url.includes("register")
    ) {
      const token = store.getters["auth/token"]
      if (token) {
        request.headers["Authorization"] = `Bearer ${token}`
      }
    } else {
      request.headers["Authorization"] = "Bearer " + (await getAuthToken())
    }

    return request
  },
  error => {
    // Do something with request error
    console.debug(error) // for debug
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  response => response,
  async error => {
    const req = (error && error.request) || undefined
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      "Ocurrio un problema al procesar su petición"
    const { status } = error.response

    if (req !== undefined) {
      if (req.responseURL.includes("login")) {
        return Promise.reject({
          message,
          status,
          data: error.response.data,
        })
      }
    }
    // If you can't refresh your token or you are sent Unauthorized on any request, reset token and go to login
    if (
      req !== undefined &&
      (req.responseURL.includes("refresh") ||
        (status === 401 && error.config.__isRetryRequest))
    ) {
      await store.dispatch("auth/resetToken")
      router.push({ name: "login" })
      return Promise.reject({
        message,
        status,
        data: error.response.data,
      })
    }
    // retry the request ONLY if not already tried
    if (
      req.responseURL.includes("refresh") ||
      (status === 401 && !error.config.__isRetryRequest)
    ) {
      error.config.__isRetryRequest = true
      return service.request(error.config)
    }

    if (status >= 500) {
      this.$q.notify({
        message: "Ocurrio un problema al procesar su petición",
        color: "danger",
      })
      return Promise.reject({
        message,
        status,
        data: error.response.data,
      })
    }
    return Promise.reject({
      message,
      status,
      data: error.response.data,
    })
  },
)

// let authTokenRequest = null
// tokenRequest dirty bit reseter
// function resetAuthTokenRequest() {
//   authTokenRequest = null
// }
async function getAuthToken() {
  // if the current token expires soon
  const decodedToken = jwt_decode(store.getters["auth/token"])
  const isTokenExpiredOrAboutTo =
    decodedToken.exp - 240 <= (Date.now() / 1000).toFixed(0)
  if (isTokenExpiredOrAboutTo) {
    // refresh it and update it
    await store.dispatch("auth/refresh")
  }
  return store.getters["auth/token"]
}

export default service
