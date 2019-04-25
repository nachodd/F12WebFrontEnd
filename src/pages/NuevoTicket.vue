<template>
  <q-page padding>
    <page-header title="Nuevo Ticket" />

    <q-form @submit="onSubmit" :autofocus="true" class="q-gutter-md">
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

      <div class="row">
        <div class="col">
          <div class="row q-col-gutter-sm">
            <div class="col col-sm-4 col-xs-12">
              <q-select
                outlined
                v-model="form.area"
                :options="areas"
                label="Area"
                :loading="optionsLoading.area"
                :disable="optionsLoading.area"
                option-value="id"
                option-label="desc"
                @filter="loadAreas"
                @filter-abort="abortFilterFn"
              />
            </div>
            <div class="col col-sm-4 col-xs-12">
              <q-select
                outlined
                v-model="form.sistema"
                :options="sistemas"
                label="Sistema"
                :loading="optionsLoading.sistema"
                :disable="optionsLoading.sistema"
              />
            </div>
            <div class="col col-sm-4 col-xs-12">
              <q-select
                outlined
                v-model="form.requerimiento_tipo"
                :options="requerimientos_tipos"
                label="Tipo Requerimiento"
                :loading="optionsLoading.requerimiento_tipo"
                :disable="optionsLoading.requerimiento_tipo"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div>
        <q-checkbox left-label v-model="test" label="¿Tiene Fecha Limite?" />
			</div>-->

      <div>
        <q-list link>
          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox left-label v-model="fechaLimiteOpen" />
            </q-item-section>
            <q-item-section>
              <q-item-label>¿Tiene Fecha Limite?</q-item-label>
            </q-item-section>
          </q-item>
          <q-slide-transition>
            <div v-if="fechaLimiteOpen">
              hola
              <br />
              fechaLimiteOpen
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

export default {
  mixins: [formValidation],
  components: { PageHeader },
  data() {
    return {
      form: {
        asunto: "",
        descripcion: "",
        area: "",
        sistema: "",
        requerimiento_tipo: "",
        prioridad: 5,
      },
      submitting: false,
      fechaLimiteOpen: false,
      isLoadingOptions: true,
      optionsLoading: {
        area: true,
        sistema: true,
        requerimiento_tipo: true,
      },
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
      areas: state => state.areas,
      sistemas: state => state.sistemas,
      requerimientos_tipos: state => state.requerimientos_tipos,
    }),
  },
  methods: {
    onSubmit() {
      return false
    },
    async loadAreas(val, update /* , abort */) {
      debugger
      if (this.areas !== null) {
        // already loaded
        update()
        return
      }

      try {
        await this.$store.dispatch("tickets/getOptionsForTicketCreate")
        this.isLoadingOptions = false
        update(() => {
          // this.options = stringOptions
        })
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

      /* setTimeout(() => {
        update(() => {
          this.options = stringOptions
        })
      }, 2000) */
    },
    abortFilterFn() {
      console.log("delayed filter aborted")
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch("tickets/getOptionsForTicketCreate")
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
