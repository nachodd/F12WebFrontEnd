<template>
  <q-page padding>
    <page-header title="Mis Requerimientos" no-margin />
    <mis-requerimientos-menu-filtros
      v-bind.sync="filtros"
      @buscar="getListRequerimientos"
    />
    <mis-requerimientos-listado
      :requerimientos="misRequerimientos"
      :loading="loadingRequerimiento"
    />
    <div class="q-pa-lg flex flex-center">
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
import PageHeader from "comp/Common/PageHeader"
import MisRequerimientosListado from "comp/MisRequerimientos/MisRequerimientosListado"
import MisRequerimientosMenuFiltros from "comp/MisRequerimientos/MisRequerimientosMenuFiltros"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import Bus from "utils/bus"

export default {
  components: {
    PageHeader,
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
      filtros: {
        sistemaId: null,
        requerimientoTipo: null,
        descripcion: null,
        // seccionId:null
      },
      crudModalOpen: false,
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
    "$route.meta"({ showCrudModal = false }) {
      this.crudModalOpen = showCrudModal
    },
  },
  async mounted() {
    this.getListRequerimientos()
    await this.$store.dispatch("requerimientos/createRequerimiento")
    Bus.$on("load-list-requerimientos", this.getListRequerimientos)
  },
  unmounted() {
    Bus.$off("load-list-requerimientos", this.getListRequerimientos)
  },
  methods: {
    async getListRequerimientos() {
      try {
        const filtros = {
          seccion_id: null,
          sistema_id: _.get(this, "filtros.sistemaId.id", null),
          requerimiento_tipo: _.get(this, "filtros.requerimientoTipo.id", null),
          requerimiento_estado: null,
          fecha_desde: null,
          fecha_hasta: null,
          descripcion: this.filtros.descripcion,
          page: this.current,
          perPage: 10,
        }
        const res = await this.$store.dispatch(
          "requerimientos/listRequerimientos",
          { filtros },
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
