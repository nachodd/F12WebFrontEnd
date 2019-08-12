<template>
  <base-filter
    ref="baseFilter"
    search-placeholder="Buscar en Asunto, Descripción..."
    :descripcion.sync="filterValues.descripcion"
    :some-filter-is-setted="someFilterIsSetted"
    @filtrar="filtrar"
  >
    <template #body>
      <base-filter-input label="Sistema">
        <select-custom
          v-model="filterValues.sistema"
          :options="sistemasUsuarioOptions"
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
        v-if="hasReportantesNoOperativos"
        label="Ver listado como"
      >
        <q-select
          v-model="filterValues.usuarioVerComo"
          color="deep-purple-10"
          dense
          :options="optionsUsersReportantes"
          emit-value
          map-options
        />
      </base-filter-input>
    </template>

    <template v-slot:buttons>
      <q-btn color="negative" flat size="md" @click="limpiarFiltros">
        Limpiar Filtros
      </q-btn>

      <q-btn color="deep-purple-10" size="md" @click="closeFilters">
        FILTRAR
      </q-btn>
    </template>

    <template v-slot:footer>
      <base-filter-chip
        :showed="sistemaSetted && filterPhoto.sistema"
        label="Sist:"
        :value="filterPhoto.sistema"
        :tooltip="'Sistema: ' + filterPhoto.sistema"
        color="red"
        @remove="removeFilter('sistema')"
      />
      <base-filter-chip
        :showed="tipoRequerimientoSetted && filterPhoto.tipo"
        label="Tipo:"
        :value="filterPhoto.tipo"
        :tooltip="'Tipo de Requerimiento: ' + filterPhoto.tipo"
        color="blue"
        @remove="removeFilter('tipo')"
      />
      <base-filter-chip
        :showed="usuarioVerComoSetted && filterPhoto.usuarioVerComo"
        label="V.C.:"
        :value="filterPhoto.usuarioAlta"
        :tooltip="'Viendo Como: ' + filterPhoto.usuarioVerComo"
        color="purple"
        @remove="removeFilter('usuarioVerComo')"
      />
    </template>
  </base-filter>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
export default {
  name: "PriorizarRequerimientosFiltros",
  components: { SelectCustom },
  props: {
    filtros: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      usuariosAsignadosOptionsFiltered: null,
      filterValues: {
        descripcion: null,
        sistema: null,
        tipo: null,
        usuarioVerComo: null,
      },
      filterPhoto: {
        sistema: null,
        tipo: null,
        usuarioVerComo: null,
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
    ...mapGetters("auth", [
      "userSistemas",
      "userReportantesNoOperativos",
      "hasReportantesNoOperativos",
    ]),
    sistemaSetted() {
      return this.filterValues.sistema && Boolean(this.filterValues.sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.filterValues.tipo && Boolean(this.filterValues.tipo.id)
    },
    usuarioVerComoSetted() {
      return (
        this.filterValues.usuarioVerComo &&
        Boolean(this.filterValues.usuarioVerComo.value)
      )
    },
    optionsUsersReportantes() {
      const label =
        this.usuarioVerComo === null
          ? "Ver listado como..."
          : `<strong>VOLVER A MI LISTADO</strong>`
      return [
        {
          label,
          value: null,
        },
        ..._.orderBy(this.userReportantesNoOperativos, "label"),
      ]
    },
    // Filtro solo los sistemas que tiene el usuario logueado
    sistemasUsuarioOptions() {
      return _.filter(this.sistemas, s => {
        return _.findIndex(this.userSistemas, { id: s.id }) !== -1
      })
    },
    /* __descripcion: {
      get() {
        return this.$store.state.priorizarRequerimientos.filtros.descripcion
      },
      set(value) {
        this.$store.dispatch("priorizarRequerimientos/setFilter", {
          filter: "descripcion",
          value,
        })
      },
    },
    __sistema: {
      get() {
        return this.$store.state.priorizarRequerimientos.filtros.sistema
      },
      set(value) {
        this.$store.dispatch("priorizarRequerimientos/setFilter", {
          filter: "sistema",
          value,
        })
      },
    },
    __tipo: {
      get() {
        return this.$store.state.priorizarRequerimientos.filtros
          .requerimientoTipo
      },
      set(value) {
        this.$store.dispatch("priorizarRequerimientos/setFilter", {
          filter: "requerimientoTipo",
          value,
        })
      },
    }, */
    /* __usuariosAsignados: {
      get() {
        return this.$store.state.asignacionRequerimientos.filtros
          .usuariosAsignados
      },
      set(value) {
        this.$store.dispatch("asignacionRequerimientos/setFilter", {
          filter: "usuariosAsignados",
          value,
        })
      },
    }, */

    sistemaDescripcion() {
      return _.get(this, "filterValues.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterValues.tipo.descripcion", null)
    },
    usuarioVerComoDescripcion() {
      return _.get(this, "filterValues.usuarioVerComo.label", null)
    },
  },
  async created() {
    // this.changeUsuarioVerComo(null)
    await this.$store.dispatch("requerimientos/createRequerimiento")
    const { descripcion, sistema, tipo, usuarioVerComo } = this.filtros

    if (descripcion) this.filterValues.descripcion = descripcion
    if (sistema) this.filterValues.sistema = sistema
    if (tipo) this.filterValues.tipo = tipo
    if (usuarioVerComo) this.filterValues.usuarioVerComo = usuarioVerComo

    this.filtrar()
  },
  methods: {
    filtrar() {
      this.updateFilterPhoto()
      this.updateSomeFilterIsSetted()
      this.$refs.baseFilter.closePopUp() // seteamos el popupOpened en el padre en false
      this.$emit("buscar", this.filterValues)
    },
    updateFilterPhoto() {
      this.filterPhoto.tipo = this.tipoRequerimientoDescripcion || null
      this.filterPhoto.sistema = this.sistemaDescripcion || null
      this.filterPhoto.usuarioVerComo = this.usuarioVerComoDescripcion || null
    },
    updateSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.sistemaSetted,
        this.tipoRequerimientoSetted,
        this.usuarioVerComoSetted,
      ])
    },
    limpiarFiltros() {
      this.filterValues.descripcion = null
      this.filterValues.tipo = null
      this.filterValues.sistema = null
      this.filterValues.usuarioVerComo = null
      this.filtrar()
    },
    removeFilter(filter) {
      if (filter == "tipo") {
        this.filterValues.tipo = null
      }
      if (filter == "sistema") {
        this.filterValues.sistema = null
      }
      if (filter == "usuarioVerComo") {
        this.filterValues.usuarioVerComo = null
      }
      this.filtrar()
    },

    /* async changeUsuarioVerComo(userId) {
      await this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
      this.$store.dispatch(
        "priorizarRequerimientos/inicializarPriorizarRequerimientos",
        { userId },
      )
    }, */
    /* filterUsuariosAsignados(val, update) {
      if (val === "") {
        update(() => {
          this.usuariosAsignadosOptionsFiltered = this.userReportantesNoOperativos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.usuariosAsignadosOptionsFiltered = this.userReportantesNoOperativos.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1,
        )
      })
    }, */
  },
}
</script>
<style lang="stylus"></style>
