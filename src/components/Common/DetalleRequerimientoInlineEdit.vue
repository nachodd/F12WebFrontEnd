<template>
  <div>
    <div
      v-if="!editMode"
      class="row justify-between"
      @hover="editShowed = true"
      @blur="editShowed = false"
    >
      <template v-if="isComentarioAndEmpty && !editMode">
        <div class="col text-grey text-italic">
          No hay comentarios agregados.
          <a href="#" class="text-blue" @click.prevent="editMode = true">
            ¿Desea agregar uno?
          </a>
        </div>
      </template>
      <template v-else>
        <div class="col text-pre-wrap">{{ value }}</div>
        <div class="col-auto opacity-25" :class="{ 'opacity-100': editShowed }">
          <q-icon
            name="fas fa-pencil-alt cursor-pointer"
            class="q-pa-sm"
            @click="editMode = !editMode"
          >
            <tooltip>Editar {{ fieldName }}</tooltip>
          </q-icon>
        </div>
      </template>
    </div>
    <q-input
      v-else
      ref="input"
      v-model="__value"
      :type="inputType"
      dense
      outlined
      color="deep-purple-10"
      :rules="validationRules"
      :hide-bottom-space="true"
      @input="$emit('touched', fieldName)"
    />
  </div>
</template>

<script>
import Tooltip from "comp/Common/Tooltip"
import formValidation from "mixins/formValidation"

export default {
  name: "InlineEdit",
  components: { Tooltip },
  mixins: [formValidation],
  props: {
    value: {
      type: String,
      default: "",
    },
    fieldName: {
      type: String,
      default: "",
    },
    inputType: {
      type: String,
      default: "text",
    },
    applyValidation: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      editMode: false,
      editShowed: false,
    }
  },
  computed: {
    __value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
    isComentarioAndEmpty() {
      return this.fieldName === "Comentarios" && (this.value === null || this.value.trim() === "")
    },
    validationRules() {
      return this.applyValidation ? [this.notEmpty] : null
    },
  },
  watch: {
    editShowed(val) {
      console.log(val)
    },
  },
  methods: {
    validate() {
      return this.$refs.input.validate()
    },
  },
}
</script>

<style></style>
