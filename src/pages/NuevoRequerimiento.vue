<template>
  <q-page padding>
    <page-header title="Nuevo Requerimiento" />
    <requerimiento-form ref="form" v-bind.sync="form" @submit="handleSubmit" />
  </q-page>
</template>
<script>
import PageHeader from "@comp/Common/PageHeader"
import RequerimientoForm from "@comp/Requerimientos/RequerimientosForm"
import Requerimiento from "@models/requerimiento"
import { warn, success } from "@utils/helpers"

export default {
  components: { PageHeader, RequerimientoForm },
  data() {
    return {
      form: new Requerimiento(),
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const form = this.isEdit
          ? await this.form.toCreatePayload()
          : await this.form.toCreatePayload()
        await this.$store.dispatch("requerimientos/storeRequerimiento", form)
        success({
          message: "La solicitud fue procesada correctamente!",
        })
        // this.form = new Requerimiento() // no funciona bien, no limpia los custom components
        this.clearForm()
      } catch (e) {}
    },
    onError() {
      warn({
        message: "El formulario contiene errores. Por favor, reviselo.",
      })
    },
    clearForm() {
      this.llevaFechaLimite = false
      this.form.asunto = ""
      this.form.descripcion = ""
      this.form.area = null
      this.form.sistema = null
      this.form.requerimientoTipo = null
      this.form.fechaLimite = null
      this.form.motivoLimite = ""
      this.form.importante = ""
      this.form.files = []
      this.$root.$emit("clearFiles")
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style lang="scss" scoped></style>
