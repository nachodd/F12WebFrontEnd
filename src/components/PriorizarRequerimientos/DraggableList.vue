<template>
  <div class="shadow-3 bg-grey-2 rounded-borders">
    <div class="title">{{ title }}</div>
    <Container
      :group-name="groupName"
      :get-child-payload="getCardPayload"
      :should-accept-drop="getShouldAcceptDrop"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :drop-placeholder="dropPlaceholderOptions"
      @drop="e => onCardDrop(listName, e)"
    >
      <Draggable v-for="req in list" :key="`req_${req.id}`">
        <priorizar-requerimientos-item :req="req" />
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@utils/helpers"
import PriorizarRequerimientosItem from "@comp/PriorizarRequerimientos/PriorizarRequerimientosItem"

export default {
  name: "DraggableList",
  components: {
    PriorizarRequerimientosItem,
    Container,
    Draggable,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
      required: true,
    },
    requerimientosList: {
      type: Array,
      required: true,
    },
    listName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: this.requerimientosList,
      dropPlaceholderOptions: {
        className: "drop-group",
        animationDuration: "150",
        showOnTop: true,
      },
    }
  },
  methods: {
    getShouldAcceptDrop(src, payload) {
      console.log(src, payload)
      return true
    },
    getCardPayload(index) {
      return this.list[index]
    },
    onCardDrop(list, dropResult) {
      // this.log("oncarddrop", list, dropResult)
      if (list === "source" && dropResult.removedIndex !== null) {
        const res1 = applyDrag(this.list, dropResult)
        this.$set(this, "list", res1)
      }

      if (list === "target" && dropResult.addedIndex !== null) {
        const res = applyDrag(this.list, dropResult)
        this.$set(this, "list", res)

        console.log(
          "requerimientosOrdenados new:",
          this.requerimientosOrdenados,
        )
      }
    },
    // log(...params) {
    //   console.log(...params)
    // },
  },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 1.2rem;
}
</style>
