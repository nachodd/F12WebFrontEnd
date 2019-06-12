<template>
  <list-requerimientos :loading-list="loadingList" :title="title">
    <Container
      v-if="!loadingList"
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
          <priorizar-requerimientos-item
            :req="req"
            :index="index"
            @click.native="
              abrirDetalleRequerimiento({
                reqId: req.id,
                listName: listNameForDetalle,
              })
            "
          />
        </Draggable>
      </template>
    </Container>
  </list-requerimientos>
</template>

<script>
import { mapActions } from "vuex"
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@utils/helpers"
import PriorizarRequerimientosItem from "@comp/PriorizarRequerimientos/PriorizarRequerimientosItem"
import ListRequerimientos from "@comp/Common/ListRequerimientos"
import RequerimientosPriorizarList from "@models/RequerimientosPriorizarList"

export default {
  name: "DraggableList",
  components: {
    ListRequerimientos,
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
    listNameForDetalle() {
      return this.listName === "source"
        ? "reqs-pendientes-aprobacion"
        : "reqs-aprobados-priorizados"
    },
  },
  methods: {
    // map `this.abrirDetalleRequerimiento(...)` to `this.$store.dispatch("priorizarRequerimientos/abrirDetalleRequerimiento",...)`
    ...mapActions({
      abrirDetalleRequerimiento: "requerimientos/abrirDetalleRequerimiento",
    }),
    getPayload(index) {
      return this.requerimientosList.list[index]
    },
    onDrop(listName, dropResult) {
      // console.log("onDrop", list, dropResult)
      const listResult = applyDrag(this.requerimientosList.list, dropResult)

      const updatedListData = { listName, listResult, dropResult }

      this.$store.dispatch(
        "priorizarRequerimientos/processUpdateList",
        updatedListData,
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
