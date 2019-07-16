<template>
  <q-page padding>
    <page-header title="Requerimientos Asignados" no-margin>
      <div>
        <div
          class="d-ib cursor-pointer"
          @click="aplicarFiltroRapidoTipoReq('Arreglo')"
        >
          <div class="square d-ib bg-red-7">&nbsp;</div>
          Arreglo Rápido &nbsp;&nbsp; - &nbsp;&nbsp;
        </div>
        <div
          class="d-ib cursor-pointer"
          @click="aplicarFiltroRapidoTipoReq('Desarrollo')"
        >
          <div class="square d-ib bg-light-blue-7">&nbsp;</div>
          Desarrollo / Mejora &nbsp;&nbsp;
        </div>
      </div>
    </page-header>
    <div class="row">
      <div class="col">
        <requerimientos-asignados-filtros />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm">
      <div class="col-sm-4 col-xs-12">
        <draggable-list
          title="Pendientes"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list="requerimientosFiltered('ASSI')"
          :loading-list="loadingRequerimientos"
        />
        <!-- requerimientosFiltered('ASSI') -->
      </div>

      <div class="col-sm-4 col-xs-12">
        <draggable-list
          title="En Ejecución"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list="requerimientosFiltered('EXEC')"
          :loading-list="loadingRequerimientos"
        />
      </div>

      <div class="col-sm-4 col-xs-12">
        <draggable-list
          title="Testing"
          group-name="requerimientos"
          list-name="testing"
          :requerimientos-list="requerimientosFiltered('TEST')"
          :loading-list="loadingRequerimientos"
        />
      </div>
    </div>

    <dialog-confirm-operation />
    <dialog-detalle-requerimiento />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import DraggableList from "@comp/RequerimientosAsignados/DraggableList"
import DialogConfirmOperation from "@comp/RequerimientosAsignados/DialogConfirmOperation"
import DialogDetalleRequerimiento from "@comp/Common/DialogDetalleRequerimiento"
import RequerimientosAsignadosFiltros from "@comp/RequerimientosAsignados/RequerimientosAsignadosFiltros"

export default {
  name: "RequerimientosAsigandos",
  components: {
    PageHeader,
    DraggableList,
    DialogConfirmOperation,
    DialogDetalleRequerimiento,
    RequerimientosAsignadosFiltros,
  },
  mixins: [pageLoading],
  computed: {
    ...mapState("requerimientosAsignados", {
      loadingRequerimientos: state => state.loadingRequerimientos,
    }),
    ...mapGetters("requerimientosAsignados", ["requerimientosFiltered"]),
  },
  async created() {
    this.$store.dispatch(
      "requerimientosAsignados/inicializarRequerimientosAsignados",
    )
  },
  methods: {},
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
