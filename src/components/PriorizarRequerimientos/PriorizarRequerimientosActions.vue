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
      @input="operationChange"
    />

    <div class="q-mt-md">
      <!-- seleccion de prioridad y motivo para cuando aprueba o reordena-->
      <q-slide-transition>
        <div v-show="isApprovingOrReordering" class="q-mt-md">
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :offset="[0, 100]"
            content-class="bg-amber text-black text-body2 shadow-4 tooltip-fix"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="ordenTooltip"></div>
          </q-tooltip>
          <div class="row">
            <div class="col">
              <div>Seleccione una Prioridad para este Requerimiento:</div>
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
                @input="updateOrdenTooltip"
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
import { mapGetters, mapState } from "vuex"
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
      ordenTooltip: "",
      // tooltipShowed: false,
    }
  },
  computed: {
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapGetters("priorizarRequerimientos", [
      "cantidadRequerimientos",
      "reqsPendientesAprobacionLength",
      "reqsAprobadosPriorizadosLength",
      "esAutor",
      "requerimientosFiltered",
    ]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
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
        return (
          this.statePending && this.requerimientosFiltered("PEND").length > 1
        )
      } else {
        return (
          this.stateApproved && this.requerimientosFiltered("APRV").length > 1
        )
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
    operationChange() {
      if (
        this.operation === "aprobar" ||
        this.operation === "seleccionarPrioridad"
      ) {
        this.updateOrdenTooltip()
      }
    },
    updateOrdenTooltip() {
      this.reqsPossibleNewOrder = [...this.requerimientosFiltered("APRV")]
      let startIndex = 1
      const realIndex = this.approvedPriority - 1
      let currReq, pre3Req, pre2Req, pre1Req, pos1Req, pos2Req, pos3Req

      // Dependiendo del tipo de operacion, inserto el nuevo
      if (this.operation === "aprobar") {
        // ubico el req a insertar en la posicion this.approvedPriority
        const reqToInsert = this.req
        this.reqsPossibleNewOrder.splice(realIndex, 0, reqToInsert)
      } else if (this.operation === "seleccionarPrioridad") {
        // primero lo saco del array resultado
        const currentIndex = _.findIndex(this.reqsPossibleNewOrder, {
          id: this.req.id,
        })
        const reqToInsert = this.reqsPossibleNewOrder.splice(currentIndex, 1)[0]
        // luego lo ubico en la posicion this.approvedPriority
        this.reqsPossibleNewOrder.splice(realIndex, 0, reqToInsert)
      }
      pre3Req = this.reqsPossibleNewOrder[realIndex - 3]
      pre2Req = this.reqsPossibleNewOrder[realIndex - 2]
      pre1Req = this.reqsPossibleNewOrder[realIndex - 1]
      currReq = this.reqsPossibleNewOrder[realIndex]
      pos1Req = this.reqsPossibleNewOrder[realIndex + 1]
      pos2Req = this.reqsPossibleNewOrder[realIndex + 2]
      pos3Req = this.reqsPossibleNewOrder[realIndex + 3]

      let pre3ReqFragment = "",
        pre2ReqFragment = "",
        pre1ReqFragment = "",
        currReqFragment = "",
        pos1ReqFragment = "",
        pos2ReqFragment = "",
        pos3ReqFragment = ""

      if (pos3Req) {
        startIndex = realIndex + 2
        pos3ReqFragment = `<li>...</li>`
      }
      if (pos2Req) {
        startIndex = realIndex + 1
        pos2ReqFragment = `<li>${pos2Req.asunto}</li>`
      }
      if (pos1Req) {
        startIndex = realIndex
        pos1ReqFragment = `<li>${pos1Req.asunto}</li>`
      }
      if (currReq) {
        startIndex = realIndex
        currReqFragment = `<li><strong>${currReq.asunto}</strong></li>`
      }
      if (pre1Req) {
        startIndex = realIndex - 1
        pre1ReqFragment = `<li>${pre1Req.asunto}</li>`
      }
      if (pre2Req) {
        startIndex = realIndex - 2
        pre2ReqFragment = `<li>${pre2Req.asunto}</li>`
      }
      if (pre3Req) {
        startIndex = realIndex - 3
        pre3ReqFragment = `<li>...</li>`
      }

      this.ordenTooltip = `
      <div class="row items-center tooltip-height-fix">
        <div class="col">
          <ol class="orden-tooltip" start="${startIndex + 1}">
            ${pre3ReqFragment}
            ${pre2ReqFragment}
            ${pre1ReqFragment}
            ${currReqFragment}
            ${pos1ReqFragment}
            ${pos2ReqFragment}
            ${pos3ReqFragment}
          </ol>
        </div>
      </div>`
    },
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
