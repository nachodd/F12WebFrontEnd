<template>
  <q-uploader
    ref="uploader"
    label="Adjunte Imagenes, documentos, etc"
    color="accent"
    multiple
    style="width: auto"
    class="q-uploader--custom"
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
          <tooltip>Eliminar todos</tooltip>
        </q-btn>
        <q-btn
          v-if="scope.uploadedFiles.length > 0"
          icon="done_all"
          round
          dense
          flat
          @click="scope.removeUploadedFiles"
        >
          <tooltip>
            Eliminr Archivos Subidos
          </tooltip>
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
          <tooltip>
            Seleccionar Archivos...
          </tooltip>
        </q-btn>
      </div>
    </template>
    <template v-slot:list="scope">
      <div class="column">
        <!-- Empty slot -->
        <div class="col order-first">
          <div
            v-show="scope.files.length === 0"
            class="row text-center cursor-pointer q-mt-md"
            @click="scope.pickFiles()"
          >
            <!-- @click="scope.pickFiles()" -->
            <span class="col text-body1">
              Seleccione o arrastre Imagenes, Documentos, etc...
            </span>
          </div>
        </div>
        <!-- New Files slot -->
        <div class="col order-first">
          <div
            v-show="scope.files.length > 0"
            class="row justify-around q-col-gutter-sm q-mt-sm q-mb-md"
          >
            <div v-for="file in scope.files" :key="file.name" class="col-4">
              <q-item class="shadow-2 bg-grey-3 no-padding adjunto-card">
                <q-item-section v-if="file.__img" side class="no-pad">
                  <img class="item--thumb" :src="file.__img.src" />
                </q-item-section>
                <q-item-section v-else side class="q-px-xs">
                  <q-icon class="item--thumb-xs" name="fas fa-paperclip" />
                </q-item-section>

                <q-item-section class="q-pa-sm">
                  <q-item-label class="ellipsis">
                    {{ file.name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section top side class="q-px-xs">
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
              <tooltip>{{ file.name }}</tooltip>
            </div>
          </div>
        </div>

        <!-- Files Uploaded slot -->
        <div
          v-show="__filesUploaded.length > 0"
          class="col order-first shadow-2 bg-grey-2 q-pa-sm q-mt-md"
        >
          <div class="text-bold text-center q-pb-sm">
            Archivos cargados previamente:
          </div>
          <div class="row justify-around q-col-gutter-sm">
            <div v-for="(adjunto, i) in __filesUploaded" :key="`req_${i}_${adjunto}`" class="col-4">
              <adjunto-card
                :adjunto="adjunto"
                :nro="i + 1"
                :show-remove="true"
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
import AdjuntoCard from "comp/Common/AdjuntoCard"
import Tooltip from "comp/Common/Tooltip"

export default {
  components: { AdjuntoCard, Tooltip },
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
  computed: {
    __filesUploaded: {
      get() {
        return this.filesUploaded
      },
      set(val) {
        this.$emit("update:filesUploaded", val)
      },
    },
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
      // Quito el adjunto del array e informo arriba del update
      const res = _.filter(this.filesUploaded, file => file !== adjunto)
      this.$emit("update:filesUploaded", res)
    },
  },
}
</script>
<style lang="stylus" scoped>
.q-uploader--custom
  box-shadow none !important

// Deep selector https://bambielli.com/til/2018-08-19-how-to-target-child-components-with-scoped-css-in-vue/
/deep/.q-uploader__list
  padding 0
  border 1px solid rgba(0,0,0,0.24)
</style>
