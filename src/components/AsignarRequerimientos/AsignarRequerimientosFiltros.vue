<template>
  <div class="q-py-md">
    <q-input
      ref="inputDescripcion"
      v-model.trim="__descripcion"
      class="standout-custom"
      dense
      standout="bg-white text-black"
      placeholder="Buscar por Asunto, Descripcion..."
      @keyup.enter="filtrar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="iconOpenFilter"
          class="cursor-pointer"
          @keyup="popupOpened = !popupOpened"
        ></q-icon>
      </template>
      <q-resize-observer @resize="onResize" />
    </q-input>
    <q-menu
      v-model="popupOpened"
      :offset="[0, -24]"
      content-class="z-index-fix"
    >
      <div class="q-pa-md" :style="{ width: widthInputDescripcion + 'px' }">
        <div class="row q-pt-sm q-col-gutter-xs">
          <div class="col-xs-12 col-sm-6">
            <select-custom
              v-model="__sistema"
              :options="sistemasUsuarioOptions"
              dense
              :outlined="false"
              standout
              label="Sistema"
              :loading="sistemas.length === 0"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <select-custom
              v-model="__tipo"
              :options="requerimientosTipos"
              label="Tipo de Requerimiento"
              dense
              :outlined="false"
              standout
              :loading="requerimientosTipos.length === 0"
            />
          </div>
        </div>
        <div class="row q-pt-sm q-col-gutter-xs">
          <div class="col-xs-12 col-sm-6">
            <span class="text-caption">
              Usuarios Asignados (Requerimientos Asignados y En Ejecución)
            </span>
            <q-select
              v-model="__usuariosAsignados"
              :options="usuariosAsignadosOptionsFiltered"
              clearable
              standout
              dense
              :hide-bottom-space="true"
              label="Usuarios Asignados"
              use-input
              use-chips
              multiple
              @filter="filterUsuariosAsignados"
            />
          </div>
        </div>
        <div class="row q-pt-sm justify-end">
          <q-btn color="deep-purple-10" size="md" @click="filtrar">
            Filtrar
          </q-btn>
        </div>
      </div>
    </q-menu>
    <div class="q-mt-sm">
      <span v-if="sistemaSetted || tipoRequerimientoSetted">
        Filtros:
      </span>
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
  </div>
</template>
<script>
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {},
  data() {
    return {
      input: "",
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
    ...mapGetters("auth", ["userSistemas", "userReportantes"]),
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
      this.widthInputDescripcion = size.width + 60 + 27 //+ 41
    },
    removeFilter(filter) {
      this.$store.dispatch("asignacionRequerimientos/setFilter", {
        filter,
        value: null,
      })
    },
    filtrar() {
      this.popupOpened = false
    },
    filterUsuariosAsignados(val, update) {
      if (val === "") {
        update(() => {
          this.usuariosAsignadosOptionsFiltered = this.userReportantes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        this.usuariosAsignadosOptionsFiltered = this.userReportantes.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1,
        )
      })
    },
  },
}
</script>
<style lang="scss">
.z-index-fix {
  z-index: 1 !important;
}
.filter-label .q-avatar__content {
  font-size: 0.4em;
}
</style>
