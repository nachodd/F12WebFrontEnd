<template>
  <div>
    <div
      v-if="!editMode"
      class="row justify-between"
      @hover="editShowed = true"
      @blur="editShowed = false"
    >
      <div>{{ value }}</div>
      <div class="opacity-25" :class="{ 'opacity-100': editShowed }">
        <q-icon
          name="fas fa-pencil-alt cursor-pointer"
          @click="editMode = !editMode"
        >
          <tooltip>Editar {{ fieldName }}</tooltip>
        </q-icon>
      </div>
    </div>
    <q-input
      v-else
      ref="input"
      v-model="__value"
      type="text"
      dense
      outlined
      color="deep-purple-10"
      :rules="[notEmpty]"
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
