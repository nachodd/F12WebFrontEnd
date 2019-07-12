<template>
  <!-- bordered content-class="bg-grey-2" -->
  <q-drawer v-model="sidebarOpened" bordered content-class="bg-grey-2">
    <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <q-item
          v-ripple
          clickable
          :to="{ name: 'inicio' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Inicio</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          :to="{ query: { ver: 'crearRequerimiento' } }"
          active-class=""
        >
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

            <!-- <div class="icons">
              <i class="fas fa-sort-amount-down icon-default"></i>
              <i class="fas fa-sort-amount-up icon-hover"></i>
            </div>-->
          </q-item-section>
          <q-item-section>
            <q-item-label>Priorizar Requerimientos</q-item-label>
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
            <q-item-label>Asignar Requerimientos</q-item-label>
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
            <q-item-label>Requerimientos Asignados</q-item-label>
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
    // ...mapGetters("app", ["sidebarOpen"]),
    ...mapGetters("auth", [
      "userEsResponsable",
      "puedeVerRequerimientosAsignados",
    ]),
    ...mapState("app", {
      sidebarOpenStore: state => state.sidebarOpen,
    }),
    sidebarOpened: {
      set(state) {
        this.$store.dispatch("app/setSideBar", state)
      },
      get() {
        return this.sidebarOpenStore
      },
    },
  },
  methods: {},
}
</script>
<style lang="scss" scoped>
@import "src/css/variables.scss";
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
}
.menu-items--active {
  color: $accent-light;
  font-weight: 500;
  background: rgba(73, 65, 214, 0.15);
}

/* .button {
  position: relative;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
  .icons {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    i {
      position: absolute;
      top: 0;
      left: 0;

      display: block;
    }
    .icon-default {
      transition: opacity 0.3s, transform 0.3s;
    }

    .icon-hover {
      transition: opacity 0.3s, transform 0.3s;
      transform: rotate(-180deg) scale(1);
      opacity: 0;
    }
  }

  &:hover {
    transform: scale(1.2);
    box-shadow: 20px 15px rgba(0, 0, 0, 0.15);
    .icon-hover {
      transform: rotate(0deg) scale(1.5);
      opacity: 1;
    }
    .icon-default {
      transform: rotate(180deg) scale(1);
      opacity: 0;
    }
  }
} */
</style>
