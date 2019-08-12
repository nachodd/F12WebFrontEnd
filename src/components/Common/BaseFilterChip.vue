<template>
  <span v-if="showed" class="q-mx-xs">
    <q-chip removable @remove="$emit('remove')">
      <q-avatar :color="color" :text-color="textColor" class="filter-label">
        {{ label }}
      </q-avatar>
      <div class="filter-chip__text">
        {{ value }}
      </div>
      <tooltip v-if="tooltip !== ''">
        {{ tooltip }}
      </tooltip>
    </q-chip>
  </span>
</template>
<script>
import Tooltip from "comp/Common/Tooltip"

export default {
  components: { Tooltip },
  props: {
    showed: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    tooltip: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "green",
    },
    textColor: {
      type: String,
      default: "white",
    },
  },
}
</script>
