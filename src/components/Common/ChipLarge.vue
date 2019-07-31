<template functional>
  <q-chip dense style="padding-right: 10px;">
    <!-- :text-color="props.avatarTextColor" -->
    <q-avatar
      :style="{
        color: props.avatarTextColor,
        backgroundColor: props.avatarColor,
      }"
      class="chip-large"
    >
      <div class="chip-large__text">
        {{ props.avatarText }}
      </div>
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
  font-weight: 600;
}
.chip-large__text {
  max-width: 200px;
  text-overflow: ellipsis;
}
</style>
