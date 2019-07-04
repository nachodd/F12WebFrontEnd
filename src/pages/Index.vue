<template>
  <q-page padding>
    <page-header title="Inicio" />

    <div class="row justify-around q-col-gutter-md">
      <div class="col-md-4 col-sm-4 col-xs-12 q-mb-lg">
        <router-link :to="{ name: 'priorizar-requerimientos' }" class="no-dec">
          <widget-simple
            icon="fas fa-sort-amount-down"
            :value="dashboard.pendientes_priorizacion"
            description="Reqs. a PRIORIZAR"
            icon-background-color="#3949ab"
            icon-background-gradient
            info-text-class="text-indigo-7"
            :loading="loadingDashboard"
          />
        </router-link>
      </div>

      <div v-if="userEsResponsable" class="col-md-4 col-sm-4 col-xs-12 q-mb-lg">
        <router-link :to="{ name: 'asignar-requerimientos' }" class="no-dec">
          <widget-simple
            icon="far fa-hand-pointer "
            :value="dashboard.pendientes_asignacion"
            description="Reqs. PEND. de ASIG."
            icon-background-color="#c62828"
            icon-background-gradient
            info-text-class="text-red-9"
            :loading="loadingDashboard"
          />
        </router-link>
      </div>

      <div
        v-if="puedeVerRequerimientosAsignados"
        class="col-md-4 col-sm-4 col-xs-12 q-mb-lg"
      >
        <router-link :to="{ name: 'requerimientos-asignados' }" class="no-dec">
          <widget-simple
            icon="fas fa-bell"
            :value="dashboard.asignados_ejecucion"
            description="Reqs. ASIGNADOS"
            icon-background-color="#2e7d32"
            icon-background-gradient
            info-text-class="text-green-9"
            :loading="loadingDashboard"
          />
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script>
import PageHeader from "@comp/Common/PageHeader"
import WidgetSimple from "@comp/Inicio/WidgetSimple"
import { mapGetters, mapState } from "vuex"

export default {
  name: "Index",
  components: { PageHeader, WidgetSimple },
  data() {
    return {
      reqsAPriorizar: 0,
      reqsPendAsignacion: 0,
      reqsAsignados: 0,
    }
  },
  computed: {
    ...mapGetters("auth", [
      "userEsResponsable",
      "puedeVerRequerimientosAsignados",
      "userId",
    ]),
    ...mapState("app", {
      dashboard: state => state.dashboard,
      loadingDashboard: state => state.loadingDashboard,
    }),
  },
  mounted() {
    this.$store.dispatch("app/getDashboardData", this.userId)
  },
}
</script>

<style lang="scss" scoped></style>
