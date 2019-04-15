import axios from "axios"
import store from "src/store"
import router from "src/router"
import jwt_decode from "jwt-decode"

let authTokenRequest = null

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true,
  timeout: 30000, // request timeout,
})

function getAuthToken() {
  // if the current store token expires soon
  if (
    jwt_decode(store.getters["auth/token"]).exp - 240 <=
    (Date.now() / 1000).toFixed(0)
  ) {
    // if not already requesting a token
    if (authTokenRequest === null) {
      authTokenRequest = service
        .post("/auth/refresh", {}, { withCredentials: true })
        .then(response => {
          // request complete and store
          resetAuthTokenRequest()
          store.commit("auth/refresh", response.data.access_token)
          return response.data.access_token
        })
    }
    return authTokenRequest
  }
  return store.getters["auth/token"]
}

// tokenRequest dirty bit reseter
function resetAuthTokenRequest() {
  authTokenRequest = null
}

// Add headers to every request:
service.defaults.headers.common["Content-Type"] = "application/json"
service.defaults.headers.common["Accept"] = "application/json"

// request interceptor
service.interceptors.request.use(
  async request => {
    // Do something before request is sent
    // request.headers.common["Content-Type"] = "application/json";
    // request.headers.common["Accept"] = "application/json";

    if (
      !request.url.includes("login") &&
      !request.url.includes("refresh") &&
      !request.url.includes("forgot_password") &&
      !request.url.includes("reset_password") &&
      !request.url.includes("activate")
    ) {
      request.headers["Authorization"] = "Bearer " + (await getAuthToken())
    } else {
      request.headers["Authorization"] = "Bearer " + store.getters["auth/token"]
    }

    // const token = store.getters["auth/token"]
    // if (token) {
    //   request.headers.common["Authorization"] = `Bearer ${token}`
    // }
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
  // Si chequearamos por un custom status code:
  /* response => {
    debugger;
    const res = response.data;
    if (res.code !== 20000) {
      this.$q.notify({
        message: res.message || "error",
        color: "danger"
      });
      // 50008: Token ilegal; 50012: Otros clientes registrados; 50014: Token caducado;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        this.$q
          .dialog({
            title: "Cierre de Sesión",
            message:
              "Se ha desconectado, puede cancelar para permanecer en esta página o volver a iniciar sesión",
            ok: { push: true },
            cancel: { color: "negative" },
            persistent: true
          })
          .onOk(() => {
            store.dispatch("auth/resetToken").then(() => {
              location.reload();
            });
          });
      }
      return Promise.reject(res.message || "error");
    } else {
      return res;
    }
  }, */
  error => {
    debugger
    const req = error.request || undefined
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
    // If you can't refresh your token or you are sent Unauthorized on any request, logout and go to login
    if (
      req !== undefined &&
      (req.responseURL.includes("refresh") ||
        (status === 401 && error.config.__isRetryRequest))
    ) {
      debugger
      store.dispatch["auth/logout"]
      router.push({ name: "login" })
    }
    // else if (req !== undefined && req.status === 401) {
    //   error.config.__isRetryRequest = true
    //   return axios.request(error.config)
    // }

    // console.log("err: " + error); // for debug

    if (status >= 500) {
      this.$q.notify({
        message: "Ocurrio un problema al procesar su petición",
        color: "danger",
      })
    }

    if (status === 401) {
      error.config.__isRetryRequest = true
      return service.request(error.config)
      // Si esta logueado (en el front, porque tiene el user en el store) y dio 401, le aviso que debe loguearse de nuevo
      // if (store.getters["auth/check"]) {
      //   this.$q
      //     .dialog({
      //       title: "Cierre de Sesión",
      //       message: "Su sesion ha caducado. Debe volver a iniciar sesión",
      //       ok: { push: true },
      //       // cancel: { color: "negative" },
      //       persistent: true,
      //     })
      //     .onOk(() => {
      //       store.dispatch("user/resetToken").then(() => {
      //         router.push({ name: "login" })
      //       })
      //     })
      // }
    }
    return Promise.reject({
      message,
      status,
      data: error.response.data,
    })
  },
)

export default service
