<template>
  <div class="q-pb-md">
    <q-resize-observer @resize="onResize" />
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        v-model.trim="__descripcion"
        class="filter"
        :class="{ popupOpened: popupOpened }"
        dense
        standout="bg-white text-black"
        placeholder="Buscar por Asunto, Descripcion, Usuario Asignado..."
        @keyup.enter="closeFilters"
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
                :loading="sistemas.length === 0"
              />
            </div>

            <div
              class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md ellipsis"
            >
              Tipo de Requerimiento
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__tipo"
                :options="requerimientosTipos"
                dense
                label="Tipo de Requerimiento"
                color="deep-purple-10"
                :loading="requerimientosTipos.length === 0"
              />
            </div>
          </div>

          <div v-if="hasReportantesNoOperativos" class="row q-mt-lg">
            <div
              class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md ellipsis"
            >
              Ver listado como:
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <q-select
                v-model="usuarioVerComo"
                color="deep-purple-10"
                dense
                :options="optionsUsersReportantes"
                emit-value
                map-options
                @input="changeUsuarioVerComo"
              />
            </div>
          </div>

          <div class="row q-pt-md justify-end q-col-gutter-x-md">
            <div class="col-auto">
              <q-btn
                color="deep-purple-10"
                flat
                size="md"
                @click="clearFilters"
              >
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

    <div class="q-mt-sm">
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
  </div>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
export default {
  name: "PriorizarRequerimientosFiltros",
  components: { SelectCustom },
  props: {},
  data() {
    return {
      input: "",
      widthInputDescripcion: 0,
      popupOpened: false,
      usuariosAsignadosOptionsFiltered: null,
      usuarioVerComo: null,
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
    __descripcion: {
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
  async created() {
    this.changeUsuarioVerComo(null)
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
    removeFilter(filter) {
      this.$store.dispatch("priorizarRequerimientos/setFilter", {
        filter,
        value: null,
      })
    },
    clearFilters() {
      this.$store.dispatch("priorizarRequerimientos/clearFilters")
    },
    closeFilters() {
      this.popupOpened = false
    },
    async changeUsuarioVerComo(userId) {
      await this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
      this.$store.dispatch(
        "priorizarRequerimientos/inicializarPriorizarRequerimientos",
        { userId },
      )
    },
    filterUsuariosAsignados(val, update) {
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
    },
  },
}
</script>
<style lang="stylus">
.q-menu-fix {
  z-index: 1 !important;
  border-radius: 0px 0px 4px 4px !important;
  // box-shadow: 0px 4px 6px -3px grey !important;
  box-shadow: 0px 4px 5px 0px grey !important;
  overflow-x: hidden;
}

.q-field--standout .q-field__control:before {
  opacity: 1;
  transition: none !important;
}

.q-field--standout .q-field__control:hover {
  opacity: 1;
}

.popupOpened .q-field__control {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.popupOpened .q-field__control:before {
  background: white !important;
  opacity: 1;
  transition: none !important;
  box-shadow: 0px 1px 5px 0px grey !important;
}

.popupOpened .q-field__control:hover {
  opacity: 1;
  transition: none !important;
}

.filter-label .q-avatar__content {
  font-size: 0.4em;
}

.filter__icon {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  transition: background-color 200ms linear;
}

.filter__icon:hover {
  background-color: $grey-4;
}
</style>
