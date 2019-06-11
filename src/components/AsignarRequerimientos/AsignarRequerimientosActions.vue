<template>
  <div>
    <div class="text-grey-7">
      Seleccione una acción:
    </div>

    <q-select
      v-model="operation"
      filled
      :options="optionsAsignar"
      options-cover
      emit-value
      map-options
    />

    <div class="q-mt-md">
      <q-slide-transition>
        <div v-show="operation === 'asignar'" class="row">
          <div class="col-12">
            <q-select
              v-model="usuarioAsignado"
              filled
              :options="userReportantes"
              options-cover
              emit-value
              map-options
            />
          </div>

          <div class="col-12">
            <q-input
              ref="commentAsignar"
              v-model="comment"
              color="accent"
              outlined
              autogrow
              label="Agregar un comentario:"
              :hide-bottom-space="true"
              :rules="[notEmpty]"
            />
          </div>
        </div>
      </q-slide-transition>
    </div>
    <div v-show="operation !== null" class="q-mt-md">
      <q-btn
        class="full-width"
        label="Guardar"
        color="deep-purple-10"
        @click="saveChanges"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import formValidation from "@mixins/formValidation"

export default {
  name: "AsignarRequerimientosActions",
  mixins: [formValidation],
  data() {
    return {
      operation: null,
      comment: null,
    }
  },
  computed: {
    ...mapGetters("auth", ["userReportantes"]),
    ...mapGetters("requerimientos", ["detalleRequerimientoState"]),
    stateNotAssigned() {
      return this.detalleRequerimientoState === "NOAS"
    },
    stateAssigned() {
      return this.detalleRequerimientoState === "ASSI"
    },
    stateInExcecution() {
      return this.detalleRequerimientoState === "EXEC"
    },
    optionsAsignar() {
      const opt = []
      opt.push({
        label: "Ninguna seleccionada",
        value: null,
      })
      if (this.stateNotAssigned) {
        opt.push({
          label: "Asignar",
          value: "asignar",
        })
        opt.push({
          label: "Enviar a Procesos",
          value: "aProcesos",
        })
      }

      if (this.stateAssigned) {
        opt.push({
          label: "Volver a Pendiente de Asignación",
          value: "asignar",
        })
      }

      return opt
    },
  },
  methods: {
    saveChanges() {},
  },
}
</script>
