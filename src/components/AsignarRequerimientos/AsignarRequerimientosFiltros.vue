<template>
  <base-filter
    ref="baseFilter"
    search-placeholder="Buscar en Asunto, Descripción, Usuario Asignado..."
    :descripcion.sync="localFilterValues.descripcion"
    :some-filter-is-setted="someFilterIsSetted"
    @filtrar="filtrar"
  >
    <template #body>
      <base-filter-input label="Sistema">
        <select-custom
          v-model="localFilterValues.sistema"
          :options="sistemasUsuarioOptions"
          dense
          color="deep-purple-10"
          :use-filter="false"
          :loading="sistemas.length === 0"
        />
      </base-filter-input>
      <base-filter-input label="Tipo Requerimiento">
        <select-custom
          v-model="localFilterValues.tipo"
          :options="requerimientosTipos"
          dense
          color="deep-purple-10"
          :use-filter="false"
          :loading="requerimientosTipos.length === 0"
        />
      </base-filter-input>

      <base-filter-input label="Usuario Alta">
        <select-custom
          v-model="localFilterValues.usuarioAlta"
          :options="optionsUsuariosFiltro"
          dense
          color="deep-purple-10"
          :loading="optionsUsuariosFiltro.length === 0"
        />
      </base-filter-input>

      <base-filter-input
        label="Usuarios Asignados"
        footer="Este filtro aplica para los 'Requerimientos Asignados' y 'Requerimientos en Ejecución'"
      >
        <q-select
          v-model="localFilterValues.usuariosAsignados"
          color="deep-purple-10"
          clearable
          dense
          :options="usuariosAsignadosOptionsFiltered"
          map-options
          use-input
          use-chips
          multiple
          @filter="filterUsuariosAsignados"
        />
      </base-filter-input>
    </template>

    <template v-slot:buttons>
      <q-btn color="negative" flat size="md" @click="limpiarFiltros">Limpiar Filtros</q-btn>
      <q-btn color="deep-purple-10" size="md" @click="filtrar">FILTRAR</q-btn>
    </template>

    <template v-slot:footer>
      <base-filter-chip
        :showed="Boolean(filterPhoto.sistema)"
        label="Sist:"
        :value="filterPhoto.sistema"
        :tooltip="'Sistema: ' + filterPhoto.sistema"
        color="red"
        @remove="removeFilter('sistema')"
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
        label="U.Al:"
        :value="filterPhoto.usuarioAlta"
        :tooltip="'Usuario Alta: ' + filterPhoto.usuarioAlta"
        color="purple"
        @remove="removeFilter('usuarioAlta')"
      />
      <base-filter-chip
        :showed="Boolean(filterPhoto.usuariosAsignados)"
        label="U.As:"
        :value="filterPhoto.usuariosAsignados"
        :tooltip="'Usuario Asignados: ' + filterPhoto.usuariosAsignados"
        color="teal"
        @remove="removeFilter('usuariosAsignados')"
      />
    </template>
    <template #quickFilter>
      <span>
        <div
          class="d-ib cursor-pointer text-caption"
          @click="aplicarFiltroRapidoTipoReq('Arreglo')"
        >
          <div class="square d-ib bg-red-7">&nbsp;</div>
          Arreglo Rápido &nbsp;&nbsp;
        </div>
        <div
          class="d-ib cursor-pointer text-caption"
          @click="aplicarFiltroRapidoTipoReq('Desarrollo')"
        >
          <div class="square d-ib bg-light-blue-7">&nbsp;</div>
          Desarrollo &nbsp;&nbsp;
        </div>
        <div
          class="d-ib cursor-pointer text-caption"
          @click="aplicarFiltroRapidoTipoReq('RevProcesos')"
        >
          <div class="square d-ib bg-yellow-7">&nbsp;</div>
          Rev. Procesos &nbsp;&nbsp;
        </div>
      </span>
    </template>
  </base-filter>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import BaseFilter from "comp/Common/BaseFilter"
import BaseFilterInput from "comp/Common/BaseFilterInput"
import BaseFilterChip from "comp/Common/BaseFilterChip"
import { mapState, mapGetters } from "vuex"
export default {
  name: "AsignarRequerimientosFiltros",
  components: { SelectCustom, BaseFilter, BaseFilterInput, BaseFilterChip },
  props: {
    filtros: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      localFilterValues: {
        descripcion: null,
        sistema: null,
        tipo: null,
        usuariosAsignados: [],
        usuarioAlta: null,
      },
      filterPhoto: {
        sistema: null,
        tipo: null,
        usuariosAsignados: null,
        usuarioAlta: null,
      },
      someFilterIsSetted: false,
      usuariosAsignadosOptionsFiltered: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
    }),
    ...mapGetters("auth", ["userSistemas", "userYoYReportantes"]),
    ...mapGetters({
      optionsUsuariosFiltro: "auth/usuariosFiltro",
    }),
    // Filtro solo los sistemas que tiene el usuario logueado
    sistemasUsuarioOptions() {
      return _.filter(this.sistemas, s => {
        return _.findIndex(this.userSistemas, { id: s.id }) !== -1
      })
    },
    sistemaSetted() {
      return this.localFilterValues.sistema && Boolean(this.localFilterValues.sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.localFilterValues.tipo && Boolean(this.localFilterValues.tipo.id)
    },
    usuarioAltaSetted() {
      return this.localFilterValues.usuarioAlta && Boolean(this.localFilterValues.usuarioAlta.id)
    },
    usuariosAsignadosSetted() {
      return (
        this.localFilterValues.usuariosAsignados &&
        this.localFilterValues.usuariosAsignados.length > 0
      )
    },

    sistemaDescripcion() {
      return _.get(this, "localFilterValues.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "localFilterValues.tipo.descripcion", null)
    },
    usuarioAltaDescripcion() {
      return _.get(this, "localFilterValues.usuarioAlta.descripcion", null)
    },
    usuariosAsignadosDescripcion() {
      if (this.usuariosAsignadosSetted) {
        return this.localFilterValues.usuariosAsignados.map(ua => ua.label).join(", ")
      }
      return ""
    },
  },
  watch: {
    "$route.query": {
      handler: function({
        descripcion = null,
        id = null,
        sistema = null,
        tipo = null,
        usuariosAsignados = [],
        usuarioAlta = null,
      }) {
        this.localFilterValues.descripcion = descripcion
        this.localFilterValues.id = id
        this.localFilterValues.sistema = _.find(this.sistemasUsuarioOptions, { id: sistema })
        this.localFilterValues.tipo = _.find(this.requerimientosTipos, { id: tipo })
        this.localFilterValues.usuariosAsignados = usuariosAsignados
        this.localFilterValues.usuarioAlta = usuarioAlta
        this.updateSomeFilterIsSetted()
        console.log("watch", this.localFilterValues, "llega=>", sistema)
        this.$store.dispatch("asignacionRequerimientos/setFilters", this.localFilterValues)
      },
      immediate: true,
    },
  },
  async mounted() {
    await this.$store.dispatch("requerimientos/createRequerimiento")

    const { descripcion, sistema, tipo, usuariosAsignados, usuarioAlta } = this.filtros

    if (descripcion) this.localFilterValues.descripcion = descripcion
    if (sistema) this.localFilterValues.sistema = sistema
    if (tipo) this.localFilterValues.tipo = tipo
    if (usuarioAlta) this.localFilterValues.usuarioAlta = usuarioAlta
    if (usuariosAsignados) this.localFilterValues.usuariosAsignados = usuariosAsignados

    console.log("mounted", this.localFilterValues)
  },
  methods: {
    filtrar() {
      this.$refs.baseFilter.closePopUp() // seteamos el popupOpened en el padre en false

      var onlyNotNull = _.pickBy({ ...this.localFilterValues }, _.identity)

      // Remplazo de objetos por id
      if (_.has(onlyNotNull, "sistema")) {
        onlyNotNull.sistema = onlyNotNull.sistema.id
      }

      if (_.has(onlyNotNull, "tipo")) {
        onlyNotNull.tipo = onlyNotNull.tipo.id
      }

      this.$router.push({ name: "asignar-requerimientos", query: onlyNotNull })
    },
    updateFilterPhoto() {
      this.filterPhoto.tipo = this.tipoRequerimientoDescripcion || null
      this.filterPhoto.sistema = this.sistemaDescripcion || null
      this.filterPhoto.usuariosAsignados = this.usuariosAsignadosDescripcion || null
      this.filterPhoto.usuarioAlta = this.usuarioAltaDescripcion || null
    },
    updateSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.sistemaSetted,
        this.tipoRequerimientoSetted,
        this.usuariosAsignadosSetted,
        this.usuarioAltaSetted,
      ])
    },
    limpiarFiltros() {
      this.localFilterValues.descripcion = null
      this.localFilterValues.tipo = null
      this.localFilterValues.sistema = null
      this.localFilterValues.usuariosAsignados = []
      this.localFilterValues.usuarioAlta = null
      this.filtrar()
    },
    removeFilter(filter) {
      if (filter == "tipo") {
        this.localFilterValues.tipo = null
      }
      if (filter == "sistema") {
        this.localFilterValues.sistema = null
      }
      if (filter == "usuariosAsignados") {
        this.localFilterValues.usuariosAsignados = []
      }
      if (filter == "usuarioAlta") {
        this.localFilterValues.usuarioAlta = null
      }
      this.filtrar()
    },

    filterUsuariosAsignados(val, update) {
      if (val === "") {
        update(() => {
          this.usuariosAsignadosOptionsFiltered = this.userYoYReportantes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.usuariosAsignadosOptionsFiltered = this.userYoYReportantes.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1,
        )
      })
    },
    aplicarFiltroRapidoTipoReq(filtroRapido) {
      switch (filtroRapido) {
        case "Arreglo":
          this.localFilterValues.tipo = {
            descripcion: "Arreglo rápido",
            id: 1,
          }
          break
        case "Desarrollo":
          this.localFilterValues.tipo = {
            descripcion: "Desarrollos / Modificaciones / Implementaciones",
            id: 2,
          }
          break
        case "RevProcesos":
          this.localFilterValues.tipo = {
            descripcion: "Revisión Procesos",
            id: 3,
          }
          break
      }
      this.filtrar()
    },
  },
}
</script>
<style lang="stylus" scoped></style>
