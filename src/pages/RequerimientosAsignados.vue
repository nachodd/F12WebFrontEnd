<template>
  <q-page padding>
    <page-header title="Requerimientos Asignados" no-margin />
    <div class="row q-py-md">
      <div class="col">
        <div class="square d-ib bg-red-7">&nbsp;</div>
        Arreglo Rápido &nbsp;&nbsp; - &nbsp;&nbsp;
        <div class="square d-ib bg-light-blue-7">&nbsp;</div>
        Desarrollo / Mejora &nbsp;&nbsp;
        <!-- - &nbsp;&nbsp; En Procesos
        <div class="square d-ib bg-green-7"></div>-->
      </div>
    </div>
    <div class="row q-pt-md q-col-gutter-sm">
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
import DialogConfirmOperation from "@comp/RequerimientosAsignados/DialogConfirmOperation"
import DialogDetalleRequerimiento from "@comp/Common/DialogDetalleRequerimiento"

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
<style lang="scss" scoped>
.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-top: 20px;
  top: -20px;
  padding-left: 5px;
  padding-right: 5px;
}

.scrolling-wrapper__card {
  flex: 0 0 auto;
  min-width: 400px;
  margin-right: 1em;
}

.d-ib {
  display: inline-block;
}

.square {
  width: 4px;
  height: 18px;
  vertical-align: middle;
}
</style>
