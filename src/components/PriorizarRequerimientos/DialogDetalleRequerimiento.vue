<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card>
      <q-card-section class="bg-deep-purple-10 text-white items-center">
        <div class="text-h6">Requerimiento Nº {{ req.id }}</div>
        <div class="text-subtitle3 text-white-7">{{ req.usuario.nombre }}</div>
      </q-card-section>

      <q-separator />
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3 text-grey-7"
        active-color="purple"
        indicator-color="purple"
        align="justify"
        narrow-indicator
      >
        <q-tab name="detalle" label="Detalle" />
        <q-tab name="acciones" label="Acciones" />
        <q-tab name="movimientos" label="Movimientos" />
      </q-tabs>
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

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="detalle">
            <!-- <div class="text-h6">{{ req.asunto }}</div> -->
            <div class="row">
              <div class="col-4">
                <div class="text-grey-7">Area</div>
                <q-item-label lines="1">
                  {{ req.area.descripcion }}
                </q-item-label>
              </div>
              <div class="col-4">
                <div class="text-grey-7">Sistema</div>
                <q-item-label lines="1">
                  {{ req.sistema.descripcion }}
                </q-item-label>
              </div>
              <div class="col-4">
                <div class="text-grey-7">Tipo</div>
                <q-item-label lines="1">
                  {{ req.requerimientoTipo.descripcion }}
                </q-item-label>
              </div>
            </div>
            <br />
            <!-- <q-separator /> -->
            <!-- <br /> -->

            <div class="text-grey-7">Asunto</div>
            {{ req.asunto }}
            <br />
            <br />
            <div class="text-grey-7">Descripcion</div>
            {{ req.descripcion }}
            <br />
            <br />
            <!-- <q-separator /> -->
          </q-tab-panel>

          <q-tab-panel name="movimientos">
            <!-- <div class="text-h6">movimientos</div> -->
            <div v-if="req.movimientos" class="row">
              <q-timeline color="purple">
                <!-- <q-timeline-entry heading body /> -->

                <q-timeline-entry
                  v-for="(movimiento, index) in req.movimientos"
                  :key="`req_${index}`"
                  :title="movimiento.estado"
                  :subtitle="movimiento.fecha"
                  icon
                  color
                  text-color="grey"
                >
                  <div>
                    Usuario: {{ movimiento.usuario }}
                    <br />
                    {{ movimiento.comentario }}
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </div>
          </q-tab-panel>

          <q-tab-panel name="acciones">
            <!-- <div class="text-h6">Movies</div> -->
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat label="Cerrar" color="purple" />
        <q-btn v-close-popup flat label="Guardar" color="purple" />
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
