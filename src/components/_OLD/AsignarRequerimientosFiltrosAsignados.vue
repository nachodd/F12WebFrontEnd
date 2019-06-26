<template>
  <q-list bordered class="rounded-borders-10 q-mx-sm">
    <q-expansion-item
      icon="fas fa-search"
      label="Filtros"
      dense
      class="rounded-borders-10"
    >
      <q-card class="rounded-borders-10">
        <q-card-section>
          asunto, decripcion
          <br />
          usuario
          <br />
          tipo: arreglo rapido / desarrollo
          <br />
          sistema
          <br />
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script>
export default {
  name: "MisRequerimientosMenuFiltros",
  data() {
    return {
      input: "",
    }
  },
  computed: {
    widthInputDescripcion() {
      console.log("refs", this.$refs)
      // console.log("elemento", this.$refs.inputDescripcion.$el.clientWidth)
      const val = _.get(this.$refs, "inputDescripcion.$el.clientWidth", 300)
      console.log(val)
      return val
      // return 985
    },
  },
  mounted() {
    console.log("mounted", this.$refs.inputDescripcion.$el.clientWidth)
  },
}
</script>
