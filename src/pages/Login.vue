<template>
  <q-layout view="lHh Lpr lFf" class="flex flex-center items-center bg-grey-3">
    <q-page-container class="">
      <q-card class="card shadow-5">
        <q-card-section>
          <div class="text-h3 text-grey-7 text-center">
            <span class="text-h2 f twelve">F</span>
            <span class="text-h2 twelve">12</span>
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            id="email"
            v-model.trim="email"
            standout
            type="email"
            label="Email"
            required
            autofocus
            ref="email"
          >
            <template v-slot:prepend>
              <q-icon name="account_circle" />
            </template>
          </q-input>
          <br />
          <q-input
            id="password"
            v-model="password"
            standout
            type="password"
            label="Contraseña"
            required
            ref="password"
            @keyup.enter="login"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
          <br />
        </q-card-section>
        <q-card-actions>
          <q-btn
            color="white"
            size="lg"
            outline
            class="full-width text-grey-7"
            :loading="loading"
            @click="login"
          >
            Ingresar
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    if (this.email === "") {
      this.$refs.email.focus();
    } else if (this.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        await this.$store.dispatch("auth/login", {
          email: this.email,
          password: this.password
        });
        this.$router.push({ path: this.redirect || "/" });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  width: 400px;
  padding: 20px;
  background-color: #fff;
}
.f.twelve {
  font-size: 4.7rem;
}
.twelve {
  letter-spacing: -10px;
  font-weight: bold;
}
</style>
