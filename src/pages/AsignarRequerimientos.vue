<template>
  <q-page padding>
    <page-header title="Asignar Requerimientos" />

    <!-- <q-page class="scrolling-wrapper">
      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos Por Asignar"
        ></list-requerimientos>
      </div>
    </q-page> -->

    <div class="row q-col-gutter-sm">
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosSinAsignar"
          :loading-list="loadingList"
          title="Requerimientos Por Asignar"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos Asignados"
        ></list-requerimientos>
      </div>
      <div class="col-sm-4 col-xs-12">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        ></list-requerimientos>
      </div>
    </div>

    <!--
    <dialog-confirm-operation /> -->
    <!-- <dialog-detalle-requerimiento /> -->
  </q-page>
</template>

<script>
import PageHeader from "@comp/Common/PageHeader"
import ListRequerimientos from "@comp/Common/ListRequerimientos"
import AsignarRequerimientosList from "@comp/AsignarRequerimientos/AsignarRequerimientosList"
import { mapGetters, mapState } from "vuex"

export default {
  components: {
    PageHeader,
    ListRequerimientos,
    AsignarRequerimientosList,
  },
  data: () => ({
    loadingList: false,
  }),
  computed: {
    ...mapState("asignacionRequerimientos", {
      reqs: state => state.requerimientos,
    }),
    ...mapGetters("asignacionRequerimientos", [
      "requerimientosSinAsignar",
      "requerimientosAsignados",
      "requerimientosPendientes",
    ]),
  },
  watch: {
    requerimientosSinAsignar(val) {
      console.log("requerimientosSinAsignar", val)
    },
    requerimientosAsignados(val) {
      console.log("requerimientosAsignados", val)
    },
    requerimientosPendientes(val) {
      console.log("requerimientosPendientes", val)
    },
    reqs(val) {
      console.log("reqs", val)
    },
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
</style>
