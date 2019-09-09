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
        placeholder="Buscar por Asunto, Descripcion..."
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

      <q-menu v-model="popupOpened" no-parent-event content-class="q-menu-fix" :offset="[0, -4]">
        <div
          class="q-pa-md row justify-center"
          :style="{
            width: widthInputDescripcion + 'px',
            'padding-top': '0',
          }"
        >
          <div class="col-md-8 col-sm-8 col-xs-12">
            <div class="row q-mt-sm q-col-gutter-sm items-center">
              <div class="col-xs-3 text-body2 q-pt-md ellipsis">
                Sistema
              </div>
              <div class="col-xs-9">
                <select-custom
                  v-model="__sistema"
                  :options="sistemasUsuarioOptions"
                  dense
                  color="deep-purple-10"
                  :loading="sistemas.length === 0"
                />
              </div>
            </div>

            <div class="row q-mt-sm q-col-gutter-sm items-center">
              <div class="col-xs-3 text-body2 q-pt-md ellipsis">
                Tipo Requerimiento
              </div>
              <div class="col-xs-9">
                <select-custom
                  v-model="__tipo"
                  :options="requerimientosTipos"
                  dense
                  color="deep-purple-10"
                  :loading="requerimientosTipos.length === 0"
                />
              </div>
            </div>

            <div v-if="hasReportantesNoOperativos" class="row q-mt-sm q-col-gutter-sm items-center">
              <div class="col-xs-3 text-body2 text-right q-pt-md ellipsis">
                Ver listado como:
              </div>
              <div class="col-xs-9">
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

            <div class="row q-mt-md justify-end">
              <q-btn color="negative" flat size="md" @click="limpiarFiltros">
                Limpiar Filtros
              </q-btn>

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
          <div class="filter-chip__text">
            {{ sistemaDescripcion }}
          </div>
          <tooltip>Sistema</tooltip>
        </q-chip>
      </span>
      <span v-if="tipoRequerimientoSetted" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('requerimientoTipo')">
          <q-avatar color="blue" text-color="white" class="filter-label">
            Tipo:
          </q-avatar>
          <div class="filter-chip__text">
            {{ tipoRequerimientoDescripcion }}
          </div>
          <tooltip>Tipo de Requerimiento</tooltip>
        </q-chip>
      </span>
      <span v-if="usuariosAsignadosSetted" class="q-mx-xs">
        <q-chip removable @remove="removeFilter('usuariosAsignados')">
          <q-avatar color="green" text-color="white" class="filter-label">
            U.A.:
          </q-avatar>
          <div class="filter-chip__text">
            {{ usuariosAsignadosDescripcion }}
          </div>
          <tooltip>Usuarios Asignados</tooltip>
        </q-chip>
      </span>
    </div>
  </div>
</template>
<script>
import SelectCustom from "comp/Requerimientos/SelectCustom"
import Tooltip from "comp/Common/Tooltip"
import { mapState, mapGetters } from "vuex"
export default {
  name: "PriorizarRequerimientosFiltros",
  components: { SelectCustom, Tooltip },
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
        return this.$store.state.priorizarRequerimientos.filtros.requerimientoTipo
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
        return this.$store.state.asignacionRequerimientos.filtros.usuariosAsignados
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
    limpiarFiltros() {
      this.$store.dispatch("priorizarRequerimientos/clearFilters")
    },
    closeFilters() {
      this.popupOpened = false
    },
    async changeUsuarioVerComo(userId) {
      await this.$store.dispatch("priorizarRequerimientos/flushRequerimientos")
      this.$store.dispatch("priorizarRequerimientos/inicializarPriorizarRequerimientos", { userId })
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
/*
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
} */
</style>
