<template>
  <q-input
    ref="input"
    outlined
    :value="selectedValue"
    :label="label"
    :rules="rulesDate"
    :hide-bottom-space="true"
  >
    <template v-slot:append>
      <q-icon
        v-if="selectedValue"
        name="cancel"
        class="cursor-pointer"
        @click.stop="clearValues"
      />
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy v-model="datePopupShowed">
          <q-date
            v-model="selectedValue"
            today-btn
            color="accent"
            :options="pastDisabledFn"
            mask="DD/MM/YYYY"
            @input="handleInput"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar"
import formValidation from "@mixins/formValidation"

export default {
  mixins: [formValidation],
  props: {
    label: {
      type: String,
      default: "",
    },
    validate: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Date, String],
      default: null,
    },
    pastDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedValue: this.value || null,
      datePopupShowed: false,
    }
  },
  computed: {
    formated_date() {
      return date.formatDate(this.selectedValue, "DD/MM/YYYY")
    },
    rulesDate() {
      return this.validate ? [this.notEmpty, this.validDate] : []
    },
  },
  watch: {
    // Escuchamos los cambios en value para saber cuando se cambia, y los propagamos al valor interno
    value(val) {
      this.selectedValue = val
      // Si hay valor elegido, cerramos el popup
      if (val) {
        this.datePopupShowed = false
      }
    },
  },
  methods: {
    handleInput() {
      this.$emit("input", this.selectedValue)
    },
    clearValues() {
      this.selectedValue = null
      this.$emit("input", null)
    },
    resetValidation() {
      this.$refs.input.resetValidation()
    },
    pastDisabledFn(currentDate) {
      if (this.pastDisabled) {
        const timeStamp = Date.now()
        const today = date.formatDate(timeStamp, "YYYY/MM/DD")
        return currentDate >= today
      }
      return true
    },
  },
}
</script>
