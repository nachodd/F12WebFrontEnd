<template>
  <q-dialog
    v-model="dialogConfirmShowed"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-accent text-white">
      <q-bar>
        <q-btn dense flat icon="fas fa-exclamation-triangle" />
        <q-space />
        <q-btn dense flat icon="close" @click="cancelOperation">
          <q-tooltip content-class="bg-white text-primary">
            Cancelar
          </q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <span class="text-h6">
          Confirmación -
          <q-chip dense color="accent-light" text-color="white">
            Req #{{ requerimientoIdToChanged }}
          </q-chip>
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
export default {
  name: "DialogConfirmOperation",
  props: {
    operationApprove: {
      type: Boolean,
      required: true,
    },
    operationReject: {
      type: Boolean,
      required: true,
    },
    dialogConfirmOpen: {
      type: Boolean,
      default: false,
    },
    requerimientoIdToChanged: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      dialogConfirmShowed: this.dialogConfirmOpen,
      approveComment: "",
    }
  },
  watch: {
    dialogConfirmOpen(newVal) {
      this.dialogConfirmShowed = newVal
    },
  },
  methods: {
    cancelOperation() {
      this.$emit("dialog-confirm-operation-cancel", null)
    },
    confirmOperation() {
      this.$emit("dialog-confirm-operation-confirm", this.approveComment)
      this.approveComment = ""
    },
  },
}
</script>

<style lang="scss" scoped></style>
