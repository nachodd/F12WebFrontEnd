<template>
  <q-tab-panel name="accionesPriorizarReqs">
    <!-- <div class="text-h6">Movies</div> -->

    <div class="text-grey-7">
      Seleccione una acción a ejecutar sobre el requerimiento
    </div>

    <q-select
      v-model="operation"
      filled
      :options="optionsPriorizar"
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
          v-show="operation === 'descartar' && !esElUltimoDeLaCadenaDeMando"
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
</template>

<script>
import { mapState, mapGetters } from "vuex"
export default {
  data() {
    return {
      operation: null,
    }
  },
  computed: {
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    ...mapGetters("auth", ["esElUltimoDeLaCadenaDeMando"]),
    // ...mapGetters("priorizarRequerimientos", [
    //   "cantidadRequerimientos",
    //   "reqsPendientesAprobacionLength",
    //   "reqsAprobadosPriorizadosLength",
    //   "esAutor",
    // ]),
    optionsPriorizar() {
      const opciones = [
        {
          label: "Ninguna seleccionada",
          value: null,
        },
      ]
      if (this.esElUltimoDeLaCadenaDeMando) {
        return [
          {
            label: "Seleccionar Prioridad",
            value: "seleccionarPrioridad",
          },
        ]
      }
      opciones.push({
        label: "Descartar",
        value: "descartar",
      })

      if (this.statePending && !this.esElUltimoDeLaCadenaDeMando) {
        opciones.push({
          label: "Aprobar",
          value: "aprobar",
          // icon: "fas fa-check",
        })
      }
      if (this.stateApproved) {
        opciones.push({
          label: "Volver a Pend. Aprob.",
          value: "pendiente",
          icon: "fas fa-undo",
        })
      }

      return opciones
    },
    statePending() {
      return this.req.estado.id === 1
    },
    stateApproved() {
      return this.req.estado.id === 2
    },
    stateNotAssigned() {
      return this.req.estado.id === 3
    },
    stateAssigned() {
      return this.req.estado.id === 4
    },
  },
}
</script>
