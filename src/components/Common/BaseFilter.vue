<template>
  <div class="q-pb-md">
    <q-resize-observer @resize="onResize" />
    <div class="q-mb-sm">
      <q-input
        ref="inputDescripcion"
        class="filter"
        :class="{ popupOpened: popupOpened }"
        dense
        standout="bg-white text-black"
        :placeholder="searchPlaceholder"
        :value="descripcion"
        @keyup.enter="processEnter"
        @input="$emit('update:descripcion', $event)"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon v-if="enteredValue" name="cancel" class="cursor-pointer" @click.stop="clearValue">
            <tooltip>Borrar filtro</tooltip>
          </q-icon>
          <q-icon
            :name="iconOpenFilter"
            class="filter__icon cursor-pointer"
            @click="popupOpened = !popupOpened"
          >
            <tooltip v-if="!popupOpened"><span class="text-no-wrap">Más filtros...</span></tooltip>
          </q-icon>
        </template>
      </q-input>
      <q-menu v-model="popupOpened" :offset="[0, -4]" content-class="q-menu-fix" no-parent-event>
        <div
          class="q-pa-md row justify-center"
          :style="{
            width: widthInputDescripcion + 'px',
            'padding-top': '0',
          }"
        >
          <div class="col-md-8 col-sm-8 col-xs-12">
            <q-scroll-area
              ref="menuBody"
              :thumb-style="{
                right: '-10px',
                borderRadius: '5px',
                background: 'linear-gradient(to top, #5e35b1, #1565c0)',
                width: '5px',
                opacity: 0.75,
              }"
              :class="['body-menu']"
              :style="{
                height: bodyHeight + 'px !important',
              }"
            >
              <slot name="body" />
            </q-scroll-area>

            <div class="row q-mt-md justify-end">
              <slot name="buttons" />
            </div>
          </div>
        </div>
      </q-menu>
    </div>

    <div v-if="hasQuickFilterSlot" class="row items-center filters-row">
      <!-- <div class="col-xs-12 col-md-8 col-sm-7"> -->
      <!-- <div class="col-xs-12 col-md-12 col-sm-12">
        <span v-if="someFilterIsSetted">Filtros:</span>
        <slot name="footer" />
      </div>-->
      <slot name="footer" />
      <div class="col-xs-12 col-md-4 col-sm-5 text-right">
        <tooltip>Click aquí para aplicar este filtro</tooltip>
        <slot name="quickFilter" />
      </div>
    </div>
    <div v-else class="q-mt-sm">
      <!-- <span v-if="someFilterIsSetted">Filtros:</span> -->
      <slot name="footer" />
    </div>
  </div>
</template>
<script>
import Tooltip from "comp/Common/Tooltip"
export default {
  name: "BaseFilter",
  components: { Tooltip },
  props: {
    searchPlaceholder: {
      type: String,
      default: "Buscar...",
    },
    descripcion: {
      type: String,
      default: "",
    },
    someFilterIsSetted: {
      type: Boolean,
      default: false,
    },
    baseHeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      widthInputDescripcion: 0,
      popupOpened: false,
      bodyHeight: 80,
      enteredValue: false,
    }
  },
  computed: {
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
    hasQuickFilterSlot() {
      return !!this.$slots.quickFilter
    },
  },
  watch: {
    popupOpened(opened) {
      if (opened) {
        document.getElementsByTagName("body")[0].classList.add("overflow-hidden")
      } else {
        document.getElementsByTagName("body")[0].classList.remove("overflow-hidden")
      }
    },
  },
  mounted() {
    const bodyElements = this.$slots.body.length || 2
    this.bodyHeight = this.baseHeight || bodyElements * 40
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
    closePopUp() {
      this.popupOpened = false
    },
    setPopUpOpened(value) {
      this.popupOpened = value
    },
    clearValue() {
      this.$emit("update:descripcion", "")
      this.$emit("filtrar")
      this.enteredValue = false
    },
    processEnter() {
      this.$emit("filtrar")
      this.enteredValue = true
    },
  },
}
</script>
<style lang="stylus">
.body-menu {
  min-height: 120px;
  height: 120px;
}
</style>
