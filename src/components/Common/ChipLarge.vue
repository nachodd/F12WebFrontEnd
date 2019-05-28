<template functional>
  <q-chip dense style="padding-right: 10px;">
    <q-avatar
      :text-color="props.avatarTextColor"
      :style="{ backgroundColor: props.avatarColor }"
      class="chip-large"
    >
      {{ props.avatarText }}
    </q-avatar>
    {{ props.text }}
  </q-chip>
</template>

<script>
export default {
  props: {
    avatarTextColor: {
      type: String,
      default: "white",
    },
    avatarColor: {
      type: String,
      default: "#F0666B",
    },
    avatarText: {
      type: [String, Number],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.chip-large {
  width: auto;
  border-radius: 16px;
  padding: 0 5px;
}
</style>
