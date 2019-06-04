<template>
  <q-item
    :active="esImportante"
    active-class="text-black bg-red-2 "
    class="cursor-pointer"
  >
    <!-- <q-item-section avatar top> -->
    <!-- <q-avatar
        v-if="esImportante"
        icon="folder"
        color="danger"
        text-color="white"
		/>-->
    <!-- <q-icon
        v-if="esImportante"
        name="fas fa-exclamation-triangle"
        color="red"
        size="34px"
      >
        <q-tooltip>Este requerimiento fue marcado como importante</q-tooltip>
		</q-icon>-->
    <!-- <q-icon v-else name="far fa-file-alt" color="grey-8" size="34px" /> -->

    <!-- <q-avatar v-else icon="receipt" color="primary" text-color="white" /> -->
    <!-- </q-item-section> -->

    <q-item-section class="col-3">
      <q-item-label class="q-mt-sm text-left text-grey-8 text-center">
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
        {{ req.estado }}
        <!-- <span class="text-grey-8">- GitHub repository</span> -->
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

    <!-- <q-item-section top side>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />

        <q-btn size="12px" flat dense round icon="more_vert" />
      </div>
		</q-item-section>-->
  </q-item>
</template>
<script>
export default {
  name: "MisRequerimientosItem",
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
