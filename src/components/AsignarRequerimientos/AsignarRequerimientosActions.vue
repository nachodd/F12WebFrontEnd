<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción:
    </div>

    <q-select
      v-model="operation"
      :color="color"
      filled
      :options="optionsAsignar"
      emit-value
      map-options
      :dark="dark"
    />

    <div class="q-mt-md">
      <q-slide-transition>
        <div v-show="operation === 'asignar'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Seleccione un usuario para asignar este Requerimiento:
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12">
              <q-select
                ref="usuarioAsignado"
                v-model="usuarioAsignado"
                :color="color"
                :dark="dark"
                filled
                :options="optionsUsersReportantes"
                emit-value
                map-options
                :rules="[notEmpty]"
              />
            </div>
          </div>

          <div class="row q-mt-xs q-col-gutter-sm">
            <div class="col-6">
              <input-date-custom
                ref="fechaFinalizacion"
                v-model="fechaFinalizacion"
                label="Fecha Finalización"
                past-disabled
                :apply-validation="true"
                :dark="dark"
                :outlined="false"
                :filled="true"
                :color="color"
              />
            </div>
            <div class="col-6">
              <q-input
                ref="horasEstimadas"
                v-model.number="horasEstimadas"
                type="number"
                :color="color"
                label="Horas Estimadas"
                filled
                :dark="dark"
                :rules="[notEmpty]"
              />
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="comment"
                v-model="comment"
                :color="color"
                :dark="dark"
                outlined
                autogrow
                label="Agregar un comentario:"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div
          v-show="
            operation === 'desasignar' ||
              operation === 'descartar' ||
              operation === 'aProcesos'
          "
        >
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="commentDesasignarDescartar"
                v-model="comment"
                color="accent"
                :dark="dark"
                outlined
                autogrow
                :rules="shouldValidateComment"
                label="Agregar un comentario:"
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
import formValidation from "@mixins/formValidation"
import { warn, success } from "@utils/helpers"
import InputDateCustom from "@comp/Common/InputDateCustom"

export default {
  name: "AsignarRequerimientosActions",
  components: {
    InputDateCustom,
  },
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
  },
  data() {
    return {
      operation: null,
      usuarioAsignado: null,
      fechaFinalizacion: null,
      horasEstimadas: null,
      comment: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["userReportantes"]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    stateNotAssigned() {
      return this.detalleRequerimientoState === "NOAS"
    },
    stateAssigned() {
      return this.detalleRequerimientoState === "ASSI"
    },
    stateInExcecution() {
      return this.detalleRequerimientoState === "EXEC"
    },
    stateSentToProcess() {
      return this.detalleRequerimientoState === "STPR"
    },
    optionsAsignar() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })
      if (this.stateNotAssigned) {
        opt.push({
          label: "Asignar",
          value: "asignar",
        })
        opt.push({
          label: "Enviar a Procesos",
          value: "aProcesos",
        })
      }
      if (this.stateAssigned) {
        opt.push({
          label: "Volver a Pendiente de Asignación",
          value: "desasignar",
        })
      }
      opt.push({
        label: "Descartar",
        value: "descartar",
      })
      return opt
    },
    optionsUsersReportantes() {
      return [
        {
          label: "Seleccione un usuario...",
          value: null,
        },
        ..._.orderBy(this.userReportantes, "label"),
      ]
    },
    shouldValidateComment() {
      return this.operation === "descartar" ? [this.notEmpty] : null
    },
  },
  methods: {
    async saveChanges() {
      // Si es descartar, debo incluir un comentario
      if (
        this.operation === "descartar" &&
        !this.$refs.commentDesasignarDescartar.validate()
      ) {
        return
      }

      // Si es asignar, debo elegir un usuario
      if (this.operation === "asignar") {
        const validations = [
          !this.$refs.usuarioAsignado.validate(),
          !this.$refs.fechaFinalizacion.validate(),
          !this.$refs.horasEstimadas.validate(),
        ]
        if (_.some(validations)) {
          return
        }
      }

      this.$store
        .dispatch("asignacionRequerimientos/updateRequerimientoState", {
          requerimientoId: this.req.id,
          operation: this.operation,
          usuarioAsignado: _.find(this.optionsUsersReportantes, {
            value: this.usuarioAsignado,
          }),
          fechaFinalizacion: this.fechaFinalizacion,
          horasEstimadas: this.horasEstimadas,
          comentario: this.comment,
        })
        .then(message => {
          if (message) success({ message })
          this.operation = null
          this.usuarioAsignado = null
          this.fechaFinalizacion = null
          this.horasEstimadas = null
          this.comment = null
          this.$emit("closeDialog")
        })
        .catch(e => {
          warn({ message: e.message })
        })
    },
  },
}
</script>
