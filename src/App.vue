<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
// import { mapGetters, mapState } from "vuex"
// import pusher from "utils/pusher"

export default {
  name: "App",
  // provide() {
  //   return {
  //     getPusherChannel: this.getPusherChannel,
  //   }
  // },
  // data() {
  //   return {
  //     pusherChannel: null,
  //     test: 0,
  //   }
  // },
  // computed: {
  //   ...mapGetters("auth", ["check"]),
  //   ...mapState("auth", {
  //     pusherChannelName: state => state.pusherChannelName,
  //   }),
  // },
  // watch: {
  //   check: {
  //     immediate: true,
  //     handler(loggedIn) {
  //       if (loggedIn) {
  //         this.pusherChannel = pusher.subscribe(this.pusherChannelName)
  //       } else {
  //         if (this.pusherChannel !== null) {
  //           this.pusherChannel.unsubscribe(this.pusherChannelName)
  //           this.pusherChannel = null
  //           this.$store.dispatch("auth/setPusherChannelName", "")
  //         }
  //       }
  //     },
  //   },
  // },
  // methods: {
  //   getPusherChannel() {
  //     return this.pusherChannel
  //   },
  // },
}
</script>

<style></style>
