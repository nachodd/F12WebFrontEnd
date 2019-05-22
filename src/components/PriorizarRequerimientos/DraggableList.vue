<template>
  <div class="shadow-3 bg-grey-2 rounded-borders">
    <div class="title">{{ title }}</div>

    <q-slide-transition>
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
          v-for="(req, index) in requerimientosList.list"
          :key="`req_${req.id}`"
        >
          <priorizar-requerimientos-item :req="req" :index="index" />
        </Draggable>
      </Container>
    </q-slide-transition>
    <q-slide-transition>
      <div v-if="loadingList" class="row text-center loading-container">
        <div class="col self-center">
          <q-spinner-gears size="50px" color="accent" />
        </div>
      </div>
    </q-slide-transition>

    <!-- <q-inner-loading :showing="loadingList">
      <q-spinner-gears size="50px" color="accent" />
    </q-inner-loading> -->
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@utils/helpers"
import PriorizarRequerimientosItem from "@comp/PriorizarRequerimientos/PriorizarRequerimientosItem"
import RequerimientosPriorizarList from "../../models/RequerimientosPriorizarList"

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
      type: RequerimientosPriorizarList,
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
  computed: {
    // orderedRequerimientos() {
    //   return _.sortBy(this.requerimientosList.list, ["prioridad"])
    // },
  },
  methods: {
    getPayload(index) {
      // console.log("getPayload", index)
      // return this.requerimientosList.list[index - 1]
      return this.requerimientosList.list[index]
    },
    onDrop(listName, dropResult) {
      // console.log("onDrop", list, dropResult)

      const listResult = applyDrag(this.requerimientosList.list, dropResult)

      this.$emit("update-list", listName, listResult, dropResult)

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
