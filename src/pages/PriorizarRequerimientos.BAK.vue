<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <div class="shadow-3 bg-grey-2 rounded-borders">
          <div class="title">Requerimiento A ORDENAR</div>
          <Container
            group-name="requerimientos"
            :get-child-payload="getSourcePayload"
            :should-accept-drop="() => sourceAcceptDrop"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
            @drop="e => onCardDrop('source', e)"
          >
            <Draggable
              v-for="req in requerimientosAOrdernar"
              :key="`req_${req.id}`"
            >
              <priorizar-requerimientos-item :req="req" />
            </Draggable>
          </Container>
        </div>
      </div>

      <div class="col-6">
        <div class="shadow-3 bg-grey-2 rounded-borders">
          <div class="title">Requerimiento ORDENADOS</div>
          <Container
            group-name="requerimientos"
            :get-child-payload="getTargetPayload"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
            @drop="e => onCardDrop('target', e)"
          >
            <Draggable
              v-for="req in requerimientosOrdenados"
              :key="`req_target_${req.id}`"
            >
              <priorizar-requerimientos-item :req="req" />
            </Draggable>
          </Container>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@utils/helpers"
import PageHeader from "@comp/Common/PageHeader"
import PriorizarRequerimientosItem from "@comp/PriorizarRequerimientos/PriorizarRequerimientosItem"
import dummyRequerimientosList from "@utils/dummyRequerimientosList"
import dummyRequerimientosList2 from "@utils/dummyRequerimientosList2"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    PriorizarRequerimientosItem,
    Container,
    Draggable,
  },
  data() {
    return {
      requerimientosAOrdernar: dummyRequerimientosList,
      requerimientosOrdenados: dummyRequerimientosList2,
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      sourceAcceptDrop: true,
    }
  },
  watch: {
    sourceAcceptDrop(val) {
      console.log("sourceAcceptDrop", val)
    },
  },
  methods: {
    getShouldAcceptDrop(src, payload) {
      console.log(src, payload)
      return true
    },
    getSourcePayload(index) {
      console.log("card payload", index)
      return this.requerimientosAOrdernar[index]
    },
    getTargetPayload(index) {
      console.log("card payload", index)
      return this.requerimientosOrdenados[index]
    },
    onCardDrop(list, dropResult) {
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
    },
    log(...params) {
      console.log(...params)
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 1.2rem;
}
</style>
