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
        @keyup.enter="$emit('filtrar')"
        @input="$emit('update:descripcion', $event)"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="iconOpenFilter"
            class="filter__icon cursor-pointer"
            @click="popupOpened = !popupOpened"
          ></q-icon>
        </template>
      </q-input>
      <q-menu
        v-model="popupOpened"
        :offset="[0, -4]"
        content-class="q-menu-fix"
        no-parent-event
        :content-style="{ height: bodyHeight + 'px' }"
      >
        <q-layout
          container
          :style="{
            width: widthInputDescripcion + 'px',
            height: bodyHeight + 'px',
          }"
          view="hHh lpR fFf"
        >
          <q-page-container>
            <q-scroll-area
              ref="menuBody"
              :thumb-style="{
                right: '2px',
                borderRadius: '5px',
                background: 'linear-gradient(to top, #5e35b1, #1565c0)',
                width: '5px',
                opacity: 0.75,
              }"
              :class="['body-menu']"
              :style="{
                width: widthInputDescripcion + 'px',
                height: bodyHeight + 'px',
                'background-color': 'yellow',
              }"
            >
              <div
                class="q-pa-md row justify-center"
                :style="{
                  width: widthInputDescripcion + 'px',
                  'padding-top': '0',
                }"
              >
                <div class="col-md-8 col-sm-8 col-xs-12">
                  <slot name="body" />
                </div>
              </div>
            </q-scroll-area>
          </q-page-container>

          <q-footer elevated class="bg-white q-py-sm">
            <div class="row">
              <div class="col-md-8 col-sm-8 col-xs-12">
                <div class="row justify-end">
                  <slot name="buttons" />
                </div>
              </div>
            </div>
          </q-footer>
        </q-layout>
      </q-menu>
    </div>
    <div v-if="hasQuickFilterSlot" class="row items-center filters-row">
      <div class="col-xs-12 col-md-8 col-sm-7">
        <span v-if="someFilterIsSetted">Filtros:</span>
        <slot name="footer" />
      </div>
      <div class="col-xs-12 col-md-4 col-sm-5 text-right">
        <tooltip>
          Click aquí para aplicar este filtro
        </tooltip>
        <slot name="quickFilter" />
      </div>
    </div>
    <div v-else class="q-mt-sm">
      <span v-if="someFilterIsSetted">Filtros:</span>
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
  },
  data() {
    return {
      widthInputDescripcion: 0,
      popupOpened: false,
      bodyHeight: 120,
      bodyMenuClass: "",
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
  mounted() {
    const bodyElemnts = this.$slots.body.length || 2
    this.bodyHeight = bodyElemnts * 80
    console.log("this.bodyHeight", this.bodyHeight)

    if (bodyElemnts > 6) {
      this.bodyMenuClass = "body-menu-x-el"
    } else {
      this.bodyMenuClass = `body-menu-${bodyElemnts - 1}-el`
    }
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
    // show() {
    //   const bodyElemnts = this.$slots.body.length || 2
    //   this.bodyHeight = bodyElemnts * 60
    //   this.$refs.menuBody.$el.style["min-height"] = this.bodyHeight + "px"
    //   this.$refs.menuBody.$el.style["height"] = this.bodyHeight + "px"
    //   console.log("sh", this.$refs.menuBody)
    //   debugger
    // },
  },
}
</script>
<style lang="stylus" scoped>
.body-menu
  width 150px
  min-height: 120px;
  height: 120px;
//   // height: calc(100vh - 121px - 100px);
.body-menu-1-el
  height: 120px;
.body-menu-2-el
  height: 120px;
.body-menu-3-el
  height: 180px;
.body-menu-4-el
  height: 240px;
.body-menu-5-el
  height: 300px;
.body-menu-6-el
  height: 360px;
.body-menu-x-el
  height: 360px;

/deep/.q-scrollarea__thumb--invisible
  opacity: 0.25 !important;
</style>
