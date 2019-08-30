<template>
  <q-overlay v-model="overlayOpened" z-index="7000" opacity="0.8">
    <template v-slot:body>
      <div class="fullscreen row justify-center items-center img-container" @click="closeImage">
        <img ref="imgFullSize" class="img-fullsize" />
      </div>
    </template>
  </q-overlay>
</template>

<script>
import Bus from "utils/bus"
import { info } from "utils/helpers"
export default {
  name: "ImageOverlay",
  data() {
    return {
      overlayOpened: false,
      closeNotify: null,
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
      this.closeNotify = info({ message: "Click en la imagen para cerrar", actions: null })
      this.$nextTick(() => {
        if (this.$refs.imgFullSize) {
          this.$refs.imgFullSize.src = data
        }
      })
    },
    closeImage() {
      this.closeNotify()
      if (this.$refs.imgFullSize) {
        this.$refs.imgFullSize.src = ""
      }
      this.$nextTick(() => {
        this.overlayOpened = false
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.img-container
  overflow-y: auto
.img-fullsize
  max-width 95%
  height auto
</style>
