<template functional>
  <div
    class="note"
    :class="{
      'note--success': props.type === 'success',
      'note--danger': props.type === 'danger',
      'note--warning': props.type === 'warning',
      'note--accent': props.type === 'accent',
    }"
  >
    <p class="note__title">{{ props.title }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-if="props.description" v-html="props.description"></p>
    <p v-else>
      <slot />
    </p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
@import "src/css/variables.scss";
.note {
  background-color: #eee;
  border-radius: 4px;
  /* margin: 16px 0; */
  padding: 16px 24px;
  font-size: 1em;
  border-width: 0 5px 0;
  border-style: solid;
  border-color: #9e9e9e;
  letter-spacing: 0.5px;
}
.note--success {
  background-color: #c1f4cd;
  border-color: #21ba45;
}
.note--danger {
  background-color: #ffc0c6;
  border-color: #c10015;
}
.note--warning {
  background-color: #f9e09b;
  border-color: #f2c037;
}
.note--accent {
  background-color: $accent-lighter;
  border-color: $accent;
}
.note__title {
  font-weight: 700;
}
.note > p {
  margin-bottom: 0;
}
</style>
