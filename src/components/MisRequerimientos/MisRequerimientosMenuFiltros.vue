<template>
  <div class="q-pa-md">
    <q-input ref="inputDescripcion" v-model="input" filled placeholder="Buscar">
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer">
          <q-popup-proxy :offset="[14, 14]">
            <div
              class="row no-wrap q-pa-md"
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
              <div class="col-3">
                <select-custom
                  v-model="__sistema"
                  :options="sistemas"
                  label="Sistema"
                  :loading="sistemas.length === 0"
                />
              </div>
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
  },
  methods: {
    onResize(size) {
      console.log("resize!", size)
      this.widthInputDescripcion = size.width + 60
    },
  },
}
</script>
