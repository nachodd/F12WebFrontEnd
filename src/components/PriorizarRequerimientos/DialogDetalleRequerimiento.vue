<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    full-height
    transition-show="scale"
    transition-hide="scale"
    @before-show="tab = 'detalle'"
  >
    <q-layout
      v-if="requerimientoSetted"
      container
      view="hHh lpR fFf"
      class="bg-white"
    >
      <q-header elevated class="bg-deep-purple-10 text-white items-center">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title>
            <div class="text-h6">Requerimiento Nº {{ req.id }}</div>
            <div class="text-subtitle3 text-white-7">
              {{ req.usuario.nombre }}
            </div>
          </q-toolbar-title>
        </q-toolbar>

        <q-tabs
          v-model="tab"
          dense
          class="bg-deep-purple-9 text-grey-5"
          active-color="white"
          indicator-color="white"
          align="justify"
          narrow-indicator
        >
          <q-tab name="detalle" label="Detalle" />

          <q-tab v-if="showAcciones" name="acciones" label="Acciones" />

          <q-tab name="movimientos" label="Movimientos" />
        </q-tabs>
      </q-header>

      <q-page-container>
        <!-- :content-style="contentStyle"
        :content-active-style="contentActiveStyle"-->
        <q-scroll-area
          :thumb-style="{
            right: '2px',
            borderRadius: '5px',
            backgroundColor: '#027be3',
            width: '5px',
            opacity: 0.75,
          }"
          class="modal-body"
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
            <q-tab-panel v-if="showAcciones" name="acciones" class="modal-body">
              <component :is="actionsComponent" @closeDialog="closeDialog" />
            </q-tab-panel>

            <!-- Tab movicmientos -->
            <q-tab-panel name="movimientos">
              <div v-if="req.movimientos" class="row">
                <q-timeline color="purple">
                  <q-timeline-entry
                    v-for="(movimiento, index) in movimientosOrdenados(
                      req.movimientos,
                    )"
                    :key="`req_${index}`"
                    :title="movimiento.estado | formatearEstado(movimiento)"
                    :subtitle="movimiento | formatearFecha"
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
        </q-scroll-area>
      </q-page-container>

      <q-footer elevated class="bg-white">
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="deep-purple-10"
            @click="detalleRequerimientoOpen = false"
          />
        </q-card-actions>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { date } from "quasar"
import formValidation from "@mixins/formValidation"
// import { warn, success } from "@utils/helpers"
import PriorizarRequerimientosActions from "@comp/PriorizarRequerimientos/PriorizarRequerimientosActions"
import AsignarRequerimientosActions from "@comp/AsignarRequerimientos/AsignarRequerimientosActions"
import RequerimientosAsignadosActions from "@comp/RequerimientosAsignados/RequerimientosAsignadosActions"

export default {
  name: "DialogDetalleRequerimiento",
  filters: {
    formatearFecha(value) {
      const fechaFormatiada = date.formatDate(value.fecha, "DD/MM/YYYY HH:mm")
      return value.usuario + " | " + fechaFormatiada
    },
    formatearEstado(value, objMovimiento) {
      return objMovimiento.tipo === "Alta" ? "Alta" : value
    },
  },
  components: {
    priorizarRequerimientosActions: PriorizarRequerimientosActions,
    asignarRequerimientosActions: AsignarRequerimientosActions,
    RequerimientosAsignadosActions: RequerimientosAsignadosActions,
  },
  mixins: [formValidation],
  data() {
    return {
      // operation: null,
      approvedPriority: 1,
      comment: null,
      fixed: false,
      tab: "detalle",
      asignacionUsuarios: [],
      // operationAsignar: null,
      usuarioAsignado: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
      test: state => state.detalleRequerimientoOpen,
    }),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    ...mapGetters("auth", ["userReportantes"]),
    stateSentToProcess() {
      return this.detalleRequerimientoState === "STPR"
    },
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
      switch (this.$route.name) {
        case "priorizar-requerimientos":
          return "priorizarRequerimientosActions"
        case "asignar-requerimientos":
          return "asignarRequerimientosActions"
        case "requerimientos-asignados":
          return "RequerimientosAsignadosActions"
        default:
          return null
      }
    },
    showAcciones() {
      switch (this.$route.name) {
        case "priorizar-requerimientos":
        case "requerimientos-asignados":
          return true
        case "asignar-requerimientos":
          // Si el estado del req es "enviado a procesos", las acciones no se muestran
          return this.stateSentToProcess ? false : true
        default:
          return false
      }
    },
    detalleRequerimientoOpen: {
      get() {
        return this.$store.state.requerimientos.detalleRequerimientoOpen
      },
      set(value) {
        return this.$store.dispatch(
          "requerimientos/setDetalleRequerimientoOpen",
          value,
        )
      },
    },
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
    movimientosOrdenados(movimientos) {
      return _.orderBy(movimientos, "fecha", "desc")
    },
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
.modal-body-container {
  height: 60vh;
  width: 84vh;
  padding: 0px !important;
}
.modal-body {
  min-height: 100px;
  height: calc(100vh - 121px - 100px);
}
.text-subtitle3 {
  font-size: 14px;
}
</style>
