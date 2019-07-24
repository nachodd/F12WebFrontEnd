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
              Horas Estimadas del Desarrollo:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col">
              <q-input
                ref="horasEstimadas"
                v-model.number="horasEstimadas"
                type="number"
                :color="color"
                :dark="dark"
                label="Horas Estimadas"
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
              <q-select
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
              />
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
              Deje un mensaje de feedback para la persona encargada del
              Desarrollo:
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
    </div>

    <div v-show="operation !== null && !hideSaveButton" class="q-mt-md">
      <q-btn
        class="full-width"
        label="Guardar"
        color="deep-purple-10"
        @click="saveChanges"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import formValidation from "mixins/formValidation"
import { warn, success } from "utils/helpers"

export default {
  name: "RequerimientosAsignadosActions",
  components: {},
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
      default: "purple-10", // accent
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
    }
  },
  computed: {
    ...mapGetters("auth", ["userYoParesYReportantes"]),
    ...mapState("requerimientos", {
      detalleRequerimientoItem: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    optionsReqsAsignados() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })

      if (this.detalleRequerimientoState === "ASSI") {
        opt.push({
          label: "Pasar a Ejecución",
          value: "ejecucion",
        })
      }
      if (this.detalleRequerimientoState === "EXEC") {
        if (this.detalleRequerimientoItem.estado.pausado === false) {
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
        } else {
          opt.push({
            label: "Reanudar ejecución",
            value: "reanudar",
          })
        }
      }
      if (this.detalleRequerimientoState === "TEST") {
        opt.push({
          label: "Devolver a Desarrollo",
          value: "devolverADesarrollo",
        })
        opt.push({
          label: "Finalizar",
          value: "finalizar",
        })
      }
      return opt
    },
    optionsUsersTesting() {
      return [
        {
          label: "Seleccione un usuario...",
          value: null,
        },
        ..._.orderBy(this.userYoParesYReportantes, "label"),
      ]
    },
  },
  mounted() {
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
    saveChanges() {
      // Valido, si esta descartando debe completar el comentario
      if (this.operation === "descartar" && !this.$refs.comment.validate()) {
        return
      }
      // Valido, si esta enviando a testing debe seleccionar un usuario
      if (
        this.operation === "testing" &&
        !this.$refs.usuarioTesting.validate()
      ) {
        return
      }
      // Valido, si esta finalizando debe completar horas de ejecucion
      if (
        this.operation === "finalizar" &&
        !this.$refs.horasEstimadas.validate()
      ) {
        return
      }
      // Valido, si esta en testing debe completar horas de ejecucion
      if (
        this.operation === "devolverADesarrollo" &&
        !this.$refs.commentDevolverADesarrollo.validate()
      ) {
        return
      }

      if (this.operation === "pausar" && !this.$refs.commentPausar.validate()) {
        return
      }

      this.$store
        .dispatch("requerimientosAsignados/processManualChanges", {
          horasEstimadas: this.horasEstimadas,
          usuarioTesting: _.find(this.optionsUsersTesting, {
            value: this.usuarioTesting,
          }),
          operation: this.operation,
          comment: this.comment,
        })
        .then(() => {
          let message = ""

          if (this.operation === "finalizar") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } se FINALIZO.`
          } else if (this.operation === "volverPendiente") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } volvió a PENDIENTE.`
          } else if (this.operation === "testing") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } enviado a TESTING.`
          } else if (this.operation === "ejecucion") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } en EJECUCIÓN.`
          } else if (this.operation === "pausar") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } en PAUSA.`
          } else if (this.operation === "reanudar") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } en REANUDADO.`
          } else if (this.operation === "devolverADesarrollo") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } en DEVUELTO A DESARROLLO.`
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
