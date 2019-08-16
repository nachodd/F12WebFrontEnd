<template>
  <q-page padding class="q-pt-lg">
    <mis-requerimientos-filtros ref="filtros" @buscar="getListRequerimientos" />
    <mis-requerimientos-listado
      :requerimientos="misRequerimientos"
      :loading="loadingRequerimiento"
    />
    <div v-if="searchMeta.total > 10" class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        color="deep-purple-10"
        :max="searchMeta.last_page"
        :max-pages="8"
        :boundary-numbers="true"
        :direction-links="true"
      ></q-pagination>
    </div>
    <div v-if="noResults" class="q-pa-lg text-body2">
      <div class="row justify-center">
        <img src="~assets/empty_box.svg" style="width:40vw;max-width:250px;" />
      </div>
      <div class="row justify-center">
        No hay requerimientos para mostrar
      </div>
      <div v-if="hayFiltros" class="row justify-center">
        <!-- eslint-disable-next-line -->
        Pruebe&nbsp;<a href="javascript:void(0);" class="text-purple-9" @click="$refs.filtros.limpiarFiltros()">borrando los filtros</a>
      </div>
    </div>
    <dialog-detalle-requerimiento />
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import { warn, info } from "utils/helpers"
import MisRequerimientosListado from "comp/MisRequerimientos/MisRequerimientosListado"
import MisRequerimientosFiltros from "comp/MisRequerimientos/MisRequerimientosFiltros"
import DialogDetalleRequerimiento from "comp/Common/DialogDetalleRequerimiento"
import Bus from "utils/bus"

export default {
  components: {
    MisRequerimientosListado,
    DialogDetalleRequerimiento,
    MisRequerimientosFiltros,
  },
  data() {
    return {
      current: 1,
      // page: 1,
      // perPage: 10,
      // lastPage: 0,
      filtroLastValues: {
        descripcion: null,
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        usuarioAlta: null,
        area: null,
        fechaDesde: null,
        fechaHasta: null,
      },
    }
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
      misRequerimientos: state => state.misRequerimientos,
      misRequerimientosHuboCambio: state => state.misRequerimientosHuboCambio,
      searchMeta: state => state.misRequerimientosSearchMeta,
    }),
    hayFiltros() {
      const f = this.filtroLastValues
      return _.some([
        f.descripcion,
        f.reqId,
        f.estados,
        f.sistema,
        f.tipo,
        f.usuarioAlta,
      ])
    },
    noResults() {
      return !this.searchMeta.total || this.searchMeta.total === 0
    },
  },
  watch: {
    current() {
      this.getListRequerimientos()
    },
    misRequerimientosHuboCambio(huboCambios) {
      if (huboCambios) {
        info({ message: "Hubo requerimientos actualizados" })
        this.$store.dispatch(
          "requerimientos/setMisRequerimientosHuboCambios",
          false,
        )
      }
    },
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
          this.filtroLastValues.usuarioAlta = filtrosValues.usuarioAlta
          this.filtroLastValues.area = filtrosValues.area
          this.filtroLastValues.fechaDesde = filtrosValues.fechaDesde
          this.filtroLastValues.fechaHasta = filtrosValues.fechaHasta
        }

        const reqEstados =
          (this.filtroLastValues.estados &&
            this.filtroLastValues.estados.map(e => e.value)) ||
          null

        await this.$store.dispatch("requerimientos/listRequerimientos", {
          filtros: {
            seccion_id: _.get(this, "filtroLastValues.area.id", null),
            sistema_id: _.get(this, "filtroLastValues.sistema.id", null),
            requerimiento_tipo: _.get(this, "filtroLastValues.tipo.id", null),
            requerimiento_id: _.get(this, "filtroLastValues.reqId", null),
            requerimiento_estado: reqEstados,
            fecha_desde: _.get(this, "filtroLastValues.fechaDesde", null), // DD/MM/YYYY
            fecha_hasta: _.get(this, "filtroLastValues.fechaHasta", null), // DD/MM/YYYY
            descripcion: this.filtroLastValues.descripcion,
            page: this.current,
            perPage: 10,
            requerimiento_usuario_alta_id: _.get(
              this,
              "filtroLastValues.usuarioAlta.id",
              null,
            ),
          },
        })
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
