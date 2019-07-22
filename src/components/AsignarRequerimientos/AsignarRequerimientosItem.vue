<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-8 cursor-pointer card-row"
    :class="{
      'card--default': !esArregloRapido,
      'card--qf': esArregloRapido,
    }"
    :style="{ background: bgCardColor }"
  >
    <div v-if="estadoEnProcesos" class="row card__process-row">
      <div class="col-12 text-right">
        <template v-if="estadoProcesos.codigo === 'NOAS'">
          <div class="card__process-ind">&nbsp;</div>
        </template>
        <template v-if="estadoProcesos.codigo === 'ASSI'">
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
        </template>
        <template v-if="estadoProcesos.codigo === 'EXEC'">
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
        </template>
        <template v-if="estadoProcesos.codigo === 'RESC'">
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
          <div class="card__process-ind">&nbsp;</div>
        </template>
      </div>
      <q-tooltip
        :target="true"
        content-class="bg-green-7"
        content-style="font-size: 12px"
      >
        Estado Procesos:
        <strong>{{ estadoProcesos.descripcion }}</strong>
      </q-tooltip>
    </div>

    <div class="row">
      <div class="col-12">
        <q-item-label lines="1">
          <span class="text-weight-medium">{{ req.asunto }}</span>
        </q-item-label>
        <q-item-label>
          <span class="text-weight-regular card__text-body">
            <span class="avatar-letter">A</span>
            {{ req.area.descripcion }}
            <q-tooltip>
              Area:
              <strong>{{ req.area.descripcion }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>
        <!-- <q-item-label caption lines="2" style="margin-bottom: auto;">
          {{ req.descripcion }}
        </q-item-label> -->
        <q-item-label v-if="req.vence">
          <span class="card__text-body">
            <q-icon
              name="far fa-calendar-alt"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ req.fechaLimite }}
            <q-icon
              v-if="diasVencimiento < 7"
              name="fas fa-exclamation-triangle"
              class="vertical-top q-mr-xs q-pl-xs"
              :style="{ color: getColorVencimiento() }"
            />
            <q-tooltip>
              Vencimiento:
              <strong>{{ req.fechaLimite }}</strong>
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
            </q-tooltip>
          </span>
        </q-item-label>

        <q-item-label v-if="req.fueEnviadoAProcesos">
          <span class="card__text-body">
            <q-icon name="fas fa-cogs" class="vertical-top q-mr-xs q-pl-xs" />
            Req. Procesos
            <strong>#{{ reqProcesosId }}</strong>
            ({{ reqProcesosEstado }})
            <q-tooltip>
              - Requerimiento Asociado en Procesos:
              <strong>#{{ reqProcesosId }}</strong>
              <br />
              - Estado:
              <strong>{{ reqProcesosEstado }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>

        <q-item-label v-if="estaAsignado">
          <span class="card__text-user">
            <q-icon
              name="fas fa-user-check"
              class="vertical-top q-mr-xs q-pl-sm"
            />
            {{ usuarioAsignado }}
            <q-tooltip>
              Usuario Asignado:
              <strong>{{ usuarioAsignado }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>

        <q-item-label v-if="estaEnTesting">
          <span class="card__text-user">
            <q-icon
              name="fas fas fa-flask"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ usuarioTesting }}
            <q-tooltip>
              Usuario Tester:
              <strong>{{ usuarioTesting }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>
      </div>
    </div>

    <!-- <div v-if="estaAsignado" class="row q-mt-xs">
      <div class="col-12 text-caption text-bold">
        <q-icon name="fas fa-user" class="vertical-middle q-mr-xs" />
        {{ usuarioAsignado }}
        <q-tooltip>
          Usuario Asignado:
          <strong>{{ usuarioAsignado }}</strong>
        </q-tooltip>
      </div>
    </div> -->

    <div class="row justify-between">
      <div class="text-left col-3">
        <q-badge
          :class="{
            'nro-req--default': !esArregloRapido,
            'nro-req--qf': esArregloRapido,
          }"
        >
          #{{ req.id }}
        </q-badge>
      </div>
      <div
        v-if="!esArregloRapido && (estadoNoAsignado || estadoEnProcesos)"
        class="col-9 text-right"
      >
        <q-badge v-if="estadoEnProcesos" color="green-7" text-color="white">
          EN PROCESOS
        </q-badge>
        <q-badge
          v-if="estadoNoAsignado"
          :style="{
            color: getColorPrioridadText(req.prioridad),
            backgroundColor: getColorPrioridad(req.prioridad),
          }"
        >
          PR: {{ req.prioridad }}
        </q-badge>
      </div>

      <div v-if="isDevelopment && estadoAsignado" class="col-3 text-right">
        <q-badge color="red-7" text-color="white">
          ORDEN: {{ reqOrden }}
        </q-badge>
      </div>
    </div>
  </q-item>
</template>
<script>
import { mapGetters } from "vuex"
import priorityColor from "mixins/priorityColor"
import { pSBC } from "utils/colorHelper"
import Requerimiento from "models/requerimiento"

export default {
  name: "AsignarRequerimientosItem",
  mixins: [priorityColor],
  props: {
    req: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapGetters("requerimientos", ["getEstadoByCodigo", "getEstadoById"]),
    esArregloRapido() {
      return this.req.tipo.id === 1
    },
    reqOrden() {
      return _.get(this, "req.estado.asignacion.orden", "")
    },
    estaAsignado() {
      const estaAsignado = _.get(this, "req.estado.asignacion", null)
      return estaAsignado !== null
    },
    usuarioAsignado() {
      return _.get(this, "req.estado.asignacion.usuario_nombre", "")
    },
    tieneComentario() {
      return this.req.comentario && this.req.comentario.length > 0
    },
    estadoEnProcesos() {
      const estEnProcesos = this.getEstadoByCodigo("STPR")
      return this.req.estado.id === estEnProcesos.id
    },
    estadoNoAsignado() {
      const estNoAsig = this.getEstadoByCodigo("NOAS")
      return this.req.estado.id === estNoAsig.id
    },
    estadoAsignado() {
      const estAsig = this.getEstadoByCodigo("ASSI")
      return this.req.estado.id === estAsig.id
    },
    estadoProcesos() {
      const estNoAsig = this.getEstadoByCodigo("NOAS")
      const estAsig = this.getEstadoByCodigo("ASSI")
      const estEnEjec = this.getEstadoByCodigo("EXEC")
      const estResCerrado = this.getEstadoByCodigo("RESC")
      const estadoProcesosId = _.get(
        this,
        "req.estado.estado_procesos.id",
        null,
      )
      if (estadoProcesosId) {
        if (estadoProcesosId === estNoAsig.id) return estNoAsig
        if (estadoProcesosId === estAsig.id) return estAsig
        if (estadoProcesosId === estEnEjec.id) return estEnEjec
        if (estadoProcesosId === estResCerrado.id) return estResCerrado
      }
      return {}
    },
    bgCardColor() {
      const blanco = "#FFFFFF"
      if (!this.req.vence) {
        return blanco
      }
      const diasVenc = this.req.diasToVencimiento
      if (diasVenc > 7) {
        return blanco
      } else {
        const colorGradiente = this.getColorVencimiento()
        return `linear-gradient(45deg, #fff 0%, #fff 25%, ${colorGradiente} 100%)`
      }
    },
    diasVencimiento() {
      return this.req.diasToVencimiento
    },
    isDevelopment() {
      return process.env.DEV && false
    },
    reqProcesosId() {
      return _.get(this.req, "requerimientoProcesos.IdRequerimiento", null)
    },
    reqProcesosEstado() {
      // FIXME: aca deberia devolver el objeto estado (y ojo con la KEY, IdRequerimientoEstadoSistemas)
      const estadoId = _.get(
        this.req,
        "requerimientoProcesos.IdRequerimientoEstadoSistemas",
        null,
      )
      const estado = this.getEstadoById(estadoId)
      return estado.descripcion
    },
    estaEnTesting() {
      const estadoTestingId = Requerimiento.getEstadoId("TEST")
      return this.req.estado.id === estadoTestingId
    },
    usuarioTesting() {
      return this.req.estado.asignacion_testing.usuario_nombre
    },
  },
  methods: {
    getColorVencimiento() {
      const rojoMax = "#ef5350"
      const blanco = "#FFFFFF"
      if (!this.req.vence) {
        return blanco
      }
      const diasVenc = this.req.diasToVencimiento
      if (diasVenc > 7) {
        return blanco
      } else if (diasVenc > -15 && diasVenc <= 7) {
        const factorDias = (diasVenc + 15) * 100
        const factorAclarado = factorDias / 22 / 100
        return pSBC(factorAclarado, rojoMax, false, true)
      } else {
        return rojoMax
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.prioridad-text
  font-size: 14px;
  font-weight: 700;

.nro-req--default
  background-color: $light-blue-7
.nro-req--qf
  background-color: $red-7

.card--default
  border-left: 3px solid $light-blue-7
.card--qf
  border-left: 3px solid $red-7
/* .card--inprocess
  border-right: 3px solid $green-7 */
.card__text-body
  font-size: 0.75rem
  color: rgba(0,0,0,0.54)
.card__text-user
  font-size 0.75rem
  font-weight bold
  color #000

.card-row
  flex-direction: column

.card__process-row
  height: 3px
  position: absolute;
  right: 7px;
  top: -5px;
  padding: 8px 0;

.card__process-ind
  display: inline-block
  width: 10px
  height: 3px
  background-color: $green-7
  margin: 0 3px
</style>
