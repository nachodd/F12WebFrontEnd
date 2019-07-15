<template>
  <q-page padding>
    <page-header title="Asignar Requerimientos" no-margin>
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
        <asignar-requerimientos-filtros />
      </div>
    </div>
    <div class="row q-pt-md q-px-xs q-col-gutter-sm">
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
      <div class="col-sm-4 col-xs-12">
        <asignar-requerimientos-list
          :requerimientos-list="requerimientosFiltered('ASSI')"
          :loading-list="loadingList"
          title="Requerimientos Asignados"
          :draggable="true"
          group-name="asignarRequerimientos"
          list-name="target"
        />
      </div>
      <div class="col-sm-4 col-xs-12">
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
import pageLoading from "@mixins/pageLoading"
import PageHeader from "@comp/Common/PageHeader"
import AsignarRequerimientosList from "@comp/AsignarRequerimientos/AsignarRequerimientosList"
import DialogDetalleRequerimiento from "@comp/Common/DialogDetalleRequerimiento"
import AsignarRequerimientosDialogConfirmOperation from "@comp/AsignarRequerimientos/AsignarRequerimientosDialogConfirmOperation"
import AsignarRequerimientosFiltros from "@comp/AsignarRequerimientos/AsignarRequerimientosFiltros"

export default {
  name: "AsignarRequerimientos",
  components: {
    PageHeader,
    AsignarRequerimientosList,
    DialogDetalleRequerimiento,
    AsignarRequerimientosDialogConfirmOperation,
    AsignarRequerimientosFiltros,
  },
  mixins: [pageLoading],
  // data: () => ({}),
  computed: {
    ...mapState("asignacionRequerimientos", {
      reqs: state => state.requerimientos,
      loadingList: state => state.loadingRequerimientos,
    }),
    ...mapGetters("asignacionRequerimientos", ["requerimientosFiltered"]),
  },
  created() {
    this.$store.dispatch("requerimientos/createRequerimiento")
    this.$store.dispatch("asignacionRequerimientos/fetchRequerimientos")
  },
  methods: {
    aplicarFiltroRapidoTipoReq(filtroRapido) {
      let value = null
      if (filtroRapido === "Arreglo") {
        value = {
          descripcion: "Arreglo rápido",
          id: 1,
        }
      } else if (filtroRapido === "Desarrollo") {
        value = {
          descripcion: "Desarrollos / Modificaciones / Implementaciones",
          id: 2,
        }
      }
      this.$store.dispatch("asignacionRequerimientos/setFilter", {
        filter: "requerimientoTipo",
        value,
      })
    },
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
