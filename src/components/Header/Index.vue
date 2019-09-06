<template>
  <q-header elevated class="headerBackground">
    <q-toolbar class="text-unselectable" :class="{ wide: hasSpace }">
      <q-btn flat dense round class="q-mx-sm" @click="toggleSidebar">
        <q-icon name="menu" />
      </q-btn>

      <q-toolbar-title>
        {{ title }}
      </q-toolbar-title>

      <q-btn
        v-if="refreshShowed"
        dense
        round
        flat
        icon="fas fa-sync-alt"
        :class="{ 'fa-spin': headerRefreshLoading }"
        @click="refreshListado"
      >
        <tooltip>Refrescar Listado</tooltip>
      </q-btn>

      <q-btn
        stretch
        flat
        icon="fas fa-bell"
        :color="notificacionesUnreadCount > 0 ? 'red' : void 0"
      >
        <!-- eslint-disable-next-line  -->
        <tooltip><div v-html="notificacionesTooltip"></div></tooltip>
        <q-badge
          v-if="notificacionesUnreadCount > 0"
          color="red"
          floating
          :class="{ strech: !hasSpace }"
        >
          {{ notificacionesUnreadCount }}
        </q-badge>
        <q-menu anchor="bottom right" self="top right" @hide="onHideNotificacionesMenu">
          <q-list v-if="noNewNotifications">
            <q-item v-close-popup clickable tabindex="0">
              <q-item-section side>
                <q-icon name="fas fa-exclamation-triangle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>No hay notificaciones nuevas</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-list v-else bordered class="rounded-borders" style="max-width: 350px">
            <template v-if="notificacionesUnread.length">
              <q-item-label caption class="q-pa-sm">NUEVAS</q-item-label>
              <div v-for="(notif, i) in notificacionesUnread" :key="notif.id">
                <notificacion-item :notif="notif" />
                <q-separator v-if="notificacionesUnread.length - 1 !== i" inset="item" />
              </div>
              <q-item-label
                v-if="notificacionesUnreadVerMasShowed"
                caption
                class="notif__vermas"
                @click="showMoreNotificaciones('unread')"
              >
                Ver Más...
              </q-item-label>
            </template>

            <template v-if="notificationsReadAndUnread">
              <!-- <q-separator inset="item" /> -->
              <q-separator spaced />
            </template>

            <template v-if="notificacionesRead.length">
              <q-item-label caption class="q-pa-sm">ANTERIORES</q-item-label>
              <div v-for="(notif, i) in notificacionesRead" :key="notif.id" class="bg-grey-2">
                <notificacion-item :notif="notif" unread />
                <q-separator v-if="notificacionesRead.length - 1 !== i" inset="item" />
              </div>
              <q-item-label
                v-if="notificacionesReadVerMasShowed"
                caption
                class="notif__vermas bg-grey-2"
                @click="showMoreNotificaciones('read')"
              >
                Ver Más...
              </q-item-label>
            </template>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn-dropdown stretch flat :label="textUser" :icon="iconUser">
        <q-list>
          <q-item-label header>
            <div>
              Bienvenido,
              <strong class="text-small">{{ userName }}</strong>
            </div>
          </q-item-label>
          <!-- <q-item v-close-popup clickable tabindex="0">
            <q-item-section avatar>
              <q-avatar
                icon="fas fa-user-circle"
                color="accent"
                text-color="white"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>Perfil</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="fas fa-user-circle" />
            </q-item-section>
          </q-item> -->
          <q-separator inset spaced />
          <q-item v-close-popup clickable tabindex="1" @click="onLogOut">
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
import { mapActions, mapGetters, mapState } from "vuex"
import NotificacionItem from "comp/Header/NotificacionItem"
import Tooltip from "comp/Common/Tooltip"

export default {
  name: "Header",
  components: {
    NotificacionItem,
    Tooltip,
  },
  props: {
    mini: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      refreshShowed: false,
    }
  },
  computed: {
    ...mapState("app", {
      limitUnread: state => state.limitUnread,
      limitRead: state => state.limitRead,
      headerRefreshLoading: state => state.headerRefreshLoading,
    }),
    ...mapGetters("auth", ["userRazonSocial"]),
    ...mapGetters("app", [
      "notificacionesRead",
      "notificacionesReadCount",
      "notificacionesReadVerMasShowed",
      "notificacionesUnread",
      "notificacionesUnreadCount",
      "notificacionesUnreadVerMasShowed",
    ]),
    notificacionesTooltip() {
      return this.notificacionesUnreadCount > 0
        ? `Tiene
          ${this.notificacionesUnreadCount}
          notificaciones nuevas`
        : "No hay notificaciones! <span class='emoji'>🎉</span>"
    },
    hasSpace() {
      return this.$q.screen.gt.xs && !this.mini
    },
    userName() {
      return this.userRazonSocial.replace(/ .*/, "")
    },
    textUser() {
      return this.$q.screen.gt.xs ? this.userName : undefined
    },
    iconUser() {
      return this.$q.screen.lt.sm ? "account_circle" : undefined
    },
    noNewNotifications() {
      return this.notificacionesRead.length === 0 && this.notificacionesUnread.length === 0
    },
    notificationsReadAndUnread() {
      return this.notificacionesReadCount > 0 && this.notificacionesUnreadCount > 0
    },
    title() {
      const { headerTitle = "F12" } = this.$route.meta
      return headerTitle
    },
  },
  watch: {
    "$route.name": {
      immediate: true,
      handler(routeName) {
        const routeMatched = [
          "mis-requerimientos",
          "priorizar-requerimientos",
          "asignar-requerimientos",
          "requerimientos-asignados",
        ].includes(routeName)

        this.refreshShowed = routeMatched
      },
    },
  },
  mounted() {
    this.toggleDevice(this.$q.platform.is)
  },
  created() {
    this.checkNotificaciones()
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
      toggleSidebar: "app/toggleSidebar",
      toggleDevice: "app/toggleDevice",
      checkNotificaciones: "app/checkNotificaciones",
      showMoreNotificaciones: "app/showMoreNotificaciones",
      resetMoreNotificaciones: "app/resetMoreNotificaciones",
      refreshListado: "app/refreshListado",
    }),
    async onLogOut() {
      await this.logout()
      this.$router.replace({ name: "login" })
    },
    onHideNotificacionesMenu() {
      this.resetMoreNotificaciones()
      if (this.notificacionesUnreadCount > 0) {
        this.$store.dispatch("app/readNotificaciones")
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.q-toolbar
  transition: padding 200ms linear;
  padding-left: 0;
  padding-right: 0;

.q-toolbar.wide
  padding: 20px 0;

.text-small
  font-size: 1rem;

.q-badge--floating.strech
  top: 3px;
  right: 1px;

.notif__vermas
  cursor pointer
  padding 8px
  text-align center
  transition: font-weight 0.3s
.notif__vermas:hover
  font-weight 900
</style>
