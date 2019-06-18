<template>
  <q-dialog
    v-model="dialogConfirmOpen"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-accent text-white">
      <q-bar>
        <q-btn dense flat icon="fas fa-exclamation-triangle" />
        <q-space />
        <q-btn dense flat icon="close" @click="cancelOperation">
          <q-tooltip content-class="bg-white text-primary">Cancelar</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <span class="text-h6">
          Confirmación -
          <q-chip dense color="accent-light" text-color="white">
            Req #{{ requerimientoIdToChange }}
          </q-chip>
        </span>
      </q-card-section>
      <q-card-section>
        <p v-if="operationApprove">
          Esta a punto de cambiar estado del requerimiento a
          <strong>EJECUCIÓN.</strong>
        </p>
        <p v-else-if="operationReject">
          Esta a punto de volver el estado del requerimiento a
          <strong>PENDIENTE.</strong>
        </p>
        ¿Desea confimar este cambio?
      </q-card-section>
      <q-card-section v-if="operationReject">
        <q-input
          v-model="comment"
          color="white"
          dark
          outlined
          type="textarea"
          label="Si desea, puede agregar un comentario: "
          :hide-bottom-space="true"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="CANCELAR"
          outline
          color="white"
          @click="cancelOperation"
        />
        <q-btn label="CONFIRMAR" color="purple-10" @click="confirmOperation" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { warn, success } from "@utils/helpers"

export default {
  name: "DialogConfirmOperation",
  data() {
    return {
      comment: "",
    }
  },
  computed: {
    ...mapState("requerimientosAsignados", {
      dialogConfirmOpenState: state => state.dialogConfirmOpen,
      requerimientoIdToChange: state => state.possibleChanges.payload.id,
    }),

    ...mapGetters("requerimientosAsignados", [
      "requerimientoIdToChange",
      "operationApprove",
      "operationReject",
    ]),

    dialogConfirmOpen: {
      get() {
        return this.dialogConfirmOpenState
      },
      set(value) {
        this.$store.dispatch(
          "requerimientosAsignados/setDialogConfirmOperationOpen",
          value,
        )
      },
    },
  },
  methods: {
    cancelOperation() {
      this.$store.dispatch("requerimientosAsignados/clearOperations")
      this.dialogConfirmOpen = false
    },
    confirmOperation() {
      const comment = this.operationReject ? null : this.comment

      this.$store
        .dispatch("requerimientosAsignados/confirmOperation", comment)
        .then(() => {
          this.dialogConfirmOpen = false
          this.comment = ""
        })
        .then(() => {
          //
          let message = `Requerimiento #${
            this.requerimientoIdToChange
          } en EJECUCIÓN.`

          if (this.operationReject) {
            message = `Requerimiento #${
              this.requerimientoIdToChange
            } volvió a PENDIENTE.`
          }

          success({ message })
        })
        .catch(e => {
          warn({ message: e.message })
        })
    },
  },
}
</script>

<style lang="scss" scoped></style>
