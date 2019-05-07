<template functional>
  <draggable v-model="requerimientos" group="requerimientos">
    <!-- <div v-for="req in requerimientosAOrdernar" :key="req.id">
      {{ req.asunto }}
		</div>-->

    <list-container :loading="props.loading">
      <mis-requerimientos-item
        v-for="req in props.requerimientos"
        :key="`req_${req.id}`"
        :req="req"
      />
    </list-container>
  </draggable>
</template>
<script>
import ListContainer from "@comp/Common/ListContainer"
import PriorizarRequerimientosItem from "./PriorizarRequerimientosItem"

export default {
  components: {
    ListContainer,
    PriorizarRequerimientosItem,
  },
  props: {
    requerimientos: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
