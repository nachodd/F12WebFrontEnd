<template>
  <q-layout view="lHh Lpr lFf" class="flex flex-center items-center bg-grey-3">
    <q-page-container class="row">
      <q-card class="col-12 card shadow-5 rounded-borders-8">
        <q-card-section
          class="card__header card-header-offset rounded-borders-8"
        >
          <div class="text-h3 text-center">
            <span class="text-h2 f">F</span>
            <span class="text-h2 twelve">12</span>
          </div>
        </q-card-section>

        <q-card-section class="card__body">
          <q-form @submit="login">
            <q-input
              id="usuario"
              v-model.trim="usuario"
              class="q-mb-sm"
              standout
              type="text"
              label="Usuario"
              :rules="[notEmpty]"
              :autofocus="true"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>
            <q-input
              id="password"
              v-model="password"
              class="q-mb-sm"
              standout
              type="password"
              label="Contraseña"
              :rules="[notEmpty]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
            <br />
            <q-btn
              type="submit"
              color="deep-purple-10"
              size="lg"
              :outline="loading"
              class="full-width"
              :loading="loading"
            >
              Ingresar
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script>
import formValidation from "mixins/formValidation"

export default {
  mixins: [formValidation],
  data() {
    return {
      usuario: "", //"hcosenza",
      password: "", //"c053nz4pocha",

      loading: false,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.dispatch("app/loadingReset")
  },
  methods: {
    async login() {
      this.loading = true
      this.errorMsg = ""
      try {
        await this.$store.dispatch("auth/login", {
          usuario: this.usuario,
          password: this.password,
        })
        this.$router.push({ path: this.redirect || "/inicio" })
      } catch (e) {
        this.$q.notify({
          color: "negative",
          message:
            (e && e.message) || "Hubo un problema al procesar su petición",
          icon: "warning",
          position: "top-right",
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.card
  min-width 350px
  height 380px
  padding 20px
  background-color #fff


.f
  font-size 4.75rem
  font-weight bold
  letter-spacing -10px

.twelve
  letter-spacing -10px
  font-weight 400

.card__header
  background linear-gradient(to top right, $deep-purple-7, $blue-9 )
.card__body
  position relative
  top -15px
</style>
