<template>
  <div class="q-py-md">
    <q-input
      ref="inputDescripcion"
      v-model.trim="__descripcion"
      class="standout-custom"
      dense
      standout="bg-white text-black"
      placeholder="Buscar por Asunto, Descripcion..."
      @keyup.enter="filtrar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon :name="iconOpenFilter" class="cursor-pointer">
          <q-menu
            v-model="popupOpened"
            :offset="[14, 8]"
            content-class="z-index-fix"
          >
            <div
              class="row no-wrap q-pa-md q-col-gutter-xs"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <div class="col-xs-12 col-sm-6">
                <select-custom
                  v-model="__sistema"
                  :options="sistemasUsuarioOptions"
                  dense
                  label="Sistema"
                  :loading="sistemas.length === 0"
                />
              </div>
              <div class="col-xs-12 col-sm-6">
                <select-custom
                  v-model="__tipo"
                  :options="requerimientosTipos"
                  label="Tipo de Requerimiento"
                  dense
                  :loading="requerimientosTipos.length === 0"
                />
              </div>
            </div>
            <div class="row q-pa-md justify-end">
              <q-btn color="deep-purple-10" size="md" @click="filtrar">
                Filtrar
              </q-btn>
            </div>
          </q-menu>
        </q-icon>
      </template>
      <q-resize-observer @resize="onResize" />
    </q-input>
    <div class="row">
      <div v-if="sistemaSetted" class="col">
        <q-chip removable @remove="removeFilter('sistema')">
          <q-avatar color="red" text-color="white" class="filter-label">
            Sist:
          </q-avatar>
          {{ sistemaDescripcion }}
        </q-chip>
      </div>
      <div v-if="tipoRequerimientoSetted" class="col">
        <q-chip removable @remove="removeFilter('tipo')">
          <q-avatar color="blue" text-color="white" class="filter-label">
            Tipo:
          </q-avatar>
          {{ tipoRequerimientoDescripcion }}
        </q-chip>
      </div>
    </div>
  </div>
</template>
<script>
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {
    sistema: {
      type: Object,
      default: null,
    },
    seccionId: {
      type: Object,
      default: null,
    },
    requerimientoTipo: {
      type: Object,
      default: null,
    },
    descripcion: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      input: "",
      widthInputDescripcion: 0,
      popupOpened: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
    }),
    ...mapGetters("auth", ["userSistemas"]),
    sistemasUsuarioOptions() {
      return _.filter(this.sistemas, s => {
        return _.findIndex(this.userSistemas, { id: s.id }) !== -1
      })
    },
    __descripcion: {
      get() {
        return this.descripcion
      },
      set(value) {
        this.$emit("update:descripcion", value)
      },
    },
    __sistema: {
      get() {
        return this.sistema
      },
      set(value) {
        this.$emit("update:sistema", value)
      },
    },
    __tipo: {
      get() {
        return this.requerimientoTipo
      },
      set(value) {
        this.$emit("update:requerimientoTipo", value)
      },
    },
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
    sistemaDescripcion() {
      return _.get(this, "sistema.descripcion", null)
    },
    sistemaSetted() {
      return this.sistema && Boolean(this.sistema.id)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "tipo.descripcion", null)
    },
    tipoRequerimientoSetted() {
      return this.tipo && Boolean(this.tipo.id)
    },
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width + 60 + 32 //+ 41
    },
    removeFilter(filterToRemove) {
      if (filterToRemove === "sistema") {
        this.$emit("update:sistema", null)
      } else if (filterToRemove === "tipo") {
        this.$emit("update:requerimientoTipo", null)
      }
    },
    filtrar() {
      this.$emit("filtrar")
      this.popupOpened = false
    },
  },
}
</script>
<style lang="scss">
.z-index-fix {
  z-index: 1 !important;
}
.filter-label .q-avatar__content {
  font-size: 0.4em;
}
</style>
