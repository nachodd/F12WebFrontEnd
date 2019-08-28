<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    full-height
    transition-show="scale"
    transition-hide="scale"
    @before-show="tab = 'detalle'"
  >
    <q-layout v-if="requerimientoSetted" container view="hHh lpR fFf" class="bg-white">
      <q-header elevated class="bg-deep-purple-10 text-white items-center">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title>
            <div class="text-h6 row justify-between">
              <div>Requerimiento Nº {{ req.id }}</div>
              <div>
                <q-btn
                  size="10px"
                  flat
                  icon="fas fa-edit"
                  class="opacity-hover"
                  :to="{ query: { ver: 'editarRequerimiento', id: req.id } }"
                >
                  <tooltip>
                    Editar Requerimiento
                  </tooltip>
                </q-btn>
              </div>
            </div>
            <div class="text-subtitle3 text-white-7 opacity-75">
              Cargado por:
              <span class="text-italic">
                {{ req.usuario.nombre }}
              </span>
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
          @input="handleTabChange"
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
            background: 'linear-gradient(to top, #5e35b1, #1565c0)',
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
                  <div class="text-grey-5 text-bold text-unselectable">
                    Area
                  </div>
                  <q-item-label lines="1">
                    {{ req.area.descripcion }}
                    <tooltip>Tipo: {{ req.area.descripcion }}</tooltip>
                  </q-item-label>
                </div>
                <div class="col-4">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Sistema
                  </div>
                  <q-item-label lines="1">
                    {{ req.sistema.descripcion }}
                    <tooltip>Tipo: {{ req.sistema.descripcion }}</tooltip>
                  </q-item-label>
                </div>
                <div class="col-4">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Tipo
                  </div>
                  <q-item-label lines="1">
                    {{ req.tipo.descripcion }}
                    <tooltip>Tipo: {{ req.tipo.descripcion }}</tooltip>
                  </q-item-label>
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Asunto
                  </div>
                  <!-- :field-value="quickEdit.asunto" -->
                  <inline-edit
                    v-model="quickEdit.asunto"
                    field-name="Asunto"
                    @touched="quickEdited = true"
                  />
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Descripcion
                  </div>
                  <!-- <div class="text-pre-wrap">{{ req.descripcion }}</div> -->
                  <inline-edit
                    v-model="quickEdit.descripcion"
                    field-name="Descripcion"
                    input-type="textarea"
                    @touched="quickEdited = true"
                  />
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Comentarios
                  </div>
                  <inline-edit
                    v-model="quickEdit.comentario"
                    field-name="Comentarios"
                    input-type="textarea"
                    :apply-validation="false"
                    @touched="quickEdited = true"
                  />
                </div>
              </div>

              <br />

              <div class="row">
                <div class="col">
                  <div class="text-grey-5 text-bold text-unselectable">
                    Ultimo movimiento
                  </div>
                  <div>
                    <!-- eslint-disable-next-line -->
                    {{ ultimoMovimiento.usuario }} @ <span class="text-italic">{{ ultimoMovimiento.fecha | formatearFechaHora }}</span>
                  </div>
                  <div>
                    Estado:
                    {{ ultimoMovimiento | formatearEstado }}
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
                    <strong>#{{ req.asociadoId }}</strong>
                  </div>
                  <!-- <div>Estado: {{ reqAsociadoEstadoDescripcion }}</div>
                  <div v-if="req.asociadoUsuario !== null">
                    Usuario Asignado: {{ req.asociadoUsuario }}
                  </div> -->
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
                          (Este req. lleva {{ diasVencimiento * -1 }} días vencido)
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

              <div v-show="req.tieneAdjuntos">
                <q-separator class="q-mb-sm" />
                <div class="text-grey-5 text-bold text-unselectable">
                  Adjuntos
                </div>
                <div class="row q-col-gutter-sm justify-center">
                  <div
                    v-for="(adjunto, i) in req.adjuntosCargadosUrl"
                    :key="`req_${i}_${adjunto}`"
                    class="col-4"
                  >
                    <adjunto-card :adjunto="adjunto" :nro="i + 1" />
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- Tab Acciones (dinamico) -->
            <q-tab-panel v-if="showAcciones" name="acciones" class="body-detalle-requerimiento">
              <component
                :is="actionsComponent"
                ref="actionsTab"
                @closeDialog="closeDialog"
                @showSaveRequerimientoAction="val => (showSaveRequerimientoAction = val)"
              />
            </q-tab-panel>

            <!-- Tab movicmientos -->
            <q-tab-panel name="movimientos">
              <div v-if="req.movimientos" class="row">
                <q-timeline color="purple">
                  <q-timeline-entry
                    v-for="(movimiento, index) in movimientosOrdenados"
                    :key="`req_${index}`"
                    :title="movimiento | formatearEstado"
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
                    <!-- eslint-disable-next-line -->
                    <div class="text-italic text-pre-wrap">{{ movimiento.comentario }}</div>
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
            :label="cerrarLabel"
            color="negative"
            @click="detalleRequerimientoOpen = false"
          />
          <q-btn
            v-if="quickEdited"
            label="Guardar Cambios"
            color="deep-purple-10"
            :outline="loadingRequerimiento"
            :loading="loadingRequerimiento"
            @click="quickEditRequerimiento"
          />

          <q-btn
            v-if="showSaveRequerimientoAction"
            label="Guardar Cambios"
            color="deep-purple-10"
            :outline="loadingRequerimiento"
            :loading="loadingRequerimiento"
            @click="saveRequerimientoAction"
          />
        </q-card-actions>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { date } from "quasar"
import Tooltip from "comp/Common/Tooltip"
import formValidation from "mixins/formValidation"
import PriorizarRequerimientosActions from "comp/PriorizarRequerimientos/PriorizarRequerimientosActions"
import AsignarRequerimientosActions from "comp/AsignarRequerimientos/AsignarRequerimientosActions"
import RequerimientosAsignadosActions from "comp/RequerimientosAsignados/RequerimientosAsignadosActions"
import Note from "comp/Common/Note"
import AdjuntoCard from "comp/Common/AdjuntoCard"
import DetalleRequerimientoInlineEdit from "comp/Common/DetalleRequerimientoInlineEdit"
import { success, warn } from "utils/helpers"
import Bus from "utils/bus"

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
    formatearEstado(movimiento) {
      let estado = movimiento.estado
      if (movimiento.tipo === "Requerimiento pausado") {
        estado += " (PAUSADO)"
      }
      if (movimiento.tipo === "Requerimiento reanudado") {
        estado += " (REANUDADO)"
      }

      if (movimiento.tipo === "Modificación estado en proceso") {
        return "Cadena - " + estado
      }

      return movimiento.tipo === "Alta" ? "Alta" : estado
    },
  },
  components: {
    PriorizarRequerimientosActions,
    AsignarRequerimientosActions,
    RequerimientosAsignadosActions,
    Note,
    AdjuntoCard,
    Tooltip,
    inlineEdit: DetalleRequerimientoInlineEdit,
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
      quickEdit: {
        asunto: "",
        descripcion: "",
        comentario: "",
      },
      quickEdited: false,
      showSaveRequerimientoAction: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
      loadingRequerimiento: state => state.loadingRequerimiento,
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
    cerrarLabel() {
      return this.quickEdited || this.showSaveRequerimientoAction ? "Cancelar y Cerrar" : "Cerrar"
    },
    detalleRequerimientoOpen: {
      get() {
        return this.$store.state.requerimientos.detalleRequerimientoOpen
      },
      set(value) {
        // solo disparamos el dispatch si el valor es distinto al actual
        if (value !== this.$store.state.requerimientos.detalleRequerimientoOpen) {
          return this.$store.dispatch("requerimientos/setDetalleRequerimientoOpen", value)
        }
      },
    },
    movimientosOrdenados() {
      return _.orderBy(this.req.movimientos, ["fecha"], ["desc"])
    },
    ultimoMovimiento() {
      return _.maxBy([...this.req.movimientos], "fecha")
    },
    ultimoMovimientoHasComentario() {
      return this.ultimoMovimiento.comentario && this.ultimoMovimiento.comentario.length
    },
    diasVencimiento() {
      return this.req.diasToVencimiento
    },
  },
  watch: {
    requerimientoSetted(isSetted) {
      this.showSaveRequerimientoAction = false
      this.quickEdited = false
      if (isSetted) {
        this.quickEdit.asunto = this.req.asunto
        this.quickEdit.descripcion = this.req.descripcion
        this.quickEdit.comentario = this.req.comentario
      } else {
        this.quickEdit.asunto = ""
        this.quickEdit.descripcion = ""
        this.quickEdit.comentario = ""
      }
    },
  },
  methods: {
    closeDialog() {
      this.quickEdit.asunto = ""
      this.quickEdit.descripcion = ""
      this.quickEdit.comentario = ""
      this.detalleRequerimientoOpen = false
    },
    async quickEditRequerimiento() {
      try {
        const form = await this.req.toUpdatePayload({ omitAdjuntos: true })
        form.asunto = this.quickEdit.asunto
        form.descripcion = this.quickEdit.descripcion
        form.comentario = this.quickEdit.comentario

        await this.$store.dispatch("requerimientos/storeRequerimiento", form)
        success({
          message: "La solicitud fue procesada correctamente!",
        })
        this.detalleRequerimientoOpen = false

        Bus.$emit("load-list-requerimientos")
      } catch ({ message }) {
        const msg = message || "No se pudo editar el requerimiento"
        // Si es un error simple (no es de validacion de form con array de errores), muestro el msj nomas
        warn({ message: msg })
      }
    },
    handleTabChange() {
      // reset de los botones y los valores por defecto
      this.quickEdited = false
      this.showSaveRequerimientoAction = false
      this.quickEdit.asunto = this.req.asunto
      this.quickEdit.descripcion = this.req.descripcion
      this.quickEdit.comentario = this.req.comentario
    },
    saveRequerimientoAction() {
      // call save action on child
      this.$refs.actionsTab.saveChanges()
    },
  },
}
</script>

<style lang="stylus" scoped>
.avatar--lg
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;

/deep/.body-detalle-requerimiento
  min-height: 100px;
  height: calc(100vh - 121px - 100px);

.q-dialog__inner > div
  border-radius 12px !important
</style>
