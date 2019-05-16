<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
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
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          :loading-list="loadingReqsAprobadosPriorizados"
          @update-list="processUpdateList"
        />
      </div>
    </div>

    <q-dialog
      v-model="dialogConfirmShowed"
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-accent text-white">
        <q-bar>
          <q-btn dense flat icon="fas fa-exclamation-triangle" />
          <!-- <div class="text-weight-bold">
            Confirmación
          </div> -->
          <q-space />
          <q-btn dense flat icon="close" @click="cancelOperation">
            <q-tooltip content-class="bg-white text-primary">
              Cancelar
            </q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <div class="text-h6">Confirmación</div>
        </q-card-section>
        <q-card-section>
          Esta a punto de cambiar el estado del requerimiento
          <strong>#{{ sourceToChangeReqId }}</strong>
          <br />
          ¿Desea confimar este cambio?
        </q-card-section>
        <q-card-section v-if="operationApprove">
          <q-input
            v-model="approveComment"
            color="white"
            dark
            outlined
            type="textarea"
            label="Si desea, puede agregar un comentario: "
            :hide-bottom-space="true"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="CANCELAR" color="negative" @click="cancelOperation" />
          <q-btn
            label="CONFIRMAR"
            outline
            color="white"
            @click="confirmOperation"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import { getRequerimientosByUserAndEstado } from "@api/requerimientos"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
  },
  mixins: [pageLoading],
  data() {
    return {
      reqsPendientesAprobacion: [],
      reqsAprobadosPriorizados: [],
      loadingReqsPendientesAprobacion: true,
      loadingReqsAprobadosPriorizados: true,
      dialogConfirmShowed: false,
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
    sourceToChangeReqId() {
      return _.get(this.possibleChanges.payload, "requerimiento_id", "")
    },
    possibleChangesSetted() {
      return (
        this.possibleChanges.sourceList.length &&
        this.possibleChanges.targetList.length &&
        this.possibleChanges.payload.requerimiento_id
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
    // - reordenamiento de la lista de aprobados => trigger update aprobados
    operationReoderApprovedList() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex !== null &&
        targetChanges.addedIndex !== null &&
        sourceChanges.removedIndex === null &&
        sourceChanges.addedIndex === null
      )
    },
    // - arrastrar de pendientes a aprobados => trigger update aprobados y pendientes
    operationApprove() {
      const { sourceChanges, targetChanges } = this.possibleChanges
      return (
        targetChanges.removedIndex === null &&
        targetChanges.addedIndex !== null &&
        sourceChanges.removedIndex !== null &&
        sourceChanges.addedIndex === null
      )
    },
    // - arrastrar de aprobados a pendientes => trigger update aprobados y pendientes
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
  watch: {
    // reqsPendientesAprobacion(val) {
    //   console.log("reqsPendientesAprobacion", val)
    // },
  },
  async created() {
    // FIXME: dependiendo del tipo de usuario (jerarquía), va a ver 1 sola columan y los titulos deberian cambiar
    const estadoPendiente = this.getEstadoByCodigo("PEND")
    const estadoAprobado = this.getEstadoByCodigo("APRV")
    this.$store.dispatch("app/loadingIncBy", 2)

    getRequerimientosByUserAndEstado(this.userId, estadoPendiente.id)
      .then(({ data: { data } }) => {
        this.reqsPendientesAprobacion = data
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.loadingReqsPendientesAprobacion = false
        this.$store.dispatch("app/loadingDec")
      })

    getRequerimientosByUserAndEstado(this.userId, estadoAprobado.id)
      .then(({ data: { data } }) => {
        this.reqsAprobadosPriorizados = data
      })
      .catch(e => console.log(e))
      .finally(() => {
        this.loadingReqsAprobadosPriorizados = false
        this.$store.dispatch("app/loadingDec")
      })
  },
  methods: {
    processUpdateList(listName, result, { removedIndex, addedIndex, payload }) {
      // console.log("processUpdateList", listName, result)
      // console.log("ri:", removedIndex, "ai", addedIndex, payload)
      this.possibleChanges[`${listName}List`] = result
      this.possibleChanges[`${listName}Changes`] = { addedIndex, removedIndex }
      this.$set(this.possibleChanges, "payload", payload)

      // Cuando los 2 listados se hayan llenado, se debe determinar el tipo de operacion
      if (this.possibleChangesSetted) {
        // - reordenamiento de la lista de pendientes => no hace nada
        if (this.operationReoderPendingList) {
          this.clearOperations()
        } else if (this.operationApprove || this.operationReject) {
          this.dialogConfirmShowed = true
        } else if (this.operationReoderApprovedList) {
          // TODO: trigger remote update ONLY for approvedList
          this.$set(
            this,
            "reqsPendientesAprobacion",
            this.possibleChanges.sourceList,
          )
          this.$set(
            this,
            "reqsAprobadosPriorizados",
            this.possibleChanges.targetList,
          )
          this.clearOperations()
        }
        /* console.log(
          "operationReoderPendingList",
          this.operationReoderPendingList,
        )
        console.log(
          "operationReoderApprovedList",
          this.operationReoderApprovedList,
        )
        console.log("operationApprove", this.operationApprove)
        console.log("operationReject", this.operationReject) */
      }

      // - reordenamiento de la lista de aprobados => trigger update aprobados
      // - arrastrar de pendientes a aprobados => trigger update aprobados y pendientes
      // - arrastrar de aprobados a pendientes => trigger update aprobados y pendientes
    },
    cancelOperation() {
      this.clearOperations()
    },
    confirmOperation() {
      // TODO trigger remote update FOR BOTH LISTS
      this.$set(
        this,
        "reqsPendientesAprobacion",
        this.possibleChanges.sourceList,
      )
      this.$set(
        this,
        "reqsAprobadosPriorizados",
        this.possibleChanges.targetList,
      )
      this.clearOperations()
    },
    clearOperations() {
      for (const listName of ["source", "target"]) {
        this.possibleChanges[`${listName}List`] = []
        this.possibleChanges[`${listName}Changes`] = {
          addedIndex: null,
          removedIndex: null,
        }
      }
      this.$set(this.possibleChanges, "payload", {})
      this.dialogConfirmShowed = false
    },
  },
}
</script>
