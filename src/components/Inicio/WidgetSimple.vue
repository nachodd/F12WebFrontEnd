<template>
  <div
    class="row rounded-borders shadow-4 items-stretch widget widget--size widget--center"
    :class="{ 'shadow-4': !hover, 'shadow-9': hover }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="col-sm-5 col-xs-5 row items-center rounded-borders q-pa-sm"
      :class="[iconBackgroundClass]"
    >
      <div class="text-center col" :class="[iconTextClass]">
        <q-icon
          :name="loading ? 'fas fa-spinner fa-spin' : icon"
          size="3.7rem"
        />
      </div>
    </div>

    <div
      class="col-sm-7 col-xs-7 row items-center rounded-borders q-pa-sm"
      :class="[infoBackgroundClass]"
    >
      <div class="text-center col" :class="[infoTextClass]">
        <template v-if="loading">
          <div class="text-h6">Cargando...</div>
        </template>
        <template v-else>
          <div class="text-h3">{{ value }}</div>
          <div class="text-subtitle">{{ description }}</div>
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
  data() {
    return {
      hover: false,
    }
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
.widget {
  transition: box-shadow 0.4s;
}
</style>
