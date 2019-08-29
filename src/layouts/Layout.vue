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

    <q-overlay v-model="overlayOpened" z-index="7000">
      <template v-slot:body>
        <div class="fullscreen row justify-center items-center" @click="closeImage">
          <img ref="imgFullSize" />
        </div>
      </template>
    </q-overlay>
  </q-layout>
</template>

<script>
import F12Header from "comp/Header/Index"
import F12Sidebar from "comp/Sidebar/Index"
import FabCrudModal from "comp/Requerimientos/FabCrudModal"
import Bus from "utils/bus"

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
      overlayOpened: false,
    }
  },
  mounted() {
    Bus.$on("open-image", this.openImage)
  },
  unmounted() {
    Bus.$off("open-image", this.openImage)
  },
  methods: {
    handleScroll(info) {
      this.mini = info.position > 100
    },
    openImage(data) {
      this.overlayOpened = true
      this.$nextTick(() => {
        this.$refs.imgFullSize.src = data
      })
    },
    closeImage() {
      this.overlayOpened = false
      this.$refs.imgFullSize.src = ""
    },
  },
}
</script>
