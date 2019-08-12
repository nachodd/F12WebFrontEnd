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
          class="body-detalle-requerimiento"
        >
          <q-tab-panels v-model="tab" animated>
            <!-- Tab Detalle -->
            <q-tab-panel name="detalle">
              <!-- detalle -->
              <div class="row">
                <div class="col-4">
                  <div class="text-grey-6">Area</div>
                  <q-item-label lines="1">
                    {{ req.area.descripcion }}
                    <tooltip>Tipo: {{ req.area.descripcion }}</tooltip>
                  </q-item-label>
                </div>
                <div class="col-4">
                  <div class="text-grey-6">Sistema</div>
                  <q-item-label lines="1">
                    {{ req.sistema.descripcion }}
                    <tooltip>Tipo: {{ req.sistema.descripcion }}</tooltip>
                  </q-item-label>
                </div>
                <div class="col-4">
                  <div class="text-grey-6">Tipo</div>
                  <q-item-label lines="1">
                    {{ req.tipo.descripcion }}
                    <tooltip>Tipo: {{ req.tipo.descripcion }}</tooltip>
                  </q-item-label>
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-6">Asunto</div>
                  <q-item-label>{{ req.asunto }}</q-item-label>
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-6">Descripcion</div>
                  {{ req.descripcion }}
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-6">Ultimo movimiento</div>
                  <div>
                    <!-- eslint-disable-next-line -->
                    {{ ultimoMovimiento.usuario }} @ <span class="text-italic">{{ ultimoMovimiento.fecha | formatearFechaHora }}</span>
                  </div>
                  <div>
                    Estado:
                    {{
                      ultimoMovimiento.estado
                        | formatearEstado(ultimoMovimiento)
                    }}
                    <div v-if="ultimoMovimientoHasComentario">
                      Comentarios:
                      {{ ultimoMovimiento.comentario }}
                    </div>
                  </div>
                </div>
              </div>

              <br />

              <div v-if="req.fueEnviadoAProcesos" class="row">
                <div class="col">
                  <div class="text-grey-6">
                    Requerimiento Asociado:
                    <strong>#{{ reqAsociadoId }}</strong>
                  </div>
                  <div>Estado: {{ reqAsociadoEstadoDescripcion }}</div>
                  <div v-if="reqAsociadoUsuario !== null">
                    Usuario Asignado: {{ reqAsociadoUsuario }}
                  </div>
                </div>
              </div>

              <br />

              <div v-if="req.vence" class="row q-mt-sm">
                <div class="col">
                  <note title="Vencimiento:" type="danger">
                    <div>
                      {{ req.fechaLimite }}
                      <template v-if="diasVencimiento !== null">
                        <span v-if="diasVencimiento > 0" class="text-black">
                          (Faltan
                          <strong>{{ diasVencimiento }}</strong>
                          días)
                        </span>

                        <span v-if="diasVencimiento === 0" class="text-black">
                          (HOY es el día de vencimiento)
                        </span>

                        <strong v-if="diasVencimiento < 0">
                          (Este req. lleva {{ diasVencimiento * -1 }} días
                          vencido)
                        </strong>
                      </template>
                      <br />

                      <span class>
                        <strong>Motivo:</strong>
                      </span>
                      <br />
                      {{ req.motivoLimite }}
                    </div>
                  </note>
                </div>
              </div>

              <div v-show="tieneAdjuntos">
                <q-separator />
                <br />
                <div class="row q-col-gutter-sm">
                  <div
                    v-for="(adjunto, i) in req.adjuntosCargadosUrl"
                    :key="`req_${i}_${adjunto}`"
                    class="col-6"
                  >
                    <adjunto-card :adjunto="adjunto" :nro="i + 1" />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Tab Acciones (dinamico) -->
            <q-tab-panel
              v-if="showAcciones"
              name="acciones"
              class="body-detalle-requerimiento"
            >
              <component :is="actionsComponent" @closeDialog="closeDialog" />
            </q-tab-panel>

            <!-- Tab movicmientos -->
            <q-tab-panel name="movimientos">
              <div v-if="req.movimientos" class="row">
                <q-timeline color="purple">
                  <q-timeline-entry
                    v-for="(movimiento, index) in movimientosOrdenados"
                    :key="`req_${index}`"
                    :title="movimiento.estado | formatearEstado(movimiento)"
                    :subtitle="movimiento | formatearUsuarioYFecha"
                    text-color="grey"
                    class="timeline-entry-custom"
                  >
                    <!-- <template
                      v-if="
                        movimiento.tipo === 'Modificación estado en proceso'
                      "
                    >
                      <div
                        v-if="movimiento.estado === 'Aprobado'"
                        class="text-italic"
                      >
                        Aprobado por: {{ movimiento.usuario }}
                      </div>
                    </template> -->
                    <div class="text-italic">{{ movimiento.comentario }}</div>
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
import formValidation from "mixins/formValidation"
// import { warn, success } from "utils/helpers"
import PriorizarRequerimientosActions from "comp/PriorizarRequerimientos/PriorizarRequerimientosActions"
import AsignarRequerimientosActions from "comp/AsignarRequerimientos/AsignarRequerimientosActions"
import RequerimientosAsignadosActions from "comp/RequerimientosAsignados/RequerimientosAsignadosActions"
import Note from "comp/Common/Note"
import AdjuntoCard from "comp/Common/AdjuntoCard"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "DialogDetalleRequerimiento",
  filters: {
    formatearFechaHora(value) {
      return date.formatDate(value, "DD/MM/YYYY HH:mm")
    },
    formatearUsuarioYFecha(value) {
      const fechaFormatiada = date.formatDate(value.fecha, "DD/MM/YYYY HH:mm")
      return value.usuario + " @ " + fechaFormatiada
    },
    formatearEstado(value, objMovimiento) {
      if (objMovimiento.tipo === "Modificación estado en proceso") {
        return "Cadena - " + value
      }
      return objMovimiento.tipo === "Alta" ? "Alta" : value
    },
  },
  components: {
    PriorizarRequerimientosActions,
    AsignarRequerimientosActions,
    RequerimientosAsignadosActions,
    Note,
    AdjuntoCard,
    Tooltip,
  },
  mixins: [formValidation],
  data() {
    return {
      approvedPriority: 1,
      comment: null,
      fixed: false,
      tab: "detalle",
      // asignacionUsuarios: [],
      usuarioAsignado: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("requerimientos", ["getEstadoById"]),
    // ...mapGetters("auth", ["userReportantes"]),
    stateSentToProcess() {
      return this.req.tieneEstado("STPR")
    },
    requerimientoSetted() {
      return !_.isEmpty(this.req)
    },
    actionsComponent() {
      switch (this.$route.name) {
        case "priorizar-requerimientos":
          return "PriorizarRequerimientosActions"
        case "asignar-requerimientos":
          return "AsignarRequerimientosActions"
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
        // solo disparamos el dispatch si el valor es distinto al actual
        if (
          value !== this.$store.state.requerimientos.detalleRequerimientoOpen
        ) {
          return this.$store.dispatch(
            "requerimientos/setDetalleRequerimientoOpen",
            value,
          )
        }
      },
    },
    movimientosOrdenados() {
      // let movimientos = [...this.req.movimientos]
      return _.orderBy(this.req.movimientos, ["fecha"], ["desc"])
    },
    ultimoMovimiento() {
      return _.maxBy([...this.req.movimientos], "fecha")
    },
    ultimoMovimientoHasComentario() {
      return (
        this.ultimoMovimiento.comentario &&
        this.ultimoMovimiento.comentario.length
      )
    },
    tieneAdjuntos() {
      return this.req.adjuntosCargadosUrl.length > 0
    },
    diasVencimiento() {
      return this.req.diasToVencimiento
    },
    reqAsociadoId() {
      return _.get(this.req, "requerimientoAsociado.id", null)
    },
    reqAsociadoEstadoDescripcion() {
      return _.get(this.req, "requerimientoAsociado.estado.descripcion", null)
    },
    reqAsociadoUsuario() {
      return _.get(this.req, "requerimientoAsociado.usuario_asignado", null)
    },
  },
  created() {
    // this.asignacionUsuarios = _.map(this.userReportantes, ur => {
    //   return {
    //     label: ur.RazonSocial,
    //     value: ur.IdUsuario,
    //   }
    // })
  },
  methods: {
    closeDialog() {
      this.detalleRequerimientoOpen = false
    },
  },
}
</script>

<style lang="scss">
.avatar--lg {
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;
}
.body-detalle-requerimiento {
  min-height: 100px;
  height: calc(100vh - 121px - 100px);
}
</style>
