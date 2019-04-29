<template>
  <q-input :value="formated_date" outlined :label="label" :rules="rulesDate">
    <template v-slot:append>
      <q-icon
        v-if="selectedValue"
        name="cancel"
        @click.stop="selectedValue = null"
        class="cursor-pointer"
      />
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy>
          <q-date v-model="selectedValue" @input="handleInput" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { date } from "quasar"
import formValidation from "src/mixins/formValidation"

export default {
  mixins: [formValidation],
  props: {
    label: String,
    validate: {
      type: Boolean,
      default: false,
    },
    value: {
      default: null,
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
  methods: {
    handleInput() {
      this.$emit("input", this.formated_date)
    },
  },
}
</script>
