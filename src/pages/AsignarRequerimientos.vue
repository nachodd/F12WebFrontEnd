<template>
  <q-page padding>
    <page-header title="Asignar Requerimientos" no-margin />
    <div class="row q-py-md">
      <div class="col">
        <div class="square d-ib bg-red-7">&nbsp;</div>
        Arreglo Rápido &nbsp;&nbsp; - &nbsp;&nbsp;
        <div class="square d-ib bg-light-blue-7">&nbsp;</div>
        Desarrollo / Mejora &nbsp;&nbsp; - &nbsp;&nbsp; En Procesos
        <div class="square d-ib bg-green-7"></div>
      </div>
    </div>

    <div class="row q-pt-md q-col-gutter-sm">
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosSinAsignar"
          :loading-list="loadingList"
          title="Requerimientos Por Asignar"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosAsignados"
          :loading-list="loadingList"
          title="Requerimientos Asignados"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosPendientes"
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        />
      </div>
    </div>

    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import pageLoading from "@mixins/pageLoading"
import PageHeader from "@comp/Common/PageHeader"
import AsignarRequerimientosList from "@comp/AsignarRequerimientos/AsignarRequerimientosList"
import DialogDetalleRequerimiento from "@comp/PriorizarRequerimientos/DialogDetalleRequerimiento"

export default {
  name: "AsignarRequerimientos",
  components: {
    PageHeader,
    AsignarRequerimientosList,
    DialogDetalleRequerimiento,
  },
  mixins: [pageLoading],
  data: () => ({
    // loadingList: false,
  }),
  computed: {
    ...mapState("asignacionRequerimientos", {
      reqs: state => state.requerimientos,
      loadingList: state => state.loadingRequerimientos,
    }),
    ...mapGetters("asignacionRequerimientos", [
      "requerimientosSinAsignar",
      "requerimientosAsignados",
      "requerimientosPendientes",
    ]),
  },
  created() {
    this.$store.dispatch("asignacionRequerimientos/fetchRequerimientos")
  },
}
</script>

<style lang="scss" scoped>
.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-top: 20px;
  top: -20px;
  padding-left: 5px;
  padding-right: 5px;
}

.scrolling-wrapper__card {
  flex: 0 0 auto;
  min-width: 400px;
  margin-right: 1em;
}

.d-ib {
  display: inline-block;
}

.square {
  width: 4px;
  height: 18px;
  vertical-align: middle;
}
</style>
