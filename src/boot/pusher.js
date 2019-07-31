import VuePusher from "vue-pusher"

export default ({ Vue }) => {
  Vue.use(VuePusher, {
    api_key: "",
  })
}
