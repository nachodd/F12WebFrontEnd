<template functional>
  <div
    :class="{
      'pageheader-h2': true,
      underlined: props.showUnderline,
      'pageheader-mb': !props.noMargin,
    }"
  >
    {{ props.title }}
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    showUnderline: {
      type: Boolean,
      default: true,
    },
    noMargin: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.pageheader-h2 {
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 0.5rem 0;
  font-weight: 500;
  color: var(--q-color-accent);
}
.underlined {
  border-bottom: 1px solid #ccc;
}
.pageheader-mb {
  margin: 0 0 2rem;
}
</style>
