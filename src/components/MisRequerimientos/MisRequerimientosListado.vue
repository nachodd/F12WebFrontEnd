<template>
  <list-container :loading="loading">
    <mis-requerimientos-item
      v-for="req in requerimientos"
      :key="`req_${req.id}`"
      :req="req"
      @click.native="
        abrirDetalleRequerimiento({
          reqId: req.id,
          fetchRequerimiento: true,
        })
      "
    />
  </list-container>
</template>
<script>
import ListContainer from "@comp/Common/ListContainer"
import MisRequerimientosItem from "./MisRequerimientosItem"
import { mapActions } from "vuex"
import pageLoading from "@mixins/pageLoading"

export default {
  name: "MisRequerimientosListado",
  components: {
    "list-container": ListContainer,
    "mis-requerimientos-item": MisRequerimientosItem,
  },
  mixins: [pageLoading],
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
  methods: {
    ...mapActions({
      abrirDetalleRequerimiento:
        "priorizarRequerimientos/abrirDetalleRequerimiento",
    }),
  },
}
</script>
