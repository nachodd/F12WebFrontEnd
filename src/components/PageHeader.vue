<template>
  <div :class="{ 'pageheader-h2': true, underlined: showUnderline }">
    {{ title }}
  </div>
</template>
<script>
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    showUnderline: {
      type: Boolean,
      default: true,
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
  margin: 0 0 1.5rem;
  color: var(--q-color-accent);
}
.underlined {
  border-bottom: 1px solid #ccc;
}
</style>
