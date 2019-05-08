<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row">
      <div class="col-xs-12 col-sm-6">
        <priorizar-requerimientos-listado
          :requerimientos="requerimientosAOrdernar"
          :loading="false"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        sdsopdjs
      </div>
    </div>
  </q-page>
</template>

<script>
import PageHeader from "@comp/PageHeader"
import PriorizarRequerimientosListado from "@comp/PriorizarRequerimientos/PriorizarRequerimientosListado"
import dummyRequerimientosList from "@utils/dummyRequerimientosList"

export default {
  name: "PriorizarRequerimientos",
  components: { PageHeader, PriorizarRequerimientosListado },
  data() {
    return {
      requerimientosAOrdernar: dummyRequerimientosList,
    }
  },
}
</script>

<style lang="scss" scoped></style>
