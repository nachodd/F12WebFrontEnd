<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="requerimiento-detail-card">
      <q-card-section class="row bg-deep-purple-10 text-white items-center">
        <div class="col-11 col-xs-auto">
          <div class="title-id">#{{ req.id }}</div>
          <div class="title-title">{{ req.asunto }}</div>
        </div>
        <div class="col-1">
          <q-btn v-close-popup icon="close" flat round dense />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-mt-sm">
          <div class="col text-center">
            <chip-large
              :avatar-color="getColorPrioridad(req.prioridad)"
              :avatar-text-color="getColorPrioridadText(req.prioridad)"
              :avatar-text="req.prioridad"
              text="Prioridad"
            />
            <chip-large avatar-text="Area" :text="req.area.descripcion" />

            <chip-large
              avatar-text="Stistema"
              :text="req.sistema.descripcion"
            />
            <chip-large
              avatar-text="Req. Tipo"
              :text="req.requerimientoTipo.descripcion"
            />
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col">
            <p class="section-title">
              Descripcion:
            </p>
            <p>
              {{ req.descripcion }}
            </p>
            <!-- <note title="Descripción:">
            </note> -->
          </div>
        </div>
        <div v-if="req.adjuntos && req.adjuntos.length" class="row q-mt-sm">
          <div class="col">
            <note title="Adjuntos:">
              test test test
            </note>
          </div>
        </div>
        <div class="row q-mt-md text-center">
          <div class="col">
            <q-btn-toggle
              v-model="operation"
              class="toggle"
              rounded
              toggle-color="accent"
              color="white"
              text-color="accent"
              :options="[
                { label: 'Aprobar', value: 'aprobar', icon: 'fas fa-check' },
                {
                  label: 'Descartar',
                  value: 'descartar',
                  icon: 'fas fa-trash',
                },
              ]"
            />
          </div>
        </div>
        <q-slide-transition>
          <div v-show="isApproving" class="row q-mt-md ">
            <div class="col">
              <div>Seleccione una Prioridad para este Requerimiento:</div>
              <br />
              <q-slider
                v-model="approvedPriority"
                class="slider"
                :min="1"
                :max="10"
                label
                label-always
                color="accent"
              />
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="CERRAR" color="negative" />
        <q-btn v-show="operation !== null" label="ACEPTAR" color="green-6" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import priorityColor from "@mixins/priorityColor"
import ChipLarge from "@comp/Common/ChipLarge"
import Note from "@comp/Common/Note"
import { mapState } from "vuex"
export default {
  name: "DialogDetalleRequerimiento",
  components: { ChipLarge, Note },
  mixins: [priorityColor],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /* req: {
        id: 145,
        asunto: "Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh",
        descripcion:
          "Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh",
        area: { id: 1, descripcion: "Area sistemas" },
        sistema: { id: 1, descripcion: "Visual bolsa" },
        requerimientoTipo: { id: 1, descripcion: "Tipo de requerimiento 1" },
        fechaLimite: "29/04/2019",
        motivoLimite: "bla bla bla",
        importante: "NO",
        prioridad: "3",
        adjuntos: [],
      }, */
      operation: null,
      approvedPriority: 1,
    }
  },
  computed: {
    ...mapState("priorizarRequerimientos", {
      // detalleRequerimientoOpen: state => state.detalleRequerimientoOpen,
      req: state => state.detalleRequerimientoItem,
    }),
    detalleRequerimientoOpen: {
      get() {
        debugger
        return this.$store.state.priorizarRequerimientos
          .detalleRequerimientoOpen
      },
      set(value) {
        debugger
        return this.$store.dispatch(
          "priorizarRequerimientos/setDetalleRequerimientoOpen",
          value,
        )
      },
    },
    // __opened: {
    //   get() {
    //     return this.value
    //   },
    //   set(__opened) {
    //     this.$emit("input", __opened)
    //   },
    // },

    isApproving() {
      return this.operation === "aprobar"
    },
  },
  watch: {
    req(val) {
      console.log(val)
    },
  },
  mounted() {
    this.operation = null
    this.approvedPriority = 1
  },
}
</script>

<style lang="scss" scoped>
@import "src/css/variables.scss";

.requerimiento-detail-card {
  min-width: 400px;
}
.title-id {
  font-size: 0.8rem;
  font-weight: 500;
  height: 20px;
}
.offset-top {
  position: relative;
  top: -8px;
}
.title-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.chip-large {
  width: auto;
  border-radius: 16px;
  padding: 0 10px;
}
.toggle {
  border: 1px solid $accent;
}
.slider {
  margin: 0 auto;
  width: 90%;
}
.section-title {
  font-weight: 500;
  margin-bottom: 0;
}
</style>
