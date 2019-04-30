<template>
  <q-page padding>
    <page-header title="Nuevo Ticket" />

    <q-form ref="form" @submit="onSubmit" class="q-gutter-md">
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
          <q-item tag="label" v-ripple>
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

          <q-item tag="label" v-ripple>
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

      <!-- <div v-permission="['menu_sistemas']">
        <div class="text-subtitle1 text-grey-7">Prioridad</div>
        <div class="row justify-around">
          <div class="col-10">
            <q-slider
              v-model="form.prioridad"
              :color="priorityColor"
              markers
              snap
              :min="0"
              :max="10"
              label
              :label-value="'Prioridad ' + form.prioridad"
              label-always
            />
          </div>
        </div>
			</div>-->

      <br />
      <div class="row">
        <div class="col">
          <q-btn
            type="submit"
            color="deep-purple-10"
            size="lg"
            :outline="submitting"
            class="full-width"
            :loading="submitting"
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
import formValidation from "@mixins/formValidation"
import { warn } from "@utils/helpers"
import Requerimiento from "@models/requerimiento"

export default {
  mixins: [formValidation],
  components: { PageHeader, SelectCustom, InputDateCustom },
  data() {
    return {
      form: new Requerimiento(),
      submitting: false,
      llevaFechaLimite: false,
      isLoadingOptions: true,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
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
      // this.form.importante = this.importante ? 1 : 0
      try {
        this.submitting = true
        await this.$store.dispatch(
          "requerimientos/storeRequerimiento",
          this.form.toCreatePayload(),
        )
        this.form = new Requerimiento()
      } catch (e) {
        warn(
          e.message,
          "Hubo un problema al guardar el ticket. Intente nuevamente mas tarde",
        )
      } finally {
        this.submitting = false
      }
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("requerimientos/createRequerimiento")
      this.isLoadingOptions = false
    } catch (e) {
      warn(
        e.message,
        "Hubo un problema al cargar las opciones. Intente nuevamente mas tarde",
      )
    }
  },
}
</script>

<style lang="scss" scoped></style>
