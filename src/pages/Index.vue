<template>
  <q-page padding>
    <page-header title="Inicio" />

    <q-card dark bordered class="bg-grey-9 flex items-center">
      <q-card-section class="flex-column">
        <q-icon name="fas fa-ticket-alt" size="4rem" />
      </q-card-section>
      <q-card-section class="flex-column q-mt-sm">
        <div class="text-h3">20</div>
        <div class="text-subtitle">Tickets nuevos</div>
      </q-card-section>

      <!-- <q-separator dark inset />

			<q-card-section>{{ lorem }}</q-card-section>-->
    </q-card>
  </q-page>
</template>

<style></style>

<script>
import PageHeader from "components/PageHeader"

export default {
  name: "Index",
  components: { PageHeader },
  methods: {},
}
</script>
