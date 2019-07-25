<template>
  <div
    class="row rounded-borders shadow-4 items-stretch widget widget--size widget--center text-unselectable"
    :class="{ 'shadow-4': !hover, 'shadow-9': hover }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="col-sm-5 col-xs-5 row items-center rounded-borders q-pa-sm"
      :class="[iconBackgroundClass]"
      :style="backGradientColor"
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
          <div class="text-h3">{{ Number(value) }}</div>
          <div class="text-subtitle">{{ description }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { pSBC, changeHue } from "utils/colorHelper"
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
      type: [String, Number],
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    iconBackgroundClass: {
      type: String,
      default: "",
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

    iconBackgroundColor: {
      type: String,
      default: null,
    },
    iconBackgroundGradient: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    backGradientColor() {
      if (this.iconBackgroundColor === null) {
        return {}
      }
      if (this.iconBackgroundGradient) {
        let toColor = changeHue(this.iconBackgroundColor, 40)
        toColor = pSBC(0.75, this.iconBackgroundColor, toColor, true)
        return {
          background: `linear-gradient(45deg, ${this.iconBackgroundColor}, ${
            this.iconBackgroundColor
          } 25% , ${toColor} 100%)`,
        }
      } else {
        return {
          background: this.iconBackgroundColor,
        }
      }
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
.widget {
  transition: box-shadow 0.4s;
}
</style>
