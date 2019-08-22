<template>
  <base-filter
    ref="baseFilter"
    search-placeholder="Buscar en Asunto, Descripción..."
    :descripcion.sync="filterValues.descripcion"
    :some-filter-is-setted="someFilterIsSetted"
    @filtrar="filtrar"
  >
    <!-- v-slot:body="data"  === #body="data" -->
    <template #body>
      <base-filter-input label="Nro Requerimiento">
        <q-input
          v-model.number="filterValues.reqId"
          dense
          type="number"
          min="0"
          color="deep-purple-10"
        />
      </base-filter-input>
      <base-filter-input label="Estados">
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
      </base-filter-input>
      <base-filter-input label="Sistema">
        <select-custom
          v-model="filterValues.sistema"
          :options="sistemas"
          dense
          color="deep-purple-10"
          :use-filter="false"
          :loading="sistemas.length === 0"
        />
      </base-filter-input>
      <base-filter-input label="Area">
        <select-custom
          v-model="filterValues.area"
          :options="areas"
          dense
          color="deep-purple-10"
          :loading="areas.length === 0"
        />
      </base-filter-input>
      <base-filter-input label="Tipo Requerimiento">
        <select-custom
          v-model="filterValues.tipo"
          :options="requerimientosTipos"
          dense
          color="deep-purple-10"
          :use-filter="false"
          :loading="requerimientosTipos.length === 0"
        />
      </base-filter-input>

      <base-filter-input label="Usuario Alta">
        <select-custom
          v-model="filterValues.usuarioAlta"
          :options="optionsUsuariosFiltro"
          dense
          color="deep-purple-10"
          :loading="optionsUsuariosFiltro.length === 0"
        />
      </base-filter-input>

      <div class="row q-mt-sm q-col-gutter-sm items-center">
        <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
          Fecha Desde
        </div>
        <div class="col-xs-3">
          <input-date-custom
            v-model="filterValues.fechaDesde"
            color="deep-purple-10"
            :outlined="false"
            dense
          />
        </div>
        <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
          Fecha Hasta
        </div>
        <div class="col-xs-3">
          <input-date-custom
            v-model="filterValues.fechaHasta"
            color="deep-purple-10"
            :outlined="false"
            dense
          />
        </div>
      </div>
    </template>

    <template v-slot:buttons>
      <q-btn color="negative" flat size="md" @click="limpiarFiltros">
        Limpiar Filtro
      </q-btn>
      <q-btn size="md" color="deep-purple-10" @click="filtrar">
        Filtrar
      </q-btn>
    </template>

    <template v-slot:footer>
      <base-filter-chip
        :showed="Boolean(filterPhoto.reqId)"
        label="Id:"
        :value="filterPhoto.reqId"
        :tooltip="'Requerimiento Nro: ' + filterPhoto.reqId"
        color="green"
        @remove="removeFilter('reqId')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.estados)"
        label="Est.:"
        :value="filterPhoto.estados"
        :tooltip="'Estdos de los Reqs.: ' + filterPhoto.estados"
        color="orange"
        @remove="removeFilter('estados')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.sistema)"
        label="Sist:"
        :value="filterPhoto.sistema"
        :tooltip="'Sistema: ' + filterPhoto.sistema"
        color="red"
        @remove="removeFilter('sistema')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.area)"
        label="Area:"
        :value="filterPhoto.area"
        :tooltip="'Area: ' + filterPhoto.area"
        color="teal"
        @remove="removeFilter('area')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.tipo)"
        label="Tipo:"
        :value="filterPhoto.tipo"
        :tooltip="'Tipo de Requerimiento: ' + filterPhoto.tipo"
        color="blue"
        @remove="removeFilter('tipo')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.usuarioAlta)"
        label="U.A.:"
        :value="filterPhoto.usuarioAlta"
        :tooltip="'Usuario Alta: ' + filterPhoto.usuarioAlta"
        color="purple"
        @remove="removeFilter('usuarioAlta')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.fechaDesde)"
        label="Des:"
        :value="filterPhoto.fechaDesde"
        :tooltip="'Fecha Desde: ' + filterPhoto.fechaDesde"
        color="amber"
        @remove="removeFilter('fechaDesde')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.fechaHasta)"
        label="Has:"
        :value="filterPhoto.fechaHasta"
        :tooltip="'Fecha Hasta: ' + filterPhoto.fechaHasta"
        color="deep-orange"
        @remove="removeFilter('fechaHasta')"
      />
    </template>
  </base-filter>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import InputDateCustom from "comp/Common/InputDateCustom"
import { mapState, mapGetters } from "vuex"
import BaseFilter from "comp/Common/BaseFilter"
import BaseFilterInput from "comp/Common/BaseFilterInput"
import BaseFilterChip from "comp/Common/BaseFilterChip"

export default {
  name: "MisRequerimientosMenuFiltros",
  components: {
    BaseFilter,
    BaseFilterInput,
    BaseFilterChip,
    SelectCustom,
    InputDateCustom,
  },
  props: {
    filtros: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      estadosOptionsFiltered: null,
      filterValues: {
        descripcion: null,
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        usuarioAlta: null,
        area: null,
        fechaDesde: null,
        fechaHasta: null,
      },
      filterPhoto: {
        reqId: null,
        estados: null,
        sistema: null,
        tipo: null,
        usuarioAlta: null,
        area: null,
        fechaDesde: null,
        fechaHasta: null,
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
    }),

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
    sistemaSetted() {
      return this.filterValues.sistema && Boolean(this.filterValues.sistema.id)
    },
    areaSetted() {
      return this.filterValues.area && Boolean(this.filterValues.area.id)
    },
    tipoRequerimientoSetted() {
      return this.filterValues.tipo && Boolean(this.filterValues.tipo.id)
    },
    usuarioAltaSetted() {
      return (
        this.filterValues.usuarioAlta &&
        Boolean(this.filterValues.usuarioAlta.id)
      )
    },
    fechaDesdeSetted() {
      return (
        this.filterValues.fechaDesde && Boolean(this.filterValues.fechaDesde)
      )
    },
    fechaHastaSetted() {
      return (
        this.filterValues.fechaHasta && Boolean(this.filterValues.fechaHasta)
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
    areaDescripcion() {
      return _.get(this, "filterValues.area.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterValues.tipo.descripcion", null)
    },
    usuarioAltaDescripcion() {
      return _.get(this, "filterValues.usuarioAlta.descripcion", null)
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
      area,
      fechaDesde,
      fechaHasta,
    } = this.filtros

    if (descripcion) this.filterValues.descripcion = descripcion
    if (reqId) this.filterValues.reqId = reqId
    if (estados) this.filterValues.estados = estados
    if (sistema) this.filterValues.sistema = sistema
    if (tipo) this.filterValues.tipo = tipo
    if (usuarioAlta) this.filterValues.usuarioAlta = usuarioAlta
    if (area) this.filterValues.area = area
    if (fechaDesde) this.filterValues.fechaDesde = fechaDesde
    if (fechaHasta) this.filterValues.fechaHasta = fechaHasta

    this.filtrar()
  },
  methods: {
    filtrar() {
      if (!this.estadosSetted) {
        this.filterValues.estados = null
      }
      this.updateFilterPhoto()
      this.updateSomeFilterIsSetted()
      this.$refs.baseFilter.closePopUp() // seteamos el popupOpened en el padre en false
      this.$emit("buscar", this.filterValues)
    },
    limpiarFiltros() {
      this.filterValues.descripcion = null
      this.filterValues.reqId = null
      this.filterValues.estados = null
      this.filterValues.tipo = null
      this.filterValues.sistema = null
      this.filterValues.usuarioAlta = null
      this.filterValues.area = null
      this.filterValues.fechaDesde = null
      this.filterValues.fechaHasta = null
      this.filtrar()
    },
    updateSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.filterValues.reqId !== null,
        this.estadosSetted,
        this.filterValues.sistema !== null,
        this.filterValues.tipo !== null,
        this.filterValues.usuarioAlta !== null,
        this.filterValues.area !== null,
        this.filterValues.fechaDesde !== null,
        this.filterValues.fechaHasta !== null,
      ])
    },
    updateFilterPhoto() {
      this.filterPhoto.reqId = this.filterValues.reqId
      this.filterPhoto.estados = this.estadosDescripcion || null
      this.filterPhoto.sistema = this.sistemaDescripcion || null
      this.filterPhoto.tipo = this.tipoRequerimientoDescripcion || null
      this.filterPhoto.usuarioAlta = this.usuarioAltaDescripcion || null
      this.filterPhoto.area = this.areaDescripcion || null
      this.filterPhoto.fechaDesde = this.filterValues.fechaDesde || null
      this.filterPhoto.fechaHasta = this.filterValues.fechaHasta || null
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
    removeFilter(filter) {
      if (filter == "reqId") {
        this.filterValues.reqId = null
      }
      if (filter == "estados") {
        this.filterValues.estados = null
      }
      if (filter == "tipo") {
        this.filterValues.tipo = null
      }
      if (filter == "sistema") {
        this.filterValues.sistema = null
      }
      if (filter == "usuarioAlta") {
        this.filterValues.usuarioAlta = null
      }
      if (filter == "area") {
        this.filterValues.area = null
      }
      if (filter == "fechaDesde") {
        this.filterValues.fechaDesde = null
      }
      if (filter == "fechaHasta") {
        this.filterValues.fechaHasta = null
      }
      this.filtrar()
    },
  },
}
</script>
<style lang="stylus" scoped></style>
