<template>
  <!-- bordered content-class="bg-grey-2" -->
  <q-drawer v-model="sidebarOpened" bordered content-class="bg-white">
    <q-scroll-area class="fit">
      <q-list padding class="menu-list text-unselectable">
        <q-item :clickable="false">
          <q-item-section class="text-center">
            <q-item-label caption>
              <div class="q-mt-md">
                <span class="f">F</span>
                <span class="twelve">12</span>
              </div>
              <div class="q-mt-md">
                Bienvenido,
                <strong>{{ userRazonSocial }}</strong>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable :to="{ name: 'inicio' }" active-class="menu-items--active">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable :to="{ query: { ver: 'crearRequerimiento' } }" active-class="">
          <q-item-section avatar>
            <q-icon name="note_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nuevo Requerimiento</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          :to="{ name: 'mis-requerimientos' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-list-ol" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Mis Requerimientos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          :to="{ name: 'priorizar-requerimientos' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar class="button">
            <q-icon name="fas fa-sort-amount-down" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Priorizar Requerimientos
              <span v-if="showPriorizarRequerimientosCount" class="text-bold">
                ({{ dashboard.pendientes_priorizacion }})
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="userEsResponsable"
          v-ripple
          clickable
          :to="{ name: 'asignar-requerimientos' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="far fa-hand-pointer" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Asignar Requerimientos
              <span v-if="dashboard.pendientes_asignacion > 0" class="text-bold">
                ({{ dashboard.pendientes_asignacion }})
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="puedeVerRequerimientosAsignados"
          v-ripple
          clickable
          :to="{ name: 'requerimientos-asignados' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-tasks" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Requerimientos Asignados
              <span v-if="dashboardAsignadosYEjecutando > 0" class="text-bold">
                ({{ dashboardAsignadosYEjecutando }})
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapGetters, mapState } from "vuex"

export default {
  name: "F12Sidebar",
  computed: {
    ...mapGetters("auth", [
      "userEsResponsable",
      "puedeVerRequerimientosAsignados",
      "userRazonSocial",
    ]),
    ...mapGetters("app", ["dashboardAsignadosYEjecutando"]),
    ...mapState("app", {
      sidebarOpenStore: state => state.sidebarOpen,
      dashboard: state => state.dashboard,
      loadingDashboard: state => state.loadingDashboard,
    }),
    sidebarOpened: {
      set(state) {
        this.$store.dispatch("app/setSideBar", state)
      },
      get() {
        return this.sidebarOpenStore
      },
    },
    showPriorizarRequerimientosCount() {
      return this.dashboard.pendientes_priorizacion > 0 && !this.esElUltimoDeLaCadenaDeMando
    },
  },
  mounted() {
    this.$store.dispatch("app/getDashboardData", this.userId)
  },
  methods: {},
}
</script>
<style lang="stylus" scoped>
.f
  font-size 2.4rem
  font-weight 800
  letter-spacing -5px
  color $accent-light

.twelve
  font-size 1.9rem
  letter-spacing -5px
  font-weight 500
  color $accent-light

.menu-list .q-item
  border-radius 0 32px 32px 0

.menu-items--active
  color $accent-light
  font-weight 500
  background rgba(73, 65, 214, 0.15)
</style>
