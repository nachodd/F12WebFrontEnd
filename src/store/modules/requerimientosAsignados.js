import RequerimientosAsignadosList from "@models/RequerimientosAsignadosList"
import { getRequerimientosAsignadosByUser } from "@api/requerimientos"

// import { warn, success } from "@utils/helpers"

const state = {
  reqsAsignadosEnCurso: new RequerimientosAsignadosList([], true),
  reqsAsignadoPendientes: new RequerimientosAsignadosList([], true),
}

const getters = {}

const mutations = {
  SET_REQS_LIST: (state, { listData }) => {
    // listType === "EXEC"
    //   ? (state.reqsAsignadosEnCurso.list = listData)
    //   : (state.reqsAsignadoPendientes.list = listData)
  },
}

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
    { commit },
    { rootGetters },
    { userId, reqState },
  ) {
    const estadoReq = rootGetters["requerimientos/getEstadoByCodigo"](reqState)
    console.log(estadoReq)
    // const listType = reqState === "PEND" ? "pending" : "approved"

    // commit("SET_LOADING_STATE_REQS_LISTS", { listType, loadingState: true })

    return getRequerimientosAsignadosByUser(userId, estadoReq)
      .then(({ data: { data } }) => {
        // console.log("requerimientosAsignados", data)

        commit("SET_REQS_LIST", { listData: data })

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
  processUpdateList({ commit, getters, dispatch }, updatedListData) {
    return new Promise(resolve => {
      // Updateo los listados temporales
      // commit("PROCESS_UPDATE_LISTS", updatedListData)

      // Chequeo si
      //  - si esElUltimoDeLaCadenaDeMando===false => si AMBOS listados temporales fueron seteados los cambios
      //  - si esElUltimoDeLaCadenaDeMando===true, => si SOLO en el listado temporal de pendientes (source) fueron seteados los cambios
      if (!getters.possibleChangesSetted) {
        return
      }

      switch (getters.operationType) {
        case "reorder-pending":
          dispatch("saveReorderPending")
          break
        case "reorder-approved":
          dispatch("saveReorderApproved")
          break
        case "approve":
        case "reject":
          dispatch("setDialogConfirmOperationOpen", true)
          break
      }
      resolve()
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
