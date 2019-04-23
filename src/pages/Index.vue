<template>
  <q-page padding>
    <page-header title="Inicio" />

    <div class="row justify-around">
      <div class="col-md-3 col-xs-12 q-mb-sm">
        <widget-simple
          icon="fas fa-bell"
          value="20"
          description="Tickets Nuevos"
        />
      </div>

      <div class="col-md-3 col-xs-12 q-mb-sm">
        <widget-simple
          icon="fas fa-bell"
          value="20"
          description="Tickets Nuevos"
        />
      </div>

      <div class="col-md-3 col-xs-12 q-mb-sm">
        <widget-simple
          icon="fas fa-bell"
          value="20"
          description="Tickets Nuevos"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="scss"></style>

<script>
import PageHeader from "components/PageHeader"
import WidgetSimple from "components/WidgetSimple"

export default {
  name: "Index",
  components: { PageHeader, WidgetSimple },
  methods: {},
}
</script>
