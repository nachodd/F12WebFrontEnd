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
      :disable="operationDisabled"
      :class="{ 'cursor-not-allowed': operationDisabled }"
      @input="operationChange"
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
                class="custom-error"
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
                class="custom-error"
                min="1"
                type="number"
                :color="color"
                label="Horas Estimadas"
                filled
                :dark="dark"
                :rules="[numberPositive, notEmpty]"
              />
            </div>
          </div>
          <div v-if="!hideOrderAsignacion" class="row q-mt-xs">
            <div
              v-if="requerimientosFilteredLength > 0"
              id="ordenContainer"
              class="col-12"
            >
              <q-tooltip
                anchor="top middle"
                self="center middle"
                :offset="[0, 100]"
                content-class="bg-amber text-black text-body2 shadow-4 tooltip-fix"
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="ordenTooltip"></div>
              </q-tooltip>
              <div class="row q-mt-xs q-mb-md">
                <div class="col-12 text-grey-7">
                  Orden
                </div>
              </div>
              <q-slider
                v-model="asignarcionOrden"
                class="slider"
                markers
                :min="1"
                :max="ordenMaxLength"
                label
                label-always
                color="accent"
                @input="updateOrdenTooltip"
                @change="sliderChange"
              />
            </div>
            <div v-else class="col-12">
              Orden:
              <strong>Último</strong>
            </div>
          </div>
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="comment"
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
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
              operation === 'aProcesos' ||
              operation === 'aPriorizar'
          "
        >
          <div class="row q-mt-xs">
            <div class="col-12">
              <q-input
                ref="commentDesasignarDescartar"
                v-model="comment"
                :color="color"
                :dark="dark"
                filled
                autogrow
                :rules="shouldValidateComment"
                label="Agregar un comentario:"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div v-if="operation === 'reordenar'">
          <div class="row q-mt-xs">
            <div
              v-if="requerimientosFilteredLength > 1"
              id="ordenContainer"
              class="col-12"
            >
              <div class="row q-mt-xs q-mb-md">
                <div class="col-12 text-grey-7">
                  Orden
                </div>
              </div>
              <q-slider
                v-model="asignarcionOrden"
                class="slider"
                markers
                :min="1"
                :max="ordenMaxLength"
                label
                label-always
                color="accent"
                @input="updateOrdenTooltip"
              />
            </div>
            <div v-else class="col-12">
              Orden:
              <strong>Último</strong>
            </div>
          </div>
          <q-tooltip
            anchor="top middle"
            self="center middle"
            :offset="[0, 100]"
            content-class="bg-amber text-black text-body2 shadow-4 tooltip-fix"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="ordenTooltip"></div>
          </q-tooltip>
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
import InputDateCustom from "comp/Common/InputDateCustom"

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
    hideOrderAsignacion: {
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
      usuarioAsignado: null,
      fechaFinalizacion: null,
      horasEstimadas: null,
      comment: null,
      operationDisabled: false,
      asignarcionOrden: 1,
      ordenTooltip: "",
      reqsPossibleNewOrder: [],
      // tooltipShowed: false,
    }
  },
  computed: {
    ...mapGetters("auth", [
      "userYoYReportantes",
      "userEsResponsableDeProcesos",
    ]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("asignacionRequerimientos", [
      "requerimientosFiltered",
      "requerimientosFilteredLength",
      1,
    ]),
    esArregloRapido() {
      return this.req.tipo.id === 1
    },
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
        if (this.esArregloRapido) {
          opt.push({
            label: "No es un Arreglo Rapido (Enviar a Priorizar)",
            value: "aPriorizar",
          })
        }
        // Se podrá enviar a procesos si: no fue enviado Y el usuario logueado no es de procesos
        if (
          !this.req.fueEnviadoAProcesos &&
          !this.userEsResponsableDeProcesos
        ) {
          opt.push({
            label: "Enviar a Procesos",
            value: "aProcesos",
          })
        }
      }
      if (this.stateAssigned) {
        opt.push({
          label: "Volver a Pendiente de Asignación",
          value: "desasignar",
        })
        opt.push({
          label: "Reordenar",
          value: "reordenar",
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
        ..._.orderBy(this.userYoYReportantes, "label"),
      ]
    },
    shouldValidateComment() {
      return this.operation === "descartar" ? [this.notEmpty] : null
    },
    ordenMaxLength() {
      return this.operation === "asignar"
        ? this.requerimientosFilteredLength + 1
        : this.requerimientosFilteredLength
    },
  },
  mounted() {
    // Si se le setea el operationType por prop, asigno el valor correspondiente al combo
    this.operationDisabled = true
    if (this.operationType === "assign") {
      this.operation = "asignar"
    } else if (this.operationType === "pending") {
      this.operation = "desasignar"
    } else {
      this.operationDisabled = false
    }
  },
  methods: {
    operationChange() {
      if (this.operation === "asignar" || this.operation === "reordenar") {
        this.updateOrdenTooltip()
      }
    },
    updateOrdenTooltip() {
      this.reqsPossibleNewOrder = [...this.requerimientosFiltered("ASSI")]
      let startIndex = 1
      const realIndex = this.asignarcionOrden - 1
      let currReq, pre3Req, pre2Req, pre1Req, pos1Req, pos2Req, pos3Req

      // Dependiendo del tipo de operacion, inserto el nuevo
      if (this.operation === "asignar") {
        // ubico el req a insertar en la posicion this.asignarcionOrden
        const reqToInsert = this.req
        this.reqsPossibleNewOrder.splice(realIndex, 0, reqToInsert)
      } else if (this.operation === "reordenar") {
        // primero lo saco del array resultado
        const currentIndex = _.findIndex(this.reqsPossibleNewOrder, {
          id: this.req.id,
        })
        const reqToInsert = this.reqsPossibleNewOrder.splice(currentIndex, 1)[0]
        // luego lo ubico en la posicion this.asignarcionOrden
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
    sliderChange() {
      // this.tooltipShowed = false
    },
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

      // Si el slider esta mostrado, envio el listado de requerimientos "ordenado" asi actualiza el state.possibleChanges.target y de esta manera, calcula el nuevo orden y el ultimo
      if (!this.hideOrderAsignacion) {
        await this.$store.dispatch(
          "asignacionRequerimientos/updateTargetList",
          {
            targetList: this.reqsPossibleNewOrder,
            reqIdToUpdate: this.req.id,
          },
        )
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
          if (message) {
            success({ message })
          } else {
            // TODO: implementar el resto de los mensajes de success aca en el front
            let msg = ""
            switch (this.operation) {
              case "aProcesos":
                msg = `Requerimiento #${this.req.id} enviado A PROCESOS`
                break
            }
            if (msg) success({ message: msg })
          }
          this.operation = null
          this.usuarioAsignado = null
          this.fechaFinalizacion = null
          this.horasEstimadas = null
          this.comment = null
          this.$emit("closeDialog") // close details dialog
          // close confirm op. dialog
          this.$store.dispatch(
            "asignacionRequerimientos/setDialogConfirmOperationOpen",
            false,
          )
        })
        .catch(e => {
          warn({ message: e.message })
        })
    },
  },
}
</script>
<style lang="stylus">
.custom-error.q-field--dark.q-field--error .q-field__bottom
  color $red-5

.custom-error.q-field--dark.q-field--error .text-negative
  color $red-5 !important

.orden-tooltip
  padding 5px 5px 5px 16px

.tooltip-fix
  height 185px !important
  min-height 184px !important
  min-width 270px
  overflow hidden
.tooltip-fix > div
  height 163px
.tooltip-height-fix
  height 163px
</style>
