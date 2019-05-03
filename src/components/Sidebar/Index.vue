<template>
  <!-- bordered content-class="bg-grey-2" -->
  <q-drawer bordered content-class="bg-grey-2" v-model="sidebarOpen">
    <q-scroll-area class="fit">
      <q-list padding class="menu-list">
        <q-item-label header>Menu Principal</q-item-label>
        <q-item
          clickable
          v-ripple
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
          clickable
          v-ripple
          :to="{ name: 'nuevo-requerimiento' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="note_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nuevo Ticket</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :to="{ name: 'listado-requerimientos' }"
          active-class="menu-items--active"
        >
          <q-item-section avatar>
            <q-icon name="fas fa-list-ol" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Listado de Requerimientos</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "F12Sidebar",
  data() {
    return {
      sidebarOpened: this.sidebarOpen,
    }
  },
  computed: {
    ...mapGetters("app", ["sidebarOpen"]),
    ...mapGetters("auth", ["user"]),
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
  background: rgba(73, 65, 214, 0.15);
}
</style>
