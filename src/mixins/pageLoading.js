import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters("app", ["isPageLoading"]),
  },
  watch: {
    isPageLoading(isLoading) {
      if (isLoading) {
        this.$q.loading.show({
          message:
            "<strong class='text-unselectable'>Cargando... <br>Por favor, espere...</strong>",
          spinner: "QSpinnerHourglass",
        })
      } else {
        this.$q.loading.hide()
      }
    },
  },
}
