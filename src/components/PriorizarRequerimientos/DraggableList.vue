<template>
  <div class="shadow-3 bg-grey-2 rounded-borders">
    <div class="title">{{ title }}</div>
    <!-- :should-accept-drop="getShouldAcceptDrop" -->
    <Container
      :group-name="groupName"
      :get-child-payload="getCardPayload"
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
    acceptDrop: {
      type: Boolean,
      default: true,
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
    // getShouldAcceptDrop() {
    //   console.log("ShouldAcceptDrop", )
    // },
    getCardPayload(index) {
      return this.list[index]
    },
    onCardDrop(list, dropResult) {
      console.log("oncarddrop", list, dropResult)

      if (list === "source") {
        if (dropResult.removedIndex !== null) {
          const res1 = applyDrag(this.list, dropResult)
          this.$set(this, "list", res1)
        } else {
          console.log("tryed to drop on source list")
        }
      }

      if (list === "target" && dropResult.addedIndex !== null) {
        const res = applyDrag(this.list, dropResult)
        this.$set(this, "list", res)
      }

      this.$emit("update:requerimientos-list", this.list)
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
