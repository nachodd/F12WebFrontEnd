<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción:
    </div>

    <q-select
      v-model="operation"
      :color="color"
      filled
      :options="optionsReqsAsignados"
      emit-value
      map-options
      :dark="dark"
      :disable="operationDisabled"
      :class="{ 'cursor-not-allowed': operationDisabled }"
      @input="operationChange"
    />

    <div class="q-mt-md">
      <q-slide-transition>
        <div v-show="operation === 'volverPendiente'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Comentarios:
            </div>
          </div>
          <div class="row  q-mt-xs">
            <div class="col">
              <q-input
                ref="comment"
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un motivo:"
                :hide-bottom-space="true"
                :rules="[notEmpty]"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation === 'finalizar'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Horas que llevó este Desarrollo:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col">
              <q-input
                ref="horasEstimadas"
                v-model.number="horasEstimadas"
                min="0.5"
                step="0.5"
                type="number"
                :color="color"
                :dark="dark"
                label="Horas"
                filled
                :rules="[notEmpty]"
              />
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Comentarios:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation === 'testing'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Seleccione un usuario para enviar a Testing:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <select-custom
                ref="usuarioTesting"
                v-model="usuarioTesting"
                label="Usuario Testing"
                :color="color"
                :dark="dark"
                filled
                class="custom-error"
                :options="optionsUsersTesting"
                emit-value
                map-options
                id-key="value"
                description-key="label"
                :apply-validation="true"
                :loading="optionsUsersTesting.length === 0"
              />

              <!-- <q-select
                ref="usuarioTesting"
                v-model="usuarioTesting"
                :options="optionsUsersTesting"
                filled
                class="custom-error"
                :color="color"
                :dark="dark"
                emit-value
                map-options
                :rules="[notEmpty]"
              /> -->
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Deje un mensaje para la persona encargada del Testing:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation == 'devolverADesarrollo'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Deje un mensaje de feedback para la persona encargada del Desarrollo:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="commentDevolverADesarrollo"
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
                :rules="[notEmpty]"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation == 'pausar'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Comentarios:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="commentPausar"
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
                :rules="[notEmpty]"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>

      <q-slide-transition>
        <div v-show="operation === 'finalizarYEnviar'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Sistema a Enviar:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col">
              <select-custom
                ref="sistema"
                v-model="sistema"
                :options="sistemas"
                label="Sistema"
                filled
                :color="color"
                :dark="dark"
                :loading="sistemas.length === 0"
                :apply-validation="true"
              />
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Horas que llevó este Desarrollo:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col">
              <q-input
                ref="horasEstimadas"
                v-model.number="horasEstimadas"
                min="0.5"
                step="0.5"
                type="number"
                :color="color"
                :dark="dark"
                label="Horas"
                filled
                :rules="[notEmpty]"
                :hide-bottom-space="true"
              />
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Comentarios:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
    </div>

    <!-- <div v-show="operation !== null && !hideSaveButton" class="q-mt-md">
      <q-btn class="full-width" label="Guardar" color="deep-purple-10" @click="saveChanges" />
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import formValidation from "mixins/formValidation"
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { warn, success } from "utils/helpers"

export default {
  name: "RequerimientosAsignadosActions",
  components: { SelectCustom },
  mixins: [formValidation],
  props: {
    dark: {
      type: Boolean,
      default: false,
    },
    hideSaveButton: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "deep-purple-10", // accent
    },
    operationType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      operation: null,
      comment: null,
      operationDisabled: false,
      horasEstimadas: null,
      usuarioTesting: null,
      sistema: null,
    }
  },
  computed: {
    ...mapGetters({
      optionsUsersTesting: "auth/userYoYVinculacionDirecta",
      esDeProcesos: "auth/esDeProcesos",
    }),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
      sistemas: state => state.options.sistemas,
    }),
    optionsReqsAsignados() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })

      if (this.req.tieneEstado("ASSI")) {
        opt.push({
          label: "Pasar a Ejecución",
          value: "ejecucion",
        })
      }
      if (this.req.tieneEstado("EXEC")) {
        if (this.req.estado.pausado === false) {
          opt.push({
            label: "Volver a Pendiente",
            value: "volverPendiente",
          })
          opt.push({
            label: "Enviar a Testing",
            value: "testing",
          })
          opt.push({
            label: "Pausar ejecución",
            value: "pausar",
          })
          opt.push({
            label: "Finalizar",
            value: "finalizar",
          })

          if (this.esDeProcesos) {
            opt.push({
              label: "Finalizar y Enviar a...",
              value: "finalizarYEnviar",
            })
          }
        } else {
          opt.push({
            label: "Reanudar ejecución",
            value: "reanudar",
          })
        }
      }
      if (this.req.tieneEstado("TEST")) {
        opt.push({
          label: "Devolver a Desarrollo",
          value: "devolverADesarrollo",
        })
        opt.push({
          label: "Finalizar",
          value: "finalizar",
        })
        if (this.esDeProcesos) {
          opt.push({
            label: "Finalizar y Enviar a...",
            value: "finalizarYEnviar",
          })
        }
      }
      return opt
    },
  },
  mounted() {
    // Para cargar los sistemas
    if (this.esDeProcesos) {
      this.$store.dispatch("requerimientos/createRequerimiento")
    }
    // Si se le setea el operationType por prop, asigno el valor correspondiente al combo
    this.operationDisabled = true
    if (this.operationType === "execute") {
      this.operation = "ejecucion"
    } else if (this.operationType === "pending") {
      this.operation = "volverPendiente"
    } else if (this.operationType === "test") {
      this.operation = "testing"
    } else {
      this.operationDisabled = false
    }
  },
  methods: {
    operationChange() {
      if (this.operation !== null) {
        this.$emit("showSaveRequerimientoAction", true)
      } else {
        this.$emit("showSaveRequerimientoAction", false)
      }
    },
    saveChanges() {
      // Valido, si esta descartando debe completar el comentario
      if (this.operation === "descartar" && !this.$refs.comment.validate()) {
        return Promise.reject()
      }
      // Valido, si esta enviando a testing debe seleccionar un usuario
      if (this.operation === "testing" && !this.$refs.usuarioTesting.validate()) {
        return Promise.reject()
      }
      // Valido, si esta finalizando debe completar horas de ejecucion
      if (this.operation === "finalizar" && !this.$refs.horasEstimadas.validate()) {
        return Promise.reject()
      }
      // Valido, si esta en testing debe completar horas de ejecucion
      if (
        this.operation === "devolverADesarrollo" &&
        !this.$refs.commentDevolverADesarrollo.validate()
      ) {
        return Promise.reject()
      }

      if (this.operation === "pausar" && !this.$refs.commentPausar.validate()) {
        return Promise.reject()
      }

      // Valido, si esta finalizando debe completar horas de ejecucion
      if (
        this.operation === "finalizarYEnviar" &&
        !this.$refs.horasEstimadas.validate() &&
        !this.$refs.sistema.validate()
      ) {
        return Promise.reject()
      }

      return this.$store
        .dispatch("requerimientosAsignados/processManualChanges", {
          horasEstimadas: this.horasEstimadas,
          usuarioTesting: _.find(this.optionsUsersTesting, {
            value: this.usuarioTesting,
          }),
          operation: this.operation,
          comment: this.comment,
          sistemaId: _.get(this, "sistema.id", null),
        })
        .then(() => {
          let message = ""

          if (this.operation === "finalizar") {
            message = `Requerimiento #${this.req.id} se FINALIZO.`
          } else if (this.operation === "volverPendiente") {
            message = `Requerimiento #${this.req.id} volvió a PENDIENTE.`
          } else if (this.operation === "testing") {
            message = `Requerimiento #${this.req.id} enviado a TESTING.`
          } else if (this.operation === "ejecucion") {
            message = `Requerimiento #${this.req.id} en EJECUCIÓN.`
          } else if (this.operation === "pausar") {
            message = `Requerimiento #${this.req.id} en PAUSA.`
          } else if (this.operation === "reanudar") {
            message = `Requerimiento #${this.req.id} en REANUDADO.`
          } else if (this.operation === "devolverADesarrollo") {
            message = `Requerimiento #${this.req.id} en DEVUELTO A DESARROLLO.`
          } else if (this.operation === "finalizarYEnviar") {
            message = `Requerimiento #${
              this.req.id
            } fue ENVIADO A ${this.sistema.descripcion.toUpperCase()}.`
          }

          success({ message })
          this.operation = null
          this.comment = null
          this.horasEstimadas = null

          this.$emit("closeDialog")
        })
        .catch(message => {
          warn({ message })
        })
    },
  },
}
</script>

<style lang="stylus" scoped></style>
