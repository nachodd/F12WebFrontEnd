<template>
  <div class="q-pa-md">
    <q-input
      ref="inputDescripcion"
      v-model="__descripcion"
      filled
      placeholder="Buscar"
      @keyup.enter="buscar"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer">
          <q-popup-proxy ref="popupproxy" :offset="[14, 14]">
            <div
              class="row no-wrap q-pa-md q-col-gutter-xs"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <!-- <div class="column items-center">
                <div class>John Doe</div>

                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                />
              </div>-->
              <div class="col-6">
                <select-custom
                  v-model="__sistema"
                  :options="sistemas"
                  label="Sistema"
                  :loading="sistemas.length === 0"
                />
              </div>
              <div class="col-6">
                <select-custom
                  v-model="__tipo"
                  :options="requerimientosTipos"
                  label="Tipo de Requerimiento"
                  :loading="requerimientosTipos.length === 0"
                />
              </div>
            </div>
            <div class="row q-pa-md justify-end">
              <q-btn
                v-close-popup
                size="md"
                color="deep-purple-10"
                @click.native="buscar"
              >
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
  },
  mounted() {
    // console.log(this.refs)
    // this.refs.popupproxy.removeEventListener("scroll")
    // let elm = svgObjectEl.removeEventListener('load', this.listener)
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width + 60 + 41
    },
    buscar() {
      this.$emit("buscar")
    },
  },
}
</script>
