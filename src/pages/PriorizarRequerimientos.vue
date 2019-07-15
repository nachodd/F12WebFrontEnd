<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" no-margin>
      <template v-if="hasReportantes">
        <div class="row">
          <div class="col">
            <q-select
              v-model="usuarioVerComo"
              color="accent"
              dense
              standout
              :options="optionsUsersReportantes"
              emit-value
              map-options
              @input="changeUsuarioVerComo"
            />
          </div>
        </div>
      </template>
    </page-header>
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
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"
import DialogConfirmOperation from "@comp/PriorizarRequerimientos/DialogConfirmOperation"
import DialogDetalleRequerimiento from "@comp/Common/DialogDetalleRequerimiento"
import PriorizarRequerimientosFiltros from "@comp/PriorizarRequerimientos/PriorizarRequerimientosFiltros"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
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
    ...mapGetters("auth", [
      "hasReportantes",
      "userReportantes",
      "esElUltimoDeLaCadenaDeMando",
    ]),
    ...mapState("priorizarRequerimientos", {
      reqsPendientesAprobacion: state => state.reqsPendientesAprobacion,
      reqsAprobadosPriorizados: state => state.reqsAprobadosPriorizados,
      loadingReqsPendientesAprobacion: state =>
        state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state =>
        state.loadingReqsAprobadosPriorizados,
    }),
    optionsUsersReportantes() {
      const label =
        this.usuarioVerComo === null
          ? "Ver listado como..."
          : `<strong>VOLVER A MI LISTADO</strong>`
      return [
        {
          label,
          value: null,
        },
        ..._.orderBy(this.userReportantes, "label"),
      ]
    },
  },
  async created() {
    this.$store.dispatch("requerimientos/createRequerimiento")
    this.changeUsuarioVerComo(null)
  },
  methods: {
    changeUsuarioVerComo(userId) {
      this.$store.dispatch(
        "priorizarRequerimientos/inicializarPriorizarRequerimientos",
        { userId },
      )
    },
  },
}
</script>
