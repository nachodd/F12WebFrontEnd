<template>
  <q-list v-show="!loading" bordered separator class="rounded-borders q-mb-md">
    <list-container :loading="loading">
      <draggable :list="requerimientos" group="requerimientos">
        <priorizar-requerimientos-item
          v-for="req in requerimientos"
          :key="`req_${req.id}`"
          :req="req"
        />
      </draggable>
    </list-container>
  </q-list>
</template>
<script>
import draggable from "vuedraggable"
import ListContainer from "@comp/Common/ListContainer"
import PriorizarRequerimientosItem from "./PriorizarRequerimientosItem"

export default {
  name: "PriorizarRequerimientosListado",
  components: {
    draggable,
    ListContainer,
    PriorizarRequerimientosItem,
  },
  props: {
    requerimientos: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
