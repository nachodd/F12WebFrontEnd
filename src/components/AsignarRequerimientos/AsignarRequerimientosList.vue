<template>
  <list-requerimientos :loading-list="loadingList" :title="title">
    <template v-if="listEmpty">
      <div class="text-h6 text-center">
        No hay requerimientos para mostrar!
      </div>
    </template>
    <template v-else>
      <template v-if="draggable">
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
            v-for="(req, index) in requerimientosList"
            :key="`req_${req.id}`"
          >
            <asignar-requerimientos-item
              :req="req"
              :index="index"
              @click.native="
                abrirDetalleRequerimiento({
                  reqId: req.id,
                  listName: 'asignar-requerimientos',
                })
              "
            />
          </Draggable>
        </Container>
      </template>
      <template v-else>
        <asignar-requerimientos-item
          v-for="(req, index) in requerimientosList"
          :key="`req_${req.id}`"
          :req="req"
          :index="index"
          @click.native="
            abrirDetalleRequerimiento({
              reqId: req.id,
              listName: 'asignar-requerimientos',
            })
          "
        />
      </template>
    </template>
  </list-requerimientos>
</template>

<script>
import { mapActions } from "vuex"
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "@utils/helpers"
import ListRequerimientos from "@comp/Common/ListRequerimientos"
import AsignarRequerimientosItem from "@comp/AsignarRequerimientos/AsignarRequerimientosItem"

export default {
  components: {
    ListRequerimientos,
    AsignarRequerimientosItem,
    Container,
    Draggable,
  },
  props: {
    requerimientosList: {
      type: Array,
      required: true,
    },
    loadingList: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    listName: {
      type: String,
      default: "",
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
      return this.requerimientosList.length === 0
    },
  },
  methods: {
    ...mapActions({
      setDetalleRequerimiento: "requerimientos/setDetalleRequerimiento",
      abrirDetalleRequerimiento: "requerimientos/abrirDetalleRequerimiento",
    }),
    getPayload(index) {
      return this.requerimientosList[index]
    },
    onDrop(listName, dropResult) {
      const listResult = applyDrag(this.requerimientosList, dropResult)

      const updatedListData = { listName, listResult, dropResult }

      // console.log(updatedListData)
      this.$store.dispatch(
        "asignacionRequerimientos/processUpdateList",
        updatedListData,
      )

      // this.setDetalleRequerimiento({
      //   reqId: dropResult.payload.id,
      //   listName: "asignar-requerimientos",
      // }).then(() => {
      //   this.$store.dispatch(
      //     "asignacionRequerimientos/setDialogConfirmOperationOpen",
      //     true,
      //   )
      // })
    },
  },
}
</script>

<style lang="scss" scoped></style>
