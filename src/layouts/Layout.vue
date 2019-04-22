<template>
  <q-layout view="hHh Lpr lFf">
    <f12-header />

    <f12-sidebar />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import F12Header from "src/components/Header"
import F12Sidebar from "src/components/Sidebar"

export default {
  name: "F12Layout",
  components: {
    F12Header,
    F12Sidebar,
  },
}
</script>
