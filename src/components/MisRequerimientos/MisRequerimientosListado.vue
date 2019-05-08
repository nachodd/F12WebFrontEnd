<template>
  <list-container :loading="loading">
    <mis-requerimientos-item
      v-for="req in requerimientos"
      :key="`req_${req.id}`"
      :req="req"
    />
  </list-container>
</template>
<script>
import ListContainer from "@comp/Common/ListContainer"
import MisRequerimientosItem from "./MisRequerimientosItem"

export default {
  name: "MisRequerimientosListado",
  components: {
    "list-container": ListContainer,
    "mis-requerimientos-item": MisRequerimientosItem,
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
