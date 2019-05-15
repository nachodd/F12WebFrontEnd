<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Requerimientos A ORDENAR"
          group-name="requerimientos"
          :requerimientos-list="requerimientosAOrdernar"
          list-name="source"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Requerimientos ORDENADOS"
          group-name="requerimientos"
          :requerimientos-list="requerimientosOrdenados"
          list-name="target"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import PageHeader from "@comp/Common/PageHeader"
import dummyRequerimientosList from "@utils/dummyRequerimientosList"
import dummyRequerimientosList2 from "@utils/dummyRequerimientosList2"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
  },
  data() {
    return {
      requerimientosAOrdernar: dummyRequerimientosList,
      requerimientosOrdenados: dummyRequerimientosList2,
    }
  },
  created() {
    // this.$store.dispatch("app/loadingInc")
  },
  methods: {
    /* onCardDrop(list, dropResult) {
      this.log("oncarddrop", list, dropResult)
      if (list === "source" && dropResult.removedIndex !== null) {
        const res1 = applyDrag(this.requerimientosAOrdernar, dropResult)
        this.$set(this, "requerimientosAOrdernar", res1)
      }

      if (list === "target" && dropResult.addedIndex !== null) {
        const res = applyDrag(this.requerimientosOrdenados, dropResult)
        this.$set(this, "requerimientosOrdenados", res)

        console.log(
          "requerimientosOrdenados new:",
          this.requerimientosOrdenados,
        )
      }
    }, */
  },
}
</script>
