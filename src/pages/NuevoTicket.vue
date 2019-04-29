<template>
  <q-page padding>
    <page-header title="Nuevo Ticket" />

    <q-form @submit="onSubmit" class="q-gutter-md">
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
              <q-checkbox left-label v-model="fechaLimiteOpen" color="accent" />
            </q-item-section>
            <q-item-section>
              <q-item-label>¿Tiene Fecha Limite?</q-item-label>
            </q-item-section>
          </q-item>
          <q-slide-transition>
            <div v-if="fechaLimiteOpen" class="row q-mt-sm">
              <div class="col">
                <div class="row q-col-gutter-sm">
                  <div class="col col-sm-4 col-xs-12">
                    <q-input
                      v-model.trim="form.fecha_limite"
                      outlined
                      mask="date"
                      label="Fecha Límite"
                      :rules="['date']"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy>
                            <q-date v-model="form.fecha_limite" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col col-sm-8 col-xs-12">
                    <q-input
                      v-model.trim="form.motivo_limite"
                      outlined
                      type="text"
                      label="Motivo"
                      :rules="[notEmpty]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-slide-transition>

          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox v-model="fechaLimiteOpen" color="accent" />
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

export default {
  mixins: [formValidation],
  components: { PageHeader, SelectCustom },
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
        // prioridad: 5,
      },
      submitting: false,
      fechaLimiteOpen: false,
      isLoadingOptions: true,
      areasFiltered: [],
    }
  },
  computed: {
    /* priorityColor() {
      if (this.form.prioridad <= 2) {
        return "green"
      } else if (this.form.prioridad > 2 && this.form.prioridad <= 5) {
        return "light-green"
      } else if (this.form.prioridad > 3 && this.form.prioridad <= 5) {
        return "amber-8"
      } else if (this.form.prioridad > 5 && this.form.prioridad <= 7) {
        return "orange"
      } else if (this.form.prioridad > 7 && this.form.prioridad <= 9) {
        return "red"
      } else {
        return "red-10"
      }
    }, */
    ...mapState("tickets", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientos_tipos: state => state.options.requerimientos_tipos,
    }),
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      return false
    },
    // filterAreas: filterFunction("areasFiltered", this.areasFiltered),
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
  watch: {
    form: function(val) {
      console.log(val)
    },
  },
}
</script>

<style lang="scss" scoped></style>
