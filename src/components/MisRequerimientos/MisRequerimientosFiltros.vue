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

      <base-filter-input
        v-if="!esElUltimoDeLaCadenaDeMando"
        label="Usuario Alta"
      >
        <select-custom
          v-model="filterValues.usuarioAlta"
          :options="optionsUsuariosFiltro"
          dense
          color="deep-purple-10"
          :loading="optionsUsuariosFiltro.length === 0"
        />
      </base-filter-input>
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
        :showed="reqIdSetted && Boolean(filterPhoto.reqId)"
        label="Id:"
        :value="filterPhoto.reqId"
        :tooltip="'Requerimiento Nro: ' + filterPhoto.reqId"
        color="green"
        @remove="removeFilter('reqId')"
      />
      <base-filter-chip
        :showed="estadosSetted && Boolean(filterPhoto.estados)"
        label="Est.:"
        :value="filterPhoto.estados"
        :tooltip="'Estdos de los Reqs.: ' + filterPhoto.estados"
        color="orange"
        @remove="removeFilter('estados')"
      />
      <base-filter-chip
        :showed="sistemaSetted && Boolean(filterPhoto.sistema)"
        label="Sist:"
        :value="filterPhoto.sistema"
        :tooltip="'Sistema: ' + filterPhoto.sistema"
        color="red"
        @remove="removeFilter('sistema')"
      />
      <base-filter-chip
        :showed="tipoRequerimientoSetted && Boolean(filterPhoto.tipo)"
        label="Tipo:"
        :value="filterPhoto.tipo"
        :tooltip="'Tipo de Requerimiento: ' + filterPhoto.tipo"
        color="blue"
        @remove="removeFilter('tipo')"
      />
      <base-filter-chip
        :showed="usuarioAltaSetted && Boolean(filterPhoto.usuarioAlta)"
        label="U.A.:"
        :value="filterPhoto.usuarioAlta"
        :tooltip="'Usuario Alta: ' + filterPhoto.usuarioAlta"
        color="purple"
        @remove="removeFilter('usuarioAlta')"
      />
    </template>
  </base-filter>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
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
    filtrar() {
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
      this.filtrar()
    },
    updateSomeFilterIsSetted() {
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
      this.filtrar()
    },
  },
}
</script>
<style lang="stylus" scoped></style>
