<template>
  <q-page padding class="q-pt-lg">
    <div class="row">
      <div class="col">
        <priorizar-requerimientos-filtros @buscar="filtrarRequerimientos" />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm justify-center req-container--nofilter">
      <div v-if="esElUltimoDeLaCadenaDeMando === false" class="col-sm-6 col-xs-12">
        <priorizar-requerimientos-list
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list="requerimientosFiltered('PEND')"
          :loading-list="loadingReqsPendientesAprobacion"
        />
      </div>

      <div class="col-sm-6 col-xs-12" :class="{ 'q-pt-xlg': this.$q.screen.lt.sm }">
        <priorizar-requerimientos-list
          :requerimientos-list="targetList"
          :loading-list="loadingReqsAprobadosPriorizados"
          :title="titleTargetList"
          group-name="requerimientos"
          list-name="target"
        />
      </div>
    </div>

    <priorizar-requerimientos-dialog-confirm-operation />
    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import pageLoading from "mixins/pageLoading"
import PriorizarRequerimientosList from "comp/PriorizarRequerimientos/PriorizarRequerimientosList"
import PriorizarRequerimientosDialogConfirmOperation from "comp/PriorizarRequerimientos/PriorizarRequerimientosDialogConfirmOperation"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import PriorizarRequerimientosFiltros from "comp/PriorizarRequerimientos/PriorizarRequerimientosFiltros"
import { warn } from "utils/helpers"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PriorizarRequerimientosList,
    PriorizarRequerimientosDialogConfirmOperation,
    DialogDetalleRequerimiento,
    PriorizarRequerimientosFiltros,
  },
  mixins: [pageLoading],
  data: () => ({
    filtroLastValues: {
      descripcion: null,
      sistema: null,
      tipo: null,
      usuarioVerComo: null,
      usuarioAlta: null,
    },
  }),
  computed: {
    ...mapGetters("priorizarRequerimientos", ["requerimientosFiltered"]),
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapState("priorizarRequerimientos", {
      loadingReqsPendientesAprobacion: state => state.loadingReqsPendientesAprobacion,
      loadingReqsAprobadosPriorizados: state => state.loadingReqsAprobadosPriorizados,
    }),
    targetList() {
      return this.esElUltimoDeLaCadenaDeMando
        ? this.requerimientosFiltered("PEND")
        : this.requerimientosFiltered("APRV")
    },
    titleTargetList() {
      return this.esElUltimoDeLaCadenaDeMando ? "Pendientes de Aprobación" : "Aprobados"
    },
  },
  beforeCreate() {
    this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
  },
  async created() {
    // FIXME: conectar el filtro PriorizarRequerimientosFiltros2 con esta pagina (similar a lo que hace MisRequerimientos).
    // Tener cuidado con usuarioVerComo, poruqe cuando ese cambia se hace un request al backend y se debe hacer un
    //   this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
    // this.$store.dispatch("requerimientos/createRequerimiento")
    await this.$store.dispatch("priorizarRequerimientos/inicializarPriorizarRequerimientos", {
      userId: null,
    })
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
          this.filtroLastValues.usuarioVerComo = filtrosValues.usuarioVerComo
          this.filtroLastValues.usuarioAlta = filtrosValues.usuarioAlta
        }

        if (this.filtroLastValues.usuarioVerComo !== filtrosValues.usuarioVerComo) {
          await this.$store.dispatch("priorizarRequerimientos/inicializarPriorizarRequerimientos", {
            userId: this.filtroLastValues.usuarioVerComo,
          })
        }

        this.$store.dispatch("priorizarRequerimientos/setFilters", this.filtroLastValues)
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
