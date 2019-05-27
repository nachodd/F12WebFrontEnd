<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md justify-center">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          ref="source"
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list.sync="reqsPendientesAprobacion"
          :loading-list="loadingReqsPendientesAprobacion"
          @list-updated="processListUpdated"
        />
      </div>

      <div v-if="!esElUltimoDeLaCadenaDeMando" class="col-sm-6 col-xs-12">
        <draggable-list
          ref="target"
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          :loading-list="loadingReqsAprobadosPriorizados"
          @list-updated="processListUpdated"
        />
      </div>
    </div>

    <dialog-confirm-operation />
    <dialog-detalle-requerimiento v-model="detalleRequerimientoOpen" />
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"
import DialogConfirmOperation from "@comp/PriorizarRequerimientos/DialogConfirmOperation"
import DialogDetalleRequerimiento from "@comp/PriorizarRequerimientos/DialogDetalleRequerimiento"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
    DialogConfirmOperation,
    DialogDetalleRequerimiento,
  },
  mixins: [pageLoading],
  data() {
    return {
      detalleRequerimientoOpen: false,
    }
  },
  computed: {
    ...mapGetters("auth", [
      "userId",
      // "userTreeLoaded",
      // "hasSuperiors",
      // "hasSubordinates",
      // "userSuperiors",
      // "userSubordinates",
      "esElUltimoDeLaCadenaDeMando",
    ]),
    ...mapGetters("priorizarRequerimientos", [
      "possibleChangesSetted",
      "operationType",
    ]),
    ...mapState("priorizarRequerimientos", {
      reqsPendientesAprobacion: state => state.reqsPendientesAprobacion,
      reqsAprobadosPriorizados: state => state.reqsAprobadosPriorizados,
      loadingReqsPendientesAprobacion: state =>
        state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state =>
        state.loadingReqsAprobadosPriorizados,
      dialogConfirmOpen: state => state.dialogConfirmOpen,
      possibleChanges: state => state.possibleChanges,
    }),
  },
  async created() {
    // FIXME: pasar estas 2 operaciones a 1 sola action en el store

    this.$store.dispatch(
      "priorizarRequerimientos/getRequerimientosByUserAndEstado",
      { userId: this.userId, reqState: "PEND" },
    )

    if (!this.esElUltimoDeLaCadenaDeMando) {
      this.$store.dispatch(
        "priorizarRequerimientos/getRequerimientosByUserAndEstado",
        { userId: this.userId, reqState: "APRV" },
      )
    }
  },
  methods: {
    processListUpdated() {
      // TODO:  pasar esto al store

      // Cuando el/los listado/s se hayan llenado, se puede determinar el tipo de operacion
      if (!this.possibleChangesSetted) {
        return
      }

      switch (this.operationType) {
        case "reorder-pending":
          this.$store.dispatch("priorizarRequerimientos/saveReorderPending")
          break
        case "reorder-approved":
          this.$store.dispatch("priorizarRequerimientos/saveReorderApproved")
          break
        case "approve":
        case "reject":
          this.$store.dispatch(
            "priorizarRequerimientos/setDialogConfirmOperationOpen",
            true,
          )
          break
      }
    },
  },
}
</script>
