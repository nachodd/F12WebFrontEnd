<template>
  <q-page padding>
    <page-header title="Mis Requerimientos" />
    {{ misRequerimientos }}
  </q-page>
</template>
<script>
import { mapState } from "vuex"
import { warn } from "@utils/helpers"
import PageHeader from "@comp/PageHeader"

export default {
  components: { PageHeader },
  data() {
    return {}
  },
  computed: {
    ...mapState("requerimientos", {
      loadingRequerimiento: state => state.loadingRequerimiento,
      misRequerimientos: state => state.misRequerimientos,
    }),
  },
  async mounted() {
    try {
      await this.$store.dispatch("requerimientos/listRequerimientos")
    } catch (e) {
      const message =
        e.message ||
        "Hubo un problema al cargar el listado de sus Requerimientos. Intente nuevamente más tarde"
      warn({ message })
    }
  },
}
</script>
