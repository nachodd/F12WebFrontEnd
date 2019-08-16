<template>
  <q-layout
    view="lHh Lpr lFf"
    class="flex flex-center items-center loginHorus__bg"
  >
    <q-page-container>
      <div class="loginHorus__text text-center">
        <div class="loginHorus__title">
          <span class="text-h2 f twelve">F</span>
          <span class="text-h2 twelve">12</span>
        </div>
        <div v-if="error === ''" class="loginHorus__subtitle text-h6">
          <!-- eslint-disable-next-line -->
          ingresando<span class="loginHorus__points">{{ points }}</span>
        </div>
        <div
          v-if="error === 'tokenInvalid'"
          class="text-h6 loginHorus__subtitle-error"
        >
          AVISO: Token no presente en la URL
          <br />
          Redirigiendo...
        </div>
        <div
          v-if="error === 'cantLogin'"
          class="text-h6 loginHorus__subtitle-error"
        >
          AVISO: No se pudo iniciar sesión automaticamente
          <br />
          Redirigiendo...
        </div>
      </div>
      <div></div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
export default {
  data() {
    return {
      interval: null,
      points: "",
      error: "",
    }
  },
  computed: {
    ...mapGetters("auth", ["check"]),
  },
  mounted() {
    this.$store.dispatch("app/loadingReset")
    this.setIntervalForText()
    this.tryLogin()
  },
  unmounted() {
    clearInterval(this.interval)
  },
  methods: {
    ...mapActions({
      getUserInfo: "auth/getUserInfo",
    }),
    setIntervalForText() {
      this.interval = setInterval(() => {
        this.points += "."
        if (this.points.length === 4) {
          this.points = ""
        }
      }, 500)
    },
    async tryLogin() {
      // Chequeo si ya no está logueado
      if (this.check) {
        try {
          // Si está refresco el token y la info del usuario y si esta todo bien, redirijo
          await this.getUserInfo()
          return this.redirectForm()
        } catch (e) {}
      }
      // Si no, esta logueado o falla el getUserInfo, intento loguearlo
      const access_token = _.get(this.$route.query, "access_token", "").trim()
      const expires_in = _.get(this.$route.query, "expires_in", "").trim()
      const refresh_token = _.get(this.$route.query, "refresh_token", "").trim()

      if (!access_token || !expires_in || !refresh_token) {
        this.error = "tokenInvalid"
        this.redirectLogin()
        return
      }

      try {
        await this.$store.dispatch("auth/loginHorus", {
          access_token,
          expires_in,
          refresh_token,
        })
        return this.redirectForm()
      } catch (e) {
        console.log("Error Login via Horus: ", e)
        this.error = "cantLogin"
        this.redirectLogin()
      }
    },
    redirectLogin() {
      setTimeout(() => {
        this.$router.replace({ name: "login" })
      }, 5000)
    },
    redirectForm() {
      this.$router.replace({
        name: "mis-requerimientos",
        query: { ver: "crearRequerimiento" },
      })
    },
  },
}
</script>
<style lang="stylus" scoped>
.f.twelve
  font-size: 4.7rem;

.twelve
  letter-spacing: -10px;
  font-weight: bold;

.loginHorus__text
  color #ffffff
  width 300px
  text-shadow 2px 2px 2px #000000;

.loginHorus__title
  margin-left -5%


.loginHorus__subtitle
  padding-top 10px
  height 60px

.loginHorus__points
  text-align left
  width 30px
  display inline-block
.loginHorus__subtitle-error
  padding-top 15px
  width: 200px;
  margin: 0 auto;
  line-height 23px
  height 60px
</style>
