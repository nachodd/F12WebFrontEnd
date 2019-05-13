<template>
  <q-page padding>
    <page-header title="Nuevo Requerimiento" />
    <requerimiento-form ref="form" v-bind.sync="form" @submit="handleSubmit" />
  </q-page>
</template>
<script>
import { mapGetters } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import RequerimientoForm from "@comp/Requerimientos/RequerimientosForm"
import Requerimiento from "@models/requerimiento"
import { warn, success } from "@utils/helpers"
import { getRequerimiento } from "@api/requerimientos"

export default {
  components: { PageHeader, RequerimientoForm },
  data() {
    return {
      form: new Requerimiento(),
    }
  },
  computed: {
    ...mapGetters("app", ["isLoading"]),
    isEdit() {
      return !!this.$route.params.id
    },
  },
  watch: {
    isLoading(isLoading) {
      if (isLoading) {
        this.$q.loading.show({
          message: "<strong>Cargando... <br>Por favor, espere...</strong>",
        })
      } else {
        this.$q.loading.hide()
      }
    },
  },
  async created() {
    try {
      //
      await this.$store.dispatch("requerimientos/createRequerimiento")

      if (this.$route.params.id) {
        this.$store.dispatch("app/loadingInc")
        getRequerimiento(this.$route.params.id)
          .then(({ data: { data } }) => {
            data.fecha_limite = "2019/05/30"
            data.motivo_limite = "1231564564"
            this.$set(this, "form", new Requerimiento(data))
          })
          .catch(e => {
            console.error(e)
            warn({
              message: "Hubo un problema al solicitar el Requerimiento",
            })
          })
          .finally(() => {
            this.$store.dispatch("app/loadingDec")
          })
      }
    } catch (e) {
      const message =
        e.message ||
        "Hubo un problema al cargar las opciones. Intente nuevamente más tarde"
      warn({ message })
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
      this.form.adjuntos = []
      this.$root.$emit("clearFiles")
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style lang="scss" scoped></style>
