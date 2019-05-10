<template>
  <q-input
    :value="formated_date"
    outlined
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
        <q-popup-proxy>
          <q-date
            v-model="selectedValue"
            today-btn
            color="accent"
            :options="pastDisabledFn"
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
      type: String,
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
    value(val) {
      // Fix para limpiar el valor cuando colapsa
      if (val === null) {
        this.selectedValue = null
      }
    },
  },
  methods: {
    handleInput() {
      this.$emit("input", this.formated_date)
    },
    clearValues() {
      this.selectedValue = null
      this.$emit("input", null)
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
