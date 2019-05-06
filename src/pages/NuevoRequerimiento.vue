<template>
  <q-page padding>
    <page-header title="Nuevo Requerimiento" />

    <q-form
      ref="form"
      @submit="onSubmit"
      @validation-error="onError"
      class="q-gutter-md"
    >
      <q-input
        v-model.trim="form.asunto"
        outlined
        type="text"
        label="Asunto"
        :rules="[notEmpty]"
      />
      <q-input
        v-model.trim="form.descripcion"
        outlined
        type="textarea"
        label="Descripción"
        :rules="[notEmpty]"
      />

      <uploader-custom />

      <!-- Wrapper de row - col por el tema del gutter izquierdo -->
      <div class="row">
        <div class="col">
          <div class="row q-col-gutter-sm">
            <div class="col col-sm-4 col-xs-12">
              <select-custom
                v-model="form.area"
                :options="areas"
                label="Area"
                :loading="areas.length === 0"
              />
            </div>
            <div class="col col-sm-4 col-xs-12">
              <select-custom
                v-model="form.sistema"
                :options="sistemas"
                label="Sistema"
                :loading="sistemas.length === 0"
              />
            </div>
            <div class="col col-sm-4 col-xs-12">
              <select-custom
                v-model="form.requerimientoTipo"
                :options="requerimientosTipos"
                label="Tipo de Requerimiento"
                :loading="requerimientosTipos.length === 0"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <q-list link>
          <q-item tag="label" v-ripple class="list-item--narrow">
            <q-item-section avatar>
              <q-checkbox
                left-label
                v-model="llevaFechaLimite"
                color="accent"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>¿Tiene Fecha Limite?</q-item-label>
            </q-item-section>
          </q-item>
          <q-slide-transition>
            <div v-show="llevaFechaLimite" class="row q-mt-sm">
              <div class="col">
                <div class="row q-col-gutter-sm">
                  <div class="col col-sm-4 col-xs-12">
                    <input-date-custom
                      label="Fecha Límite"
                      :validate="llevaFechaLimite"
                      v-model="form.fechaLimite"
                      past-disabled
                    />
                  </div>
                  <div class="col col-sm-8 col-xs-12">
                    <q-input
                      v-model.trim="form.motivoLimite"
                      outlined
                      type="text"
                      label="Motivo"
                      :rules="motivoLimiteRules"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-slide-transition>

          <q-item tag="label" v-ripple class="list-item--narrow">
            <q-item-section avatar>
              <q-checkbox v-model="form.importante" color="accent" />
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
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import PageHeader from "@comp/PageHeader"
import SelectCustom from "@comp/NuevoTicket/SelectCustom"
import InputDateCustom from "@comp/NuevoTicket/InputDateCustom"
import UploaderCustom from "@comp/NuevoTicket/UploaderCustom"
import formValidation from "@mixins/formValidation"
import { warn, success } from "@utils/helpers"
import Requerimiento from "@models/requerimiento"

export default {
  mixins: [formValidation],
  components: { PageHeader, SelectCustom, InputDateCustom, UploaderCustom },
  data() {
    return {
      form: new Requerimiento(),
      llevaFechaLimite: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
      loadingOptions: state => state.loadingOptions,
      loadingRequerimiento: state => state.loadingRequerimiento,
    }),
    motivoLimiteRules() {
      return this.llevaFechaLimite ? [this.notEmpty] : []
    },
  },
  watch: {
    llevaFechaLimite(val) {
      if (!val) {
        this.form.fechaLimite = null
        this.form.motivoLimite = ""
      }
    },
  },
  methods: {
    async onSubmit() {
      try {
        await this.$store.dispatch(
          "requerimientos/storeRequerimiento",
          this.form.toCreatePayload(),
        )
        // no funciona bien, no limpia los custom components
        // this.form = new Requerimiento()
        success({
          message: "La solicitud fue procesada correctamente!",
        })
        this.llevaFechaLimite = false
        this.clearForm()
      } catch (e) {}
    },
    onError() {
      warn({
        message: "El formulario contiene errores. Por favor, reviselo.",
      })
    },
    clearForm() {
      this.form.asunto = ""
      this.form.descripcion = ""
      this.form.area = null
      this.form.sistema = null
      this.form.requerimientoTipo = null
      this.form.fechaLimite = null
      this.form.motivoLimite = ""
      this.form.importante = ""
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("requerimientos/createRequerimiento")
    } catch (e) {
      const message =
        e.message ||
        "Hubo un problema al cargar las opciones. Intente nuevamente más tarde"
      warn({ message })
    }
  },
}
</script>

<style lang="scss" scoped></style>
