<template>
  <div>
    <q-item class="shadow-2 bg-grey-3 no-padding adjunto-card">
      <div v-if="fileIsImage" class="no-pad img-lazy-cont" @click="openImage">
        <img
          ref="imgThumb"
          v-auth-src="adjunto"
          class="item--thumb lazy loading"
          :auth-src="adjunto"
        />
      </div>
      <template v-else>
        <q-item-section v-if="showIcon" side class="q-px-xs">
          <q-icon class="item--thumb-xs" :name="icon" size="5px" />
        </q-item-section>
        <q-item-section class="q-pa-sm">
          <q-item-label class="ellipsis">
            <template v-if="hasDefaultSlot">
              <slot />
            </template>
            <template v-else>
              <a v-auth-href :href="adjunto" class="ellipsis">
                {{ fileNameComp }}
              </a>
            </template>
          </q-item-label>
        </q-item-section>
      </template>

      <q-item-section v-if="showRemove" top side class="q-px-xs">
        <q-btn flat dense round icon="delete" @click="$emit('removeAttach', adjunto)" />
      </q-item-section>
    </q-item>
    <tooltip>{{ fileNameComp }}</tooltip>
  </div>
</template>

<script>
import { extension } from "utils/helpers"
import Bus from "utils/bus"
import Tooltip from "comp/Common/Tooltip"
export default {
  components: { Tooltip },
  props: {
    adjunto: {
      type: String,
      required: true,
    },
    nro: {
      type: Number,
      required: true,
    },
    fileName: {
      type: String,
      default: `Adjunto`,
    },
    showRemove: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: "fas fa-paperclip",
    },
  },
  computed: {
    hasDefaultSlot() {
      return !!this.$slots["default"]
    },
    fileNameComp() {
      return `${this.fileName} ${this.nro}`
    },
    fileIsImage() {
      const fileExtension = extension(this.adjunto.toLowerCase())
      // eslint-disable-next-line
      const commonImagesExtensions = ["apng","bmp","gif","ico","cur","jpg","jpeg","jfif","pjpeg","pjp","png","svg","webp"]
      return commonImagesExtensions.includes(fileExtension)
    },
  },
  methods: {
    openImage() {
      Bus.$emit("open-image", this.$refs.imgThumb.src)
      // this.imageOpened = true
      /* this.$nextTick(() => {
        // console.log(this.$refs)
        this.$refs.imgFullSize.src = this.$refs.imgThumb.src
      }) */
    },
  },
}
</script>
<style lang="stylus"></style>
