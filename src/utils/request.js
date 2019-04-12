import axios from "axios"
import store from "src/store"
import router from "src/router"

// create an axios instance
console.log(process.env.VUE_APP_BASE_API)
debugger

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
  request => {
    // Do something before request is sent
    // request.headers.common["Content-Type"] = "application/json";
    // request.headers.common["Accept"] = "application/json";
    const token = store.getters["auth/token"]

    if (token) {
      request.headers.common["Authorization"] = `Bearer ${token}`
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
    // console.log("err: " + error); // for debug
    const message =
      (error.response.data && error.response.data.message) ||
      "Ocurrio un problema al procesar su petición"
    const { status } = error.response

    if (status >= 500) {
      this.$q.notify({
        message: "Ocurrio un problema al procesar su petición",
        color: "danger",
      })
    }

    if (status === 401) {
      // Si esta logueado (en el front, porque tiene el user en el store) y dio 401, le aviso que debe loguearse de nuevo
      if (store.getters["auth/check"]) {
        this.$q
          .dialog({
            title: "Cierre de Sesión",
            message: "Su sesion ha caducado. Debe volver a iniciar sesión",
            ok: { push: true },
            // cancel: { color: "negative" },
            persistent: true,
          })
          .onOk(() => {
            store.dispatch("user/resetToken").then(() => {
              router.push({ name: "login" })
            })
          })
      }
    }
    return Promise.reject({
      message,
      status,
      data: error.response.data,
    })
  },
)

export default service
