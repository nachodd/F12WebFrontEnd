<template functional>
  <div class="relative-position list-container">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <q-list
        v-show="!props.loading"
        bordered
        separator
        class="rounded-borders q-mb-md"
      >
        <slot />
      </q-list>
    </transition>
    <q-inner-loading :showing="props.loading">
      <q-spinner-gears size="50px" color="accent" />
    </q-inner-loading>
  </div>
</template>

<script>
export default {
  name: "ListContainer",
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.list-container {
  height: 290px;
}
</style>
