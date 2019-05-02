<template>
  <q-uploader
    url="http://localhost:4444/upload"
    label="Adjunte Imagenes, documentos, etc"
    color="accent"
    multiple
    style="width: auto"
  >
    <template v-slot:header="scope">
      <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
        <q-btn
          v-if="scope.queuedFiles.length > 0"
          icon="clear_all"
          @click="scope.removeQueuedFiles"
          round
          dense
          flat
        >
          <q-tooltip>Eliminar todos</q-tooltip>
        </q-btn>
        <q-btn
          v-if="scope.uploadedFiles.length > 0"
          icon="done_all"
          @click="scope.removeUploadedFiles"
          round
          dense
          flat
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
        <q-btn
          v-if="scope.editable"
          icon="add_box"
          @click="scope.pickFiles"
          round
          dense
          flat
        >
          <q-tooltip>Seleccionar Archivos...</q-tooltip>
        </q-btn>
      </div>
    </template>
    <template v-slot:list="scope">
      <div v-show="scope.files.length === 0" class="row text-center">
        <span class="col text-body1" style="margin-top: 10px;">
          Seleccione o arrastre Imagenes, Documentos, etc...
        </span>
      </div>
      <div
        v-show="scope.files.length > 0"
        class="row justify-around q-gutter-sm"
      >
        <q-card
          v-for="file in scope.files"
          class="col-xs-4 col-sm-3 col-md-3"
          :key="file.name"
        >
          <q-card-section class="row justify-between">
            <div>
              <div class="text-body1">{{ file.name }}</div>
              <div class="text-caption">
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </div>
            </div>
            <div>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- <q-list separator>
            <q-item v-for="file in scope.files" :key="file.name">
              <q-item-section>
                <q-item-label class="full-width ellipsis">
                  {{ file.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ file.__sizeLabel }} / {{ file.__progressLabel }}
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
			</q-list>-->
    </template>
  </q-uploader>
</template>
<script>
export default {
  props: [],
}
</script>
