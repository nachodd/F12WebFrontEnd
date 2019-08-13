<template>
  <tr class="items-center cursor-pointer text-unselectable">
    <td class="q-px-sm">
      <q-badge color="grey">#{{ req.id }}</q-badge>
    </td>

    <td class="text-weight-medium mw-150">
      <span class="ellipsis-2-lines ws-normal">
        {{ req.asunto }}
      </span>
    </td>

    <td class="gt-sm mw-150">
      <span class="ellipsis-3-lines text-caption ws-normal">
        {{ req.descripcion }}
      </span>
    </td>

    <td class="text-center mw-75">
      <q-badge :color="estadoColor" text-color="white" class="estado">
        {{ req.estado.descripcion }}
      </q-badge>
      <tooltip>Estado: {{ req.estado.descripcion }}</tooltip>
    </td>

    <td class="mw-100">
      <div class="text-weight-medium ellipsis">
        {{ req.usuario.nombre }}
        <tooltip>Usuario alta: {{ req.usuario.nombre }}</tooltip>
      </div>
      <div class="text-caption ellipsis">
        {{ req.fecha_alta | formatearFecha }}
      </div>
    </td>

    <td class="mw-100 gt-xs">
      <div class="ellipsis">
        <span class="text-weight-medium">Area:</span>
        {{ req.area.descripcion }}
        <tooltip>Area: {{ req.area.descripcion }}</tooltip>
      </div>
      <div class="ellipsis">
        <span class="text-weight-medium">Sist.:</span>
        {{ req.sistema.descripcion }}
        <tooltip>Sistema: {{ req.sistema.descripcion }}</tooltip>
      </div>
      <div class="ellipsis">
        <span class="text-weight-medium">Tipo:</span>
        {{ req.tipo.descripcion }}
        <tooltip>Tipo: {{ req.tipo.descripcion }}</tooltip>
      </div>
    </td>

    <td class="gt-xs text-right">
      <div class="text-grey-6">
        <q-btn
          size="10px"
          flat
          round
          icon="fas fa-edit"
          :to="{ query: { ver: 'editarRequerimiento', id: req.id } }"
        >
          <tooltip>
            Editar Requerimiento
          </tooltip>
        </q-btn>
      </div>
    </td>
  </tr>
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
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "MisRequerimientosItem",
  components: {
    Tooltip,
  },
  filters: {
    formatearFecha: function(value) {
      return date.formatDate(value, "DD/MM HH:mm")
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
<style lang="stylus" scoped>
.text-caption
  color: $grey-7
.estado
  white-space normal
</style>
