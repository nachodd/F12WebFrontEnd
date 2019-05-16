<template>
  <div class="shadow-3 bg-grey-2 rounded-borders">
    <div class="title">{{ title }}</div>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <Container
        v-if="!loadingList"
        :group-name="groupName"
        :get-child-payload="getPayload"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :drop-placeholder="dropPlaceholderOptions"
        @drop="e => onDrop(listName, e)"
      >
        <Draggable
          v-for="req in requerimientosList"
          :key="`req_${req.requerimiento_id}`"
        >
          <priorizar-requerimientos-item :req="req" />
        </Draggable>
      </Container>
    </transition>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-if="loadingList" class="row text-center loading-container">
        <div class="col self-center">
          <q-spinner-gears size="50px" color="accent" />
        </div>
      </div>
    </transition>

    <!-- <q-inner-loading :showing="loadingList">
      <q-spinner-gears size="50px" color="accent" />
    </q-inner-loading> -->
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
    loadingList: {
      type: Boolean,
      default: true,
    },
    // acceptDrop: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  data() {
    return {
      // list: this.requerimientosList,
      dropPlaceholderOptions: {
        className: "drop-group",
        animationDuration: "150",
        showOnTop: true,
      },
    }
  },
  methods: {
    getPayload(index) {
      return this.requerimientosList[index]
    },
    onDrop(list, dropResult) {
      // console.log("onDrop", list, dropResult)
      let result = []

      result = applyDrag(this.requerimientosList, dropResult)

      this.$emit("update-list", list, result, dropResult)

      // this.$emit("update:requerimientos-list", result)

      /* if (list === "source") {
        if (dropResult.removedIndex !== null) {
          result = applyDrag(this.requerimientosList, dropResult)
          // this.$set(this, "list", res1)
          this.$emit("update:requerimientos-list", result)
        } else {
          result = applyDrag(this.requerimientosList, dropResult)
          // this.$set(this, "list", res1)
          this.$emit("update:requerimientos-list", result)
          console.log("tryed to drop on source list")
        }
      }

      if (list === "target" && dropResult.addedIndex !== null) {
        result = applyDrag(this.requerimientosList, dropResult)
        // this.$set(this, "list", res)
        this.$emit("update:requerimientos-list", result)
      } */
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 1.2rem;
}
.loading-container {
  min-height: 100px;
}
</style>
