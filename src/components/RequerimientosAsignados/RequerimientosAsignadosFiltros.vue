<template>
  <div class="q-py-md">
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
        <q-resize-observer @resize="onResize" />
      </q-input>

      <q-menu
        v-model="popupOpened"
        no-parent-event
        content-class="q-menu-fix"
        :content-style="{ maxWidth: widthInputDescripcion + 'px !important' }"
        :offset="[0, -4]"
      >
        <div class="q-pa-md" :style="{ width: widthInputDescripcion + 'px' }">
          <div class="row q-pt-sm q-col-gutter-xs">
            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
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

            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
              Tipo de Requerimiento
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
      widthInputDescripcion: 0,
      popupOpened: false,
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
    // Filtro solo los sistemas que tiene el usuario logueado
    __descripcion: {
      get() {
        return this.$store.state.requerimientosAsignados.filtros.descripcion
      },
      set(value) {
        this.$store.dispatch("requerimientosAsignados/setFilter", {
          filter: "descripcion",
          value,
        })
      },
    },
    __sistema: {
      get() {
        return this.$store.state.requerimientosAsignados.filtros.sistema
      },
      set(value) {
        this.$store.dispatch("requerimientosAsignados/setFilter", {
          filter: "sistema",
          value,
        })
      },
    },
    __tipo: {
      get() {
        return this.$store.state.requerimientosAsignados.filtros
          .requerimientoTipo
      },
      set(value) {
        this.$store.dispatch("requerimientosAsignados/setFilter", {
          filter: "requerimientoTipo",
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
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width + 60 + 30
    },
    removeFilter(filter) {
      this.$store.dispatch("requerimientosAsignados/setFilter", {
        filter,
        value: null,
      })
    },
    clearFilters() {
      this.$store.dispatch("requerimientosAsignados/clearFilters")
    },
    closeFilters() {
      this.popupOpened = false
    },
  },
}
</script>
<style lang="stylus">
// FIXME: implementar este filtro, que funcione
// FIXME: re-implementar la store con 1 solo listado base y getters, como esta haciendo ari en priorizar reqs
</style>
