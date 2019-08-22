import {
  login,
  logout,
  refresh,
  getUsuarioGestion,
  getUsuariosFiltro,
} from "api/user"
import {
  getToken,
  getExpiresIn,
  getRefreshToken,
  expiresToUnixTS,
  setToken,
  removeToken,
} from "utils/auth"
import { keysToCamel } from "utils/helpers"
import { resetRouter } from "router"
import router from "router/index"
// import * as types from "../mutation-types";

// state
const state = {
  token: getToken(),
  expiresIn: getExpiresIn(),
  refreshToken: getRefreshToken(),
  user: null,
  userArea: {},
  userNivel: "",
  userVinculacion: {
    jefes: [],
    reportantes: [],
    pares: [],
  },
  userSistemas: [],
  gerentes: [],
  usuariosFiltro: [],
  // roles: [],
}

// getters
const getters = {
  token: state => state.token,
  expiresIn: state => state.expiresIn,
  refreshToken: state => state.refreshToken,
  user: state => state.user,
  userId: state => (state.user ? state.user.usuarioId : null),
  userRazonSocial: state => (state.user ? state.user.razonSocial : "Usuario"),
  // roles: state => state.roles,
  check: state => state.user !== null,
  // userTreeLoaded: state => !_.isEmpty(state.userVinculacion),
  userJefes: state => state.userVinculacion && state.userVinculacion.jefes,
  userReportantes: state => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return _.map(userReps, ur => {
      return {
        label: ur.razonSocial,
        value: ur.usuarioId,
      }
    })
  },
  userReportantesNoOperativos: state => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return _(userReps)
      .filter(ur => ur.nivel !== "Operativo")
      .map(ur => ({
        label: ur.razonSocial,
        value: ur.usuarioId,
      }))
      .value()
  },
  userYoYReportantes: (state, getters) => {
    const ur = [...getters.userReportantes]
    const currentUser = state.user || {}
    ur.push({
      label: currentUser.razonSocial,
      value: currentUser.usuarioId,
    })
    return _.orderBy(ur, ["label"], ["asc"])
  },
  userPares: state => {
    const userPares = _.get(state, "userVinculacion.pares", [])
    return _.map(userPares, ur => {
      return {
        label: ur.razonSocial,
        value: ur.usuarioId,
      }
    })
  },
  userParesYReportantes: (state, getters) => {
    const users = [...getters.userReportantes, ...getters.userPares]
    return _.orderBy(users, ["label"], ["asc"])
  },
  userParesReportantesYJefes: (state, getters) => {
    const userJefes = getters.userJefes.map(uj => ({
      label: uj.razonSocial,
      value: uj.usuarioId,
    }))
    const users = [
      ...getters.userReportantes,
      ...getters.userPares,
      ...userJefes,
    ]
    return _.orderBy(users, ["label"], ["asc"])
  },
  userYoParesYReportantes: (state, getters) => {
    const users = [...getters.userParesYReportantes]
    const currentUser = state.user || {}
    users.push({
      label: currentUser.razonSocial,
      value: currentUser.usuarioId,
    })
    return _.orderBy(users, ["label"], ["asc"])
  },
  userYoYVinculacionDirecta: (state, getters) => {
    const users = [...getters.userParesReportantesYJefes]
    const currentUser = state.user || {}
    users.push({
      label: currentUser.razonSocial,
      value: currentUser.usuarioId,
    })
    return _.orderBy(users, ["label"], ["asc"])
  },
  hasJefes: (state, getters) =>
    getters.userJefes && getters.userJefes.length > 0,
  hasReportantes: (state, getters) =>
    getters.userReportantes && getters.userReportantes.length > 0,
  hasReportantesNoOperativos: (state, getters) => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return (
      getters.hasReportantes && _.some(userReps, ur => ur.nivel !== "Operativo")
    )
  },

  // Si no tiene reportantes, será el ultimo eslabon de la cadena de mando
  esElUltimoDeLaCadenaDeMando: state => state.userNivel === "Operativo",
  esGerente: state => state.userNivel === "Gerente",
  userSistemas: state => state.userSistemas,
  userEsResponsable: state => state.userSistemas.length > 0,
  puedeVerRequerimientosAsignados: state => {
    // valiamos que el area a la que pertece el usuario sea una de las areas a las cuales se les pueden asignar requerimientos
    const userPerteneceAreaConReqsAsignables =
      _.filter([8, 16, 36, 37, 48], id => id == state.userArea.id).length > 0
    // y que ademas el usuario en cuestion no sea gerente ni presidente:
    return (
      userPerteneceAreaConReqsAsignables &&
      state.userNivel !== "Gerente" &&
      state.userNivel !== "Presidente"
    )
  },

  userEsResponsableDeProcesos: state =>
    _.find(state.userSistemas, { id: 13 }) !== undefined,
  esDeSistemasOProcesos: state =>
    _.filter([36, 48], id => id == state.userArea.id).length > 0,
  esDeProcesos: state => state.userArea.id === 48,
  gerentesOrderByArea: state => {
    // return _.groupBy(state.gerentes, "area.descripcion")
    return _.orderBy(state.gerentes, ["area.descripcion", "razon_social"])
  },
  pusherChannelName: (state, getters) => {
    return `${process.env.PUSHER_CHANNEL_PREXIF}${getters.userId}`
  },
  usuariosFiltro: state => {
    return _(state.usuariosFiltro)
      .map(uf => ({
        id: uf.usuarioId,
        descripcion: uf.razonSocial,
      }))
      .orderBy("label")
      .value()
  },
}

// mutations
const mutations = {
  SET_TOKEN: (state, { token, expiresIn, refreshToken = null }) => {
    state.token = token
    state.expiresIn = expiresIn
    if (refreshToken) {
      state.refreshToken = refreshToken
    }
  },
  CLEAR_TOKENS: state => {
    state.token = ""
    state.expiresIn = ""
    state.refreshToken = ""
  },
  RESET_STATE: state => {
    state.user = null
    state.userArea = {}
    state.userNivel = ""
    state.userVinculacion.jefes = []
    state.userVinculacion.reportantes = []
    state.userVinculacion.pares = []
    state.userSistemas = []
    state.gerentes = []
    state.usuariosFiltro = []
  },
  SET_USER: (state, userData) => {
    if (userData === null) {
      state.user = null
      state.userArea = {}
      state.userVinculacion.jefes = []
      state.userVinculacion.reportantes = []
      state.userVinculacion.pares = []
      state.userSistemas = []
      state.userNivel = ""
    } else {
      const user = {}
      {
        // Block assigment - next variables aren't valid outside this scope
        let { usuario_id, usuario, razon_social, numero_documento } = userData
        Object.assign(user, {
          usuarioId: usuario_id,
          usuario,
          razonSocial: razon_social,
          numeroDocumento: numero_documento,
        })
      }
      state.user = user
      state.userArea = userData.area
      state.userSistemas = userData.sistemas
      state.userVinculacion.jefes = keysToCamel(userData.jefes)
      state.userVinculacion.reportantes = keysToCamel(userData.reportantes)
      state.userVinculacion.pares = keysToCamel(userData.pares)
      state.userNivel = userData.nivel
    }
  },
  SET_GERENTES: (state, data) => {
    state.gerentes = data
  },
  SET_USUARIOS_FILTRO: (state, data) => {
    state.usuariosFiltro = keysToCamel(data)
  },
}

// actions
const actions = {
  // user login
  login({ commit, dispatch }, userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo)
        // console.log("loginData", data)
        const expires = expiresToUnixTS(data.expires_in)
        commit("SET_TOKEN", {
          token: data.access_token,
          expiresIn: expires,
          refreshToken: data.refresh_token,
        })
        setToken(data.access_token, expires, data.refresh_token)
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        await dispatch("getUserInfo")

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  getUserInfo({ commit, getters, dispatch }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        await dispatch("app/initPusher", getters.pusherChannelName, {
          root: true,
        })

        resolve()
      } catch (error) {
        // Si esta en el login y falló al obtener el usuario (porque por ejemplo, esta caido f12), reseteo el token
        const isInLogin = router.currentRoute.name === "login"
        if (isInLogin) {
          await dispatch("resetToken")
        }
        // TODO: Si estamos en loginHorus y falla al cargar la info del usuario, deberiamos devolver un error que especifique que hay problemas con el servidor y que vuelva a intentar mas tarde
        reject(error)
      }
    })
  },
  loginHorus(
    { commit, dispatch },
    { access_token, expires_in, refresh_token },
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const expires = expiresToUnixTS(expires_in)
        commit("SET_TOKEN", {
          token: access_token,
          expiresIn: expires,
          refreshToken: refresh_token,
        })
        setToken(access_token, expires, refresh_token)
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        await dispatch("getUserInfo")

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      // try to logout only if token is expired (becouse, token is needed to logout)
      if (state.token) {
        try {
          await logout()
        } catch (error) {
          // can't logout (ie token expired) => do nothing
        }
      }
      try {
        commit("RESET_STATE")
        commit("app/LOADING_RESET", null, { root: true })
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        removeToken()
        resetRouter()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("RESET_STATE")
      commit("app/LOADING_RESET", null, { root: true })
      removeToken()
      resolve()
    })
  },

  refresh({ commit, state, dispatch }) {
    return new Promise(async (resolve, reject) => {
      if (!state.refreshToken) {
        dispatch("logout")
        commit("app/LOADING_RESET", null, { root: true })
        reject()
      } else {
        try {
          const { data } = await refresh(state.refreshToken)

          const expires = expiresToUnixTS(data.expires_in)
          commit("SET_TOKEN", {
            token: data.access_token,
            expiresIn: expires,
            refreshToken: data.refresh_token,
          })
          setToken(data.access_token, expires, data.refresh_token)

          resolve()
        } catch (e) {
          await dispatch("resetToken")
          reject()
        }
      }
    })
  },

  getUsuariosFiltro({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        // solo traera los usuarios para el filtro si no los cargó aun
        if (state.usuariosFiltro.length === 0) {
          const usuariosFiltro = await getUsuariosFiltro()
          commit("SET_USUARIOS_FILTRO", usuariosFiltro)
        }
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
