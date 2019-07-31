<template>
  <q-page padding class="q-pt-lg">
    <mis-requerimientos-menu-filtros @buscar="getListRequerimientos" />
    <mis-requerimientos-listado
      :requerimientos="misRequerimientos"
      :loading="loadingRequerimiento"
    />
    <div v-if="misRequerimientos.length > 10" class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        color="deep-purple-10"
        :max="lastPage"
        :max-pages="8"
        :boundary-numbers="true"
      ></q-pagination>
    </div>
    <dialog-detalle-requerimiento />
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import { warn } from "utils/helpers"
import MisRequerimientosListado from "comp/MisRequerimientos/MisRequerimientosListado"
import MisRequerimientosMenuFiltros from "comp/MisRequerimientos/MisRequerimientosMenuFiltros"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import Bus from "utils/bus"

export default {
  components: {
    MisRequerimientosListado,
    DialogDetalleRequerimiento,
    MisRequerimientosMenuFiltros,
  },
  data() {
    return {
      current: 1,
      page: 1,
      perPage: 10,
      lastPage: 0,
      filtroLastValues: {
        descripcion: null,
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        // seccionId:null
      },
      // crudModalOpen: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
      misRequerimientos: state => state.misRequerimientos,
    }),
  },
  watch: {
    current() {
      this.getListRequerimientos()
    },
    // "$route.meta"({ showCrudModal = false }) {
    //   this.crudModalOpen = showCrudModal
    // },
  },
  async mounted() {
    // this.getListRequerimientos() // Se paso al componente filtro
    Bus.$on("load-list-requerimientos", this.getListRequerimientos)
  },
  unmounted() {
    Bus.$off("load-list-requerimientos", this.getListRequerimientos)
  },
  methods: {
    async getListRequerimientos(filtrosValues) {
      try {
        // Si el filtro fue enviado como parametro, lo guardo localmente.
        // Cuando se llama al paginador, no tengo el valor del filtro. Por eso lo guardo previamente
        if (filtrosValues) {
          this.filtroLastValues.descripcion = filtrosValues.descripcion
          this.filtroLastValues.reqId = filtrosValues.reqId
          this.filtroLastValues.estados = filtrosValues.estados
          this.filtroLastValues.sistema = filtrosValues.sistema
          this.filtroLastValues.tipo = filtrosValues.tipo
        }

        const reqEstados =
          (this.filtroLastValues.estados &&
            this.filtroLastValues.estados.map(e => e.value)) ||
          null

        const res = await this.$store.dispatch(
          "requerimientos/listRequerimientos",
          {
            filtros: {
              seccion_id: null,
              sistema_id: _.get(this, "filtroLastValues.sistema.id", null),
              requerimiento_tipo: _.get(this, "filtroLastValues.tipo.id", null),
              requerimiento_id: _.get(this, "filtroLastValues.reqId", null),
              requerimiento_estado: reqEstados,
              fecha_desde: null,
              fecha_hasta: null,
              descripcion: this.filtroLastValues.descripcion,
              page: this.current,
              perPage: 10,
            },
          },
        )

        this.lastPage = res.last_page
        // this.current = a.current_page
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
