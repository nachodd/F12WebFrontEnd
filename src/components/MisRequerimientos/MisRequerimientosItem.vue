<template>
  <q-item
    :active="esImportante"
    active-class="text-black"
    class="cursor-pointer"
  >
    <q-item-section avatar>
      <!-- <q-avatar icon="account_box" color text-color="grey" class="avatar--lg" /> -->
      <q-badge color="grey">#{{ req.id }}</q-badge>
    </q-item-section>

    <q-item-section>
      <!-- <q-item-label lines="1">{{ req.usuario.nombre }}</q-item-label> -->
      <!-- <q-item-label caption>February 22nd, 2019</q-item-label> -->

      <q-item-label lines="2" class="q-mt-sm text-left text-center">
        <span class="text-weight-medium">{{ req.usuario.nombre }}</span>
      </q-item-label>
      <q-item-label caption>{{ req.fecha_alta | formatearFecha }}</q-item-label>
    </q-item-section>

    <q-item-section class="col-2">
      <q-item-label class="q-mt-sm text-left text-center">
        <span class="text-weight-medium">{{ req.asunto }}</span>
      </q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label caption lines="3">{{ req.descripcion }}</q-item-label>
      <!-- <q-item-label
        lines="1"
        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        style="margin-top: auto;"
      >
        <span class="cursor-pointer">VER DETALLE</span>
      </q-item-label>-->
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1" class="text-center">
        <span class="text-weight-medium">{{ req.estado.descripcion }}</span>
        <!-- <span class="text-grey-8">- GitHub repository</span> -->
      </q-item-label>
    </q-item-section>

    <q-item-section top class="col-2 q-my-xs">
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

    <!-- <q-item-section top side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />

        <q-btn size="12px" flat dense round icon="more_vert" />
      </div>
    </q-item-section>-->
  </q-item>
</template>
<style scope>
.avatar--lg {
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;
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
  },
  computed: {
    esImportante() {
      return this.req.importante === "SI"
    },
  },
}
</script>
