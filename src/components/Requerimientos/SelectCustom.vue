<template>
  <q-select
    v-model="localValue"
    outlined
    :hide-bottom-space="true"
    :label="label"
    :option-value="idKey"
    :option-label="descriptionKey"
    :options="filteredOptions"
    :loading="loading"
    :disable="loading"
    :rules="rules"
    use-input
    @filter="filterFunction"
  >
    <!-- @input="handleInput" -->
    <template v-if="localValue" v-slot:append>
      <q-icon
        name="cancel"
        class="cursor-pointer"
        @click.stop="$emit('input', null)"
      />
    </template>
  </q-select>
</template>
<script>
import formValidation from "@mixins/formValidation"

export default {
  mixins: [formValidation],
  props: {
    value: {
      type: [Object, String],
      default: null,
    },
    applyValidation: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: "",
    },
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
      filteredOptions: this.options,
    }
  },
  computed: {
    localValue: {
      get() {
        return this.value
      },
      set(localValue) {
        this.$emit("input", localValue)
      },
    },
    rules() {
      return this.applyValidation ? [this.notEmpty] : []
    },
  },
  watch: {
    // value(val) {
    //   console.log(val)
    //   // Fix para limpiar el valor cuando colapsa
    //   if (val === null) {
    //     this.selectedValue = null
    //   }
    // },
  },
  methods: {
    // handleInput() {
    //   this.$emit(
    //     "input",
    //     this.value,
    //     // (this.selectedValue && this.selectedValue[this.idKey]) || "",
    //   )
    // },
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
