<template>
  <div class="shadow-3 bg-grey-2 rounded-borders">
    <div class="bg-deep-purple-10 card-header rounded-borders-8">
      {{ title }}
    </div>
    <q-slide-transition>
      <Container
        v-if="!loadingList"
        class="req-container"
        :group-name="groupName"
        :get-child-payload="getPayload"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :drop-placeholder="dropPlaceholderOptions"
        @drop="e => onDrop(listName, e)"
      >
        <template v-if="listEmpty">
          <div class="text-h6 text-center">
            No hay requerimientos para mostrar!
          </div>
        </template>
        <template v-else>
          <Draggable
            v-for="(req, index) in requerimientosList.list"
            :key="`req_${req.id}`"
          >
            <priorizar-requerimientos-item :req="req" :index="index" />
          </Draggable>
        </template>
      </Container>
    </q-slide-transition>
    <q-slide-transition>
      <div v-if="loadingList" class="row text-center loading-container">
        <div class="col self-center">
          <q-spinner-gears size="50px" color="accent" />
        </div>
      </div>
    </q-slide-transition>
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
    listEmpty() {
      return this.requerimientosList.list.length === 0
    },
  },
  methods: {
    getPayload(index) {
      return this.requerimientosList.list[index]
    },
    onDrop(listName, dropResult) {
      // console.log("onDrop", list, dropResult)
      const listResult = applyDrag(this.requerimientosList.list, dropResult)
      debugger

      this.$emit("update-list", listName, listResult, dropResult)
    },
  },
}
</script>

<style lang="scss" scoped>
.loading-container {
  min-height: 100px;
}
.card-header {
  text-align: center;
  font-size: 1.2rem;
  color: #fff;
  width: 90%;
  position: relative;
  top: -20px;
  box-shadow: inherit;
  margin: 0 auto;
  padding: 5px;
}
.req-container {
  position: relative;
  top: -10px;
}
</style>
