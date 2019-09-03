<template>
  <q-page padding class="q-pt-lg">
    <div class="row">
      <div class="col">
        <requerimientos-asignados-filtros @buscar="filtrarRequerimientos" />
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
      </div>

      <div class="col-sm-4 col-xs-12" :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }">
        <requerimientos-asignados-list
          title="En Ejecución"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list="requerimientosFiltered('EXEC')"
          :loading-list="loadingRequerimientos"
        />
      </div>

      <div class="col-sm-4 col-xs-12" :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }">
        <requerimientos-asignados-list
          title="Testing"
          group-name="requerimientos"
          list-name="testing"
          :requerimientos-list="requerimientosFiltered('TEST')"
          :loading-list="loadingRequerimientos"
        />
      </div>
    </div>

    <requerimientos-asignados-dialog-confirm-operation />
    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import pageLoading from "mixins/pageLoading"
import RequerimientosAsignadosList from "comp/RequerimientosAsignados/RequerimientosAsignadosList"
import RequerimientosAsignadosDialogConfirmOperation from "comp/RequerimientosAsignados/RequerimientosAsignadosDialogConfirmOperation"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import RequerimientosAsignadosFiltros from "comp/RequerimientosAsignados/RequerimientosAsignadosFiltros"

export default {
  name: "RequerimientosAsigandos",
  components: {
    RequerimientosAsignadosList,
    RequerimientosAsignadosDialogConfirmOperation,
    DialogDetalleRequerimiento,
    RequerimientosAsignadosFiltros,
  },
  mixins: [pageLoading],
  data: () => ({
    filtroLastValues: {
      descripcion: null,
      sistema: null,
      tipo: null,
    },
  }),
  computed: {
    ...mapState("requerimientosAsignados", {
      loadingRequerimientos: state => state.loadingRequerimientos,
    }),
    ...mapGetters("requerimientosAsignados", ["requerimientosFiltered"]),
  },
  async created() {
    await this.$store.dispatch("requerimientosAsignados/inicializarRequerimientosAsignados")
  },
  methods: {
    filtrarRequerimientos(filtrosValues) {
      if (filtrosValues) {
        this.filtroLastValues.descripcion = filtrosValues.descripcion
        this.filtroLastValues.sistema = filtrosValues.sistema
        this.filtroLastValues.tipo = filtrosValues.tipo
      }
      this.$store.dispatch("requerimientosAsignados/setFilters", this.filtroLastValues)
    },
  },
}
</script>
<style lang="scss" scoped></style>
