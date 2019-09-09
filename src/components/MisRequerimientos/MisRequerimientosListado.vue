<template>
  <div>
    <q-markup-table class="rounded-borders-12">
      <tbody>
        <mis-requerimientos-item
          v-for="req in requerimientos"
          :key="`req_${req.id}`"
          :req="req"
          @click.native="
            abrirDetalleRequerimiento({
              reqId: req.id,
              listName: 'mis-requerimientos',
            })
          "
        />
      </tbody>
    </q-markup-table>
  </div>
</template>
<script>
import MisRequerimientosItem from "comp/MisRequerimientos/MisRequerimientosItem"
import { mapActions } from "vuex"
import pageLoading from "mixins/pageLoading"

export default {
  name: "MisRequerimientosListado",
  components: {
    "mis-requerimientos-item": MisRequerimientosItem,
  },
  mixins: [pageLoading],
  props: {
    requerimientos: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    ...mapActions({
      abrirDetalleRequerimiento: "requerimientos/abrirDetalleRequerimiento",
    }),
    getItemClass(index) {
      if (index === 0) return "rounded-borders-12-top"
      if (index === this.requerimientos.length) return "rounded-borders-12-bottom"
      return ""
    },
  },
}
</script>
