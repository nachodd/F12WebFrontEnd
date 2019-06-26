<template>
  <div class="q-py-md">
    <q-input
      ref="inputDescripcion"
      v-model="input"
      class="standout-custom"
      dense
      standout="bg-white text-black"
      placeholder="Buscar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer">
          <q-popup-proxy :offset="[14, 8]">
            <div
              class="row no-wrap q-pa-md q-col-gutter-xs"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <div class="col-6">
                <select-custom
                  v-model="__sistema"
                  :options="sistemasUsuarioOptions"
                  dense
                  label="Sistema"
                  :loading="sistemas.length === 0"
                />
              </div>
              <div class="col-6">
                <select-custom
                  v-model="__tipo"
                  :options="requerimientosTipos"
                  label="Tipo de Requerimiento"
                  dense
                  :loading="requerimientosTipos.length === 0"
                />
              </div>
            </div>
            <div class="row q-pa-md justify-end">
              <q-btn color="deep-purple-10" size="md" @click.native="buscar">
                Buscar
              </q-btn>
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
      <q-resize-observer @resize="onResize" />
    </q-input>
  </div>
</template>
<script>
import SelectCustom from "@comp/Requerimientos/SelectCustom"
import { mapState, mapGetters } from "vuex"
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
  },
  data() {
    return {
      input: "",
      widthInputDescripcion: 0,
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
  },
  methods: {
    onResize(size) {
      // console.log("resize!", size)
      this.widthInputDescripcion = size.width + 60 + 32 //+ 41
    },

    buscar() {
      this.$emit("buscar")
    },
  },
}
</script>
