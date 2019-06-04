<template>
  <q-page padding>
    <page-header title="Nuevo Requerimiento" />
    <requerimiento-form
      ref="form"
      v-bind.sync="form"
      :lleva-fecha-limite.sync="llevaFechaLimite"
      @submit="handleSubmit"
    />
  </q-page>
</template>
<script>
import pageLoading from "@mixins/pageLoading"
import PageHeader from "@comp/Common/PageHeader"
import RequerimientoForm from "@comp/Requerimientos/RequerimientosForm"
import Requerimiento from "@models/Requerimiento"
import { warn, success, warnDialog } from "@utils/helpers"
import { getRequerimiento } from "@api/requerimientos"
import router from "@router"

export default {
  components: { PageHeader, RequerimientoForm },
  mixins: [pageLoading],
  data() {
    return {
      form: new Requerimiento(),
      llevaFechaLimite: false,
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id
    },
  },
  async created() {
    try {
      // incremento el loading así esta fijo ANTES de que haga los llamados
      await this.$store.dispatch("app/loadingInc")
      await this.$store.dispatch("requerimientos/createRequerimiento")

      if (this.$route.params.id) {
        getRequerimiento(this.$route.params.id)
          .then(({ data: { data } }) => {
            this.$set(this, "form", new Requerimiento(data))
          })
          .catch(e => {
            if (e.status === 404) {
              warnDialog({
                message: "El requerimiento solicitado no existe",
              }).then(() => {
                router.replace({ name: "nuevo-requerimiento" })
              })
            } else {
              warn({
                message: "Hubo un problema al solicitar el Requerimiento",
              })
            }
          })
          .finally(async () => {
            this.$store.dispatch("app/loadingReset")
          })
      } else {
        this.$store.dispatch("app/loadingDec")
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
      this.form.importante = false
      this.form.adjuntos = []
      this.$root.$emit("clearFiles")
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style lang="scss" scoped></style>
