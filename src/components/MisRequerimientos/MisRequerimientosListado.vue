<template>
  <list-container :loading="loading">
    <mis-requerimientos-item
      v-for="(req, i) in requerimientos"
      :key="`req_${req.id}`"
      :item-class="getItemClass(i)"
      :req="req"
      @click.native="
        abrirDetalleRequerimiento({
          reqId: req.id,
          listName: 'mis-requerimientos',
        })
      "
    />
  </list-container>
</template>
<script>
import ListContainer from "comp/Common/ListContainer"
import MisRequerimientosItem from "./MisRequerimientosItem"
import { mapActions } from "vuex"
import pageLoading from "mixins/pageLoading"

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
      abrirDetalleRequerimiento: "requerimientos/abrirDetalleRequerimiento",
    }),
    getItemClass(index) {
      if (index === 0) return "rounded-borders-12-top"
      if (index === this.requerimientos.length)
        return "rounded-borders-12-bottom"
      return ""
    },
  },
}
</script>
