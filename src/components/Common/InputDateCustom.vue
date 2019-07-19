<template>
  <!-- :value="selectedValue" -->
  <q-input
    ref="input"
    v-model="selectedValue"
    :dark="dark"
    :color="color"
    :outlined="outlined"
    :filled="filled"
    :label="label"
    :rules="rulesDate"
    :hide-bottom-space="true"
    class="custom-error"
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
    applyValidation: {
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
    dark: {
      type: Boolean,
      default: false,
    },
    outlined: {
      type: Boolean,
      default: true,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "accent",
    },
  },
  data() {
    return {
      datePopupShowed: false,
    }
  },
  computed: {
    formated_date() {
      return date.formatDate(this.selectedValue, "DD/MM/YYYY")
    },
    rulesDate() {
      return this.applyValidation ? [this.notEmpty, this.validDate] : []
    },
    selectedValue: {
      get() {
        return this.value
      },
      set(newVal) {
        this.$emit("input", newVal)
      },
    },
  },
  methods: {
    handleInput(val) {
      if (val) {
        this.datePopupShowed = false
      }
    },
    validate() {
      return this.$refs.input.validate()
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
<style lang="stylus">
.custom-error.q-field--dark.q-field--error .q-field__bottom
  color $red-5

.custom-error.q-field--dark.q-field--error .text-negative
  color $red-5 !important
</style>
