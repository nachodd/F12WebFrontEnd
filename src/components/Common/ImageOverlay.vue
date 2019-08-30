<template>
  <q-overlay v-model="overlayOpened" z-index="7000" opacity="0.8">
    <template v-slot:body>
      <div class="fullscreen row justify-center items-center" @click="closeImage">
        <img ref="imgFullSize" />
      </div>
    </template>
  </q-overlay>
</template>

<script>
import Bus from "utils/bus"
export default {
  name: "ImageOverlay",
  data() {
    return {
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
    openImage(data) {
      this.overlayOpened = true
      this.$nextTick(() => {
        this.$refs.imgFullSize.src = data
      })
    },
    closeImage() {
      this.$refs.imgFullSize.src = ""
      this.$nextTick(() => {
        this.overlayOpened = false
      })
    },
  },
}
</script>

<style lang="stylus" scoped></style>
