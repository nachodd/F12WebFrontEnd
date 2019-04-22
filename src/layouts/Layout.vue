<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="headerBackground">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title>
          F12
        </q-toolbar-title>

        <q-btn-dropdown stretch flat :label="user.Usuario">
          <q-list>
            <q-item-label header>Usuario</q-item-label>
            <q-item clickable v-close-popup tabindex="0">
              <!-- <q-item-section avatar>
                <q-avatar
                  icon="fas fa-user-circle"
                  color="accent"
                  text-color="white"
                />
              </q-item-section> -->
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="fas fa-user-circle" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item clickable v-close-popup tabindex="1" @click="onLogOut">
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="fas fa-sign-out-alt" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="sidebarOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Essential Links</q-item-label>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="http://v1.quasar-framework.org"
        >
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>v1.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://github.com/quasarframework/"
        >
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="http://chat.quasar-framework.org"
        >
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://forum.quasar-framework.org"
        >
          <q-item-section avatar>
            <q-icon name="record_voice_over" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar-framework.org</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          tag="a"
          target="_blank"
          href="https://twitter.com/quasarframework"
        >
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import { openURL } from "quasar"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MyLayout",
  data() {
    return {
      user: this.$store.getters["auth/user"],
      sidebarOpen: this.$q.platform.is.desktop,
    }
  },
  computed: {
    ...mapGetters("app", ["sidebar"]),
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      toggleSidebar: "app/toggleSidebar",
    }),
    async onLogOut() {
      await this.logout()
      this.$router.replace({ name: "login" })
    },
  },
  mounted() {
    console.log(this.sidebar)
    // debugger
  },
}
</script>

<style scoped>
.q-toolbar {
  /* margin: 15px 0; */
  height: 80px;
}
</style>
