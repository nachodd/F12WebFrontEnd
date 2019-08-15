<template>
  <q-select
    ref="select"
    v-model="localValue"
    :outlined="outlined"
    :standout="standout"
    :hide-bottom-space="true"
    :label="label"
    :option-value="idKey"
    :option-label="descriptionKey"
    :options="filteredOptions"
    :loading="loading"
    :disable="disable || loading"
    :dense="dense"
    :rules="rules"
    :color="color"
    :options-cover="optionsCover"
    :use-input="useFilter ? true : null"
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

    <!-- override only "option" v-scoped-slot: -->
    <template v-if="$scopedSlots.option" v-slot:option="scope">
      <slot name="option" v-bind="scope" />
    </template>

    <!-- override ALL v-scoped-slot's -->
    <!-- <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template> -->
  </q-select>
</template>
<script>
import formValidation from "mixins/formValidation"

export default {
  mixins: [formValidation],
  props: {
    value: {
      type: [Object, String, Array],
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
    disable: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    idKey: {
      type: String,
      default: "id",
    },
    descriptionKey: {
      type: String,
      default: "descripcion",
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    standout: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: null,
    },
    useFilter: {
      type: Boolean,
      default: true,
    },
    optionsCover: {
      type: Boolean,
      default: false,
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
    // isMobile() {
    //   const res = this.$q.platform.is.mobile && this.$q.screen.lt.sm
    //   console.log("this.$q.platform.is.mobile", this.$q.platform.is.mobile)
    //   console.log("this.$q.screen.lt.sm", this.$q.screen.lt.sm)
    //   console.log("res", res)
    //   return res
    // },
    // shouldCover() {
    //   const res = this.optionsCover || this.isMobile
    //   console.log(this.optionsCover)
    //   return res
    // },
  },
  methods: {
    validate() {
      return this.$refs.select.validate()
    },
    resetValidation() {
      this.$refs.select.resetValidation()
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
