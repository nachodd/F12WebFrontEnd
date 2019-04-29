<template functional>
  <div
    class="row rounded-borders shadow-5 items-stretch widget--size widget--center"
  >
    <div
      class="col-sm-5 col-xs-5 row items-center rounded-borders q-pa-sm"
      :class="[props.iconBackgroundClass]"
    >
      <div class="text-center col" :class="[props.iconTextClass]">
        <q-icon
          :name="props.loading ? 'fas fa-spinner fa-spin' : props.icon"
          size="3.7rem"
        />
      </div>
    </div>

    <div
      class="col-sm-7 col-xs-7 row items-center rounded-borders q-pa-sm"
      :class="[props.infoBackgroundClass]"
    >
      <div class="text-center col" :class="[props.infoTextClass]">
        <template v-if="props.loading">
          <div class="text-h6">Cargando...</div>
        </template>
        <template v-else>
          <div class="text-h3">{{ props.value }}</div>
          <div class="text-subtitle">{{ props.description }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
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
<style lang="scss">
.widget--size {
  max-width: 300px;
  min-height: 90px;
}
.widget--center {
  margin: 0 auto;
}
</style>
