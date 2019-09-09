<template>
  <base-filter
    ref="baseFilter"
    search-placeholder="Buscar en Asunto, Descripción, Usuario Asignado..."
    :descripcion.sync="localFilterValues.descripcion"
    :some-filter-is-setted="someFilterIsSetted"
    :base-height="280"
    @filtrar="pushFilters"
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
      <q-btn color="deep-purple-10" size="md" @click="pushFilters({ guardarFiltro: true })">
        GUARDAR Y FILTRAR
      </q-btn>

      <q-btn color="negative" flat size="md" @click="limpiarFiltros">Limpiar Filtros</q-btn>

      <q-btn color="deep-purple-10" size="md" @click="pushFilters">FILTRAR</q-btn>
    </template>

    <template v-slot:footer>
      <div class="container-filters-selected">
        <div class="container-filtros-guardados row ">
          <label class="col-auto q-pa-xs q-mt-sm">Filtros:</label>
          <!-- label="Filtros guardados" -->
          <!-- :value="filtroGuardadoValue" -->
          <q-select
            ref="selectTest"
            v-model="filtroGuardadoValue"
            outlined
            dense
            map-options
            color="deep-purple-10"
            hide-dropdown-icon
            option-value="id"
            option-label="descripcion"
            :disable="filtrosGuardados.length === 0"
            :options="filtrosGuardadosOptions"
            class="col select-filtros-guardados"
          >
            <template v-slot:append>
              <q-icon name="arrow_drop_down" />
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="color-deep-purple-10" v-on="scope.itemEvents">
                <q-item-section>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <q-item-label v-html="scope.opt.descripcion" />
                </q-item-section>
                <q-item-section
                  v-if="!scope.opt.emptyOption"
                  avatar
                  @click.stop="eliminarFiltroGuardado(scope.opt.id)"
                >
                  <q-icon name="delete_forever" class="delete_icon" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- <select-custom
            ref="selectTest"
            v-model="filtroGuardadoValue"
            outlined
            dense
            map-options
            color="deep-purple-10"
            :use-filter="false"
            :apply-validation="false"
            :loading="false"
            :disable="filtrosGuardados.length === 0"
            :options="filtrosGuardadosOptions"
            class="col select-filtros-guardados"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="color-deep-purple-10" v-on="scope.itemEvents">
                <q-item-section>
                  !-- eslint-disable-next-line vue/no-v-html --
                  <q-item-label v-html="scope.opt.descripcion" />
                </q-item-section>
                <q-item-section avatar @click.stop="eliminarFiltroGuardado(scope.opt.id)">
                  <q-icon name="delete_forever" class="delete_icon" />
                </q-item-section>
              </q-item>
            </template>
          </select-custom> -->
        </div>
        <base-filter-chip
          :showed="Boolean(sistemaDescripcion)"
          label="Sist:"
          :value="sistemaDescripcion"
          :tooltip="'Sistema: ' + sistemaDescripcion"
          color="red"
          @remove="removeFilter('sistema')"
        />
        <base-filter-chip
          :showed="Boolean(tipoRequerimientoDescripcion)"
          label="Tipo:"
          :value="tipoRequerimientoDescripcion"
          :tooltip="'Tipo de Requerimiento: ' + tipoRequerimientoDescripcion"
          color="blue"
          @remove="removeFilter('tipo')"
        />
        <base-filter-chip
          :showed="Boolean(usuarioAltaDescripcion)"
          label="U.Al:"
          :value="usuarioAltaDescripcion"
          :tooltip="'Usuario Alta: ' + usuarioAltaDescripcion"
          color="purple"
          @remove="removeFilter('usuarioAlta')"
        />
        <base-filter-chip
          :showed="Boolean(usuariosAsignadosDescripcion)"
          label="U.As:"
          :value="usuariosAsignadosDescripcion"
          :tooltip="'Usuario Asignados: ' + usuariosAsignadosDescripcion"
          color="teal"
          @remove="removeFilter('usuariosAsignados')"
        />
      </div>
    </template>
    <!-- <template #quickFilter> -->
    <!-- <span>
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
    </span>-->
    <!-- <div class="row justify-end"> -->
    <!-- <div class="col-xs-6 col-md-6 col-sm-6">
          <select-custom
            ref="sistema"
            label="Filtros guardados"
            outlined
            color="deep-purple-10"
            :apply-validation="false"
            :loading="false"
          />
    </div>-->
    <!-- </div> -->
    <!-- </template> -->
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
  data() {
    return {
      localFilterValues: {
        descripcion: null,
        sistema: null,
        tipo: null,
        usuariosAsignados: [],
        usuarioAlta: null,
      },
      someFilterIsSetted: false,
      usuariosAsignadosOptionsFiltered: null,
      filtrosGuardados: [],
      filtroGuardadoValue: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      areas: state => state.options.areas,
      sistemas: state => state.options.sistemas,
      requerimientosTipos: state => state.options.requerimientosTipos,
    }),
    ...mapState("asignacionRequerimientos", {
      filterPhoto: state => state.filtros,
    }),
    ...mapGetters({
      optionsUsuariosFiltro: "auth/usuariosFiltro",
      userSistemas: "auth/userSistemas",
      userYoYReportantes: "auth/userYoYReportantes",
      userId: "auth/userId",
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
      return this.filterPhoto.usuariosAsignados && this.filterPhoto.usuariosAsignados.length > 0
    },
    sistemaDescripcion() {
      return _.get(this, "filterPhoto.sistema.descripcion", null)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "filterPhoto.requerimientoTipo.descripcion", null)
    },
    usuarioAltaDescripcion() {
      return _.get(this, "filterPhoto.usuarioAlta.descripcion", null)
    },
    usuariosAsignadosDescripcion() {
      if (this.usuariosAsignadosSetted) {
        return this.filterPhoto.usuariosAsignados.map(ua => ua.label).join(", ")
      }
      return ""
    },
    filtrosGuardadosOptions() {
      if (this.filtrosGuardados.length === 0) {
        return [{ id: null, descripcion: "No hay filtros Guardados!" }]
      }
      const options = [
        { nombre: "Seleccione una opción", emptyOption: true },
        ...this.filtrosGuardados,
      ]
      return _.map(options, value => ({
        id: value.nombre,
        descripcion: value.nombre,
        emptyOption: value.emptyOption || false,
      }))
    },
  },
  watch: {
    "$route.query": {
      handler: function(query) {
        this.setFilters(query)
      },
    },
    filtroGuardadoValue(data) {
      let query = {}
      let filter = null

      if (!data.emptyOption) {
        filter = _.find(this.filtrosGuardados, { nombre: data.id })
        query = filter.query
        filter.setted = true
      }

      this.$router.push({ name: "asignar-requerimientos", query })

      this.$store.dispatch("asignacionRequerimientos/updateFiltersLocalStorage", filter)
    },
  },
  async mounted() {
    await this.$store.dispatch("requerimientos/createRequerimiento")
    this.setFilters(this.$route.query)
    this.updateFiltrosGuardados()
  },
  methods: {
    pushFilters({ guardarFiltro = false } = {}) {
      let queryParamNotNull = _.pickBy({ ...this.localFilterValues }, _.identity)

      // Remplazo de objetos por id
      if (_.has(queryParamNotNull, "sistema")) {
        queryParamNotNull.sistema = queryParamNotNull.sistema.id
      }
      if (_.has(queryParamNotNull, "tipo")) {
        queryParamNotNull.tipo = queryParamNotNull.tipo.id
      }
      if (_.has(queryParamNotNull, "usuarioAlta")) {
        queryParamNotNull.usuarioAlta = queryParamNotNull.usuarioAlta.id
      }

      if (_.has(queryParamNotNull, "usuariosAsignados")) {
        if (queryParamNotNull.usuariosAsignados.length != 0) {
          queryParamNotNull.usuariosAsignados = encodeURIComponent(
            _.map(queryParamNotNull.usuariosAsignados, "value"),
          )
        } else {
          queryParamNotNull = _.omit(queryParamNotNull, ["usuariosAsignados"])
        }
      }

      if (guardarFiltro) {
        this.$q
          .dialog({
            title: "Nombre del filtro",
            prompt: {
              model: "",
              type: "text", // optional
            },
            cancel: true,
            persistent: true,
            color: "deep-purple-10",
          })
          .onOk(async nombreFiltro => {
            await this.$store.dispatch("asignacionRequerimientos/saveFiltersLocalStorage", {
              seccion: this.$route.name,
              nombre: nombreFiltro,
              query: queryParamNotNull,
              setted: true,
            })
            this.$router.push({ name: "asignar-requerimientos", query: queryParamNotNull })
            this.updateFiltrosGuardados(nombreFiltro)
            this.$refs.baseFilter.closePopUp()
          })
      } else {
        this.$router.push({ name: "asignar-requerimientos", query: queryParamNotNull })
        this.$refs.baseFilter.closePopUp()
      }
    },
    setFilters({
      descripcion = null,
      id = null,
      sistema = null,
      tipo = null,
      usuariosAsignados = [],
      usuarioAlta = null,
    }) {
      this.localFilterValues.descripcion = descripcion
      this.localFilterValues.id = id
      this.localFilterValues.sistema = _.find(this.sistemasUsuarioOptions, {
        id: parseInt(sistema),
      })
      this.localFilterValues.tipo = _.find(this.requerimientosTipos, { id: parseInt(tipo) })
      this.localFilterValues.usuarioAlta = _.find(this.optionsUsuariosFiltro, {
        id: parseInt(usuarioAlta),
      })
      this.localFilterValues.usuariosAsignados = _.filter(this.userYoYReportantes, usuario =>
        _.split(decodeURIComponent(usuariosAsignados), ",").includes(String(usuario.value)),
      )
      this.$store.dispatch("asignacionRequerimientos/setFilters", this.localFilterValues)

      this.updateSomeFilterIsSetted()
    },
    async updateFiltrosGuardados(filterNameSetted = null) {
      // carga los filtros guardaos
      this.filtrosGuardados = await this.$store.dispatch(
        "asignacionRequerimientos/getFiltersLocalStorage",
      )

      // setea el que venga seleccionado
      if (filterNameSetted) {
        this.filtroGuardadoValue = { id: filterNameSetted, descripcion: filterNameSetted }
      } else {
        const ultimoSeteado = _.find(this.filtrosGuardados, { setted: true })

        if (ultimoSeteado) {
          this.filtroGuardadoValue = {
            id: ultimoSeteado.nombre,
            descripcion: ultimoSeteado.nombre,
          }
        } else {
          // this.filtroGuardadoValue = null
          this.filtroGuardadoValue = {
            id: "Seleccione una opción",
            descripcion: "Seleccione una opción",
            emptyOption: true,
          }
        }
      }
    },
    async eliminarFiltroGuardado(filterName) {
      await this.$store.dispatch("asignacionRequerimientos/removeFiltersLocalStorage", filterName)

      this.filtroGuardadoValue = {
        id: "Seleccione una opción",
        descripcion: "Seleccione una opción",
        emptyOption: true,
      }
      this.updateFiltrosGuardados()
      this.$refs.selectTest.hidePopup()
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
      this.pushFilters()
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
      this.pushFilters()
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
      this.pushFilters()
    },
  },
}
</script>
<style lang="stylus" scoped>
.container-filters-selected:after {
  content: '';
  display: table;
  clear: both;
}

.container-filters-selected div {
  float: left;
}

.container-filters-selected span {
  float: left;
}

.container-filters-selected div.container-filtros-guardados {
  float: right;
  width: 300px;
}

.select-filtros-guardados {
  width: 90%;
}

.q-item--active.color-deep-purple-10 {
  color: #311b92 !important;
}

.delete_icon {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: background-color 200ms linear;
}

.delete_icon:hover {
  background-color: $grey;
}
</style>
