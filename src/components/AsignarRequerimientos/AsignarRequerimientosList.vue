<template>
  <list-requerimientos :loading-list="loadingList" :title="title">
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
        <template v-if="listEmpty">
          <div class="text-h6 text-center">
            No hay requerimientos
            <br />
            para mostrar!
          </div>
        </template>
        <template v-else>
          <Draggable
            v-for="(req, index) in requerimientosList"
            :key="`req_${req.id}`"
          >
            <transition
              appear
              name="flip"
              mode="out-in"
              enter-active-class="animated slow flipInY"
              leave-active-class="animated slow flipOutY"
            >
              <requerimiento-card
                :req="req"
                :index="index"
                card-type="asignar"
                @click.native="
                  abrirDetalleRequerimiento({
                    reqId: req.id,
                    listName: 'asignar-requerimientos',
                  })
                "
              />
              <!-- <asignar-requerimientos-item
                :req="req"
                :index="index"
                @click.native="
                  abrirDetalleRequerimiento({
                    reqId: req.id,
                    listName: 'asignar-requerimientos',
                  })
                "
              /> -->
            </transition>
          </Draggable>
        </template>
      </Container>
    </template>
    <template v-else>
      <template v-if="listEmpty">
        <div class="text-h6 text-center">
          No hay requerimientos
          <br />
          para mostrar!
        </div>
      </template>
      <template v-else>
        <transition-group
          name="flip"
          tag="div"
          appear
          enter-active-class="animated slow flipInY"
          leave-active-class="animated slow flipOutY"
        >
          <requerimiento-card
            :key="`req_${req.id}`"
            :req="req"
            :index="index"
            card-type="asignar"
            @click.native="
              abrirDetalleRequerimiento({
                reqId: req.id,
                listName: 'asignar-requerimientos',
              })
            "
          />
          <!-- <asignar-requerimientos-item
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
          /> -->
        </transition-group>
      </template>
    </template>
  </list-requerimientos>
</template>

<script>
import { mapActions } from "vuex"
import { Container, Draggable } from "vue-smooth-dnd"
import { applyDrag } from "utils/helpers"
import ListRequerimientos from "comp/Common/ListRequerimientos"
import RequerimientoCard from "comp/Common/RequerimientoCard"
// import AsignarRequerimientosItem from "comp/AsignarRequerimientos/AsignarRequerimientosItem"
import { success, warn } from "utils/helpers"

export default {
  name: "AsignarRequerimientosList",
  components: {
    ListRequerimientos,
    // AsignarRequerimientosItem,
    RequerimientoCard,
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
      abrirDetalleRequerimiento: "requerimientos/abrirDetalleRequerimiento",
    }),
    getPayload(index) {
      return this.requerimientosList[index]
    },
    onDrop(listName, dropResult) {
      const listResult = applyDrag(this.requerimientosList, dropResult)

      const updatedListData = { listName, listResult, dropResult }

      this.$store
        .dispatch("asignacionRequerimientos/processUpdateList", updatedListData)
        .then(message => {
          if (message) success({ message })
        })
        .catch(({ message }) => {
          warn({ message })
        })
    },
  },
}
</script>

<style lang="scss"></style>
