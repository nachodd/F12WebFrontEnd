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
      @filesAdded="handleFilesAdded"
      @filesRemoved="handleFilesRemoved"
    />

    <!-- Wrapper de row - col por el tema del gutter izquierdo -->
    <div class="row">
      <div class="col">
        <div class="row q-col-gutter-sm">
          <div class="col col-sm-4 col-xs-12">
            <select-custom
              v-model="__area"
              :options="areas"
              label="Area"
              :loading="areas.length === 0"
              @input="$emit('update:area', $event)"
            />
          </div>
          <div class="col col-sm-4 col-xs-12">
            <select-custom
              v-model="__sistema"
              :options="sistemas"
              label="Sistema"
              :loading="sistemas.length === 0"
              @input="$emit('update:sistema', $event)"
            />
          </div>
          <div class="col col-sm-4 col-xs-12">
            <select-custom
              v-model="__requerimientoTipo"
              :options="requerimientosTipos"
              label="Tipo de Requerimiento"
              :loading="requerimientosTipos.length === 0"
              @input="$emit('update:requerimientoTipo', $event)"
            />
          </div>
        </div>
      </div>
    </div>

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
                  <input-date-custom
                    ref="fechaLimite"
                    label="Fecha Límite"
                    past-disabled
                    :validate="__llevaFechaLimite"
                    :value="fechaLimite"
                    @input="$emit('update:fechaLimite', $event)"
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

        <q-item v-ripple tag="label" class="list-item--narrow">
          <q-item-section avatar>
            <q-checkbox
              color="accent"
              :value="importante"
              @input="$emit('update:importante', $event)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              MARCAR ESTE TICKET COMO IMPORTANTE
              <q-icon name="fas fa-exclamation-triangle" color="red" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <br />
    <div class="row">
      <div class="col">
        <q-btn
          type="submit"
          color="deep-purple-10"
          size="lg"
          :outline="loadingRequerimiento"
          class="full-width"
          :loading="loadingRequerimiento"
        >
          Cargar Ticket
        </q-btn>
      </div>
    </div>
  </q-form>
</template>

<script>
import { mapState } from "vuex"
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import InputDateCustom from "@comp/Requerimientos/InputDateCustom"
import UploaderCustom from "@comp/Requerimientos/UploaderCustom"
import formValidation from "@mixins/formValidation"
import { warn } from "@utils/helpers"

export default {
  components: { SelectCustom, InputDateCustom, UploaderCustom },
  mixins: [formValidation],
  props: {
    asunto: {
      type: String,
      default: "",
    },
    descripcion: {
      type: String,
      default: "",
    },
    area: {
      type: Object,
      default: null,
    },
    sistema: {
      type: Object,
      default: null,
    },
    requerimientoTipo: {
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
    importante: {
      type: Boolean,
      default: false,
    },
    adjuntos: {
      type: Array,
      default: () => [],
    },
    llevaFechaLimite: {
      type: Boolean,
      default: false,
    },
  },
  // data() {
  //   return {
  //     llevaFechaLimite: false,
  //   }
  // },
  computed: {
    __area: {
      get() {
        return this.area
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    __sistema: {
      get() {
        return this.sistema
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    __requerimientoTipo: {
      get() {
        return this.requerimientoTipo
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    __llevaFechaLimite: {
      get() {
        return this.llevaFechaLimite
      },
      set(value) {
        this.$emit("update:llevaFechaLimite", value)
      },
    },
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
      loadingOptions: state => state.loadingOptions,
      loadingRequerimiento: state => state.loadingRequerimiento,
    }),
    isEdit() {
      return !!this.form.id
    },
    motivoLimiteRules() {
      return this.__llevaFechaLimite ? [this.notEmpty] : []
    },
  },
  watch: {
    motivoLimite(val) {
      if (val) {
        this.llevaFechaLimite = true
      }
    },
    llevaFechaLimite(val) {
      if (!val) {
        this.fechaLimite = null
        this.motivoLimite = ""
        this.$refs.fechaLimite.resetValidation()
        this.$refs.motivoLimite.resetValidation()
        this.$emit("update:fechaLimite", this.fechaLimite)
        this.$emit("update:motivoLimite", this.motivoLimite)
      }
    },
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
        if (indexInArray) {
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
