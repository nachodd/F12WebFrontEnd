<template>
  <q-uploader
    ref="uploader"
    label="Adjunte Imagenes, documentos, etc"
    color="accent"
    multiple
    style="width: auto"
    @added="handleAdded"
    @removed="handleRemoved"
  >
    <template v-slot:header="scope">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn
          v-if="scope.queuedFiles.length > 0"
          icon="clear_all"
          round
          dense
          flat
          @click="scope.removeQueuedFiles"
        >
          <q-tooltip>Eliminar todos</q-tooltip>
        </q-btn>
        <q-btn
          v-if="scope.uploadedFiles.length > 0"
          icon="done_all"
          round
          dense
          flat
          @click="scope.removeUploadedFiles"
        >
          <q-tooltip>Eliminr Archivos Subidos</q-tooltip>
        </q-btn>
        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
        <div class="col">
          <div class="q-uploader__title">Adjunte Imagenes, documentos, etc</div>
          <!-- <div class="q-uploader__subtitle">
            {{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}
					</div>-->
        </div>
        <q-btn v-if="scope.editable" icon="add_box" round dense flat>
          <q-uploader-add-trigger ref="addButton" />
          <q-tooltip>Seleccionar Archivos...</q-tooltip>
        </q-btn>
      </div>
    </template>
    <template v-slot:list="scope">
      <div
        v-show="scope.files.length === 0"
        class="row text-center cursor-pointer"
        @click="handleClickAddText"
      >
        <!-- @click="scope.pickFiles()" -->
        <span class="col text-body1" style="margin-top: 10px;">
          Seleccione o arrastre Imagenes, Documentos, etc...
        </span>
      </div>

      <div
        v-show="scope.files.length > 0"
        class="row justify-around q-col-gutter-sm"
      >
        <div v-for="file in scope.files" :key="file.name" class="col-4">
          <q-item class="shadow-2">
            <q-item-section>
              <q-item-label lines="2" class="">
                {{ file.name }}
              </q-item-label>
            </q-item-section>

            <q-item-section v-if="file.__img" thumbnail class="gt-xs">
              <img :src="file.__img.src" />
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </template>
  </q-uploader>
</template>
<script>
export default {
  props: [],
  mounted() {
    this.$root.$on("clearFiles", this.clearFiles)
  },
  methods: {
    handleAdded(files) {
      this.$emit("filesAdded", files)
    },
    handleRemoved(files) {
      this.$emit("filesRemoved", files)
    },
    clearFiles() {
      this.$refs.uploader.reset()
    },
    handleClickAddText() {
      // SUPER HACK: El scope.pickFile no funciona, entonces busco el boton de add
      this.$refs.addButton.$el.click()
    },
  },
}
</script>
