<template>
  <q-item :active="esImportante" active-class="text-black bg-red-2">
    <q-item-section class="col-1">
      <q-icon
        v-if="esImportante"
        name="fas fa-exclamation-triangle"
        color="red"
        size="16px"
      >
        <q-tooltip>Este requerimiento fue marcado como importante</q-tooltip>
      </q-icon>
      <q-icon v-else name="far fa-file-alt" color="grey-8" size="16px" />
    </q-item-section>

    <q-item-section top>
      <q-item-label lines="1">
        <span class="text-weight-medium">[{{ req.asunto }}]</span>
        <!-- <span class="text-grey-8">- GitHub repository</span> -->
      </q-item-label>
      <q-item-label caption lines="2" style="margin-bottom: auto;">
        {{ req.descripcion }}
      </q-item-label>
      <q-item-label
        lines="1"
        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        style="margin-top: auto;"
      >
        <span class="cursor-pointer">VER DETALLE</span>
      </q-item-label>
    </q-item-section>

    <q-item-section top class="col-2 q-my-xs">
      <q-item-label class="q-mt-sm" lines="1">
        <span class="text-weight-medium">Area:</span>
        {{ req.area }}
      </q-item-label>
      <q-item-label lines="1">
        <span class="text-weight-medium">Sistema:</span>
        {{ req.sistema }}
      </q-item-label>
      <q-item-label lines="1">
        <span class="text-weight-medium">Tipo:</span>
        {{ req.tipo }}
      </q-item-label>
    </q-item-section>

    <q-item-section top side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
      </div>
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  name: "PriorizarRequerimientosItem",
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
