<template>
  <q-dialog
    v-model="detalleRequerimientoOpen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card v-if="requerimientoSetted" class="requerimiento-detail-card">
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
            <chip-large
              avatar-text="Usuario"
              avatar-color="#6671f0"
              :text="req.usuario.nombre"
            />

            <br />

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
            <note title="Descripción:" type="accent">
              {{ req.descripcion }}
            </note>
          </div>
        </div>
        <div v-if="req.vence" class="row q-mt-sm">
          <div class="col">
            <note
              title="Este requerimiento posee Fecha de Vencimiento"
              type="danger"
            >
              <div>
                <span class="text-underline">Vencimiento:</span>
                {{ req.fechaLimite }}
                <template v-if="vencimientoDiff !== null">
                  <span v-if="vencimientoDiff > 0" class="text-red">
                    (Faltan
                    <strong>{{ vencimientoDiff }}</strong>
                    días)
                  </span>
                  <span v-if="vencimientoDiff === 0" class="text-red">
                    (HOY es el día de vencimiento)
                  </span>
                  <span v-if="vencimientoDiff < 0" class="text-red">
                    (
                    <strong>Este req. se encuentra vencido</strong>
                    )
                  </span>
                </template>
              </div>
              <div>
                <span class="text-underline">Motivo:</span>
                {{ req.motivoLimite }}
              </div>
            </note>
          </div>
        </div>
        <div
          v-if="req.adjuntosCargados && req.adjuntosCargados.length"
          class="row q-mt-sm"
        >
          <div class="col">
            <note title="Adjuntos:">
              <ul>
                <li
                  v-for="(adjunto, i) in req.adjuntosCargados"
                  :key="`req_${req.id}_${adjunto}`"
                >
                  <a v-auth-href :href="adjunto">Adjunto {{ i + 1 }}</a>
                </li>
              </ul>
            </note>
          </div>
        </div>
        <div v-if="req.comentario" class="row q-mt-sm">
          <div class="col">
            <note title="Comentarios:">{{ req.comentario }}</note>
          </div>
        </div>

        <div v-if="req.movimientos" class="row q-mt-md">
          <q-timeline color="secondary">
            <q-timeline-entry heading body="Movimientos" />

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

        <div class="q-mt-md">
          <note title="Acciones:">
            <div class="row text-center">
              <!-- <q-btn-toggle
              v-model="operation"
              class="toggle"
              rounded
              stack
              unelevated
              toggle-color="accent"
              color="white"
              text-color="accent"
              :options="options"
              />-->
              <div v-if="seleccionarPrioridadShown" class="col">
                <q-btn
                  class="btn__action small-icon"
                  :class="{
                    'selected--accent': operation === 'seleccionarPrioridad',
                  }"
                  color="accent"
                  stack
                  outline
                  dense
                  rounded
                  icon="fas fa-sort-amount-down"
                  label="Selec. Prioridad"
                  @click="operation = 'seleccionarPrioridad'"
                />
              </div>
              <div
                v-if="statePending && !esElUltimoDeLaCadenaDeMando"
                class="col"
              >
                <q-btn
                  class="btn__action small-icon"
                  :class="{ 'selected--accent': operation === 'aprobar' }"
                  color="accent"
                  stack
                  outline
                  dense
                  rounded
                  icon="fas fa-check"
                  label="Aprobar"
                  @click="operation = 'aprobar'"
                />
              </div>
              <div v-if="stateApproved" class="col">
                <q-btn
                  class="btn__action small-icon"
                  :class="{ 'selected--accent': operation === 'pendiente' }"
                  color="accent"
                  stack
                  outline
                  dense
                  rounded
                  icon="fas fa-undo"
                  label="Pend. Aprob."
                  @click="operation = 'pendiente'"
                />
              </div>
              <div class="col">
                <q-btn
                  class="btn__action small-icon"
                  :class="{ 'selected--red': operation === 'descartar' }"
                  color="red"
                  stack
                  outline
                  dense
                  rounded
                  icon="fas fa-trash"
                  label="Descartar"
                  @click="operation = 'descartar'"
                />
              </div>
            </div>
            <q-slide-transition>
              <div v-show="isApprovingOrReordering" class="q-mt-md">
                <div class="row">
                  <div class="col">
                    <div>Seleccione una Prioridad para este Requerimiento:</div>
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
            <q-slide-transition>
              <div
                v-show="
                  operation === 'descartar' && !esElUltimoDeLaCadenaDeMando
                "
                class="q-mt-md"
              >
                <div class="row">
                  <div class="col">
                    <q-input
                      ref="commentDescartar"
                      v-model="comment"
                      color="accent"
                      outlined
                      autogrow
                      label="Agregar un motivo:"
                      :rules="[notEmpty]"
                      :hide-bottom-space="true"
                    />
                  </div>
                </div>
              </div>
            </q-slide-transition>
          </note>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="CERRAR"
          rounded
          outline
          color="negative"
          @click="detalleRequerimientoOpen = false"
        />
        <q-btn
          v-show="operation !== null"
          rounded
          outline
          label="ACEPTAR"
          color="green-6"
          @click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { date } from "quasar"
import formValidation from "mixins/formValidation"
import priorityColor from "mixins/priorityColor"
import ChipLarge from "comp/Common/ChipLarge"
import Note from "comp/Common/Note"
import { warn, success } from "utils/helpers"

export default {
  name: "DialogDetalleRequerimiento",
  components: { ChipLarge, Note },
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
    }
  },
  computed: {
    ...mapState("priorizarRequerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    ...mapGetters("priorizarRequerimientos", [
      "cantidadRequerimientos",
      "reqsPendientesAprobacionLength",
      "reqsAprobadosPriorizadosLength",
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
  width: 85%;
}
.section-title {
  font-weight: 500;
  margin-bottom: 0;
}
.selected--accent {
  background-color: #311b92 !important;
  color: #ffffff !important;
}
.selected--red {
  background-color: #f44336 !important;
  color: #ffffff !important;
}
.btn__action {
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
