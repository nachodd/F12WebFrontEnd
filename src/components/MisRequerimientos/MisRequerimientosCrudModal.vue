<template>
  <q-dialog
    :value="true"
    full-height
    transition-show="scale"
    transition-hide="scale"
  >
    <q-layout container view="hHh lpR fFf" class="bg-white">
      <q-header elevated class="bg-deep-purple-10 text-white items-center">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title>
            <div class="text-h6">Crear Requerimiento</div>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-scroll-area
          :thumb-style="{
            right: '2px',
            borderRadius: '5px',
            backgroundColor: '#027be3',
            width: '5px',
            opacity: 0.75,
          }"
          class="modal-body"
        >
          TEST TEST TEST
        </q-scroll-area>
      </q-page-container>

      <q-footer elevated class="bg-white">
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cerrar"
            color="deep-purple-10"
            @click="$router.replace({ name: 'mis-requerimientos' })"
          />
        </q-card-actions>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
// import { warn, success } from "@utils/helpers

export default {
  name: "MisRequerimientosCrudModal",
  components: {},
  data() {
    return {
      // crudModalOpen: true,
    }
  },
  computed: {},
  created() {},
  methods: {},
}
</script>

<style lang="scss" scope>
.modal-body {
  min-height: 100px;
  height: calc(100vh - 121px - 100px);
}
</style>
