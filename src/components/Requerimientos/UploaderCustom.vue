<template>
  <q-uploader
    ref="uploader"
    label="Adjunte Imagenes, documentos, etc"
    color="accent"
    multiple
    style="width: auto"
    class="q-uploader--list-no-pading"
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
      <div class="column">
        <!-- Empty slot -->
        <div class="col order-first">
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
        </div>
        <!-- New Files slot -->
        <div class="col order-first">
          <div
            v-show="scope.files.length > 0"
            class="row justify-around q-col-gutter-sm"
          >
            <div v-for="file in scope.files" :key="file.name" class="col-4">
              <q-item class="shadow-2 bg-grey-3 no-padding">
                <q-item-section v-if="file.__img" side class="no-pad">
                  <img class="item--thumb" :src="file.__img.src" />
                </q-item-section>
                <q-item-section v-else side class="no-pad">
                  <q-icon class="item--thumb-xs" name="fas fa-paperclip" />
                </q-item-section>

                <q-item-section class="q-pa-sm">
                  <q-item-label lines="2" class="">
                    {{ file.name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <q-btn
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
        </div>

        <!-- Files Uploaded slot -->
        <div
          v-show="filesUploaded.length > 0"
          class="col order-first shadow-2 bg-grey-2 q-pa-sm q-mt-md"
        >
          <div class="text-bold text-center q-pb-sm">
            Archivos cargados previamente:
          </div>
          <div class="row justify-around q-col-gutter-sm">
            <div
              v-for="(adjunto, i) in filesUploaded"
              :key="`req_${i}_${adjunto}`"
              class="col-3"
            >
              <adjunto-card
                :adjunto="adjunto"
                :nro="i + 1"
                @removeAttach="removeUploadedFile"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </q-uploader>
</template>
<script>
import AdjuntoCard from "@comp/Common/AdjuntoCard"

export default {
  components: { AdjuntoCard },
  props: {
    filesUploaded: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filesTouched: false,
    }
  },
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
      // Hack, a veces el uploader no lo encuntraa
      this.$nextTick(() => {
        this.$refs.uploader.reset()
      })
    },
    handleClickAddText() {
      // SUPER HACK: El scope.pickFile no funciona, entonces busco el boton de add
      this.$refs.addButton.$el.click()
    },
    removeUploadedFile(adjunto) {
      // FIXME: implementar esto:
      console.log(adjunto)
    },
  },
}
</script>
<style lang="scss">
.q-uploader--list-no-pading .q-uploader__list {
  padding: 0;
}
</style>
