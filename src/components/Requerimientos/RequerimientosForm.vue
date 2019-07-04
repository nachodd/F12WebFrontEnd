<template>
  <q-form
    ref="form"
    class="q-gutter-md"
    @submit="$emit('submit')"
    @validation-error="onValidationError"
  >
    <q-input
      outlined
      type="text"
      label="Asunto"
      :rules="[notEmpty]"
      :hide-bottom-space="true"
      :value="asunto"
      @input="$emit('update:asunto', $event)"
    />

    <select-custom
      v-model="__sistema"
      :options="sistemas"
      label="Sistema"
      outlined
      :loading="sistemas.length === 0"
      :apply-validation="true"
    />

    <select-custom
      v-model="__tipo"
      :options="requerimientosTipos"
      label="Tipo de Requerimiento"
      outlined
      :loading="requerimientosTipos.length === 0"
      :apply-validation="true"
    />

    <q-input
      outlined
      type="textarea"
      label="Descripción"
      :rules="[notEmpty]"
      :hide-bottom-space="true"
      :value="descripcion"
      @input="$emit('update:descripcion', $event)"
    />

    <uploader-custom
      :files-uploaded.sync="__adjuntosCargadosUrl"
      @filesAdded="handleFilesAdded"
      @filesRemoved="handleFilesRemoved"
    />

    <div>
      <q-list link>
        <q-item v-ripple tag="label" class="list-item--narrow">
          <q-item-section avatar>
            <q-checkbox
              v-model="__llevaFechaLimite"
              left-label
              color="accent"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>¿Tiene Fecha Limite?</q-item-label>
          </q-item-section>
        </q-item>
        <q-slide-transition>
          <div v-show="__llevaFechaLimite" class="row q-mt-sm">
            <div class="col">
              <div class="row q-col-gutter-sm">
                <div class="col col-sm-4 col-xs-12">
                  <!-- Se podria escrivir asi tambien, asigandolé directamente el :value y emitiendo valores onInput -->
                  <!-- <input-date-custom
                    ref="fechaLimite"
                    label="Fecha Límite"
                    past-disabled
                    :apply-validation="__llevaFechaLimite"
                    :value="fechaLimite"
                    @input="$emit('update:fechaLimite', $event)"
                  />-->
                  <!-- o bien, usar un v-model con una computed property, que en el setter emita su valor arriba y el getter sea la prop  -->
                  <input-date-custom
                    ref="fechaLimite"
                    v-model="__fechaLimite"
                    label="Fecha Límite"
                    past-disabled
                    :apply-validation="__llevaFechaLimite"
                  />
                </div>
                <div class="col col-sm-8 col-xs-12">
                  <q-input
                    ref="motivoLimite"
                    outlined
                    type="text"
                    label="Motivo"
                    :rules="motivoLimiteRules"
                    :hide-bottom-space="true"
                    :value="motivoLimite"
                    @input="$emit('update:motivoLimite', $event)"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-slide-transition>
      </q-list>
    </div>

    <br />
    <div class="row">
      <div class="col">
        <q-btn
          type="submit"
          color="deep-purple-10"
          size="lg"
          :outline="submitLoading"
          class="full-width"
          :loading="submitLoading"
        >
          {{ submitText }}
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<script>
import { mapState } from "vuex"
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import InputDateCustom from "@comp/Common/InputDateCustom"
import UploaderCustom from "@comp/Requerimientos/UploaderCustom"
import formValidation from "@mixins/formValidation"
import { warn } from "@utils/helpers"

export default {
  components: { SelectCustom, InputDateCustom, UploaderCustom },
  mixins: [formValidation],
  props: {
    id: {
      type: Number,
      default: null,
    },
    asunto: {
      type: String,
      default: "",
    },
    adjuntosCargadosUrl: {
      type: Array,
      default: () => [],
    },
    descripcion: {
      type: String,
      default: "",
    },
    sistema: {
      type: Object,
      default: null,
    },
    tipo: {
      type: Object,
      default: null,
    },
    fechaLimite: {
      type: [String, Date],
      default: null,
    },
    motivoLimite: {
      type: String,
      default: "",
    },
    adjuntos: {
      type: Array,
      default: () => [],
    },
    llevaFechaLimite: {
      type: Boolean,
      default: false,
    },
    procesandoArchivosCargados: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    __adjuntosCargadosUrl: {
      get() {
        return this.adjuntosCargadosUrl
      },
      set(value) {
        this.$emit("update:adjuntosCargadosUrl", value)
      },
    },
    __sistema: {
      get() {
        return this.sistema
      },
      set(value) {
        this.$emit("update:sistema", value)
      },
    },
    __tipo: {
      get() {
        return this.tipo
      },
      set(value) {
        this.$emit("update:tipo", value)
      },
    },
    __fechaLimite: {
      get() {
        return this.fechaLimite
      },
      set(newVal) {
        this.$emit("update:fechaLimite", newVal)
      },
    },
    __llevaFechaLimite: {
      get() {
        return this.llevaFechaLimite
      },
      set(value) {
        this.$emit("update:llevaFechaLimite", value)

        if (!value) {
          // this.fechaLimite = null
          this.__fechaLimite = null
          this.motivoLimite = ""
          this.$refs.fechaLimite.resetValidation()
          this.$refs.motivoLimite.resetValidation()
          // this.$emit("update:fechaLimite", this.fechaLimite)
          this.$emit("update:motivoLimite", this.motivoLimite)
        }
      },
    },
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
      loadingOptions: state => state.loadingOptions,
      loadingRequerimiento: state => state.loadingRequerimiento,
    }),
    submitText() {
      return this.id ? "Editar Requerimiento" : "Cargar Requerimiento"
    },
    motivoLimiteRules() {
      return this.__llevaFechaLimite ? [this.notEmpty] : []
    },
    submitLoading() {
      return this.procesandoArchivosCargados || this.loadingRequerimiento
    },
  },
  watch: {
    motivoLimite(val) {
      if (val) {
        this.__llevaFechaLimite = true
      }
    },
    // llevaFechaLimite(val) {
    // },
  },
  methods: {
    handleFilesAdded(files) {
      files.forEach(file => {
        const isInArray = _.find(this.adjuntos, { name: file.name })
        if (!isInArray) {
          this.adjuntos.push(file)
        }
      })
      this.$emit("update:files", this.adjuntos)
    },
    handleFilesRemoved(files) {
      files.forEach(file => {
        const indexInArray = _.findIndex(this.adjuntos, { name: file.name })
        if (indexInArray >= 0) {
          this.adjuntos.splice(indexInArray, 1)
        }
      })
      this.$emit("update:files", this.adjuntos)
    },
    onValidationError() {
      warn({
        message: "El formulario contiene errores. Por favor, reviselo.",
      })
    },
    resetValidation() {
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
