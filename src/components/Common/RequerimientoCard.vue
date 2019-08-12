<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-8 cursor-pointer card-row"
    :class="{
      'card--default': req.esDesarrollo,
      'card--qf': req.esArregloRapido,
      'card--paused': req.estaEnPausa,
    }"
    :style="{ background: req.colorVencimientoBg }"
  >
    <tooltip v-if="req.estaEnPausa">
      Este requerimiento esta EN PAUSA
    </tooltip>
    <tooltip v-if="yoDeboTestearla" content-class="bg-red">
      USTED DEBE TESTEAR ESTE REQUERIMIENTO
    </tooltip>

    <div class="row">
      <div class="col-12">
        <!-- ASUNTO -->
        <q-item-label lines="1">
          <span class="text-weight-medium">{{ req.asunto }}</span>
        </q-item-label>

        <!-- AREA -->
        <q-item-label>
          <span class="text-weight-regular card__text-body">
            <span class="avatar-letter">A</span>
            {{ req.area.descripcion }}
            <tooltip>
              Area:
              <strong>{{ req.area.descripcion }}</strong>
            </tooltip>
          </span>
        </q-item-label>
        <!--
        <q-item-label caption lines="2" style="margin-bottom: auto;">
          {{ req.descripcion }}
        </q-item-label>
        -->
        <!-- FECHA DE CARGA -->
        <q-item-label>
          <span class="card__text-body">
            <q-icon
              name="far fa-calendar"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ req.fechaAlta }}
            <tooltip>
              Fecha de Carga:
              <strong>{{ req.fechaAlta }}</strong>
            </tooltip>
          </span>
        </q-item-label>

        <!-- USUARIO DE CARGA -->
        <q-item-label>
          <span class="card__text-body">
            <q-icon
              name="fas fa-user-tie"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ req.usuario.nombre }}
            <tooltip>
              Usuario Alta:
              <strong>{{ req.usuario.nombre }}</strong>
            </tooltip>
          </span>
        </q-item-label>

        <!-- VENCIMIENTO -->
        <q-item-label v-if="req.vence">
          <span class="card__text-body card__text-red">
            <q-icon
              name="far fa-calendar-alt"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            Venc:
            {{ req.fechaLimite }}
            <q-icon
              v-if="req.diasToVencimiento < 7"
              name="fas fa-exclamation-triangle"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            <tooltip content-class="bg-red">
              Vencimiento:
              <strong>{{ req.fechaLimite }}</strong>
              <template v-if="req.diasToVencimiento !== null">
                <span v-if="req.diasToVencimiento > 0">
                  (Faltan
                  <strong>{{ req.diasToVencimiento }}</strong>
                  días)
                </span>
                <span v-if="req.diasToVencimiento === 0">
                  (HOY es el día de vencimiento)
                </span>
                <strong v-if="req.diasToVencimiento < 0">
                  (Este req. lleva {{ req.diasToVencimiento * -1 }} días
                  vencido)
                </strong>
              </template>
            </tooltip>
          </span>
        </q-item-label>

        <!-- REQ ASOCIADO -->
        <q-item-label v-if="req.fueEnviadoAProcesos">
          <span class="card__text-body">
            <q-icon name="fas fa-cogs" class="vertical-top q-mr-xs q-pl-xs" />
            Req. Asociado
            <strong>#{{ req.asociadoId }}</strong>
            ({{ reqAsociadoEstadoDescripcion }})
            <tooltip>
              - Requerimiento Asociado Nro:
              <strong>#{{ req.asociadoId }}</strong>
              <br />
              - Estado:
              <strong>{{ req.asociadoEstadoDescripcion }}</strong>
              <span v-if="req.asociadoUsuario !== null">
                <br />
                - Usuario Asignado:
                <strong>{{ req.asociadoUsuario }}</strong>
              </span>
            </tooltip>
          </span>
        </q-item-label>

        <!-- USUARIO ASIGNADO -->
        <q-item-label v-if="muestraUsuarioAsignado">
          <span class="card__text-user">
            <q-icon
              name="fas fa-user-check"
              class="vertical-top q-mr-xs q-pl-sm"
            />
            {{ req.usuarioAsignado }}
            <tooltip>
              Usuario Asignado:
              <strong>{{ req.usuarioAsignado }}</strong>
            </tooltip>
          </span>
        </q-item-label>

        <!-- USUARIO TESTING -->
        <q-item-label v-if="req.tieneEstado('TEST')">
          <span class="card__text-user">
            <q-icon
              name="fas fas fa-flask"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ req.usuarioTesting }}
            <tooltip>
              Usuario Tester:
              <strong>{{ req.usuarioTesting }}</strong>
            </tooltip>
          </span>
        </q-item-label>
      </div>
    </div>

    <div class="row justify-between q-mt-xs">
      <div class="text-left col-3">
        <q-badge
          :class="{
            'nro-req--default': !req.esArregloRapido,
            'nro-req--qf': req.esArregloRapido,
          }"
        >
          #{{ req.id }}
        </q-badge>
      </div>

      <!-- v-if="!req.esArregloRapido && req.tieneEstado('NOAS')" -->
      <div v-if="muestraPrioridad" class="col-9 text-right">
        <q-badge
          :style="{
            color: req.colorPrioridad.text,
            backgroundColor: req.colorPrioridad.bg,
          }"
        >
          PR: {{ req.prioridad }}
          <tooltip>
            Prioridad:
            <strong>{{ req.prioridad }}</strong>
          </tooltip>
        </q-badge>
      </div>

      <div
        v-if="isDevelopment && req.tieneEstado('ASSI')"
        class="col-3 text-right"
      >
        <q-badge color="red-7" text-color="white">
          ORDEN: {{ req.asignacionOrden }}
        </q-badge>
      </div>
    </div>
  </q-item>
</template>
<script>
import Requerimiento from "models/requerimiento"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "RequerimientoCard",
  components: {
    Tooltip,
  },
  props: {
    req: {
      type: [Requerimiento, Object],
      required: true,
    },
    cardType: {
      type: String,
      default: "",
    },
    index: {
      type: Number,
      required: true,
    },
  },
  computed: {
    yoDeboTestearla() {
      return (
        this.req.tieneEstado("TEST") &&
        Number(this.req.estado.asignacion_testing.usuario_id) === this.userId
      )
    },

    muestraPrioridad() {
      // En priorizar, se muestra para cualquier estado
      const condicionesEnPriorizar = this.cardType === "priorizar"
      // En asignar, Solo se muestra para la columna de "Por asignar"
      const condicionesEnAsignar =
        this.cardType === "asignar" && this.req.tieneEstado("NOAS")
      return (
        this.req.esDesarrollo &&
        (condicionesEnPriorizar || condicionesEnAsignar)
      )
    },

    muestraUsuarioAsignado() {
      return this.req.estaAsignado && this.cardType === "asignar"
    },

    isDevelopment() {
      return process.env.DEV && false
    },
  },
  methods: {},
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
.card__text-red
  color: $red-4 !important
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
