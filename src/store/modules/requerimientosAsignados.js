import RequerimientosAsignadosList from "@models/RequerimientosAsignadosList"
import { getRequerimientosAsignadosByUser } from "@api/requerimientos"

// import { warn, success } from "@utils/helpers"

const state = {
  reqsAsignadosnEnCurso: new RequerimientosAsignadosList([], false),
  reqsAsignadoPendientes: new RequerimientosAsignadosList([], true),
}

const getters = {}

const mutations = {}

const actions = {
  inicializarRequerimientosAsignados({ dispatch, rootGetters }) {
    const currentUserId = rootGetters["auth/userId"]

    dispatch("getRequerimientosAsignadosByUser", {
      userId: currentUserId,
      reqState: "APRV",
    })
  },
  getRequerimientosAsignadosByUser(
    // { commit, rootGetters },
    { rootGetters },
    { userId, reqState },
  ) {
    const estadoReq = rootGetters["requerimientos/getEstadoByCodigo"](reqState)
    console.log(estadoReq)
    // const listType = reqState === "PEND" ? "pending" : "approved"

    // commit("SET_LOADING_STATE_REQS_LISTS", { listType, loadingState: true })

    return getRequerimientosAsignadosByUser(userId)
      .then(({ data: { data } }) => {
        console.log("requerimientosAsignados", data)
        // commit("SET_REQS_LIST", { listType, listData: data })
        // commit("UPDATE_LIST_ESTADO", listType)
        // commit("SORT_LIST_BY_PRIORITY", listType)
      })
      .catch(e => console.log(e))
      .finally(() => {
        // commit("SET_LOADING_STATE_REQS_LISTS", {
        //   listType,
        //   loadingState: false,
        // })
      })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
