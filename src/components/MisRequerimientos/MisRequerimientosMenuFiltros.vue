<template>
  <div class="q-py-md">
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        v-model.trim="__descripcion"
        class="standout-custom"
        :class="{ popupOpened: popupOpened }"
        dense
        standout="bg-white text-black"
        placeholder="Buscar"
        @keyup.enter="filtrar"
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
        :offset="[0, -4]"
        content-class="q-menu-fix"
        :content-style="{ maxWidth: widthInputDescripcion + 'px !important' }"
        no-parent-event
      >
        <div class="q-pa-md" :style="{ width: widthInputDescripcion + 'px' }">
          <div class="row q-pt-sm q-col-gutter-xs">
            <div class="col-xs-3 col-sm-3 col-md-2 col-lg-1 text-body2 q-pt-md">
              Sistema
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-11">
              <select-custom
                v-model="__sistema"
                :options="sistemas"
                dense
                label="Sistema"
                color="accent"
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
                :loading="requerimientosTipos.length === 0"
              />
            </div>
          </div>

          <div class="row q-pt-sm justify-end">
            <q-btn size="md" color="deep-purple-10" @click.native="filtrar">
              Filtrar
            </q-btn>
          </div>
        </div>
      </q-menu>
    </div>
    <!-- <div class="q-mt-sm">
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
    </div>-->
  </div>
</template>
<script>
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import { mapState } from "vuex"
export default {
  name: "MisRequerimientosMenuFiltros",
  components: { SelectCustom },
  props: {
    sistemaId: {
      type: Object,
      default: null,
    },
    seccionId: {
      type: Object,
      default: null,
    },
    requerimientoTipo: {
      type: Object,
      default: null,
    },
    descripcion: {
      type: String,
      default: null,
    },
  },
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

    sistemaSetted() {
      return this.__sistema && Boolean(this.__sistema.id)
    },
    tipoRequerimientoSetted() {
      return this.__tipo && Boolean(this.__tipo.id)
    },
    __sistema: {
      get() {
        return this.sistemaId
      },
      set(value) {
        this.$emit("update:sistemaId", value)
      },
    },
    __tipo: {
      get() {
        return this.requerimientoTipo
      },
      set(value) {
        this.$emit("update:requerimientoTipo", value)
      },
    },
    __descripcion: {
      get() {
        return this.descripcion
      },
      set(value) {
        this.$emit("update:descripcion", value)
      },
    },
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
  },
  mounted() {},
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width + 60 + 30
    },
    filtrar() {
      this.popupOpened = false
      this.$emit("buscar")
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
