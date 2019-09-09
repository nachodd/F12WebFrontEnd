<template functional>
  <div class="row q-mt-sm q-col-gutter-sm items-center">
    <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
      {{ props.label }}
    </div>
    <div class="col-xs-9">
      <slot />
    </div>
    <div v-if="props.footer !== ''" class="col-xs-9 offset-xs-3 text-caption">
      {{ props.footer }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    footer: {
      type: String,
      default: "",
    },
  },
}
</script>
