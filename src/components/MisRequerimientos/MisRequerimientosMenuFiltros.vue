<template>
  <div class="q-pa-md">
    <q-input ref="inputDescripcion" v-model="input" filled>
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer">
          <q-popup-proxy :offset="[14, 14]">
            <div
              class="row no-wrap q-pa-md"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <div class="column items-center">
                <!-- <div class>John Doe</div>

                  <q-btn
                    v-close-popup
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                />-->
              </div>
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
      <q-resize-observer @resize="onResize" />
    </q-input>
  </div>
</template>
<script>
export default {
  name: "MisRequerimientosMenuFiltros",
  data() {
    return {
      input: "",
      widthInputDescripcion: 0,
    }
  },
  methods: {
    onResize(size) {
      console.log("resize!", size)

      this.widthInputDescripcion = size.width + 60
      // {
      //   width: 20 // width of container (in px)
      //   height: 50 // height of container (in px)
      // }
    },
  },
}
</script>
