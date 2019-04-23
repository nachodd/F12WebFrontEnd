<template functional>
  <div class="row rounded-borders shadow-5 items-stretch">
    <div
      class="col-sm-5 row items-center rounded-borders q-pa-sm"
      :class="[props.iconBackgroundClass]"
    >
      <div class="text-center col" :class="[props.iconTextClass]">
        <q-icon :name="props.icon" size="4rem" />
      </div>
    </div>

    <div
      class="col-sm-7 row items-center rounded-borders q-pa-sm"
      :class="[props.infoBackgroundClass]"
    >
      <div class="text-center col" :class="[props.infoTextClass]">
        <div class="text-h3">{{ props.value }}</div>
        <div class="text-subtitle">{{ props.description }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    iconBackgroundClass: {
      type: String,
      default: "bg-red-9",
    },
    iconTextClass: {
      type: String,
      default: "text-white",
    },
    infoBackgroundClass: {
      type: String,
      default: "bg-white",
    },
    infoTextClass: {
      type: String,
      default: "text-red",
    },
  },
}
</script>
<style lang="sass"></style>
