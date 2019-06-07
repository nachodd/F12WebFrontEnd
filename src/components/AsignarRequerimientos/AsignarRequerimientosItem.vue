<template>
  <q-item
    class="q-ma-sm shadow-2 rounded-borders-10 bg-white cursor-pointer"
    :active="esArregloRapido"
    active-class="text-black bg-light-blue-2"
  >
    <q-item-section top>
      <q-item-label lines="1">
        <q-badge>#{{ req.id }}</q-badge>
        &nbsp;
        <span class="text-weight-medium">{{ req.asunto }}</span>
      </q-item-label>
      <q-item-label caption lines="2" style="margin-bottom: auto;">
        {{ req.descripcion }}
      </q-item-label>
    </q-item-section>

    <q-item-section v-if="!esArregloRapido" top side>
      <!-- <q-item-label class="text-center">
        <q-badge>#{{ req.id }}</q-badge>
      </q-item-label> -->
      <q-item-label>
        <q-badge
          :style="{
            color: getColorPrioridadText(req.prioridad),
            backgroundColor: getColorPrioridad(req.prioridad),
          }"
        >
          {{ req.prioridad }}
        </q-badge>
      </q-item-label>
    </q-item-section>

    <!-- <q-item-section class="col-xs-3 text-center">
      <span class="text-accent text-weight-medium">#{{ req.id }}</span>
      <div>
        <q-chip dense class="no-margin">
          <q-avatar
            class="prioridad-text"
            :style="{
              color: getColorPrioridadText(req.prioridad),
              backgroundColor: getColorPrioridad(req.prioridad),
            }"
          >
            {{ req.prioridad }}
          </q-avatar>
          Prioridad
        </q-chip>
      </div>
    </q-item-section> -->

    <!-- <q-item-section top class="col-2 q-my-xs">
      <q-item-label class="q-mt-sm" lines="1">
        <span class="text-weight-medium">Area:</span>
        {{ req.area.descripcion }}
      </q-item-label>
      <q-item-label lines="1">
        <span class="text-weight-medium">Sistema:</span>
        {{ req.sistema.descripcion }}
      </q-item-label>
      <q-item-label lines="1">
        <span class="text-weight-medium">Tipo:</span>
        {{ req.tipo.descripcion }}
      </q-item-label>
    </q-item-section> -->

    <!-- <q-item-section top side>
      <div v-if="tieneComentario" class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="fas fa-comment">
          <q-tooltip>
            {{ req.comentario }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-item-section> -->
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
    esArregloRapido() {
      return this.req.tipo.id === 1
    },
    tieneComentario() {
      return this.req.comentario && this.req.comentario.length > 0
    },
  },
}
</script>
<style>
.prioridad-text {
  font-size: 14px;
  font-weight: 700;
}
</style>
