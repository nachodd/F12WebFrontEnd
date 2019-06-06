<template>
  <q-layout view="hHh Lpr lFf">
    <f12-header />

    <f12-sidebar />

    <q-page-container>
      <!-- FIX: https://stackoverflow.com/questions/42603583/vue-js-same-component-with-different-routes -->
      <router-view :key="$route.path" />
    </q-page-container>
  </q-layout>
</template>

<script>
import F12Header from "@comp/Header"
import F12Sidebar from "@comp/Sidebar"

export default {
  name: "F12Layout",
  components: {
    F12Header,
    F12Sidebar,
  },
}
</script>
