<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-8 bg-white cursor-pointer card-row"
    :class="{
      'card--default': !esArregloRapido,
      'card--qf': esArregloRapido,
      'card--paused': estaEnPausa,
    }"
  >
    <q-tooltip v-if="estaEnPausa">
      Este requerimiento esta EN PAUSA
    </q-tooltip>

    <q-tooltip v-if="yoDeboTestearla" content-class="bg-red">
      USTED DEBE TESTEAR ESTE REQUERIMIENTO
    </q-tooltip>

    <div class="row">
      <div class="col-12">
        <q-item-label lines="1">
          <span class="text-weight-medium">{{ req.asunto }}</span>
        </q-item-label>
        <q-item-label caption lines="2" style="margin-bottom: auto;">
          {{ req.descripcion }}
        </q-item-label>

        <q-item-label v-if="estaEnTesting && !yoDeboTestearla">
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
      <!-- <div v-if="!esArregloRapido" class="col-6 text-right">
        <q-badge
          :style="{
            color: getColorPrioridadText(req.prioridad),
            backgroundColor: getColorPrioridad(req.prioridad),
          }"
        >
          PR: {{ req.prioridad }}
        </q-badge>
      </div> -->
    </div>
  </q-item>
</template>
<script>
import { mapGetters } from "vuex"
import priorityColor from "@mixins/priorityColor"
import Requerimiento from "@models/Requerimiento"

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
    // ...mapGetters("requerimientos", ["getEstadoByCodigo"]),
    ...mapGetters("auth", ["userId"]),
    esArregloRapido() {
      return this.req.tipo.id === 1
    },
    usuarioAsignado() {
      return _.get(this, "req.estado.asignacion.usuario_nombre", "")
    },
    tieneComentario() {
      return this.req.comentario && this.req.comentario.length > 0
    },
    estaEnPausa() {
      return this.req.estado.pausado === true
    },
    estaEnTesting() {
      const estadoTestingId = Requerimiento.getEstadoId("TEST")
      return this.req.estado.id === estadoTestingId
    },
    yoDeboTestearla() {
      return (
        this.estaEnTesting &&
        Number(this.req.estado.asignacion_testing.usuario_id) === this.userId
      )
    },
    usuarioTesting() {
      return this.req.estado.asignacion_testing.usuario_nombre
    },
  },
}
</script>
<style lang="stylus" scoped>
.nro-req--default {
  background-color: $light-blue-7;
}
.nro-req--qf {
  background-color: $red-7;
}
.card--default {
  border-left: 3px solid $light-blue-7;
}
.card--qf {
  border-left: 3px solid $red-7;
}
// .card--inprocess {
//   border-right: 3px solid $green-7;
// }
.card-row {
  flex-direction: column;
}
</style>
