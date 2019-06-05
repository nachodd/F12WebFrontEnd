<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Requerimiento</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="max-height: 50vh;padding:0px !important;"
        class="scroll"
      >
        <!-- <p v-for="n in 15" :key="n">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </p>-->

        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-3 text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="detalle" label="Detalle" />
          <q-tab name="alarms" label="Movimientos" />
          <!-- <q-tab name="movies" label="Movies" /> -->
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="detalle">
            <!-- <div class="text-h6">Detalle</div> -->
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <!-- <div class="text-h6">Alarms</div> -->
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

          <q-tab-panel name="movies">
            <div class="text-h6">Movies</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Decline" v-close-popup color="primary" />
        <q-btn flat label="Accept" v-close-popup color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { date } from "quasar"
import formValidation from "@mixins/formValidation"
import priorityColor from "@mixins/priorityColor"
// import ChipLarge from "@comp/Common/ChipLarge"
// import Note from "@comp/Common/Note"
import { warn, success } from "@utils/helpers"

export default {
  name: "DialogDetalleRequerimiento",
  // components: { ChipLarge, Note },

  mixins: [priorityColor, formValidation],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      operation: null,
      approvedPriority: 1,
      comment: null,
      fixed: false,
      tab: "detalle",
    }
  },
  computed: {
    ...mapState("priorizarRequerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando", "userId"]),
    ...mapGetters("priorizarRequerimientos", [
      "cantidadRequerimientos",
      "reqsPendientesAprobacionLength",
      "reqsAprobadosPriorizadosLength",
      "esAutor",
    ]),
    maximoSliderPrioridad() {
      // Si la operacion es de seleccionar prioridad, el max del slider será 1 menos que la cant de reqs
      return this.operation === "seleccionarPrioridad"
        ? this.cantidadRequerimientos - 1
        : this.cantidadRequerimientos
    },
    requerimientoSetted() {
      return !_.isEmpty(this.req)
    },
    vencimientoDiff() {
      if (this.req && this.req.vence) {
        const diff = date.getDateDiff(
          new Date(this.req._fechaLimite),
          new Date(),
          "days",
        )
        return diff
      }
      return null
    },
    detalleRequerimientoOpen: {
      get() {
        return this.$store.state.priorizarRequerimientos
          .detalleRequerimientoOpen
      },
      set(value) {
        return this.$store
          .dispatch(
            "priorizarRequerimientos/setDetalleRequerimientoOpen",
            value,
          )
          .then(() => {
            // Reset de la operacion (para los botones) y la prioridad seleccionada
            this.operation = null
            this.approvedPriority = 1
            this.comment = null
          })
      },
    },
    /* options() {
      if (this.esElUltimoDeLaCadenaDeMando) {
        return [
          {
            label: "Seleccionar Prioridad",
            value: "aprobar",
            icon: "fas fa-sort-amount-down",
          },
        ]
      }
      const options = [
        {
          label: "Descartar",
          value: "descartar",
          icon: "fas fa-trash",
        },
      ]
      if (this.statePending) {
        options.push({
          label: "Aprobar",
          value: "aprobar",
          icon: "fas fa-check",
        })
      }
      if (this.stateApproved) {
        options.push({
          label: "Vovler a Pend. Aprob.",
          value: "pendiente",
          icon: "fas fa-undo",
        })
      }

      return options
    }, */
    statePending() {
      return this.req.estado.id === 1
    },
    stateApproved() {
      return this.req.estado.id === 2
    },
    isApprovingOrReordering() {
      return (
        this.operation === "aprobar" ||
        this.operation === "seleccionarPrioridad"
      )
    },
    seleccionarPrioridadShown() {
      if (this.esElUltimoDeLaCadenaDeMando) {
        return this.statePending && this.reqsPendientesAprobacionLength > 1
      } else {
        return this.stateApproved && this.reqsAprobadosPriorizadosLength > 1
      }
    },
  },
  methods: {
    saveChanges() {
      if (
        this.operation === "descartar" &&
        !this.esElUltimoDeLaCadenaDeMando &&
        !this.$refs.commentDescartar.validate()
      ) {
        return
      }

      this.$store
        .dispatch("priorizarRequerimientos/processManualChanges", {
          operation: this.operation,
          priority: this.approvedPriority,
          comment: this.comment,
          listName: this.statePending ? "source" : "target",
        })
        .then(message => {
          if (message) success({ message })
          this.detalleRequerimientoOpen = false
        })
        .catch(message => {
          warn({ message })
        })
    },
  },
}
</script>
