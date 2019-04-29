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
                v-model="form.requerimiento_tipo"
                :options="requerimientos_tipos"
                label="Tipo de Requerimiento"
                :loading="requerimientos_tipos.length === 0"
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
                      v-model="form.fecha_limite"
                    />
                  </div>
                  <div class="col col-sm-8 col-xs-12">
                    <q-input
                      v-model.trim="form.motivo_limite"
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
import PageHeader from "components/PageHeader"
import formValidation from "src/mixins/formValidation"
import { mapState } from "vuex"
import SelectCustom from "components/NuevoTicket/SelectCustom"
import InputDateCustom from "components/NuevoTicket/InputDateCustom"

export default {
  mixins: [formValidation],
  components: { PageHeader, SelectCustom, InputDateCustom },
  data() {
    return {
      form: {
        asunto: "",
        descripcion: "",
        area: "",
        sistema: "",
        requerimiento_tipo: "",
        fecha_limite: "",
        motivo_limite: "",
        importante: false,
        // prioridad: 5,
      },
      submitting: false,
      llevaFechaLimite: false,
      isLoadingOptions: true,
    }
  },
  computed: {
    ...mapState("tickets", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientos_tipos: state => state.options.requerimientos_tipos,
    }),
    motivoLimiteRules() {
      return this.llevaFechaLimite ? [this.notEmpty] : []
    },
  },
  watch: {
    llevaFechaLimite(val) {
      if (!val) {
        this.form.fecha_limite = ""
        this.form.motivo_limite = ""
      }
    },
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      return false
    },
    /* async onSubmit(formRef) {
      console.log(this.form)
      try {
        const success = await formRef.validate()
        console.log(success)
        // if (success) {
        // }
      } catch (e) {
        console.log(e)
      }

      return false
    }, */
  },
  async mounted() {
    try {
      await this.$store.dispatch("tickets/getOptionsForTicketCreate")
      console.log(this.areas)
      this.isLoadingOptions = false
    } catch (e) {
      this.$q.notify({
        color: "negative",
        message:
          e.message ||
          "Hubo un problema al cargar las opciones. Intente nuevamente mas tarde",
        icon: "warning",
        position: "top-right",
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
