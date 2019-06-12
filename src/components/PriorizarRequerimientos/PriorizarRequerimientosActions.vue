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
      <!-- seleccion de prioridad y motivo para cuando aprueba o reordena-->
      <q-slide-transition>
        <div v-show="isApprovingOrReordering" class="q-mt-md">
          <div class="row">
            <div class="col">
              <div>
                Seleccione una Prioridad para este Requerimiento:
              </div>
              <br />
              <q-slider
                v-model="approvedPriority"
                class="slider"
                markers
                :min="1"
                :max="maximoSliderPrioridad"
                label
                label-always
                color="accent"
              />
            </div>
          </div>
          <div v-if="operation === 'aprobar'" class="row">
            <div class="col">
              <q-input
                v-model="comment"
                color="accent"
                outlined
                autogrow
                label="Si desea, puede agregar un comentario: "
                :hide-bottom-space="true"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>

      <!-- motivo para cuando descarta -->
      <q-slide-transition>
        <div v-show="showDescartarComment" class="row">
          <div class="col">
            <q-input
              ref="commentDescartar"
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
import { mapGetters } from "vuex"
import formValidation from "@mixins/formValidation"
import { warn, success } from "@utils/helpers"

export default {
  name: "PriorizarRequerimientosActions",
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      approvedPriority: 1,
      comment: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
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
      if (this.esElUltimoDeLaCadenaDeMando) {
        if (this.seleccionarPrioridadShown) {
          opt.push({
            label: "Seleccionar Prioridad",
            value: "seleccionarPrioridad",
          })
        }
        opt.push({
          label: "Descartar",
          value: "descartar",
        })
        return opt
      }

      if (this.statePending && !this.esElUltimoDeLaCadenaDeMando) {
        opt.push({
          label: "Aprobar",
          value: "aprobar",
        })
      }
      if (this.stateApproved) {
        if (this.seleccionarPrioridadShown) {
          opt.push({
            label: "Seleccionar Prioridad",
            value: "seleccionarPrioridad",
          })
        }
        opt.push({
          label: "Volver a Pendiente de Aprobacion",
          value: "pendiente",
          icon: "fas fa-undo",
        })
      }
      opt.push({
        label: "Descartar",
        value: "descartar",
      })

      return opt
    },
    statePending() {
      return this.detalleRequerimientoState === "PEND"
    },
    stateApproved() {
      return this.detalleRequerimientoState === "APRV"
    },
    isApprovingOrReordering() {
      return (
        this.operation === "aprobar" ||
        this.operation === "seleccionarPrioridad"
      )
    },
    seleccionarPrioridadShown() {
      if (this.esElUltimoDeLaCadenaDeMando) {
        return this.statePending && this.reqsPendientesAprobacionLength > 1
      } else {
        return this.stateApproved && this.reqsAprobadosPriorizadosLength > 1
      }
    },
    maximoSliderPrioridad() {
      // Si la operacion es de seleccionar prioridad, el max del slider será 1 menos que la cant de reqs
      return this.operation === "seleccionarPrioridad"
        ? this.cantidadRequerimientos - 1
        : this.cantidadRequerimientos
    },
    showDescartarComment() {
      const res = this.operation === "descartar" && !this.esAutor
      return res
    },
  },
  methods: {
    saveChanges() {
      // Valido, si esta descartando (operacion: descartar && NO es esAutor), debe completar el comentario
      if (
        this.operation === "descartar" &&
        !this.esAutor &&
        !this.$refs.commentDescartar.validate()
      ) {
        return
      }

      this.$store
        .dispatch("priorizarRequerimientos/processManualChanges", {
          operation: this.operation,
          priority: this.approvedPriority,
          comment: this.comment,
          listName: this.statePending ? "source" : "target",
        })
        .then(message => {
          if (message) success({ message })
          this.operation = null
          this.approvedPriority = 1
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
