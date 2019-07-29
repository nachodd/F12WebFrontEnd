<template>
  <div class="q-pb-md">
    <q-resize-observer @resize="onResize" />
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        v-model.trim="__descripcion"
        class="filter"
        :class="{ popupOpened: popupOpened, aclarado: inputAclarado }"
        dense
        standout="bg-white text-black"
        placeholder="Buscar por Asunto, Descripcion, Usuario Asignado..."
        @keyup.enter="closeFilters"
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
        no-parent-event
        content-class="q-menu-fix"
        :offset="[0, -4]"
      >
        <div class="q-pa-md" :style="{ width: widthInputDescripcion + 'px' }">
          <div class="row q-pt-sm q-col-gutter-xs">
            <div
              class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md ellipsis"
            >
              Sistema
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__sistema"
                :options="sistemasUsuarioOptions"
                dense
                label="Sistema"
                color="deep-purple-10"
                :use-filter="false"
                :loading="sistemas.length === 0"
              />
            </div>

            <div
              class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md ellipsis"
            >
              Tipo Requerimiento
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__tipo"
                :options="requerimientosTipos"
                dense
                label="Tipo de Requerimiento"
                color="deep-purple-10"
                :use-filter="false"
                :loading="requerimientosTipos.length === 0"
              />
            </div>
          </div>
          <div class="row q-pt-sm q-col-gutter-xs">
            <div class="col-12 text-caption q-pt-md text-caption">
              Para las columans de "Requerimientos Asignados" y "Requerimientos
              en Ejecución"
            </div>
            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
              Usuarios Asignados
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <q-select
                v-model="__usuariosAsignados"
                :options="usuariosAsignadosOptionsFiltered"
                clearable
                dense
                :hide-bottom-space="true"
                label="Usuarios Asignados"
                use-input
                use-chips
                multiple
                color="deep-purple-10"
                @filter="filterUsuariosAsignados"
              />
            </div>
          </div>
          <div class="row q-pt-md justify-end q-col-gutter-x-md">
            <div class="col-auto">
              <q-btn color="negative" flat size="md" @click="clearFilters">
                Limpiar Filtros
              </q-btn>
            </div>
            <div class="col-auto">
              <q-btn color="deep-purple-10" size="md" @click="closeFilters">
                FILTRAR
              </q-btn>
            </div>
          </div>
        </div>
      </q-menu>
    </div>

    <div class="row justify-between items-center filters-row">
      <div class="col">
        <span v-if="sistemaSetted || tipoRequerimientoSetted">Filtros:</span>
        <span v-if="sistemaSetted" class="q-mx-xs">
          <q-chip removable @remove="removeFilter('sistema')">
            <q-avatar color="red" text-color="white" class="filter-label">
              Sist:
            </q-avatar>
            {{ sistemaDescripcion }}
            <q-tooltip>Sistema</q-tooltip>
          </q-chip>
        </span>
        <span v-if="tipoRequerimientoSetted" class="q-mx-xs">
          <q-chip removable @remove="removeFilter('requerimientoTipo')">
            <q-avatar color="blue" text-color="white" class="filter-label">
              Tipo:
            </q-avatar>
            {{ tipoRequerimientoDescripcion }}
            <q-tooltip>Tipo de Requerimiento</q-tooltip>
          </q-chip>
        </span>
        <span v-if="usuariosAsignadosSetted" class="q-mx-xs">
          <q-chip removable @remove="removeFilter('usuariosAsignados')">
            <q-avatar color="green" text-color="white" class="filter-label">
              U.A.:
            </q-avatar>
            {{ usuariosAsignadosDescripcion }}
            <q-tooltip>Usuarios Asignados</q-tooltip>
          </q-chip>
        </span>
      </div>
      <div class="col-xs-4 col-md-auto col-sm-auto col-xs-auto text-right">
        <q-tooltip>
          Click aquí para aplicar este filtro
        </q-tooltip>
        <span>
          <div
            class="d-ib cursor-pointer"
            @click="aplicarFiltroRapidoTipoReq('Arreglo')"
          >
            <div class="square d-ib bg-red-7">&nbsp;</div>
            Arreglo Rápido &nbsp;&nbsp; - &nbsp;&nbsp;
          </div>
          <div
            class="d-ib cursor-pointer"
            @click="aplicarFiltroRapidoTipoReq('Desarrollo')"
          >
            <div class="square d-ib bg-light-blue-7">&nbsp;</div>
            Desarrollo / Mejora &nbsp;&nbsp;
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {},
  data() {
    return {
      input: "",
      inputAclarado: false,
      widthInputDescripcion: 0,
      popupOpened: false,
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
    // Filtro solo los sistemas que tiene el usuario logueado
    sistemasUsuarioOptions() {
      return _.filter(this.sistemas, s => {
        return _.findIndex(this.userSistemas, { id: s.id }) !== -1
      })
    },
    __descripcion: {
      get() {
        return this.$store.state.asignacionRequerimientos.filtros.descripcion
      },
      set(value) {
        this.$store.dispatch("asignacionRequerimientos/setFilter", {
          filter: "descripcion",
          value,
        })
      },
    },
    __sistema: {
      get() {
        return this.$store.state.asignacionRequerimientos.filtros.sistema
      },
      set(value) {
        this.$store.dispatch("asignacionRequerimientos/setFilter", {
          filter: "sistema",
          value,
        })
      },
    },
    __tipo: {
      get() {
        return this.$store.state.asignacionRequerimientos.filtros
          .requerimientoTipo
      },
      set(value) {
        this.$store.dispatch("asignacionRequerimientos/setFilter", {
          filter: "requerimientoTipo",
          value,
        })
      },
    },
    __usuariosAsignados: {
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
    },
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
    sistemaDescripcion() {
      return _.get(this, "__sistema.descripcion", null)
    },
    sistemaSetted() {
      return this.__sistema && Boolean(this.__sistema.id)
    },
    tipoRequerimientoDescripcion() {
      return _.get(this, "__tipo.descripcion", null)
    },
    tipoRequerimientoSetted() {
      return this.__tipo && Boolean(this.__tipo.id)
    },
    usuariosAsignadosDescripcion() {
      if (this.usuariosAsignadosSetted) {
        return this.__usuariosAsignados.map(ua => ua.label).join(", ")
      }
      return ""
    },
    usuariosAsignadosSetted() {
      return this.__usuariosAsignados && this.__usuariosAsignados.length > 0
    },
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
    removeFilter(filter) {
      this.$store.dispatch("asignacionRequerimientos/setFilter", {
        filter,
        value: null,
      })
    },
    clearFilters() {
      this.$store.dispatch("asignacionRequerimientos/clearFilters")
    },
    closeFilters() {
      this.popupOpened = false
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
      let value = null
      if (filtroRapido === "Arreglo") {
        value = {
          descripcion: "Arreglo rápido",
          id: 1,
        }
      } else if (filtroRapido === "Desarrollo") {
        value = {
          descripcion: "Desarrollos / Modificaciones / Implementaciones",
          id: 2,
        }
      }
      this.$store.dispatch("asignacionRequerimientos/setFilter", {
        filter: "requerimientoTipo",
        value,
      })
    },
    toggleAclarado(val) {
      console.log(val)
      this.inputAclarado = !this.inputAclarado
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
