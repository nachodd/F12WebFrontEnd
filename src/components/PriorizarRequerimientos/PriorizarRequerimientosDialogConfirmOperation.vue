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
        <p v-if="operationApprove">
          Esta a punto de cambiar estado del requerimiento a
          <strong>APROBADO.</strong>
        </p>
        <p v-else-if="operationReject">
          Esta a punto de volver el estado del requerimiento a
          <strong>PENDIENTE DE APROBACIÓN.</strong>
        </p>
        ¿Desea confimar este cambio?
      </q-card-section>
      <q-card-section v-if="operationApprove">
        <q-input
          v-model="approveComment"
          color="white"
          dark
          outlined
          type="textarea"
          label="Si desea, puede agregar un comentario: "
          :hide-bottom-space="true"
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
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "DialogConfirmOperation",
  components: {
    Tooltip,
  },
  data() {
    return {
      approveComment: "",
    }
  },
  computed: {
    ...mapState("priorizarRequerimientos", {
      dialogConfirmOpenState: state => state.dialogConfirmOpen,
    }),
    ...mapGetters("priorizarRequerimientos", ["operationApprove", "operationReject"]),
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
        this.$store.dispatch("priorizarRequerimientos/setDialogConfirmOperationOpen", value)
      },
    },
  },
  methods: {
    cancelOperation() {
      this.$store.dispatch("priorizarRequerimientos/clearOperations")
      this.dialogConfirmOpen = false
    },
    confirmOperation() {
      const comment = this.operationReject ? null : this.approveComment

      this.$store
        .dispatch("priorizarRequerimientos/confirmOperation", comment)
        .then(() => {
          this.dialogConfirmOpen = false
          this.approveComment = ""
        })
        .catch(() => {})

      // this.$emit("dialog-confirm-operation-confirm", comment)
    },
  },
}
</script>

<style lang="scss" scoped></style>
