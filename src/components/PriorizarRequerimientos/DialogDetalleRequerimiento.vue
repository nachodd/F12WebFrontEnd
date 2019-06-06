<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card v-if="requerimientoSetted">
      <q-card-section class="bg-deep-purple-10 text-white items-center">
        <div class="text-h6">Requerimiento Nº {{ req.id }}</div>
        <div class="text-subtitle3 text-white-7">{{ req.usuario.nombre }}</div>
      </q-card-section>

      <q-separator />
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3 text-grey-7"
        active-color="deep-purple-10"
        indicator-color="deep-purple-10"
        align="justify"
        narrow-indicator
      >
        <q-tab name="detalle" label="Detalle" />
        <q-tab name="acciones" label="Acciones" />
        <q-tab name="movimientos" label="Movimientos" />
      </q-tabs>
      <q-separator />
      <q-card-section
        id="test"
        style="height: 50vh;width:84vh;padding:0px !important;"
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

            <!-- aviso de vencimiento -->

            <!-- detalle -->
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

            <q-banner
              v-if="req.vence"
              inline-actions
              class="text-white bg-red-4"
              style="margin-bottom:20px;"
              rounded
            >
              <div>
                <span>Vencimiento:</span>
                <br />
                {{ req.fechaLimite }}
                <template v-if="vencimientoDiff !== null">
                  <span v-if="vencimientoDiff > 0" class="text-white">
                    (Faltan
                    <strong>{{ vencimientoDiff }}</strong>
                    días)
                  </span>

                  <span v-if="vencimientoDiff === 0" class="text-white">
                    (HOY es el día de vencimiento)
                  </span>

                  <strong v-if="vencimientoDiff < 0">
                    (Este req. se encuentra vencido )
                  </strong>
                </template>
                <br />
                <br />
                <span class>Motivo:</span>
                <br />
                {{ req.motivoLimite }}
              </div>
              <template v-slot:action>
                <!-- <q-btn flat color="white" label="Turn ON Wifi" /> -->
                <q-avatar
                  icon="info"
                  color
                  text-color="white"
                  class="avatar--lg"
                />
              </template>
            </q-banner>
          </q-tab-panel>

          <q-tab-panel name="acciones">
            <!-- <div class="text-h6">Movies</div> -->

            <div class="text-grey-7">
              Seleccione una acción a ejecutar sobre el requerimiento
            </div>

            <q-select
              v-model="operation"
              filled
              :options="options"
              options-cover
              emit-value
              map-options
            />

            <div class="q-mt-md">
              <!-- seleccion de prioridad y motivo para cuando aprueba o reordena-->
              <q-slide-transition>
                <div v-show="isApprovingOrReordering" class="q-mt-md">
                  <div class="row">
                    <div class="col">
                      <div>
                        Seleccione una Prioridad para este Requerimiento:
                      </div>
                      <br />
                      <q-slider
                        v-model="approvedPriority"
                        class="slider"
                        markers
                        :min="1"
                        :max="maximoSliderPrioridad"
                        label
                        label-always
                        color="accent"
                      />
                    </div>
                  </div>
                  <div v-if="operation === 'aprobar'" class="row">
                    <div class="col">
                      <q-input
                        v-model="comment"
                        color="accent"
                        outlined
                        autogrow
                        label="Si desea, puede agregar un comentario: "
                        :hide-bottom-space="true"
                      />
                    </div>
                  </div>
                </div>
              </q-slide-transition>

              <!-- motivo para cuando descarta -->
              <q-slide-transition>
                <div
                  v-show="
                    operation === 'descartar' && !esElUltimoDeLaCadenaDeMando
                  "
                  class="row"
                >
                  <div class="col">
                    <q-input
                      ref="commentDescartar"
                      v-model="comment"
                      color="accent"
                      outlined
                      autogrow
                      label="Agregar un motivo:"
                      :hide-bottom-space="true"
                      :rules="[notEmpty]"
                    />
                  </div>
                </div>
              </q-slide-transition>
            </div>
          </q-tab-panel>

          <q-tab-panel name="movimientos">
            <!-- <div class="text-h6">movimientos</div> -->
            <div v-if="req.movimientos" class="row">
              <q-timeline color="purple">
                <!-- <q-timeline-entry heading body /> -->

                <q-timeline-entry
                  v-for="(movimiento, index) in req.movimientos"
                  :key="`req_${index}`"
                  :title="movimiento.estado | formatiarEstado(movimiento)"
                  :subtitle="movimiento | formatiarFecha"
                  icon
                  color
                  text-color="grey"
                  class="title-custom"
                >
                  <div>{{ movimiento.comentario }}</div>
                </q-timeline-entry>
              </q-timeline>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <!-- Botones de accion para el requerimiento -->
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cerrar"
          color="deep-purple-10"
          @click="detalleRequerimientoOpen = false"
        />
        <q-btn
          v-show="operation !== null"
          label="Guardar"
          color="deep-purple-10"
          @click="saveChanges"
        />
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
  filters: {
    formatiarFecha(value) {
      let fechaFormatiada = date.formatDate(value.fecha, "DD/MM/YYYY HH:mm")

      let retorno = value.usuario + " | " + fechaFormatiada

      return retorno
    },
    formatiarEstado(value, objMovimiento) {
      if (objMovimiento.tipo == "Alta") {
        value = "Alta"
      }
      return value
    },
  },
  // components: { ChipLarge, Note },
  // components: { Note },

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

    options() {
      const optiones = [
        {
          label: "Ninguna seleccionada",
          value: null,
          // icon: "fas fa-trash",
        },
      ]
      console.log("Es el ultimo de la cadena", this.esElUltimoDeLaCadenaDeMando)
      if (this.esElUltimoDeLaCadenaDeMando) {
        return [
          {
            label: "Seleccionar Prioridad",
            value: "seleccionarPrioridad",
            // icon: "fas fa-sort-amount-down",
          },
        ]
      }
      optiones.push({
        label: "Descartar",
        value: "descartar",
        // icon: "fas fa-trash",
      })

      if (this.statePending && !this.esElUltimoDeLaCadenaDeMando) {
        optiones.push({
          label: "Aprobar",
          value: "aprobar",
          // icon: "fas fa-check",
        })
      }
      if (this.stateApproved) {
        optiones.push({
          label: "Volver a Pend. Aprob.",
          value: "pendiente",
          icon: "fas fa-undo",
        })
      }

      return optiones
    },
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
      // Valido, si esta descartando (operacion: descartar && NO es esAutor), debe completar el comentario
      if (
        this.operation === "descartar" &&
        !this.esAutor &&
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

<style lang="scss" scope>
.avatar--lg {
  font-size: 80px !important;
  height: auto !important;
  width: auto !important;
}

.title-custom .q-timeline__title {
  margin: 0px;
}
</style>
