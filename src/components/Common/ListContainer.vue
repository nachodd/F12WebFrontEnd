<template functional>
  <div class="relative-position list-container">
    <!-- <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    > -->
    <q-slide-transition>
      <q-list
        v-show="!props.loading"
        bordered
        separator
        class="rounded-borders-12 q-mb-md shadow-2 bg-white"
      >
        <slot />
      </q-list>
    </q-slide-transition>
    <!-- </transition> -->
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
  min-height: 390px;
}
</style>
