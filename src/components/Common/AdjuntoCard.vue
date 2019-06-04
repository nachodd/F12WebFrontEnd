<template>
  <q-item class="shadow-2 bg-grey-3 no-padding">
    <q-item-section v-if="showIcon" side class="no-pad">
      <q-icon class="item--thumb-xs" :name="icon" />
    </q-item-section>

    <q-item-section class="q-pa-sm">
      <q-item-label lines="2" class="">
        <template v-if="hasDefaultSlot">
          <slot />
        </template>
        <a v-else v-auth-href :href="adjunto">
          {{ fileNameComp }}
        </a>
      </q-item-label>
    </q-item-section>
    <q-item-section v-if="showRemove" top side>
      <q-btn
        size="12px"
        flat
        dense
        round
        icon="delete"
        @click="$emit('removeAttach', adjunto)"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
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
      default: true,
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
