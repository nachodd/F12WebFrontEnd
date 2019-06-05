<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md justify-center">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list.sync="reqsPendientesAprobacion"
          :loading-list="loadingReqsPendientesAprobacion"
        />
      </div>

      <div v-if="!esElUltimoDeLaCadenaDeMando" class="col-sm-6 col-xs-12">
        <draggable-list
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          :loading-list="loadingReqsAprobadosPriorizados"
        />
      </div>
    </div>

    <dialog-confirm-operation />
    <dialog-detalle-requerimiento />
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
  // data() {
  //   return {
  //     detalleRequerimientoOpen: true,
  //   }
  // },
  computed: {
    ...mapGetters("auth", [
      // "userId",
      // "hasJefes",
      // "hasReportantes",
      // "userJefes",
      // "userReportantes",
      "esElUltimoDeLaCadenaDeMando",
    ]),
    // ...mapGetters("priorizarRequerimientos", [
    //   "possibleChangesSetted",
    //   "operationType",
    // ]),
    ...mapState("priorizarRequerimientos", {
      reqsPendientesAprobacion: state => state.reqsPendientesAprobacion,
      reqsAprobadosPriorizados: state => state.reqsAprobadosPriorizados,
      loadingReqsPendientesAprobacion: state =>
        state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state =>
        state.loadingReqsAprobadosPriorizados,
    }),
  },
  async created() {
    this.$store.dispatch(
      "priorizarRequerimientos/inicializarPriorizarRequerimientos",
    )
  },
  methods: {},
}
</script>
