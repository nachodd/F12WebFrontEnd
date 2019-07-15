<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción a ejecutar sobre el requerimiento
    </div>

    <q-select
      v-model="operation"
      filled
      :options="optionsReqsAsignados"
      emit-value
      map-options
    />

    <div class="q-mt-md">
      <q-slide-transition>
        <div v-show="operation === 'volverPendiente'" class="row">
          <div class="col">
            <q-input
              ref="comment"
              v-model="comment"
              color="deep-purple-10"
              outlined
              autogrow
              label="Agregar un motivo:"
              :hide-bottom-space="true"
              :rules="[notEmpty]"
            />
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation == 'finalizar'">
          <div class="col">
            <q-input
              ref="horasEstimadas"
              v-model.number="horasEstimadas"
              type="number"
              color="deep-purple-10"
              label="Horas Estimadas"
              filled
              outlined
              :rules="[notEmpty]"
            />
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-show="operation == 'testing'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Seleccione un usuario para enviar a Testing:
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <!-- :color="color"
                :dark="dark" -->
              <q-select
                ref="usuarioTesting"
                v-model="usuarioTesting"
                :options="optionsUsersTesting"
                filled
                class="custom-error"
                color="deep-purple-10"
                emit-value
                map-options
                :rules="[notEmpty]"
              />
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                v-model="comment"
                color="deep-purple-10"
                outlined
                autogrow
                label="Agregar un Comentario:"
                :hide-bottom-space="true"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
    </div>

    <div v-show="operation !== null" class="q-mt-md">
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
import formValidation from "@mixins/formValidation"
import { warn, success } from "@utils/helpers"

export default {
  name: "RequerimientosAsignadosActions",
  components: {},
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      comment: null,
      horasEstimadas: null,
      usuarioTesting: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["userParesYReportantes"]),
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
      return opt
    },
    optionsUsersTesting() {
      return [
        {
          label: "Seleccione un usuario...",
          value: null,
        },
        ..._.orderBy(this.userParesYReportantes, "label"),
      ]
    },
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

      this.$store
        .dispatch("requerimientosAsignados/processManualChanges", {
          horasEstimadas: this.horasEstimadas,
          usuarioTesting: _.find(this.optionsUsersTesting, {
            value: this.usuarioTesting,
          }),
          operation: this.operation,
          priority: this.approvedPriority,
          comment: this.comment,
          listName:
            this.detalleRequerimientoState === "EXEC"
              ? "reqsAsignadosEnEjecucion"
              : "reqsAsignadosPendientes",
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

<style lang="scss" scope>
.slider {
  margin: 0 auto;
  width: 95%;
}
</style>
