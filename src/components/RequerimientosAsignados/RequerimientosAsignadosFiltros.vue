<template>
  <base-filter
    ref="baseFilter"
    search-placeholder="Buscar en Asunto, Descripción, Usuario Asignado..."
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
  name: "RequerimientosAsignadosFiltros",
  components: { SelectCustom, BaseFilter, BaseFilterInput, BaseFilterChip },
  props: {
    filtros: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      filterValues: {
        descripcion: null,
        sistema: null,
        tipo: null,
      },
      filterPhoto: {
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
    ...mapGetters("auth", ["userSistemas"]),
    sistemasUsuarioOptions() {
      return _.filter(this.sistemas, s => {
        return _.findIndex(this.userSistemas, { id: s.id }) !== -1
      })
    },
    sistemaSetted() {
      return this.filterValues.sistema && Boolean(this.filterValues.sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.filterValues.tipo && Boolean(this.filterValues.tipo.id)
    },

    sistemaDescripcion() {
      return _.get(this, "filterValues.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterValues.tipo.descripcion", null)
    },
  },
  async mounted() {
    await this.$store.dispatch("requerimientos/createRequerimiento")
    const { descripcion, sistema, tipo } = this.filtros

    if (descripcion) this.filterValues.descripcion = descripcion
    if (sistema) this.filterValues.sistema = sistema
    if (tipo) this.filterValues.tipo = tipo

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
    },
    updateSomeFilterIsSetted() {
      this.someFilterIsSetted = _.some([
        this.sistemaSetted,
        this.tipoRequerimientoSetted,
      ])
    },
    limpiarFiltros() {
      this.filterValues.descripcion = null
      this.filterValues.tipo = null
      this.filterValues.sistema = null
      this.filtrar()
    },
    removeFilter(filter) {
      if (filter == "tipo") {
        this.filterValues.tipo = null
      }
      if (filter == "sistema") {
        this.filterValues.sistema = null
      }
      this.filtrar()
    },
    aplicarFiltroRapidoTipoReq(filtroRapido) {
      switch (filtroRapido) {
        case "Arreglo":
          this.filterValues.tipo = {
            descripcion: "Arreglo rápido",
            id: 1,
          }
          break
        case "Desarrollo":
          this.filterValues.tipo = {
            descripcion: "Desarrollos / Modificaciones / Implementaciones",
            id: 2,
          }
          break
        case "RevProcesos":
          this.filterValues.tipo = {
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
<style lang="stylus" scoped>
.square
  width 4px
  height 18px
  vertical-align middle
.filters-row
  min-height 40px
</style>
