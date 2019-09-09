<template>
  <q-item
    :active="esImportante"
    active-class="text-black"
    class="cursor-pointer row"
    :class="itemClass"
  >
    <q-item-section avatar class="q-px-sm col-md-auto">
      <q-badge color="grey">#{{ req.id }}</q-badge>
    </q-item-section>

    <q-item-section class="col-md-2 col-xs-6">
      <q-item-label class="text-left text-weight-medium">
        {{ req.asunto }}
      </q-item-label>
    </q-item-section>

    <q-item-section class="col-md-2 col-xs-6 gt-xs">
      <q-item-label caption lines="3">{{ req.descripcion }}</q-item-label>
    </q-item-section>

    <q-item-section class="col-md-2 col-xs-6">
      <q-item-label lines="1" class="text-weight-medium text-left">
        <q-badge :color="estadoColor" text-color="white">
          {{ req.estado.descripcion }}
        </q-badge>
      </q-item-label>
    </q-item-section>

    <q-item-section class="col-md-2 col-xs-6">
      <q-item-label lines="1" class="q-mt-sm text-left text-center elipsis">
        <span class="text-weight-medium">{{ req.usuario.nombre }}</span>
      </q-item-label>
      <q-item-label caption>{{ req.fecha_alta | formatearFecha }}</q-item-label>
    </q-item-section>

    <q-item-section top class="col-md-2 col-xs-12 q-my-xs">
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
    </q-item-section>

    <q-item-section v-show="$q.screen.gt.xs" top side class="padding-none col-1">
      <div class="text-grey-8 q-gutter-xs">
        <q-btn
          size="12px"
          flat
          dense
          round
          icon="more_vert"
          :to="{ query: { ver: 'editarRequerimiento', id: req.id } }"
        >
          <q-tooltip>
            Editar Requerimiento
          </q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>
<style scope>
.avatar--lg {
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;
}
.padding-none {
  padding: 0 !important;
}
</style>

<script>
import { date } from "quasar"

export default {
  name: "MisRequerimientosItem",
  filters: {
    formatearFecha: function(value) {
      return date.formatDate(value, "DD/MM/YYYY HH:mm")
    },
  },
  props: {
    req: {
      type: Object,
      required: true,
    },
    itemClass: {
      type: String,
      default: "",
    },
  },
  computed: {
    esImportante() {
      return this.req.importante === "SI"
    },
    estadoColor() {
      switch (this.req.estado.id) {
        case 1:
          return "green-6" // "PEND"
        case 2:
          return "teal-6" // "APRV"
        case 3:
          return "cyan-6" // "NOAS"
        case 4:
          return "blue-6" // "ASSI"
        case 5:
          return "indigo-6" // "EXEC"
        case 6:
          return "deep-purple-6" // "RESC"
        case 7:
          return "red-6" // "REJC"
        case 8:
          return "purple-6" // "INGR"
        case 9:
          return "orange-6" // "STPR"
        case 10:
          return "blue-grey-6" // "TEST"
        default:
          return "grey-6" // "TEST"
      }
    },
  },
}
</script>
