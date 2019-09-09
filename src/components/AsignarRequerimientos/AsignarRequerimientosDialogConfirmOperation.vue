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
          <tooltip content-class="bg-white text-primary">Cancelar</tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <span class="text-h6">
          Confirmación -
          <q-chip dense color="accent-light" text-color="white">Req #{{ reqId }}</q-chip>
        </span>
      </q-card-section>
      <q-card-section>
        <asignar-requerimientos-actions
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
        <q-btn label="CONFIRMAR" color="deep-purple-10" @click="confirmOperation" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import AsignarRequerimientosActions from "comp/AsignarRequerimientos/AsignarRequerimientosActions"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "AsignarRequerimientosDialogConfirmOperation",
  components: {
    AsignarRequerimientosActions,
    Tooltip,
  },
  computed: {
    ...mapState("asignacionRequerimientos", {
      dialogConfirmOpenState: state => state.dialogConfirmOpen,
    }),
    ...mapGetters("asignacionRequerimientos", ["operationType"]),
    // ...mapGetters("requerimientos", ["detalleRequerimientoId"]),
    ...mapState("requerimientos", {
      req: state => state.detalleRequerimientoItem,
    }),
    reqId() {
      return this.req && this.req.id ? this.req.id : ""
    },
    dialogConfirmOpen: {
      get() {
        return this.dialogConfirmOpenState
      },
      set(value) {
        this.$store.dispatch("asignacionRequerimientos/setDialogConfirmOperationOpen", value)
      },
    },
  },
  methods: {
    cancelOperation() {
      this.dialogConfirmOpen = false
    },
    confirmOperation() {
      // se llama al save del children (del componente AsignarRequerimientosActions)
      this.$refs.actions
        .saveChanges()
        .then(() => {
          this.dialogConfirmOpen = false
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped></style>
