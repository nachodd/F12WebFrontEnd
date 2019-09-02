<template>
  <div class="q-mb-md">
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
        <div v-show="operation === 'asignar' || operation === 'reasignar'">
          <div class="row q-mt-xs">
            <div class="col-12 text-grey-7">
              Seleccione un usuario para asignar este Requerimiento:
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col-12">
              <select-custom
                ref="usuarioAsignado"
                v-model="usuarioAsignado"
                label="Usuario Asignado"
                :color="color"
                :dark="dark"
                filled
                class="custom-error"
                :options="optionsUsersReportantesFiltrados"
                emit-value
                map-options
                id-key="value"
                description-key="label"
                :apply-validation="true"
                :loading="optionsUsersReportantesFiltrados.length === 0"
                @input="usuarioAsignadoChange"
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
                min="0.5"
                step="0.5"
                type="number"
                :color="color"
                label="Horas Estimadas"
                filled
                :dark="dark"
                :rules="[notEmpty]"
              />
            </div>
          </div>
          <div v-if="!hideOrderAsignacion" class="row q-mt-xs">
            <div v-if="ordenMaxLength > 1" id="ordenContainer" class="col-12">
              <tooltip
                v-if="usuarioAsignado !== null"
                anchor="top middle"
                self="center middle"
                :offset="[0, 100]"
                content-class="bg-amber text-black text-body2 shadow-4 tooltip-fix"
              >
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-html="ordenTooltip"></div>
              </tooltip>
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
                :disable="usuarioAsignado === null"
                @input="updateOrdenTooltip"
              />
            </div>
            <!-- <div v-else class="col-12">
              Orden:
              <strong>Último</strong>
            </div> -->
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
              operation === 'aPriorizar' ||
              operation === 'preaprobar'
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
            <div v-if="ordenMaxLength > 1" id="ordenContainer" class="col-12">
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
          <tooltip
            anchor="top middle"
            self="center middle"
            :offset="[0, 100]"
            content-class="bg-amber text-black text-body2 shadow-4 tooltip-fix"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="ordenTooltip"></div>
          </tooltip>
        </div>
      </q-slide-transition>
    </div>
    <!-- <div v-show="operation !== null && !hideSaveButton" class="q-mt-md">
      <q-btn
        class="full-width"
        label="Guardar"
        color="deep-purple-10"
        @click="saveChanges"
      />
    </div> -->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import formValidation from "mixins/formValidation"
import { warn, success } from "utils/helpers"
import InputDateCustom from "comp/Common/InputDateCustom"
import SelectCustom from "comp/Requerimientos/SelectCustom"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "AsignarRequerimientosActions",
  components: {
    InputDateCustom,
    Tooltip,
    SelectCustom,
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
      usuarioAsignado: null,
      fechaFinalizacion: null,
      horasEstimadas: null,
      comment: null,
      operationDisabled: false,
      asignarcionOrden: 1,
      ordenTooltip: "",
      reqsPossibleNewOrder: [],
      ordenMaxLength: 1,
      // tooltipShowed: false,
    }
  },
  computed: {
    ...mapGetters({
      optionsUsersReportantes: "auth/userYoYReportantes",
      userEsResponsableDeProcesos: "auth/userEsResponsableDeProcesos",
    }),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("asignacionRequerimientos", [
      "requerimientosFiltered",
      // "requerimientosFilteredLength",
    ]),
    stateNotAssigned() {
      return this.req.tieneEstado("NOAS")
    },
    stateAssigned() {
      return this.req.tieneEstado("ASSI")
    },
    stateInExcecution() {
      return this.req.tieneEstado("EXEC")
    },
    stateSentToProcess() {
      return this.req.tieneEstado("STPR")
    },
    optionsAsignar() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })
      if (this.stateNotAssigned) {
        const labelPreAprobado = this.req.preAprobado ? "Quitar 'Pre-Aprobación'" : "Pre-Aprobar"
        opt.push({
          label: labelPreAprobado,
          value: "preaprobar",
        })
        opt.push({
          label: "Asignar",
          value: "asignar",
        })
        if (this.req.esArregloRapido) {
          opt.push({
            label: "No es un Arreglo Rapido (Enviar a Priorizar)",
            value: "aPriorizar",
          })
        }
        // Se podrá enviar a procesos si: no fue enviado Y el usuario logueado no es de procesos
        if (!this.userEsResponsableDeProcesos) {
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
          label: "Reasignar",
          value: "reasignar",
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
    shouldValidateComment() {
      return this.operation === "descartar" ? [this.notEmpty] : null
    },
    optionsUsersReportantesFiltrados() {
      if (this.operation === "reasignar") {
        return this.optionsUsersReportantes.filter(ur => {
          return ur.value !== this.req.usuarioAsignadoId
        })
      }
      return this.optionsUsersReportantes
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
      if (this.operation !== null) {
        this.$emit("showSaveRequerimientoAction", true)
      } else {
        this.$emit("showSaveRequerimientoAction", false)
      }
      // Reseteamos el usuario asignado (y la validacion, porque al setearla en null salta) y el orden
      this.usuarioAsignado = null
      this.$refs.usuarioAsignado.resetValidation()
      this.asignarcionOrden = 1

      if (["asignar", "reasignar", "reordenar"].includes(this.operation)) {
        this.updateOrdenTooltip()
        this.updateOrderMax()
      }
    },
    usuarioAsignadoChange() {
      this.asignarcionOrden = 1
      this.updateOrdenTooltip()
      this.updateOrderMax()
    },
    updateReqsPossibleNewOrder() {
      // Si hay un usuario asignado, el slider de orden lo debemos calcular filtrado para ese usuario
      if (this.usuarioAsignado !== null) {
        const userObj = _.find(this.optionsUsersReportantes, {
          value: this.usuarioAsignado,
        })
        const overrideFilters = {
          usuariosAsignados: [userObj],
        }
        this.reqsPossibleNewOrder = [...this.requerimientosFiltered("ASSI", overrideFilters)]
      } else {
        this.reqsPossibleNewOrder = [...this.requerimientosFiltered("ASSI")]
      }
    },
    // ubico el req a insertar en la posicion this.asignarcionOrden (menos 1)
    insertCurrentReqIntoPosition(realIndex) {
      const reqToInsert = this.req
      this.reqsPossibleNewOrder.splice(realIndex, 0, reqToInsert)
    },
    // Primero saco el req del listado de reqs, de donde esté y luego inserto en la posicion this.asignarcionOrden (menos 1)
    removeAndInsertCurrentReqIntoPosition(realIndex) {
      const currentIndex = _.findIndex(this.reqsPossibleNewOrder, {
        id: this.req.id,
      })
      const reqToInsert = this.reqsPossibleNewOrder.splice(currentIndex, 1)[0]
      this.reqsPossibleNewOrder.splice(realIndex, 0, reqToInsert)
    },
    updateOrdenTooltip() {
      this.updateReqsPossibleNewOrder()

      let startIndex = 1
      const realIndex = this.asignarcionOrden - 1
      let currReq, pre3Req, pre2Req, pre1Req, pos1Req, pos2Req, pos3Req

      // Dependiendo del tipo de operacion, inserto el nuevo
      if (this.operation === "asignar") {
        this.insertCurrentReqIntoPosition(realIndex)
      } else if (this.operation === "reordenar") {
        this.removeAndInsertCurrentReqIntoPosition(realIndex)
      } else if (this.operation === "reasignar") {
        if (this.usuarioAsignado === null) {
          this.removeAndInsertCurrentReqIntoPosition(realIndex)
        } else {
          this.insertCurrentReqIntoPosition(realIndex)
        }
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
    updateOrderMax() {
      if (["asignar", "reordenar", "reasignar"].includes(this.operation)) {
        // el ordenMaxLength lo tomo del reqsPossibleNewOrder (que tiene el posible usuarioAsignado filtrado)
        this.ordenMaxLength = this.reqsPossibleNewOrder.length
      }
    },
    async saveChanges() {
      // Si es descartar, debo incluir un comentario
      if (this.operation === "descartar" && !this.$refs.commentDesasignarDescartar.validate()) {
        return Promise.reject()
      }

      // Si es asignar, debo elegir un usuario
      if (this.operation === "asignar" || this.operation === "reasignar") {
        const validations = [
          !this.$refs.usuarioAsignado.validate(),
          !this.$refs.fechaFinalizacion.validate(),
          !this.$refs.horasEstimadas.validate(),
        ]
        if (_.some(validations)) {
          return Promise.reject()
        }
      }

      // Si el slider esta mostrado, envio el listado de requerimientos "ordenado" asi actualiza el state.possibleChanges.target y de esta manera, calcula el nuevo orden y el ultimo
      if (!this.hideOrderAsignacion) {
        await this.$store.dispatch("asignacionRequerimientos/updateTargetList", {
          targetList: this.reqsPossibleNewOrder,
          reqIdToUpdate: this.req.id,
        })
      }
      const preAprobadoState = this.req.preAprobado
      return this.$store
        .dispatch("asignacionRequerimientos/updateRequerimientoState", {
          requerimientoId: this.req.id,
          operation: this.operation,
          usuarioAsignado: _.find(this.optionsUsersReportantes, {
            value: this.usuarioAsignado,
          }),
          fechaFinalizacion: this.fechaFinalizacion,
          horasEstimadas: this.horasEstimadas,
          comentario: this.comment,
          preAprobado: preAprobadoState,
        })
        .then(message => {
          let msg = ""
          let actionMsg = ""
          switch (this.operation) {
            case "preaprobar":
              actionMsg = !preAprobadoState ? "PREAPROBADO" : "QUITADO DE PREAPROBACION"
              msg = `Requerimiento #${this.req.id} ${actionMsg} correctamente`
              break
            case "asignar":
              msg = `Requerimiento #${this.req.id} ASIGNADO correctamente`
              break
            case "aPriorizar":
              // eslint-disable-next-line
              msg = `Requerimiento #${this.req.id} marcado como DESARROLLO y devuelto a LA CADENA DE PRIORIZACIÓN`
              break
            case "aProcesos":
              msg = `Requerimiento #${this.req.id} enviado A PROCESOS`
              break
            case "desasignar":
              msg = `Requerimiento #${this.req.id} DESASIGNADO`
              break
            case "reasignar":
              msg = `Requerimiento #${this.req.id} REASIGNADO`
              break
            case "reordenar":
              msg = `Requerimiento #${this.req.id} REORDENADO / PRIORIZADO`
              break
            case "descartar":
              msg = `Requerimiento #${this.req.id} DESCARTADO`
              break
            default:
              msg = message || `Operación completada satisfactoriamente`
          }

          success({ message: msg })

          this.operation = null
          this.usuarioAsignado = null
          this.fechaFinalizacion = null
          this.horasEstimadas = null
          this.comment = null
          this.$emit("closeDialog") // close details dialog
        })
        .catch(e => {
          warn({ message: e.message })
        })
    },
  },
}
</script>
<style lang="stylus"></style>
