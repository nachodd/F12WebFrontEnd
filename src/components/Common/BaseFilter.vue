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
      >
        <div
          class="q-pa-md row justify-center"
          :style="{
            width: widthInputDescripcion + 'px',
            'padding-top': '0',
          }"
        >
          <div class="col-md-8 col-sm-8 col-xs-12">
            <slot name="filterBody" />

            <div class="row q-mt-md justify-end">
              <slot name="filterButtons" />
            </div>
          </div>
        </div>
      </q-menu>
    </div>
    <div class="q-mt-sm">
      <span v-if="someFilterIsSetted">Filtros:</span>
      <slot name="filterFooter" />
    </div>
  </div>
</template>
<script>
export default {
  name: "BaseFilter",
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
    }
  },
  computed: {
    iconOpenFilter() {
      return this.popupOpened ? "arrow_drop_up" : "arrow_drop_down"
    },
  },
  methods: {
    onResize(size) {
      this.widthInputDescripcion = size.width
    },
  },
}
</script>
