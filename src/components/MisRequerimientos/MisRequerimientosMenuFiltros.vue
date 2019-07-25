<template>
  <div class="q-pb-md">
    <q-resize-observer @resize="onResize" />
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        v-model.trim="__descripcion"
        class="standout-custom"
        :class="{ popupOpened: popupOpened }"
        dense
        standout="bg-white text-black"
        placeholder="Buscar"
        @keyup.enter="filtrar"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="iconOpenFilter"
            class="filter__icon cursor-pointer"
            @click="popupOpened = !popupOpened"
          ></q-icon>
        </template>
      </q-input>
      <q-menu
        v-model="popupOpened"
        :offset="[0, -4]"
        content-class="q-menu-fix"
        no-parent-event
      >
        <div class="q-pa-md" :style="{ width: widthInputDescripcion + 'px' }">
          <div class="row q-pt-sm q-col-gutter-xs">
            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
              Sistema
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__sistema"
                :options="sistemas"
                dense
                label="Sistema"
                color="accent"
                :use-filter="false"
                :loading="sistemas.length === 0"
              />
            </div>

            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
              Tipo de Requerimiento
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__tipo"
                :options="requerimientosTipos"
                dense
                label="Tipo de Requerimiento"
                color="accent"
                :use-filter="false"
                :loading="requerimientosTipos.length === 0"
              />
            </div>
          </div>

          <div class="row q-pt-sm justify-end">
            <q-btn size="md" color="deep-purple-10" @click.native="filtrar">
              Filtrar
            </q-btn>
          </div>
        </div>
      </q-menu>
    </div>
    <div class="q-mt-sm">
      <span v-if="sistemaSetted || tipoRequerimientoSetted">Filtros:</span>
      <span v-if="sistemaSetted" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('sistema')">
          <q-avatar color="red" text-color="white" class="filter-label">
            Sist:
          </q-avatar>
          {{ sistemaDescripcion }}
          <q-tooltip>Sistema</q-tooltip>
        </q-chip>
      </span>
      <span v-if="tipoRequerimientoSetted" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('requerimientoTipo')">
          <q-avatar color="blue" text-color="white" class="filter-label">
            Tipo:
          </q-avatar>
          {{ tipoRequerimientoDescripcion }}
          <q-tooltip>Tipo de Requerimiento</q-tooltip>
        </q-chip>
      </span>
    </div>
  </div>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState } from "vuex"
export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {
    sistemaId: {
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

    sistemaSetted() {
      return this.__sistema && Boolean(this.__sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.__tipo && Boolean(this.__tipo.id)
    },
    __sistema: {
      get() {
        return this.sistemaId
      },
      set(value) {
        this.$emit("update:sistemaId", value)
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
    __descripcion: {
      get() {
        return this.descripcion
      },
      set(value) {
        this.$emit("update:descripcion", value)
      },
    },
    sistemaDescripcion() {
      return _.get(this, "__sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "__tipo.descripcion", null)
    },
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
  },
  mounted() {},
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
    filtrar() {
      this.popupOpened = false
      this.$emit("buscar")
    },
    removeFilter(filter) {
      // this.$store.dispatch("asignacionRequerimientos/setFilter", {
      //   filter,
      //   value: null,
      // })

      if (filter == "requerimientoTipo") {
        this.__tipo = null
      }

      if (filter == "sistema") {
        this.__sistema = null
      }

      this.filtrar()
    },
  },
}
</script>
<style lang="stylus"></style>
