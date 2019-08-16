<template>
  <div>
    <q-page-sticky v-if="fabShowed" position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        text-color="white"
        class="bg-gradient"
        :to="{ query: { ver: 'crearRequerimiento' } }"
      >
        <tooltip
          anchor="center left"
          self="center right"
          content-class="bg-accent"
          content-style="font-size: 14px"
        >
          Nuevo Requerimiento
        </tooltip>
      </q-btn>
    </q-page-sticky>

    <!-- full-height -->
    <q-dialog
      v-model="crudModalOpen"
      persistent
      transition-show="scale"
      transition-hide="scale"
      @hide="removeQueryParams"
    >
      <q-layout container view="hHh lpR fFf" class="bg-white">
        <q-header elevated class="bg-gradient text-white items-center">
          <q-toolbar class="q-pa-md">
            <q-toolbar-title>
              <div class="text-h6">{{ title }}</div>
            </q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-scroll-area
            :thumb-style="{
              right: '2px',
              borderRadius: '5px',
              background: 'linear-gradient(to top, #5e35b1, #1565c0)',
              width: '5px',
              opacity: 0.75,
            }"
            class="modal-fabcrud-body"
          >
            <crear-editar-requerimiento
              ref="crud"
              @form-submitted="removeQueryParams"
            />
          </q-scroll-area>
        </q-page-container>

        <q-footer elevated class="bg-white">
          <q-card-actions align="right">
            <q-btn
              flat
              label="Cerrar"
              color="negative"
              @click="crudModalOpen = false"
            />
            <q-btn
              :label="submitText"
              color="deep-purple-10"
              :outline="submitLoading"
              :loading="submitLoading"
              @click="handleSubmit"
            />
          </q-card-actions>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
// import { warn, success } from "utils/helpers
import CrearEditarRequerimiento from "comp/Requerimientos/CrearEditarRequerimiento"
import { mapState } from "vuex"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "FabCrudModal",
  components: {
    CrearEditarRequerimiento,
    Tooltip,
  },
  data() {
    return {
      crudModalOpen: false,
      fabShowed: false,
      title: "",
      isEdit: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
      procesandoArchivosCargados: state => state.procesandoArchivosCargados,
    }),
    submitText() {
      return this.isEdit ? "Editar Requerimiento" : "Cargar Requerimiento"
    },
    submitLoading() {
      return this.procesandoArchivosCargados || this.loadingRequerimiento
    },
  },
  watch: {
    "$route.name": {
      immediate: true,
      handler(routeName) {
        switch (routeName) {
          case "mis-requerimientos":
            this.fabShowed = true
            break
          default:
            this.fabShowed = false
            break
        }
      },
    },
    "$route.query": {
      handler: function({ ver, id = null }) {
        if (ver === "editarRequerimiento") {
          this.title = `Editar Requerimiento #${id}`
          this.isEdit = true
        } else if (ver === "crearRequerimiento") {
          this.title = "Nuevo Requerimiento"
          this.isEdit = false
        }

        switch (ver) {
          case "crearRequerimiento":
          case "editarRequerimiento":
            this.$nextTick(() => {
              this.crudModalOpen = true
            })
            break
          default:
            this.crudModalOpen = false
            break
        }
      },
      immediate: true,
    },
  },
  methods: {
    removeQueryParams() {
      this.$router.replace({ query: null })
    },
    handleSubmit() {
      this.$refs.crud.handleSubmit()
    },
  },
}
</script>

<style lang="scss">
.modal-fabcrud-body {
  min-height: 100px;
  height: calc(100vh - 121px - 44px);
  // max-height: 700px;
}
// .q-dialog__inner--minimized > div {
//   max-height: 700px;
// }
</style>
