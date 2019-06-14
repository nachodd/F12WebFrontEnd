<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-8 bg-white cursor-pointer card-row"
    :class="{
      'card--default': !esArregloRapido,
      'card--qf': esArregloRapido,
      'card--inprocess': estadoEnProcesos,
    }"
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
        <q-item-label caption lines="2" style="margin-bottom: auto;">
          {{ req.descripcion }}
        </q-item-label>
      </div>
    </div>

    <div v-if="estaAsignado" class="row q-mt-xs">
      <div class="col-12 text-caption text-bold">
        Asig: {{ usuarioAsignado }}
      </div>
    </div>

    <div class="row justify-around">
      <div
        class="text-left"
        :class="{ 'col-6': !esArregloRapido, 'col-12': esArregloRapido }"
      >
        <q-badge
          :class="{
            'nro-req--default': !esArregloRapido,
            'nro-req--qf': esArregloRapido,
          }"
        >
          #{{ req.id }}
        </q-badge>
        &nbsp;
      </div>
      <div v-if="!esArregloRapido" class="col-6 text-right">
        <q-badge
          :style="{
            color: getColorPrioridadText(req.prioridad),
            backgroundColor: getColorPrioridad(req.prioridad),
          }"
        >
          PR: {{ req.prioridad }}
        </q-badge>
      </div>
    </div>
  </q-item>
</template>
<script>
import { mapGetters } from "vuex"
import priorityColor from "@mixins/priorityColor"

export default {
  name: "PriorizarRequerimientosItem",
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
    ...mapGetters("requerimientos", ["getEstadoByCodigo"]),
    esArregloRapido() {
      return this.req.tipo.id === 1
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
.card--inprocess
  border-right: 3px solid $green-7

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
