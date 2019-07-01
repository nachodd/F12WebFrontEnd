<template>
  <div class="q-py-md">
    <q-input
      ref="inputDescripcion"
      v-model.trim="__descripcion"
      class="standout-custom"
      :input-class="{ 'fix-q-input-border-radius': popupOpened }"
      dense
      standout="bg-white text-black"
      placeholder="Buscar"
      @keyup.enter="filtrar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon :name="iconOpenFilter" class="cursor-pointer">
          <q-menu
            v-model="popupOpened"
            :offset="[12, 3]"
            content-class="z-index-fix border-radius-fix box-shadow-fix"
          >
            <div
              class="q-pa-md"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <div class="row q-pt-sm q-col-gutter-xs">
                <div class="col-xs-12 col-sm-6">
                  <select-custom
                    v-model="__sistema"
                    :options="sistemas"
                    dense
                    :outlined="false"
                    label="Sistema"
                    standout
                    :loading="sistemas.length === 0"
                  />
                </div>
                <div class="col-xs-12 col-sm-6">
                  <select-custom
                    v-model="__tipo"
                    :options="requerimientosTipos"
                    dense
                    :outlined="false"
                    label="Tipo de Requerimiento"
                    standout
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
        </q-icon>
      </template>
      <q-resize-observer @resize="onResize" />
    </q-input>
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
      this.widthInputDescripcion = size.width + 60 + 24
    },
    filtrar() {
      this.popupOpened = false
      this.$emit("buscar")
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

.border-radius-fix {
  border-radius: 0px 0px 4px 4px !important;
}

.box-shadow-fix {
  box-shadow: 0px 4px 6px -3px grey !important;
  // z-index: 14;
}

.standout-custom {
  border-radius: 0px !important;
}

.standout-custom.q-field--focused {
  background: none !important;
}

.fix-q-input-border-radius .q-field__inner .q-field__control {
  border-radius: 4px 4px 0px 0px !important;
}

.fix-q-input-border-radius .q-field__inner .q-field__control:before {
  background: transparent !important;
  opacity: 0;
  transition: none !important;
}
.q-field--standout .q-field__control:before {
  background: transparent !important;
  opacity: 1;
  transition: none !important;
}
.q-field--standout .q-field__control:hover {
  // background: transparent !important;
  opacity: 1;
  transition: none !important;

  // box-shadow: 0px -1px 7px -2px grey !important;
}
</style>
