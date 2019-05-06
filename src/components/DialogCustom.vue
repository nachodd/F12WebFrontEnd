<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin q-py-sm">
      <q-card-section :class="titleBackgroundClass">
        <div class="text-h6" :class="titleClass">{{ title }}</div>
      </q-card-section>
      <q-card-section v-html="message" class="q-mt-md" />
      <q-card-actions align="right">
        <q-btn color="red" label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "DialogCustom",
  props: {
    title: {
      type: String,
      default: "Aviso",
    },
    message: {
      type: String,
      required: true,
    },
    titleBackgroundClass: {
      type: String,
      default: "bg-red-6",
    },
    titleClass: {
      type: String,
      default: "text-white",
    },
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit("hide")
    },

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit("ok")
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>
