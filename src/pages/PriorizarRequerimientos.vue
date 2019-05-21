<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          ref="source"
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list.sync="reqsPendientesAprobacion"
          :loading-list="loadingReqsPendientesAprobacion"
          @update-list="processUpdateList"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <draggable-list
          ref="target"
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          :loading-list="loadingReqsAprobadosPriorizados"
          @update-list="processUpdateList"
        />
      </div>
    </div>

    <dialog-confirm-operation
      :operation-approve="operationApprove"
      :operation-reject="operationReject"
      :dialog-confirm-open="dialogConfirmOpen"
      :requerimiento-id-to-changed="requerimientoIdToChange"
      @dialog-confirm-operation-cancel="clearOperation"
      @dialog-confirm-operation-confirm="confirmOperation"
    />
  </q-page>
</template>

<script>
import { mapGetters } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import { warn, success } from "@utils/helpers"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"
import DialogConfirmOperation from "@comp/PriorizarRequerimientos/DialogConfirmOperation"
import RequerimientosPriorizarList from "@models/RequerimientosPriorizarList"
import {
  getRequerimientosByUserAndEstado,
  updateRequerimientosEstados,
} from "@api/requerimientos"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
    DialogConfirmOperation,
  },
  mixins: [pageLoading],
  data() {
    return {
      reqsPendientesAprobacion: new RequerimientosPriorizarList([], false),
      reqsAprobadosPriorizados: new RequerimientosPriorizarList([], true),
      loadingReqsPendientesAprobacion: true,
      loadingReqsAprobadosPriorizados: true,
      dialogConfirmOpen: false,
      possibleChanges: {
        sourceList: [],
        sourceChanges: {
          addedIndex: null,
          removedIndex: null,
        },
        targetList: [],
        targetChanges: {
          addedIndex: null,
          removedIndex: null,
        },
        payload: {},
      },
      approveComment: "",
    }
  },
  computed: {
    ...mapGetters("auth", ["userId"]),
    ...mapGetters("requerimientos", ["getEstadoByCodigo"]),
    requerimientoIdToChange() {
      return _.get(this.possibleChanges.payload, "id", "")
    },
    possibleChangesSetted() {
      return (
        this.possibleChanges.sourceList.length &&
        this.possibleChanges.targetList.length &&
        this.possibleChanges.payload.id
      )
    },
    // - reordenamiento de la lista de pendientes => no hace nada
    operationReoderPendingList() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex === null &&
        targetChanges.addedIndex === null &&
        sourceChanges.removedIndex !== null &&
        sourceChanges.addedIndex !== null
      )
    },
    // - reordenamiento de la lista de aprobados => disparar update aprobados
    operationReoderApprovedList() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex !== null &&
        targetChanges.addedIndex !== null &&
        sourceChanges.removedIndex === null &&
        sourceChanges.addedIndex === null
      )
    },
    // - arrastrar de pendientes a aprobados => confirmar y disparar update aprobados y pendientes
    operationApprove() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex === null &&
        targetChanges.addedIndex !== null &&
        sourceChanges.removedIndex !== null &&
        sourceChanges.addedIndex === null
      )
    },
    // - arrastrar de aprobados a pendientes => confirmar y disparar update aprobados y pendientes
    operationReject() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex !== null &&
        targetChanges.addedIndex === null &&
        sourceChanges.removedIndex === null &&
        sourceChanges.addedIndex !== null
      )
    },
  },
  async created() {
    // FIXME: dependiendo del tipo de usuario (jerarquía), va a ver 1 sola columan y los titulos deberian cambiar
    const estadoPendiente = this.getEstadoByCodigo("PEND")
    const estadoAprobado = this.getEstadoByCodigo("APRV")
    this.$store.dispatch("app/loadingIncBy", 2)

    getRequerimientosByUserAndEstado(this.userId, estadoPendiente.id)
      .then(({ data: { data } }) => {
        this.reqsPendientesAprobacion.list = data
        this.reqsPendientesAprobacion.sortByPrioridad()
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.loadingReqsPendientesAprobacion = false
        this.$store.dispatch("app/loadingDec")
      })

    getRequerimientosByUserAndEstado(this.userId, estadoAprobado.id)
      .then(({ data: { data } }) => {
        this.reqsAprobadosPriorizados.list = data
        this.reqsAprobadosPriorizados.sortByPrioridad()
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.loadingReqsAprobadosPriorizados = false
        this.$store.dispatch("app/loadingDec")
      })
  },
  methods: {
    async processUpdateList(
      listName,
      result,
      { removedIndex, addedIndex, payload },
    ) {
      this.possibleChanges[`${listName}List`] = result
      this.possibleChanges[`${listName}Changes`] = { addedIndex, removedIndex }
      this.$set(this.possibleChanges, "payload", payload)

      // Cuando los 2 listados se hayan llenado, se debe determinar el tipo de operacion
      if (this.possibleChangesSetted) {
        // - reordenamiento de la lista de pendientes => no hace nada
        if (this.operationReoderPendingList) {
          // actualizo localmente, aunque el cambio no es persistido
          this.reqsPendientesAprobacion.list = this.possibleChanges.sourceList
          this.clearOperation()
        }
        // - arrastrar de pendientes a aprobados => confirmar y disparar update aprobados y pendientes
        // - arrastrar de aprobados a pendientes => confirmar y disparar update aprobados y pendientes
        else if (this.operationApprove || this.operationReject) {
          this.dialogConfirmOpen = true // la operacion es mandejada por el dialog de confirmación
        }
        // - reordenamiento de la lista de aprobados => disparar update aprobados
        else if (this.operationReoderApprovedList) {
          // valido si efecivamente si hizo un cambio: Si el addedIndex y removedIndex son iguales, no se movio nada en la lista
          const differentPosition =
            this.possibleChanges.targetChanges.addedIndex !==
            this.possibleChanges.targetChanges.removedIndex
          if (differentPosition) {
            const aprobadosBackup = [...this.reqsAprobadosPriorizados.list]
            this.reqsAprobadosPriorizados.list = this.possibleChanges.targetList
            this.reqsAprobadosPriorizados.updatePrioridad()
            const res = await this.persistChanges(
              this.reqsAprobadosPriorizados.toUpdatePayload(),
            )
            if (!res) {
              this.reqsAprobadosPriorizados.list = aprobadosBackup
            }
          }
          this.clearOperation()
        }
      }
    },
    async confirmOperation(comentario) {
      // copio los listados (de manera de tener un backup)
      const pendientesBackup = [...this.reqsPendientesAprobacion.list]
      const aprobadosBackup = [...this.reqsAprobadosPriorizados.list]

      // Actualizo el comentario
      let listToUpdateComment = this.operationReject
        ? "sourceList"
        : "targetList"
      _.find(this.possibleChanges[listToUpdateComment], {
        id: this.requerimientoIdToChange,
      }).comentario = comentario

      // actualizo localmente los listados
      this.reqsPendientesAprobacion.list = this.possibleChanges.sourceList
      this.reqsAprobadosPriorizados.list = this.possibleChanges.targetList

      this.reqsAprobadosPriorizados.updatePrioridad()
      this.reqsAprobadosPriorizados.sortByPrioridad()

      const tempReqsConcated = [
        ...this.reqsPendientesAprobacion.toUpdatePayload(),
        ...this.reqsAprobadosPriorizados.toUpdatePayload(),
      ]
      // Persisto los cambios y si no gurado correctamente, reviertos los cambios
      const res = await this.persistChanges(tempReqsConcated)
      if (!res) {
        this.reqsPendientesAprobacion.list = pendientesBackup
        this.reqsAprobadosPriorizados.list = aprobadosBackup
      }
      this.clearOperation()
    },
    async persistChanges(list) {
      try {
        this.$store.dispatch("app/loadingInc")
        await updateRequerimientosEstados(this.userId, list)

        let message = ""
        if (this.operationReject) {
          message = `Requerimiento #${
            this.requerimientoIdToChange
          } marcado como "PEND. DE APROBACIÓN"`
        } else if (this.operationApprove) {
          message = `Requerimiento #${this.requerimientoIdToChange} APROBADO`
        } else if (this.operationReoderApprovedList) {
          message = "Requerimientos aprobados PRIORIZADOS"
        }
        success({ message })

        return true
      } catch (e) {
        const message =
          e.message ||
          "Hubo un problema al cambiar el estado de los Requerimientos. Intente nuevamente más tarde"
        warn({ message })
        return false
      } finally {
        this.$store.dispatch("app/loadingDec")
      }
    },
    clearOperation() {
      for (const listName of ["source", "target"]) {
        this.possibleChanges[`${listName}List`] = []
        this.possibleChanges[`${listName}Changes`] = {
          addedIndex: null,
          removedIndex: null,
        }
      }
      this.$set(this.possibleChanges, "payload", {})
      this.approveComment = ""
      this.dialogConfirmOpen = false
    },
  },
}
</script>
