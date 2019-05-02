<template>
  <q-select
    outlined
    :label="label"
    v-model="selectedValue"
    :option-value="idKey"
    :option-label="descriptionKey"
    :options="filteredOptions"
    :loading="loading"
    :disable="loading"
    :rules="[notEmpty]"
    use-input
    clearable
    @filter="filterFunction"
    @input="handleInput"
  />
</template>
<script>
import formValidation from "@mixins/formValidation"

export default {
  mixins: [formValidation],
  props: {
    value: {
      default: null,
    },
    options: Array,
    label: String,
    loading: {
      type: Boolean,
      default: true,
    },
    idKey: {
      type: String,
      default: "id",
    },
    descriptionKey: {
      type: String,
      default: "descripcion",
    },
    // rules: Array,
  },
  data() {
    return {
      selectedValue: this.value || null,
      filteredOptions: this.options,
    }
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
      this.$emit(
        "input",
        (this.selectedValue && this.selectedValue[this.idKey]) || "",
      )
    },
    filterFunction(val, update) {
      if (val === "") {
        update(() => {
          this.filteredOptions = this.options
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.filteredOptions = this.options.filter(
          v => v[this.descriptionKey].toLowerCase().indexOf(needle) > -1,
        )
      })
    },
  },
}
</script>
