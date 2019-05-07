<template functional>
  <list-container :loading="props.loading">
    <mis-requerimientos-item
      v-for="req in props.requerimientos"
      :key="`req_${req.id}`"
      :req="req"
    />
  </list-container>
</template>
<script>
import ListContainer from "@comp/Common/ListContainer"
import MisRequerimientosItem from "./MisRequerimientosItem"

export default {
  components: {
    ListContainer,
    MisRequerimientosItem,
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
