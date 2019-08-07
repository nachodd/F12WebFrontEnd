<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-8 cursor-pointer card-row"
    :class="{
      'card--default': !req.esArregloRapido,
      'card--qf': req.esArregloRapido,
    }"
    :style="{ background: req.colorVencimientoBg }"
  >
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
            <q-tooltip content-class="text-caption">
              Area:
              <strong>{{ req.area.descripcion }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>
        <!--
        <q-item-label caption lines="2" style="margin-bottom: auto;">
          {{ req.descripcion }}
        </q-item-label>
        -->
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
            <q-tooltip content-class="bg-red text-caption">
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
            </q-tooltip>
          </span>
        </q-item-label>

        <!-- REQ ASOCIADO -->
        <q-item-label v-if="req.fueEnviadoAProcesos">
          <span class="card__text-body">
            <q-icon name="fas fa-cogs" class="vertical-top q-mr-xs q-pl-xs" />
            Req. Asociado
            <strong>#{{ req.asociadoId }}</strong>
            ({{ reqAsociadoEstadoDescripcion }})
            <q-tooltip content-class="text-caption">
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
            </q-tooltip>
          </span>
        </q-item-label>

        <!-- USUARIO ASIGNADO -->
        <q-item-label v-if="req.estaAsignado">
          <span class="card__text-user">
            <q-icon
              name="fas fa-user-check"
              class="vertical-top q-mr-xs q-pl-sm"
            />
            {{ req.usuarioAsignado }}
            <q-tooltip>
              Usuario Asignado:
              <strong>{{ req.usuarioAsignado }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>

        <!-- USUARIO TESTING -->
        <q-item-label v-if="req.estaEnTesting">
          <span class="card__text-user">
            <q-icon
              name="fas fas fa-flask"
              class="vertical-top q-mr-xs q-pl-xs"
            />
            {{ req.usuarioTesting }}
            <q-tooltip>
              Usuario Tester:
              <strong>{{ req.usuarioTesting }}</strong>
            </q-tooltip>
          </span>
        </q-item-label>
      </div>
    </div>

    <div class="row justify-between">
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
      <div
        v-if="!req.esArregloRapido && req.tieneEstado('NOAS')"
        class="col-9 text-right"
      >
        <!--
        <q-badge v-if="estadoEnProcesos" color="green-7" text-color="white">
          EN PROCESOS
        </q-badge>
        -->
        <q-badge
          v-if="req.tieneEstado('NOAS')"
          :style="{
            color: req.colorPrioridad.text,
            backgroundColor: req.colorPrioridad.bg,
          }"
        >
          PR: {{ req.prioridad }}
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
import { mapGetters } from "vuex"
import priorityColor from "mixins/priorityColor"
import Requerimiento from "models/requerimiento"

export default {
  name: "RequerimientoCard",
  mixins: [priorityColor],
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
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),

    tieneComentario() {
      return this.req.comentario && this.req.comentario.length > 0
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
