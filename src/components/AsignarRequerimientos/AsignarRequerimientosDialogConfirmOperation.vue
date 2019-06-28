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
            Req #{{ requerimientoId }}
          </q-chip>
        </span>
      </q-card-section>
      <q-card-section>
        <!-- FIXME ver de que manera le podemos pasar a este comp la accion, de manra de que no rompa. Tal vez la podría leer del store directamente ? -->
        <asignar-requerimientos-actions
          ref="actions"
          :dark="true"
          hide-save-button
          color="white"
          :show-order-asignacion="false"
          :operation-type="operationType"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="CANCELAR" color="negative" @click="cancelOperation" />
        <q-btn
          label="CONFIRMAR"
          outline
          color="white"
          @click="confirmOperation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import AsignarRequerimientosActions from "@comp/AsignarRequerimientos/AsignarRequerimientosActions"
export default {
  name: "AsignarRequerimientosDialogConfirmOperation",
  components: {
    AsignarRequerimientosActions,
  },
  // data() {
  //   return {
  //     approveComment: "",
  //   }
  // },
  computed: {
    ...mapState("asignacionRequerimientos", {
      dialogConfirmOpenState: state => state.dialogConfirmOpen,
    }),
    ...mapGetters("asignacionRequerimientos", ["operationType"]),
    // ...mapGetters("priorizarRequerimientos", [
    //   "requerimientoIdToChange",
    // ]),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    requerimientoId() {
      return _.get(this, "req.id", "")
    },
    dialogConfirmOpen: {
      get() {
        return this.dialogConfirmOpenState
      },
      set(value) {
        this.$store.dispatch(
          "asignacionRequerimientos/setDialogConfirmOperationOpen",
          value,
        )
      },
    },
  },
  methods: {
    cancelOperation() {
      this.dialogConfirmOpen = false
    },
    confirmOperation() {
      // se llama al save del children (del componente AsignarRequerimientosActions)
      this.$refs.actions.saveChanges()
    },
  },
}
</script>

<style lang="scss" scoped></style>
