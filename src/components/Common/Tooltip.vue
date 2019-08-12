<template>
  <q-tooltip
    v-model="showed"
    :content-class="__contentClass"
    :anchor="anchor"
    :self="self"
    :offset="offset"
    :content-style="contentStyle"
    @before-show="handleShow"
    @hide="handleHide"
  >
    <slot />
  </q-tooltip>
</template>

<script>
export default {
  props: {
    contentClass: {
      type: String,
      default: void 0,
    },
    contentStyle: {
      type: String,
      default: void 0,
    },
    anchor: {
      type: String,
      default: void 0,
    },
    self: {
      type: String,
      default: void 0,
    },
    offset: {
      type: Array,
      default: void 0,
    },
  },
  data() {
    return {
      showed: false,
      timeout: null,
    }
  },
  computed: {
    __contentClass() {
      return this.contentClass
        ? `text-caption ${this.contentClass}`
        : "text-caption"
    },
  },
  methods: {
    handleShow() {
      if (this.$q.platform.is.mobile) {
        this.timeout = setTimeout(() => {
          this.showed = false
        }, 3000)
      }
    },
    handleHide() {
      if (this.timeout !== null) {
        this.timeout = null
      }
    },
  },
}
</script>
