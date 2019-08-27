<template>
  <div>
    <q-item class="shadow-2 bg-grey-3 no-padding adjunto-card">
      <q-item-section v-if="showIcon" side class="q-px-xs">
        <q-icon class="item--thumb-xs" :name="icon" size="5px" />
      </q-item-section>

      <q-item-section class="q-pa-sm">
        <q-item-label class="ellipsis">
          <template v-if="hasDefaultSlot">
            <slot />
          </template>
          <a v-else v-auth-href :href="adjunto" class="ellipsis">
            {{ fileNameComp }}
          </a>
        </q-item-label>
      </q-item-section>
      <q-item-section v-if="showRemove" top side class="q-px-xs">
        <q-btn flat dense round icon="delete" @click="$emit('removeAttach', adjunto)" />
      </q-item-section>
    </q-item>
    <tooltip>{{ fileNameComp }}</tooltip>
  </div>
</template>

<script>
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
  },
}
</script>
<style lang="stylus"></style>
