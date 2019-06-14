<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción a ejecutar sobre el requerimiento
    </div>

    <q-select
      v-model="operation"
      filled
      :options="optionsPriorizar"
      emit-value
      map-options
    />

    <div class="q-mt-md">
      <!-- motivo para cuando descarta -->
      <q-slide-transition>
        <div v-show="showComment" class="row">
          <div class="col">
            <q-input
              ref="comment"
              v-model="comment"
              color="accent"
              outlined
              autogrow
              label="Agregar un motivo:"
              :hide-bottom-space="true"
              :rules="[notEmpty]"
            />
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
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      comment: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapState("requerimientos", {
      detalleRequerimientoItem: state => state.detalleRequerimientoItem,
    }),

    ...mapGetters("requerimientosAsignados", ["requerimientoIdToChange"]),
    ...mapGetters("priorizarRequerimientos", [
      "cantidadRequerimientos",
      "reqsPendientesAprobacionLength",
      "reqsAprobadosPriorizadosLength",
      "esAutor",
    ]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    optionsPriorizar() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })

      if (this.statePendiente) {
        opt.push({
          label: "Pasar a Ejecución",
          value: "ejecucion",
          icon: "fas fa-undo",
        })
      }

      if (this.stateEjecucion) {
        opt.push({
          label: "Volver a Pendiente",
          value: "volverPendiente",
          icon: "fas fa-undo",
        })

        opt.push({
          label: "Finalizar",
          value: "finalizar",
        })
      }
      return opt
    },
    statePendiente() {
      return this.detalleRequerimientoState === "ASSI"
    },
    stateEjecucion() {
      return this.detalleRequerimientoState === "EXEC"
    },
    showComment() {
      const res = this.operation === "volverPendiente"
      return res
    },
  },
  methods: {
    saveChanges() {
      // Valido, si esta descartando (operacion: descartar && NO es esAutor), debe completar el comentario
      if (this.operation === "descartar" && !this.$refs.comment.validate()) {
        return
      }

      this.$store
        .dispatch("requerimientosAsignados/processManualChanges", {
          horasEjecucion: 15,
          operation: this.operation,
          priority: this.approvedPriority,
          comment: this.comment,
          listName: this.stateEjecucion
            ? "reqsAsignadosEnEjecucion"
            : "reqsAsignadosPendientes",
        })
        .then(() => {
          let message = ""

          if (this.operation == "finalizar") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } se FINALIZO.`
          } else if (this.operation == "volverPendiente") {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } volvió a PENDIENTE.`
          } else {
            message = `Requerimiento #${
              this.detalleRequerimientoItem.id
            } en EJECUCIÓN.`
          }

          success({ message })
          this.operation = null
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

<style lang="scss" scope>
.slider {
  margin: 0 auto;
  width: 95%;
}
</style>
