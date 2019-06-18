<template>
  <q-page padding>
    <page-header title="Mis Requerimientos" />
    <mis-requerimientos-listado
      :requerimientos="misRequerimientos"
      :loading="loadingRequerimiento"
    />
    <dialog-detalle-requerimiento />
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import { warn } from "@utils/helpers"
import PageHeader from "@comp/Common/PageHeader"
import MisRequerimientosListado from "@comp/MisRequerimientos/MisRequerimientosListado"
import DialogDetalleRequerimiento from "@comp/PriorizarRequerimientos/DialogDetalleRequerimiento"

export default {
  components: {
    PageHeader,
    MisRequerimientosListado,
    DialogDetalleRequerimiento,
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
      misRequerimientos: state => state.misRequerimientos,
    }),
  },
  async mounted() {
    try {
      const filtros = {
        seccion_id: null,
        sistema_id: null,
        requerimiento_tipo: null,
        requerimiento_estado: null,
        fecha_desde: null,
        fecha_hasta: null,
        descripcion: null,

        page: 1,
        perPage: 10,
      }

      await this.$store.dispatch("requerimientos/listRequerimientos", {
        filtros,
      })
    } catch (e) {
      const message =
        e.message ||
        "Hubo un problema al cargar el listado de sus Requerimientos. Intente nuevamente más tarde"
      warn({ message })
    }
  },
}
</script>
