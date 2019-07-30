<template>
  <!-- style="width: 100%; max-width:600px; margin:0 auto;" -->
  <div class="q-pb-md">
    <q-resize-observer @resize="onResize" />
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        v-model.trim="__descripcion"
        class="filter"
        :class="{ popupOpened: popupOpened, aclarado: inputAclarado }"
        :style="{ width: widthInputDescripcion + 'px important' }"
        dense
        standout="bg-white text-black"
        placeholder="Buscar"
        @keyup.enter="filtrar"
        @focus="inputAclarado = true"
        @blur="inputAclarado = false"
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
        <div
          class="q-pa-md row"
          :style="{ width: widthInputDescripcion + 'px' }"
        >
          <div class="col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-xs-12">
            <div class="row q-mt-sm q-col-gutter-sm items-center">
              <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                Req. Nro
              </div>
              <div class="col-xs-9">
                <q-input
                  v-model.number="__reqId"
                  dense
                  type="number"
                  min="0"
                  color="deep-purple-10"
                />
              </div>

              <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                Estados
              </div>
              <div class="col-xs-9">
                <q-select
                  v-model="__estados"
                  :options="estadosOptionsFiltered"
                  clearable
                  dense
                  use-input
                  use-chips
                  multiple
                  color="deep-purple-10"
                  @filter="filterEstadosAsignados"
                />
              </div>
            </div>

            <div class="row q-mt-sm q-col-gutter-sm items-center">
              <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                Sistema
              </div>
              <div class="col-xs-9">
                <select-custom
                  v-model="__sistema"
                  :options="sistemas"
                  dense
                  color="accent"
                  :use-filter="false"
                  :loading="sistemas.length === 0"
                />
              </div>

              <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                Tipo Req.
              </div>
              <div class="col-xs-9">
                <select-custom
                  v-model="__tipo"
                  :options="requerimientosTipos"
                  dense
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
        </div>
      </q-menu>
    </div>
    <div class="q-mt-sm">
      <span v-if="someFilterIsSetted">Filtros:</span>
      <span v-if="reqIdSetted && filterPhoto.reqId" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('reqId')">
          <q-avatar color="green" text-color="white" class="filter-label">
            Id:
          </q-avatar>
          {{ filterPhoto.reqId }}
          <q-tooltip>Requerimiento Nro</q-tooltip>
        </q-chip>
      </span>
      <span v-if="estadosSetted && filterPhoto.estados" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('estados')">
          <q-avatar color="orange" text-color="white" class="filter-label">
            Est.:
          </q-avatar>
          {{ filterPhoto.estados }}
          <q-tooltip>Estdos de los Requerimientos</q-tooltip>
        </q-chip>
      </span>
      <span v-if="sistemaSetted && filterPhoto.sistema" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('sistema')">
          <q-avatar color="red" text-color="white" class="filter-label">
            Sist:
          </q-avatar>
          {{ filterPhoto.sistema }}
          <q-tooltip>Sistema</q-tooltip>
        </q-chip>
      </span>
      <span v-if="tipoRequerimientoSetted && filterPhoto.tipo" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('requerimientoTipo')">
          <q-avatar color="blue" text-color="white" class="filter-label">
            Tipo:
          </q-avatar>
          {{ filterPhoto.tipo }}
          <q-tooltip>Tipo de Requerimiento</q-tooltip>
        </q-chip>
      </span>
    </div>
  </div>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"

export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {
    reqId: {
      type: String,
      default: null,
    },
    estados: {
      type: Array,
      default: null,
    },
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
      inputAclarado: false,
      estadosOptionsFiltered: null,
      filterPhoto: {
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
      },
      someFilterIsSetted: false,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
    }),
    ...mapGetters("requerimientos", ["optionsEstados"]),
    sistemaSetted() {
      return this.__sistema && Boolean(this.__sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.__tipo && Boolean(this.__tipo.id)
    },
    reqIdSetted() {
      return this.__reqId && Boolean(this.__reqId)
    },
    estadosSetted() {
      return (
        this.estados && Array.isArray(this.estados) && this.estados.length > 0
      )
    },
    // someFilterIsSetted() {
    //   debugger
    //   const res = _.some([
    //     this.__reqId,
    //     this.__estados,
    //     this.__sistema,
    //     this.__tipo,
    //   ])
    //   debugger
    //
    //   return res
    // },
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
    __reqId: {
      get() {
        return this.reqId
      },
      set(value) {
        this.$emit("update:reqId", value)
      },
    },
    __estados: {
      get() {
        return this.estados
      },
      set(value) {
        this.$emit("update:estados", value)
      },
    },
    estadosDescripcion() {
      return this.estadosSetted
        ? this.__estados.map(st => st.label).join(", ")
        : ""
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
      this.someFilterIsSetted = _.some([
        this.__reqId,
        this.__estados,
        this.__sistema,
        this.__tipo,
      ])
      this.updateFilterPhoto()
      this.popupOpened = false
      this.$emit("buscar")
    },
    updateFilterPhoto() {
      this.filterPhoto.reqId = this.reqIdSetted ? this.reqId : null
      this.filterPhoto.estados =
        this.__estados !== null ? this.estadosDescripcion : null
      this.filterPhoto.sistema = this.sistemaSetted
        ? this.sistemaDescripcion
        : null
      this.filterPhoto.tipo = this.tipoRequerimientoSetted
        ? this.tipoRequerimientoDescripcion
        : null
    },
    filterEstadosAsignados(val, update) {
      if (val === "") {
        update(() => {
          this.estadosOptionsFiltered = this.optionsEstados
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.estadosOptionsFiltered = this.optionsEstados.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1,
        )
      })
    },
    async removeFilter(filter) {
      // NOTE: directamente llamamos $emit("update:...", null) porque setear el campo directamente (ej: __reqId = null) no funcionaba
      // Ademas lo ponemos con un await asi esperamos que el evento se propage arriba y actualice
      if (filter == "reqId") {
        this.__reqId = null
        // await this.$emit("update:reqId", null)
      }
      if (filter == "estados") {
        debugger
        this.__estados = null
        this.filterPhoto.estados = null
        debugger
        // await this.$emit("update:estados", null)
      }
      if (filter == "requerimientoTipo") {
        this.__tipo = null
        // await this.$emit("update:requerimientoTipo", null)
      }
      if (filter == "sistema") {
        this.__sistema = null
        // await this.$emit("update:sistemaId", null)
      }
      this.someFilterIsSetted = _.some([
        this.__reqId,
        this.__estados,
        this.__sistema,
        this.__tipo,
      ])
      this.updateFilterPhoto()
      this.filtrar()
    },
  },
}
</script>
<style lang="stylus" scoped></style>
