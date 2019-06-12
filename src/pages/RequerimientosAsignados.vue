<template>
  <q-page padding>
    <page-header title="Requerimientos Asignados" />
    <div class="row q-col-gutter-md justify-center">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Pendientes"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list.sync="reqsAsignadosPendientes"
          :loading-list="loadingReqsPendientesAprobacion"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="En Ejecución"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAsignadosEnEjecucion"
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
import DraggableList from "@comp/RequerimientosAsignados/DraggableList"
import DialogConfirmOperation from "@comp/PriorizarRequerimientos/DialogConfirmOperation"
import DialogDetalleRequerimiento from "@comp/PriorizarRequerimientos/DialogDetalleRequerimiento"

export default {
  name: "RequerimientosAsigandos",
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
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),

    ...mapState("priorizarRequerimientos", {
      reqsPendientesAprobacion: state => state.reqsPendientesAprobacion,
      reqsAprobadosPriorizados: state => state.reqsAprobadosPriorizados,
      loadingReqsPendientesAprobacion: state =>
        state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state =>
        state.loadingReqsAprobadosPriorizados,
    }),

    ...mapState("requerimientosAsignados", {
      reqsAsignadosPendientes: state => state.reqsAsignadosPendientes,
      reqsAsignadosEnEjecucion: state => state.reqsAsignadosEnEjecucion,
    }),
  },
  async created() {
    this.$store.dispatch(
      "requerimientosAsignados/inicializarRequerimientosAsignados",
    )
  },
  methods: {},
}
</script>
