<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción:
    </div>

    <q-select
      v-model="operation"
      color="purple-10"
      filled
      :options="optionsAsignar"
      emit-value
      map-options
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
                color="purple-10"
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
              />
            </div>
            <div class="col-6">
              <q-input
                v-model.number="horasEstimadas"
                type="number"
                label="Horas Estimadas"
                filled
                outlined
                :rules="[notEmpty]"
              />
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="comment"
                v-model="comment"
                color="accent"
                outlined
                autogrow
                label="Agregar un comentario:"
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
import { mapGetters } from "vuex"
import formValidation from "@mixins/formValidation"
import { warn, success } from "@utils/helpers"
import InputDateCustom from "@comp/Common/InputDateCustom"

export default {
  name: "AsignarRequerimientosActions",
  components: {
    InputDateCustom,
  },
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      comment: null,
      usuarioAsignado: null,
      fechaFinalizacion: null,
      horasEstimadas: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["userReportantes"]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    stateNotAssigned() {
      return this.detalleRequerimientoState === "NOAS"
    },
    stateAssigned() {
      return this.detalleRequerimientoState === "ASSI"
    },
    stateInExcecution() {
      return this.detalleRequerimientoState === "EXEC"
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
        opt.push({
          label: "Descartar",
          value: "descartar",
        })
      }
      if (this.stateAssigned) {
        opt.push({
          label: "Volver a Pendiente de Asignación",
          value: "asignar",
        })
      }
      return opt
    },
    optionsUsersReportantes() {
      return [
        {
          label: "Seleccione un usuario...",
          value: null,
        },
        ...this.userReportantes,
      ]
    },
  },
  methods: {
    saveChanges() {
      // Si es descartar, debo incluir un comentario
      if (this.operation === "descartar" && !this.$refs.comment.validate()) {
        return
      }

      // Si es asignar, debo elegir un usuario
      if (
        this.operation === "asignar" &&
        !this.$refs.usuarioAsignado.validate()
      ) {
        return
      }

      this.$store
        .dispatch("asignarRequerimientos/updateRequerimientoState", {
          operation: this.operation,
          comment: this.comment,
        })
        .then(message => {
          if (message) success({ message })
          this.operation = null
          this.usuarioAsignado = null
          this.comment = null
          this.$emit("closeDialog")
        })
        .catch(message => {
          warn({ message })
        })
    },
  },
}
</script>
