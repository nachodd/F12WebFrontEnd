<template>
  <q-layout view="hHh Lpr lFf" class="bg-page" @scroll="handleScroll">
    <f12-header :mini="mini" />

    <f12-sidebar />

    <q-page-container>
      <!-- FIX: https://stackoverflow.com/questions/42603583/vue-js-same-component-with-different-routes -->
      <!-- <router-view :key="$route.path" /> -->
      <router-view />
    </q-page-container>

    <fab-crud-modal />
  </q-layout>
</template>

<script>
import F12Header from "comp/Header/Index"
import F12Sidebar from "comp/Sidebar/Index"
import FabCrudModal from "comp/Requerimientos/FabCrudModal"

export default {
  name: "F12Layout",
  components: {
    F12Header,
    F12Sidebar,
    FabCrudModal,
  },
  data() {
    return {
      mini: false,
    }
  },
  methods: {
    handleScroll(info) {
      this.mini = info.position > 100
    },
  },
}
</script>
