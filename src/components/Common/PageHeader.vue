<template functional>
  <div
    class="row justify-around"
    :class="{
      underlined: props.showUnderline,
      'pageheader-mb': !props.noMargin,
    }"
  >
    <div class="col">
      <div class="pageheader-h2">
        {{ props.title }}
      </div>
    </div>
    <div v-if="!!$slots.default" class="col-auto pageheader-slot">
      <slot />
    </div>
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

<style lang="stylus">
.pageheader-h2
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 0.5rem 0;
  font-weight: 500;
  color: $accent

.underlined
  border-bottom: 1px solid #ccc;

.pageheader-mb
  margin: 0 0 2rem;

.pageheader-slot
  padding: 0.5rem 0px;
  text-align: right;
</style>
