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
      <q-btn color="deep-purple-10" size="md" @click="pushFilters(1)">GUARDAR Y FILTRAR</q-btn>

      <q-btn color="negative" flat size="md" @click="limpiarFiltros">Limpiar Filtros</q-btn>

      <q-btn color="deep-purple-10" size="md" @click="pushFilters">FILTRAR</q-btn>
    </template>

    <template v-slot:footer>
      <div class="result">
        <div class="test">
          <select-custom
            ref="sistema"
            label="Filtros guardados"
            outlined
            dense
            color="deep-purple-10"
            :apply-validation="false"
            :loading="false"
            :options="filtrosGuardados"
          />
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
  },
  watch: {
    "$route.query": {
      handler: function(query) {
        this.setFilters(query)
      },
    },
  },
  async mounted() {
    await this.$store.dispatch("requerimientos/createRequerimiento")

    // const { descripcion, sistema, tipo, usuariosAsignados, usuarioAlta } = this.filtros
    // if (descripcion) this.localFilterValues.descripcion = descripcion
    // if (sistema) this.localFilterValues.sistema = sistema
    // if (tipo) this.localFilterValues.tipo = tipo
    // if (usuarioAlta) this.localFilterValues.usuarioAlta = usuarioAlta
    // if (usuariosAsignados) this.localFilterValues.usuariosAsignados = usuariosAsignados

    this.setFilters(this.$route.query)
  },
  methods: {
    pushFilters(guardarFiltro = false) {
      let onlyNotNull = _.pickBy({ ...this.localFilterValues }, _.identity)

      // Remplazo de objetos por id
      if (_.has(onlyNotNull, "sistema")) {
        onlyNotNull.sistema = onlyNotNull.sistema.id
      }
      if (_.has(onlyNotNull, "tipo")) {
        onlyNotNull.tipo = onlyNotNull.tipo.id
      }
      if (_.has(onlyNotNull, "usuarioAlta")) {
        onlyNotNull.usuarioAlta = onlyNotNull.usuarioAlta.id
      }

      if (_.has(onlyNotNull, "usuariosAsignados")) {
        if (onlyNotNull.usuariosAsignados.length != 0) {
          onlyNotNull.usuariosAsignados = encodeURIComponent(
            _.map(onlyNotNull.usuariosAsignados, "value"),
          )
        } else {
          onlyNotNull = _.omit(onlyNotNull, ["usuariosAsignados"])
        }
      }

      if (guardarFiltro) {
        this.$q
          .dialog({
            title: "Nombre del filtro",
            // message: "Nombre del filtro",
            prompt: {
              model: "",
              type: "text", // optional
            },
            cancel: true,
            persistent: true,
          })
          .onOk(nombreFiltro => {
            this.$router.push({ name: "asignar-requerimientos", query: onlyNotNull })
            console.log(">>>> OK, received", nombreFiltro, this.$route)

            this.guardarFiltrosLocalStorage(nombreFiltro)

            this.$refs.baseFilter.closePopUp() // seteamos el popupOpened en el padre en false
          })
          .onCancel(() => {
            console.log(">>>> Cancel")
          })
          .onDismiss(() => {
            console.log("I am triggered on both OK and Cancel")
          })
      } else {
        this.$router.push({ name: "asignar-requerimientos", query: onlyNotNull })
        this.$refs.baseFilter.closePopUp() // seteamos el popupOpened en el padre en false
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
    guardarFiltrosLocalStorage(filterName) {
      const key = "filtros_" + this.userId

      // if (!this.validarNombreFiltro(key, filterName)) {
      //   return false
      // }

      const filtrosGuardados = _.concat([...this.filtrosGuardados], {
        seccion: "asignarRequerimientos",
        nombre: filterName,
        query: this.$route.query,
      })

      localStorage.setItem(key, JSON.stringify(filtrosGuardados))

      console.log(filtrosGuardados, key)
    },
    recuperarFiltrosLocalStorage(filterName = null) {
      // falta armar el hash
      console.log(filterName)
      localStorage.getItem("testObject")
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
.result:after {
  content: '';
  display: table;
  clear: both;
}

.result div {
  float: left;
}

.result span {
  float: left;
}

.result div.test {
  float: right;
}
</style>
