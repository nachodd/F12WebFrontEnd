<template>
  <base-filter
    search-placeholder="Buscar..."
    :descripcion.sync="filterValues.descripcion"
    :some-filter-is-setted="someFilterIsSetted"
  >
    <div class="q-pb-md">
      <q-resize-observer @resize="onResize" />
      <div class="q-mb-sm">
        <q-input
          ref="inputDescripcion"
          v-model.trim="filterValues.descripcion"
          class="filter"
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
          <div
            class="q-pa-md row justify-center"
            :style="{
              width: widthInputDescripcion + 'px',
              'padding-top': '0',
            }"
          >
            <div class="col-md-8 col-sm-8 col-xs-12">
              <div class="row q-mt-sm q-col-gutter-sm items-center">
                <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                  Nro Requerimiento
                </div>
                <div class="col-xs-9">
                  <q-input
                    v-model.number="filterValues.reqId"
                    dense
                    type="number"
                    min="0"
                    color="deep-purple-10"
                  />
                </div>
              </div>
              <div class="row q-mt-sm q-col-gutter-sm items-center">
                <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                  Estados
                </div>
                <div class="col-xs-9">
                  <q-select
                    v-model="filterValues.estados"
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
                    v-model="filterValues.sistema"
                    :options="sistemas"
                    dense
                    color="accent"
                    :use-filter="false"
                    :loading="sistemas.length === 0"
                  />
                </div>
              </div>
              <div class="row q-mt-sm q-col-gutter-sm items-center">
                <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                  Tipo Requerimiento
                </div>
                <div class="col-xs-9">
                  <select-custom
                    v-model="filterValues.tipo"
                    :options="requerimientosTipos"
                    dense
                    color="accent"
                    :use-filter="false"
                    :loading="requerimientosTipos.length === 0"
                  />
                </div>
              </div>

              <div
                v-if="!esElUltimoDeLaCadenaDeMando"
                class="row q-mt-sm q-col-gutter-sm items-center"
              >
                <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                  Usuario Alta
                </div>
                <div class="col-xs-9">
                  <select-custom
                    v-model="filterValues.usuarioAlta"
                    :options="optionsUsuariosFiltro"
                    dense
                    color="accent"
                    :loading="optionsUsuariosFiltro.length === 0"
                  />
                </div>
              </div>

              <div class="row q-mt-md justify-end">
                <q-btn color="negative" flat size="md" @click="limpiarFiltros">
                  Limpiar Filtro
                </q-btn>
                <q-btn size="md" color="deep-purple-10" @click="filtrar">
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
            <div class="filter-chip__text">
              {{ filterPhoto.reqId }}
            </div>
            <tooltip content-class="text-caption">Requerimiento Nro</tooltip>
          </q-chip>
        </span>
        <span v-if="estadosSetted && filterPhoto.estados" class="q-mx-xs">
          <q-chip removable @remove="removeFilter('estados')">
            <q-avatar color="orange" text-color="white" class="filter-label">
              Est.:
            </q-avatar>
            <div class="filter-chip__text">
              {{ filterPhoto.estados }}
            </div>
            <tooltip content-class="text-caption">
              Estdos de los Requerimientos
            </tooltip>
          </q-chip>
        </span>
        <span v-if="sistemaSetted && filterPhoto.sistema" class="q-mx-xs">
          <q-chip removable @remove="removeFilter('sistema')">
            <q-avatar color="red" text-color="white" class="filter-label">
              Sist:
            </q-avatar>
            <div class="filter-chip__text">
              {{ filterPhoto.sistema }}
            </div>
            <tooltip content-class="text-caption">Sistema</tooltip>
          </q-chip>
        </span>
        <span
          v-if="tipoRequerimientoSetted && filterPhoto.tipo"
          class="q-mx-xs"
        >
          <q-chip removable @remove="removeFilter('requerimientoTipo')">
            <q-avatar color="blue" text-color="white" class="filter-label">
              Tipo:
            </q-avatar>
            <div class="filter-chip__text">
              {{ filterPhoto.tipo }}
            </div>
            <tooltip content-class="text-caption">
              Tipo de Requerimiento
            </tooltip>
          </q-chip>
        </span>
        <span
          v-if="usuarioAltaSetted && filterPhoto.usuarioAlta"
          class="q-mx-xs"
        >
          <q-chip removable @remove="removeFilter('usuarioAlta')">
            <q-avatar color="purple" text-color="white" class="filter-label">
              U.A.:
            </q-avatar>
            <div class="filter-chip__text">
              {{ filterPhoto.usuarioAlta }}
            </div>
            <tooltip content-class="text-caption">Usuario Asignado</tooltip>
          </q-chip>
        </span>
      </div>
    </div>
  </base-filter>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
import Tooltip from "comp/Common/Tooltip"
import BaseFilter from "comp/Common/BaseFilter"

export default {
  name: "MisRequerimientosMenuFiltros",
  components: { BaseFilter, SelectCustom, Tooltip },
  props: {
    filtros: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      widthInputDescripcion: 0,
      popupOpened: false,
      estadosOptionsFiltered: null,
      filterValues: {
        descripcion: null,
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        usuarioAlta: null,
      },
      filterPhoto: {
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        usuarioAlta: null,
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
    ...mapGetters({
      optionsUsuariosFiltro: "auth/usuariosFiltro",
      esElUltimoDeLaCadenaDeMando: "auth/esElUltimoDeLaCadenaDeMando",
    }),

    sistemaSetted() {
      return this.filterValues.sistema && Boolean(this.filterValues.sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.filterValues.tipo && Boolean(this.filterValues.tipo.id)
    },
    reqIdSetted() {
      return this.filterValues.reqId && Boolean(this.filterValues.reqId)
    },
    estadosSetted() {
      return (
        this.filterValues.estados &&
        Array.isArray(this.filterValues.estados) &&
        this.filterValues.estados.length > 0
      )
    },
    usuarioAltaSetted() {
      return (
        this.filterValues.usuarioAlta &&
        Boolean(this.filterValues.usuarioAlta.id)
      )
    },
    estadosDescripcion() {
      return this.estadosSetted
        ? this.filterValues.estados.map(st => st.label).join(", ")
        : ""
    },
    sistemaDescripcion() {
      return _.get(this, "filterValues.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterValues.tipo.descripcion", null)
    },
    usuarioAltaDescripcion() {
      return _.get(this, "filterValues.usuarioAlta.descripcion", null)
    },
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
  },
  async mounted() {
    await this.$store.dispatch("requerimientos/initFiltrosMisRequerimientos")
    const {
      descripcion,
      reqId,
      estados,
      sistema,
      tipo,
      usuarioAlta,
    } = this.filtros

    if (descripcion) this.filterValues.descripcion = descripcion
    if (reqId) this.filterValues.reqId = reqId
    if (estados) this.filterValues.estados = estados
    if (sistema) this.filterValues.sistema = sistema
    if (tipo) this.filterValues.tipo = tipo
    if (usuarioAlta) this.filterValues.usuarioAlta = usuarioAlta

    this.filtrar()
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
    filtrar() {
      this.updateFilterPhoto()
      this.getSomeFilterIsSetted()
      this.popupOpened = false
      this.$emit("buscar", this.filterValues)
    },
    limpiarFiltros() {
      this.filterValues.descripcion = null
      this.filterValues.reqId = null
      this.filterValues.estados = null
      this.filterValues.tipo = null
      this.filterValues.sistema = null
      this.filterValues.usuarioAlta = null
      this.filtrar()
    },
    getSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.filterValues.reqId !== null,
        this.estadosSetted,
        this.filterValues.sistema !== null,
        this.filterValues.tipo !== null,
        this.filterValues.usuarioAlta !== null,
      ])
    },
    updateFilterPhoto() {
      this.filterPhoto.reqId = this.filterValues.reqId
      this.filterPhoto.estados = this.estadosDescripcion || null
      this.filterPhoto.sistema = this.sistemaDescripcion || null
      this.filterPhoto.tipo = this.tipoRequerimientoDescripcion || null
      this.filterPhoto.usuarioAlta = this.usuarioAltaDescripcion || null
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
      if (filter == "reqId") {
        this.filterValues.reqId = null
      }
      if (filter == "estados") {
        this.filterValues.estados = null
      }
      if (filter == "requerimientoTipo") {
        this.filterValues.tipo = null
      }
      if (filter == "sistema") {
        this.filterValues.sistema = null
      }
      if (filter == "usuarioAlta") {
        this.filterValues.usuarioAlta = null
      }
      this.filtrar()
    },
  },
}
</script>
<style lang="stylus" scoped></style>
