<template>
  <q-page padding class="q-pt-lg">
    <div class="row">
      <div class="col">
        <requerimientos-asignados-filtros />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm req-container--filter">
      <div class="col-sm-4 col-xs-12">
        <requerimientos-asignados-list
          title="Pendientes"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list="requerimientosFiltered('ASSI')"
          :loading-list="loadingRequerimientos"
        />
        <!-- requerimientosFiltered('ASSI') -->
      </div>

      <div
        class="col-sm-4 col-xs-12"
        :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }"
      >
        <requerimientos-asignados-list
          title="En Ejecución"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list="requerimientosFiltered('EXEC')"
          :loading-list="loadingRequerimientos"
        />
      </div>

      <div
        class="col-sm-4 col-xs-12"
        :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }"
      >
        <requerimientos-asignados-list
          title="Testing"
          group-name="requerimientos"
          list-name="testing"
          :requerimientos-list="requerimientosFiltered('TEST')"
          :loading-list="loadingRequerimientos"
        />
      </div>
    </div>

    <dialog-confirm-operation />
    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import pageLoading from "mixins/pageLoading"
import RequerimientosAsignadosList from "comp/RequerimientosAsignados/RequerimientosAsignadosList"
import DialogConfirmOperation from "comp/RequerimientosAsignados/DialogConfirmOperation"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import RequerimientosAsignadosFiltros from "comp/RequerimientosAsignados/RequerimientosAsignadosFiltros"

export default {
  name: "RequerimientosAsigandos",
  components: {
    RequerimientosAsignadosList,
    DialogConfirmOperation,
    DialogDetalleRequerimiento,
    RequerimientosAsignadosFiltros,
  },
  mixins: [pageLoading],
  computed: {
    ...mapState("requerimientosAsignados", {
      loadingRequerimientos: state => state.loadingRequerimientos,
    }),
    ...mapGetters("requerimientosAsignados", ["requerimientosFiltered"]),
  },
  async created() {
    this.$store.dispatch("requerimientos/createRequerimiento")
    this.$store.dispatch(
      "requerimientosAsignados/inicializarRequerimientosAsignados",
    )
  },
}
</script>
<style lang="scss" scoped></style>
