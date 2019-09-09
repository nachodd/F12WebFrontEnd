<template>
  <q-page padding>
    <page-header :title="pageTitle" />
    <requerimiento-form
      ref="form"
      v-bind.sync="form"
      :lleva-fecha-limite.sync="llevaFechaLimite"
      @submit="handleSubmit"
    />
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import pageLoading from "mixins/pageLoading"
import PageHeader from "comp/Common/PageHeader"
import RequerimientoForm from "comp/Requerimientos/RequerimientosForm"
import Requerimiento from "models/requerimiento"
import { warn, success, warnDialog } from "utils/helpers"
import { getRequerimiento } from "api/requerimientos"
import router from "router"

export default {
  components: { PageHeader, RequerimientoForm },
  mixins: [pageLoading],
  data() {
    return {
      form: new Requerimiento(),
      llevaFechaLimite: false,
      isEdit: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
    }),
    pageTitle() {
      if (this.isPageLoading || this.form.procesandoArchivosCargados) {
        return "Cargando, por favor espere..."
      } else {
        return this.isEdit ? `Editar Requerimiento #${this.form.id}` : "Nuevo Requerimiento"
      }
    },
  },
  async mounted() {
    try {
      // incremento el loading así esta fijo ANTES de que haga los llamados
      await this.$store.dispatch("app/loadingInc")
      await this.$store.dispatch("requerimientos/createRequerimiento")

      if (this.$route.params.id) {
        this.isEdit = true
        getRequerimiento(this.$route.params.id)
          .then(({ data: { data } }) => {
            const req = new Requerimiento(data)
            // Mandamos a convertir asincronicamente a base64 los archivos previamente cargados (si es que tiene)
            req.tryConvertDownloadedFiles()
            this.$set(this, "form", req)
          })
          .catch(e => {
            this.isEdit = false
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
        e.message || "Hubo un problema al cargar las opciones. Intente nuevamente más tarde"
      warn({ message })
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const form = this.isEdit
          ? await this.form.toUpdatePayload()
          : await this.form.toCreatePayload()

        await this.$store.dispatch("requerimientos/storeRequerimiento", form)
        success({
          message: "La solicitud fue procesada correctamente!",
        })
        if (this.isEdit) {
          this.$router.push({ name: "mis-requerimientos" })
        } else {
          // this.form = new Requerimiento() // no funciona bien, no limpia los custom components
          this.clearForm()
        }
      } catch ({ message }) {
        // Si es un error simple (no es de validacion de form con array de errores), muestro el msj nomas
        warn({ message })
      }
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
      this.form.tipo = null
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
