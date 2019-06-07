<template>
  <q-page padding>
    <page-header title="Asignar Requerimientos" />
    <!-- FIXME: EL SCROLL WRAPPER DEBERIA ESTAR A NIVEL DE PAGINA, PERO EL PAGE QUEDER QUEDA MAL. VER DE ARREGLARLO -->
    <div class="scrolling-wrapper">
      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos Por Asignar"
        ></list-requerimientos>
      </div>
      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos Asignados"
        ></list-requerimientos>
      </div>

      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        ></list-requerimientos>
      </div>

      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        ></list-requerimientos>
      </div>

      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        ></list-requerimientos>
      </div>

      <div class="scrolling-wrapper__card">
        <list-requerimientos
          :loading-list="loadingList"
          title="Requerimientos en Ejecucion"
        ></list-requerimientos>
      </div>
    </div>

    <!-- <div class="row q-col-gutter-md justify-center">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Pendientes de Aprobación"
          group-name="requerimientos"
          list-name="source"
          :requerimientos-list.sync="reqsPendientesAprobacion"
          :loading-list="loadingReqsPendientesAprobacion"
        />
      </div>

      <div v-if="!esElUltimoDeLaCadenaDeMando" class="col-sm-6 col-xs-12">
        <draggable-list
          title="Aprobados"
          group-name="requerimientos"
          list-name="target"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          :loading-list="loadingReqsAprobadosPriorizados"
        />
      </div>
    </div>

    <dialog-confirm-operation /> -->
    <!-- <dialog-detalle-requerimiento /> -->
  </q-page>
</template>

<script>
import PageHeader from "@comp/common/PageHeader"
import ListRequerimientos from "@comp/common/ListRequerimientos"

export default {
  components: {
    PageHeader,
    ListRequerimientos,
  },
  data: () => ({
    loadingList: true,
  }),
}
</script>

<style lang="scss" scoped>
.w300 {
  width: 300px;
  display: inline-block;
}

.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.scrolling-wrapper__card {
  flex: 0 0 auto;
  width: 350px;
  margin-right: 1em;
}
</style>
