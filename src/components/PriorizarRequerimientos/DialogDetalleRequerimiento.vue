<template>
  <q-dialog
    v-model="__opened"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="requerimiento-detail-card">
      <q-card-section class="bg-deep-purple-10 text-white">
        <div class="title-id row">
          <div class="col">#{{ req.id }}</div>
          <div class="col text-right offset-top">
            <chip-large
              avatar-text-color="black"
              :avatar-color="getColorPrioridad(req.prioridad)"
              :avatar-text="req.prioridad"
              text="Prioridad"
            />
          </div>
        </div>
        <div class="title-title">{{ req.asunto }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-mt-sm">
          <div class="col">
            <chip-large avatar-text="Area" :text="req.area.descripcion" />
            <chip-large
              avatar-text="Stistema"
              :text="req.sistema.descripcion"
            />
            <chip-large
              avatar-text="Req. Tipo"
              :text="req.requerimientoTipo.descripcion"
            />
          </div>
          <div class="col">
            Adjuntos:
          </div>
        </div>
        <div class="row q-mt-sm">
          <div class="col">
            <q-input
              outlined
              :value="req.descripcion"
              label="Descripcion"
              disable
              type="textarea"
            />
          </div>
        </div>
        <div class="row q-mt-md text-center">
          <div class="col">
            <q-btn outline rounded color="accent" label="Aprobar" />
          </div>
          <div class="col">
            <q-btn outline rounded color="accent" label="Descartar" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-accent">
        <q-btn v-close-popup flat label="cerrar" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import priorityColor from "@mixins/priorityColor"
import ChipLarge from "@comp/Common/ChipLarge"
export default {
  name: "DialogDetalleRequerimiento",
  components: { ChipLarge },
  mixins: [priorityColor],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      req: {
        id: 145,
        asunto: "Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh",
        descripcion:
          "Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh Prueba dish aoisdhia osdh oisahd iashd oiash aoisdh",
        area: { id: 1, descripcion: "Area sistemas" },
        sistema: { id: 1, descripcion: "Visual bolsa" },
        requerimientoTipo: { id: 1, descripcion: "Tipo de requerimiento 1" },
        fechaLimite: "29/04/2019",
        motivoLimite: "bla bla bla",
        importante: "NO",
        prioridad: "3",
        adjuntos: [],
      },
    }
  },
  computed: {
    __opened: {
      get() {
        return this.value
      },
      set(__opened) {
        this.$emit("input", __opened)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.requerimiento-detail-card {
  min-width: 400px;
}
.title-id {
  font-size: 0.8rem;
  font-weight: 500;
  height: 20px;
}
.offset-top {
  position: relative;
  top: -8px;
}
.title-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.chip-large {
  width: auto;
  border-radius: 16px;
  padding: 0 10px;
}
</style>
