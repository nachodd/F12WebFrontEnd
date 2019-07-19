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
            Req #{{ detalleRequerimientoId }}
          </q-chip>
        </span>
      </q-card-section>
      <q-card-section>
        <requerimientos-asignados-actions
          ref="actions"
          :dark="true"
          hide-save-button
          hide-order-asignacion
          color="white"
          :operation-type="operationType"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="CANCELAR" flat color="red-7" @click="cancelOperation" />
        <q-btn
          label="CONFIRMAR"
          color="deep-purple-10"
          @click="confirmOperation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import RequerimientosAsignadosActions from "@comp/RequerimientosAsignados/RequerimientosAsignadosActions"

export default {
  name: "RequerimientosAsignadosDialogConfirmOperation",
  components: {
    RequerimientosAsignadosActions,
  },
  // data() {
  //   return {
  //     comment: "",
  //   }
  // },
  computed: {
    ...mapState("requerimientosAsignados", {
      dialogConfirmOpenState: state => state.dialogConfirmOpen,
    }),
    ...mapGetters("requerimientosAsignados", ["operationType"]),
    ...mapGetters("requerimientos", ["detalleRequerimientoId"]),

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
      // se llama al save del children (del componente RequerimientosAsignadosActions)
      this.$refs.actions.saveChanges()
      /* const comment = this.operationReject ? this.comment : null

      this.$store
        .dispatch("requerimientosAsignados/confirmOperation", comment)
        .then(() => {
          this.dialogConfirmOpen = false
          this.comment = ""
        })
        .then(() => {
          //
          let message = `Requerimiento #${
            this.detalleRequerimientoId
          } en EJECUCIÓN.`

          if (this.operationReject) {
            message = `Requerimiento #${
              this.detalleRequerimientoId
            } volvió a PENDIENTE.`
          }

          success({ message })
        })
        .catch(e => {
          warn({ message: e.message })
        }) */
    },
  },
}
</script>

<style lang="scss" scoped></style>
