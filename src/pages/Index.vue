<template>
  <q-page padding>
    <page-header title="Inicio" />

    <div class="row justify-around q-col-gutter-md">
      <div class="col-md-4 col-sm-4 col-xs-12 q-mb-lg">
        <widget-simple
          icon="fas fa-ticket-alt"
          value="15"
          description="Tickets Nuevos"
          icon-background-class="bg-green-9"
          info-text-class="text-green-9"
          :loading="loading"
        />
      </div>

      <div class="col-md-4 col-sm-4 col-xs-12 q-mb-lg">
        <widget-simple
          icon="fas fa-exclamation-triangle"
          value="7"
          description="Tickets importantes"
          :loading="loading"
        />
      </div>

      <div class="col-md-4 col-sm-4 col-xs-12 q-mb-lg">
        <widget-simple
          icon="fas fa-bell"
          value="3"
          description="Recordatorios"
          icon-background-class="bg-blue-9"
          info-text-class="text-blue-9"
          :loading="loading"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import PageHeader from "@comp/PageHeader"
import WidgetSimple from "@comp/WidgetSimple"

export default {
  name: "Index",
  components: { PageHeader, WidgetSimple },
  data() {
    return {
      loading: true,
    }
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      this.loading = false
    }, 3000)
  },
}
</script>

<style lang="scss" scoped></style>
