<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos">
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
import DialogDetalleRequerimiento from "@comp/Common/DialogDetalleRequerimiento"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
    DialogConfirmOperation,
    DialogDetalleRequerimiento,
  },
  mixins: [pageLoading],
  data: () => ({
    usuarioVerComo: null,
  }),
  computed: {
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
