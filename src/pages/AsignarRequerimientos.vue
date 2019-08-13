<template>
  <q-page padding class="q-pt-lg">
    <div class="row">
      <div class="col">
        <asignar-requerimientos-filtros2 @buscar="filtrarRequerimientos" />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm req-container--filter">
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosFiltered('NOAS')"
          :loading-list="loadingList"
          title="Requerimientos Por Asignar"
          :draggable="true"
          group-name="asignarRequerimientos"
          list-name="source"
        />
      </div>
      <div
        class="col-sm-4 col-xs-12"
        :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }"
      >
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosFiltered('ASSI')"
          :loading-list="loadingList"
          title="Requerimientos Asignados"
          :draggable="true"
          group-name="asignarRequerimientos"
          list-name="target"
        />
      </div>
      <div
        class="col-sm-4 col-xs-12"
        :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }"
      >
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosFiltered('EXEC/TEST')"
          :loading-list="loadingList"
          title="Reqs. en Ejecucion / Testing"
        />
      </div>
    </div>

    <dialog-detalle-requerimiento />
    <asignar-requerimientos-dialog-confirm-operation />
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import pageLoading from "mixins/pageLoading"
// import PageHeader from "comp/Common/PageHeader"
import AsignarRequerimientosList from "comp/AsignarRequerimientos/AsignarRequerimientosList"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import AsignarRequerimientosDialogConfirmOperation from "comp/AsignarRequerimientos/AsignarRequerimientosDialogConfirmOperation"
import AsignarRequerimientosFiltros2 from "comp/AsignarRequerimientos/AsignarRequerimientosFiltros2"
import { warn } from "utils/helpers"

export default {
  name: "AsignarRequerimientos",
  components: {
    // PageHeader,
    AsignarRequerimientosList,
    DialogDetalleRequerimiento,
    AsignarRequerimientosDialogConfirmOperation,
    AsignarRequerimientosFiltros2,
  },
  mixins: [pageLoading],
  data: () => ({
    filtroLastValues: {
      descripcion: null,
      sistema: null,
      tipo: null,
      usuariosAsignados: [],
      usuarioAlta: null,
    },
  }),
  computed: {
    ...mapState("asignacionRequerimientos", {
      reqs: state => state.requerimientos,
      loadingList: state => state.loadingRequerimientos,
      requerimientosLoaded: state => state.requerimientosLoaded,
    }),
    ...mapGetters("asignacionRequerimientos", ["requerimientosFiltered"]),
  },
  async created() {
    // this.$store.dispatch("requerimientos/createRequerimiento")
    // if (!this.requerimientosLoaded) {
    await this.$store.dispatch("asignacionRequerimientos/fetchRequerimientos")
    // }
  },
  methods: {
    async filtrarRequerimientos(filtrosValues) {
      try {
        // Si el filtro fue enviado como parametro, lo guardo localmente.
        // Cuando se llama al paginador, no tengo el valor del filtro. Por eso lo guardo previamente
        if (filtrosValues) {
          this.filtroLastValues.descripcion = filtrosValues.descripcion
          this.filtroLastValues.sistema = filtrosValues.sistema
          this.filtroLastValues.tipo = filtrosValues.tipo
          this.filtroLastValues.usuariosAsignados =
            filtrosValues.usuariosAsignados
          this.filtroLastValues.usuarioAlta = filtrosValues.usuarioAlta
        }
        // FIXME: no andan los usuarios asignados ni el tipo Rev procesos. (Falta en el combo)

        await this.$store.dispatch(
          "asignacionRequerimientos/setFilters",
          this.filtroLastValues,
        )
      } catch (e) {
        const message =
          e.message ||
          "Hubo un problema al cargar el listado de sus Requerimientos. Intente nuevamente más tarde"
        warn({ message })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
