<template>
  <div class="q-pa-md">
    <requerimientos-form
      ref="requerimientosForm"
      v-bind.sync="form"
      :lleva-fecha-limite.sync="llevaFechaLimite"
      :lleva-usuario-cadena.sync="llevaUsuarioCadena"
      @submit="handleSubmit"
    />
  </div>
</template>
<script>
import { mapState } from "vuex"
import pageLoading from "mixins/pageLoading"
import RequerimientosForm from "comp/Requerimientos/RequerimientosForm"
import Requerimiento from "models/requerimiento"
import { warn, success, warnDialog } from "utils/helpers"
import Bus from "utils/bus"
import { getRequerimiento } from "api/requerimientos"
import router from "router"

export default {
  components: { RequerimientosForm },
  mixins: [pageLoading],
  data() {
    return {
      form: new Requerimiento(),
      llevaFechaLimite: false,
      llevaUsuarioCadena: false,
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
        return this.isEdit
          ? `Editar Requerimiento #${this.form.id}`
          : "Nuevo Requerimiento"
      }
    },
  },
  watch: {
    "form.procesandoArchivosCargados"(val) {
      this.$store.dispatch("requerimientos/setProcesandoArchivosCargados", val)
    },
  },
  async mounted() {
    try {
      // incremento el loading así esta fijo ANTES de que haga los llamados
      await this.$store.dispatch("app/loadingInc")
      await this.$store.dispatch("requerimientos/createRequerimiento")
      const reqIdToEdit = _.get(this, "$route.query.id", false)
      const isEdit =
        _.get(this, "$route.query.ver", null) === "editarRequerimiento"

      if (isEdit && reqIdToEdit) {
        this.isEdit = true
        getRequerimiento(reqIdToEdit)
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
        e.message ||
        "Hubo un problema al cargar las opciones. Intente nuevamente más tarde"
      warn({ message })
    }
  },
  methods: {
    async handleSubmit() {
      const valid = await this.$refs.requerimientosForm.validate()
      if (!valid) {
        return
      }

      try {
        const form = this.isEdit
          ? await this.form.toUpdatePayload()
          : await this.form.toCreatePayload()

        await this.$store.dispatch("requerimientos/storeRequerimiento", form)
        success({
          message: "La solicitud fue procesada correctamente!",
        })

        Bus.$emit("load-list-requerimientos")
        this.$emit("form-submitted")
      } catch ({ message }) {
        const msg = message || "No se pudo cargar / editar el requerimiento"
        // Si es un error simple (no es de validacion de form con array de errores), muestro el msj nomas
        warn({ message: msg })
      }
    },
    /* clearForm() {
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
      this.$refs.requerimientosForm.resetValidation()
    }, */
  },
}
</script>

<style lang="scss" scoped></style>
