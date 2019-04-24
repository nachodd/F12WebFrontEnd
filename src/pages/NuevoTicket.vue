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

      <q-select outlined v-model="form.area" :options="options" label="Area" />

      <q-select
        outlined
        v-model="form.sistema"
        :options="options"
        label="Sistema"
      />

      <q-select
        outlined
        v-model="form.requerimiento_tipo"
        :options="options"
        label="Tipo Requerimiento"
      />

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

      <br />
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
    </q-form>
  </q-page>
</template>
<script>
import PageHeader from "components/PageHeader"
import formValidation from "src/mixins/formValidation"

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
    }
  },
  computed: {
    priorityColor() {
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
    },
  },
  methods: {
    onSubmit() {
      return false
    },
  },
}
</script>
