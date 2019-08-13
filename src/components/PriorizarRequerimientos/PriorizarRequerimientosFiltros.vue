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
      <!-- <base-filter-input label="Tipo Requerimiento">
        <select-custom
          v-model="filterValues.tipo"
          :options="requerimientosTipos"
          dense
          color="deep-purple-10"
          :use-filter="false"
          :loading="requerimientosTipos.length === 0"
        />
      </base-filter-input> -->

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
      <q-btn color="deep-purple-10" size="md" @click="filtrar">
        FILTRAR
      </q-btn>
    </template>

    <template v-slot:footer>
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
        :showed="usuarioVerComoSetted && Boolean(filterPhoto.usuarioVerComo)"
        label="V.C.:"
        :value="filterPhoto.usuarioAlta"
        :tooltip="'Viendo Como: ' + filterPhoto.usuarioVerComo"
        color="purple"
        @remove="removeFilter('usuarioVerComo')"
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
import BaseFilter from "comp/Common/BaseFilter"
import BaseFilterInput from "comp/Common/BaseFilterInput"
import BaseFilterChip from "comp/Common/BaseFilterChip"
import { mapState, mapGetters } from "vuex"
export default {
  name: "PriorizarRequerimientosFiltros",
  components: { SelectCustom, BaseFilter, BaseFilterInput, BaseFilterChip },
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
        usuarioAlta: null,
      },
      filterPhoto: {
        sistema: null,
        tipo: null,
        usuarioVerComo: null,
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
    ...mapGetters("auth", [
      "userSistemas",
      "userReportantesNoOperativos",
      "hasReportantesNoOperativos",
    ]),
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
    usuarioVerComoSetted() {
      return (
        this.filterValues.usuarioVerComo &&
        Boolean(this.filterValues.usuarioVerComo.value)
      )
    },
    usuarioAltaSetted() {
      return (
        this.filterValues.usuarioAlta &&
        Boolean(this.filterValues.usuarioAlta.id)
      )
    },
    optionsUsersReportantes() {
      const label =
        this.filterValues.usuarioVerComo === null
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
    sistemaDescripcion() {
      return _.get(this, "filterValues.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterValues.tipo.descripcion", null)
    },
    usuarioVerComoDescripcion() {
      return _.get(this, "filterValues.usuarioVerComo.label", null)
    },
    usuarioAltaDescripcion() {
      return _.get(this, "filterValues.usuarioAlta.descripcion", null)
    },
  },
  async mounted() {
    // this.changeUsuarioVerComo(null)
    await this.$store.dispatch("requerimientos/createRequerimiento")
    const {
      descripcion,
      sistema,
      tipo,
      usuarioVerComo,
      usuarioAlta,
    } = this.filtros

    if (descripcion) this.filterValues.descripcion = descripcion
    if (sistema) this.filterValues.sistema = sistema
    if (tipo) this.filterValues.tipo = tipo
    if (usuarioVerComo) this.filterValues.usuarioVerComo = usuarioVerComo
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
    updateFilterPhoto() {
      this.filterPhoto.tipo = this.tipoRequerimientoDescripcion || null
      this.filterPhoto.sistema = this.sistemaDescripcion || null
      this.filterPhoto.usuarioVerComo = this.usuarioVerComoDescripcion || null
      this.filterPhoto.usuarioAlta = this.usuarioAltaDescripcion || null
    },
    updateSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.sistemaSetted,
        this.tipoRequerimientoSetted,
        this.usuarioVerComoSetted,
        this.usuarioAltaSetted,
      ])
    },
    limpiarFiltros() {
      this.filterValues.descripcion = null
      this.filterValues.tipo = null
      this.filterValues.sistema = null
      this.filterValues.usuarioVerComo = null
      this.filterValues.usuarioAlta = null
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
      if (filter == "usuarioAlta") {
        this.filterValues.usuarioAlta = null
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
