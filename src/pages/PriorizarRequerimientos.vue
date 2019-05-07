<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <draggable
      v-model="requerimientosAOrdernar"
      group="requerimientos"
      @start="drag = true"
      @end="drag = false"
    >
      <div v-for="req in requerimientosAOrdernar" :key="req.id">
        {{ req.asunto }}
      </div>
    </draggable>
  </q-page>
</template>

<script>
import draggable from "vuedraggable"
import PageHeader from "@comp/PageHeader"
import dummyRequerimientosList from "@utils/dummyRequerimientosList"

export default {
  components: { PageHeader, draggable },
  data() {
    return {
      requerimientosAOrdernar: dummyRequerimientosList,
    }
  },
}
</script>

<style lang="scss" scoped></style>
