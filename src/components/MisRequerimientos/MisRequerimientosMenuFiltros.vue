<template>
  <div class="q-pa-md">
    <q-input ref="inputDescripcion" v-model="input" filled>
      <template v-slot:append>
        <q-icon name="arrow_drop_down" class="cursor-pointer">
          <q-popup-proxy :offset="[14, 14]">
            <!-- <q-banner class="bg-purple text-white">
              <template v-slot:avatar>
                <q-icon name="signal_wifi_off" />
              </template>
              You have lost connection to the internet. This app is offline.
            </q-banner>-->
            <div
              class="row no-wrap q-pa-md"
              :style="{ width: widthInputDescripcion + 'px' }"
            >
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <!-- <q-toggle v-model="mobileData" label="Use Mobile Data" />
                <q-toggle v-model="bluetooth" label="Bluetooth" />-->
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                <q-btn
                  v-close-popup
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                />
              </div>
            </div>
          </q-popup-proxy>
        </q-icon>
      </template>
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
  computed: {
    // widthInputDescripcion() {
    //   console.log("refs", this.$refs)
    //   // console.log("elemento", this.$refs.inputDescripcion.$el.clientWidth)
    //   const val = _.get(this.$refs, "inputDescripcion.$el.clientWidth", 985)
    //   console.log(val)
    //   return val
    //   // return 985
    // },
  },
  async mounted() {
    await this.$nextTick()
    // console.log("mounted", this.$refs.inputDescripcion.$el.clientWidth)
    this.widthInputDescripcion = this.$refs.inputDescripcion.$el.clientWidth

    this.$watch(
      () => {
        console.log("a1")
        return this.$refs.inputDescripcion.$el.clientWidth
      },
      val => {
        console.log("b1")
        this.widthInputDescripcion = val
      },
    )
  },
  methods: {
    setWidth(a) {
      console.log(a)
    },
  },
}
</script>
