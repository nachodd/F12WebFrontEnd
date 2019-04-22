<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
    <q-btn color="primary" icon="check" label="Logout" @click="onLogOut" />
  </q-page>
</template>

<style></style>

<script>
import { mapActions } from "vuex"

export default {
  name: "PageIndex",
  methods: {
    ...mapActions({
      logout: "auth/logout",
    }),
    async onLogOut() {
      debugger
      await this.logout()
      this.$router.replace({ name: "login" })
    },
  },
}
</script>
