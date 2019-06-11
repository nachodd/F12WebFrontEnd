<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card v-if="requerimientoSetted">
      <q-card-section class="bg-deep-purple-10 text-white items-center">
        <div class="text-h6">Requerimiento Nº {{ req.id }}</div>
        <div class="text-subtitle3 text-white-7">{{ req.usuario.nombre }}</div>
      </q-card-section>

      <q-separator />
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3 text-grey-7"
        active-color="deep-purple-10"
        indicator-color="deep-purple-10"
        align="justify"
        narrow-indicator
      >
        <q-tab name="detalle" label="Detalle" />
        <q-tab v-if="showAcciones" name="acciones" label="Acciones" />

        <q-tab name="movimientos" label="Movimientos" />
      </q-tabs>
      <q-separator />
      <q-card-section
        id="test"
        style="height: 50vh;width:84vh;padding:0px !important;"
        class="scroll"
      >
        <q-tab-panels v-model="tab" animated>
          <!-- Tab Detalle -->
          <q-tab-panel name="detalle">
            <!-- detalle -->
            <div class="row">
              <div class="col-4">
                <div class="text-grey-7">Area</div>
                <q-item-label lines="1">
                  {{ req.area.descripcion }}
                </q-item-label>
              </div>
              <div class="col-4">
                <div class="text-grey-7">Sistema</div>
                <q-item-label lines="1">
                  {{ req.sistema.descripcion }}
                </q-item-label>
              </div>
              <div class="col-4">
                <div class="text-grey-7">Tipo</div>
                <q-item-label lines="1">
                  {{ req.tipo.descripcion }}
                </q-item-label>
              </div>
            </div>
            <br />
            <div class="text-grey-7">Asunto</div>
            {{ req.asunto }}
            <br />
            <br />
            <div class="text-grey-7">Descripcion</div>
            {{ req.descripcion }}
            <br />
            <br />
            <q-banner
              v-if="req.vence"
              inline-actions
              class="text-white bg-red-4"
              style="margin-bottom:20px;"
              rounded
            >
              <div>
                <span>Vencimiento:</span>
                <br />
                {{ req.fechaLimite }}
                <template v-if="vencimientoDiff !== null">
                  <span v-if="vencimientoDiff > 0" class="text-white">
                    (Faltan
                    <strong>{{ vencimientoDiff }}</strong>
                    días)
                  </span>

                  <span v-if="vencimientoDiff === 0" class="text-white">
                    (HOY es el día de vencimiento)
                  </span>

                  <strong v-if="vencimientoDiff < 0">
                    (Este req. se encuentra vencido )
                  </strong>
                </template>
                <br />
                <br />
                <span class>Motivo:</span>
                <br />
                {{ req.motivoLimite }}
              </div>
              <template v-slot:action>
                <!-- <q-btn flat color="white" label="Turn ON Wifi" /> -->
                <q-avatar
                  icon="info"
                  color
                  text-color="white"
                  class="avatar--lg"
                />
              </template>
            </q-banner>
          </q-tab-panel>

          <!-- Tab Acciones (dinamico) -->
          <q-tab-panel v-if="showAcciones" name="acciones">
            <component :is="actionsComponent" @closeDialog="closeDialog" />
          </q-tab-panel>

          <!-- Tab movicmientos -->
          <q-tab-panel name="movimientos">
            <div v-if="req.movimientos" class="row">
              <q-timeline color="purple">
                <q-timeline-entry
                  v-for="(movimiento, index) in req.movimientos"
                  :key="`req_${index}`"
                  :title="movimiento.estado | formatiarEstado(movimiento)"
                  :subtitle="movimiento | formatiarFecha"
                  icon
                  color
                  text-color="grey"
                  class="title-custom"
                >
                  <div>{{ movimiento.comentario }}</div>
                </q-timeline-entry>
              </q-timeline>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <!-- Botones de accion para el requerimiento -->
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cerrar"
          color="deep-purple-10"
          @click="detalleRequerimientoOpen = false"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { date } from "quasar"
import formValidation from "@mixins/formValidation"
// import { warn, success } from "@utils/helpers"
import PriorizarRequerimientosActions from "@comp/PriorizarRequerimientos/PriorizarRequerimientosActions"
import AsignarRequerimientosActions from "@comp/AsignarRequerimientos/AsignarRequerimientosActions"

export default {
  name: "DialogDetalleRequerimiento",
  filters: {
    formatiarFecha(value) {
      let fechaFormatiada = date.formatDate(value.fecha, "DD/MM/YYYY HH:mm")

      let retorno = value.usuario + " | " + fechaFormatiada

      return retorno
    },
    formatiarEstado(value, objMovimiento) {
      if (objMovimiento.tipo == "Alta") {
        value = "Alta"
      }
      return value
    },
  },
  components: {
    priorizarRequerimientosActions: PriorizarRequerimientosActions,
    asignarRequerimientosActions: AsignarRequerimientosActions,
  },
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      approvedPriority: 1,
      comment: null,
      fixed: false,
      tab: "detalle",
      asignacionUsuarios: [],
      operationAsignar: null,
      usuarioAsignado: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("auth", [
      "esElUltimoDeLaCadenaDeMando",
      "userId",
      "userReportantes",
    ]),
    // ...mapGetters("priorizarRequerimientos", [
    //   "cantidadRequerimientos",
    //   "reqsPendientesAprobacionLength",
    //   "reqsAprobadosPriorizadosLength",
    //   "esAutor",
    // ]),
    /* maximoSliderPrioridad() {
      // Si la operacion es de seleccionar prioridad, el max del slider será 1 menos que la cant de reqs
      return this.operation === "seleccionarPrioridad"
        ? this.cantidadRequerimientos - 1
        : this.cantidadRequerimientos
    }, */
    requerimientoSetted() {
      return !_.isEmpty(this.req)
    },
    vencimientoDiff() {
      if (this.req && this.req.vence) {
        const diff = date.getDateDiff(
          new Date(this.req._fechaLimite),
          new Date(),
          "days",
        )
        return diff
      }
      return null
    },
    actionsComponent() {
      if (this.$route.name === "priorizar-requerimientos") {
        return "priorizarRequerimientosActions"
      } else if (this.$route.name === "asignar-requerimientos") {
        return "asignaRequerimientosActions"
      }
      return null
    },
    showAcciones() {
      switch (this.$route.name) {
        case "priorizar-requerimientos":
        case "asignar-requerimientos":
          return true
        default:
          return false
      }
    },
    detalleRequerimientoOpen: {
      get() {
        return this.$store.state.requerimientos.detalleRequerimientoOpen
      },
      set(value) {
        return this.$store
          .dispatch("requerimientos/setDetalleRequerimientoOpen", value)
          .then(() => {
            // Reset de la operacion (para los botones) y la prioridad seleccionada
            // this.operation = null
            // this.approvedPriority = 1
            // this.comment = null
          })
      },
    },
    optionsAsignar() {
      const opt = [
        {
          label: "Ninguna seleccionada",
          value: null,
        },
      ]
      if (this.stateNotAssigned) {
        opt.push({
          label: "Asignar",
          value: "asignar",
        })
      }
      return opt
    },
    /* statePending() {
      return this.req.estado.id === 1
    },
    stateApproved() {
      return this.req.estado.id === 2
    }, */
    stateNotAssigned() {
      return this.req.estado.id === 3
    },
    stateAssigned() {
      return this.req.estado.id === 4
    },
    /* isApprovingOrReordering() {
      return (
        this.operation === "aprobar" ||
        this.operation === "seleccionarPrioridad"
      )
    }, */
    /* seleccionarPrioridadShown() {
      if (this.esElUltimoDeLaCadenaDeMando) {
        return this.statePending && this.reqsPendientesAprobacionLength > 1
      } else {
        return this.stateApproved && this.reqsAprobadosPriorizadosLength > 1
      }
    }, */
    // tabAcciones() {
    //   return this.$route.name === "priorizar-requerimientos"
    // },
    // tabAccionesAsignarReqs() {
    //   return this.$route.name === "asignar-requerimientos"
    // },
  },
  created() {
    this.asignacionUsuarios = _.map(this.userReportantes, ur => {
      return {
        label: ur.RazonSocial,
        value: ur.IdUsuario,
      }
    })
  },
  methods: {
    closeDialog() {
      this.detalleRequerimientoOpen = false
    },
    /* saveChanges() {
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
          this.detalleRequerimientoOpen = false
        })
        .catch(message => {
          warn({ message })
        })
    }, */
  },
}
</script>

<style lang="scss" scope>
.avatar--lg {
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;
}

.title-custom .q-timeline__title {
  margin: 0px;
}
</style>
