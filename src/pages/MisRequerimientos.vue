<template>
  <q-page padding>
    <page-header title="Mis Requerimientos" />
    <MisRequerimientosMenuFiltros />
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
import { warn } from "@utils/helpers"
import PageHeader from "@comp/Common/PageHeader"
import MisRequerimientosListado from "@comp/MisRequerimientos/MisRequerimientosListado"
import MisRequerimientosMenuFiltros from "@comp/MisRequerimientos/MisRequerimientosMenuFiltros"
import DialogDetalleRequerimiento from "@comp/PriorizarRequerimientos/DialogDetalleRequerimiento"

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
  },
  mounted() {
    this.getListRequerimientos()
  },
  methods: {
    async getListRequerimientos() {
      try {
        const filtros = {
          seccion_id: null,
          sistema_id: null,
          requerimiento_tipo: null,
          requerimiento_estado: null,
          fecha_desde: null,
          fecha_hasta: null,
          descripcion: null,

          page: this.current,
          perPage: 10,
        }

        const a = await this.$store.dispatch(
          "requerimientos/listRequerimientos",
          {
            filtros,
          },
        )

        this.lastPage = a.last_page
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
