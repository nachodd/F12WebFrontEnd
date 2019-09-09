<template>
  <q-item class="q-ma-sm shadow-2 rounded-borders-8 bg-white cursor-pointer card-row">
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

    <div class="row justify-around">
      <div class="text-left" :class="{ 'col-6': !esArregloRapido, 'col-12': esArregloRapido }">
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
          <q-tooltip>
            Prioridad:
            <strong>{{ req.prioridad }}</strong>
          </q-tooltip>
        </q-badge>
      </div>
    </div>
  </q-item>
</template>
<script>
import { mapGetters } from "vuex"
import priorityColor from "mixins/priorityColor"

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
    usuarioAsignado() {
      return _.get(this, "req.estado.asignacion.usuario_nombre", "")
    },
    tieneComentario() {
      return this.req.comentario && this.req.comentario.length > 0
    },
  },
}
</script>
<style lang="stylus" scoped>
.prioridad-text {
  font-size: 14px;
  font-weight: 700;
}

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

.card--inprocess {
  border-right: 3px solid $green-7;
}

.card-row {
  flex-direction: column;
}

.card__process-row {
  height: 3px;
  position: absolute;
  right: 7px;
  top: -5px;
  padding: 8px 0;
}

.card__process-ind {
  display: inline-block;
  width: 10px;
  height: 3px;
  background-color: $green-7;
  margin: 0 3px;
}
</style>
