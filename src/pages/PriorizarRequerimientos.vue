<template>
  <q-page padding class="q-pt-lg">
    <div class="row">
      <div class="col">
        <priorizar-requerimientos-filtros />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list="requerimientosFiltered('PEND')"
          :loading-list="loadingReqsPendientesAprobacion"
        />
      </div>

      <div v-if="!esElUltimoDeLaCadenaDeMando" class="col-sm-6 col-xs-12">
        <draggable-list
          :requerimientos-list="requerimientosFiltered('APRV')"
          :loading-list="loadingReqsAprobadosPriorizados"
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
        />
      </div>
    </div>

    <dialog-confirm-operation />
    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import pageLoading from "mixins/pageLoading"
import DraggableList from "comp/PriorizarRequerimientos/DraggableList"
import DialogConfirmOperation from "comp/PriorizarRequerimientos/DialogConfirmOperation"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import PriorizarRequerimientosFiltros from "comp/PriorizarRequerimientos/PriorizarRequerimientosFiltros"

export default {
  name: "PriorizarRequerimientos",
  components: {
    DraggableList,
    DialogConfirmOperation,
    DialogDetalleRequerimiento,
    PriorizarRequerimientosFiltros,
  },
  mixins: [pageLoading],
  data: () => ({
    usuarioVerComo: null,
  }),
  computed: {
    ...mapGetters("priorizarRequerimientos", ["requerimientosFiltered"]),
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapState("priorizarRequerimientos", {
      loadingReqsPendientesAprobacion: state =>
        state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state =>
        state.loadingReqsAprobadosPriorizados,
    }),
  },
  beforeCreate() {
    this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
  },
  async created() {
    this.$store.dispatch("requerimientos/createRequerimiento")
  },
  methods: {},
}
</script>
