<template>
  <q-header elevated class="headerBackground">
    <q-toolbar :class="{ wide: hasSpace }">
      <q-btn flat dense round class="q-mx-sm" @click="toggleSidebar">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>F12</q-toolbar-title>

      <!-- icon="account_circle" -->
      <q-btn
        stretch
        flat
        icon="fas fa-bell"
        :color="notificaction_count > 0 ? 'red' : undefined"
      >
        <q-badge
          v-if="notificaction_count > 0"
          color="red"
          floating
          :class="{ strech: !hasSpace }"
        >
          {{ notificaction_count }}
        </q-badge>
        <q-menu anchor="bottom right" self="top right">
          <q-list>
            <q-item clickable v-close-popup tabindex="0">
              <q-item-section side>
                <q-icon name="fas fa-exclamation-triangle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>No hay notificaciones nuevas</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn-dropdown stretch flat :label="textUser" :icon="iconUser">
        <q-list>
          <q-item-label header>
            <div>
              Bienvenido,
              <strong class="text-small">{{ user.RazonSocial }}</strong>
            </div>
          </q-item-label>
          <q-item clickable v-close-popup tabindex="0">
            <!-- <q-item-section avatar>
                <q-avatar
                  icon="fas fa-user-circle"
                  color="accent"
                  text-color="white"
                />
						</q-item-section>-->
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
</template>
<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "MyLayout",
  data() {
    return {
      notificaction_count: 5,
    }
  },
  computed: {
    ...mapGetters("auth", ["user"]),
    hasSpace() {
      return this.$q.screen.gt.xs
    },
    userName() {
      return this.user.RazonSocial.replace(/ .*/, "")
    },
    textUser() {
      return this.$q.screen.gt.xs ? this.userName : undefined
    },
    iconUser() {
      return this.$q.screen.lt.sm ? "account_circle" : undefined
    },
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      toggleSidebar: "app/toggleSidebar",
      toggleDevice: "app/toggleDevice",
    }),
    async onLogOut() {
      await this.logout()
      this.$router.replace({ name: "login" })
    },
  },
  mounted() {
    this.toggleDevice(this.$q.platform.is)
  },
}
</script>

<style scoped>
.q-toolbar.wide {
  padding: 20px 0;
}
.text-small {
  font-size: 1rem;
}
.q-badge--floating.strech {
  top: 3px;
  right: 1px;
}
</style>
