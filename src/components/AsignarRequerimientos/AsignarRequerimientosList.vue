<template>
  <list-requerimientos :loading-list="loadingList" :title="title">
    <template v-if="listEmpty">
      <div class="text-h6 text-center">
        No hay requerimientos para mostrar!
      </div>
    </template>
    <template v-else>
      <asignar-requerimientos-item
        v-for="(req, index) in requerimientosList"
        :key="`req_${req.id}`"
        :req="req"
        :index="index"
      />
    </template>
  </list-requerimientos>
</template>

<script>
import ListRequerimientos from "@comp/Common/ListRequerimientos"
import AsignarRequerimientosItem from "@comp/AsignarRequerimientos/AsignarRequerimientosItem"

export default {
  components: {
    ListRequerimientos,
    AsignarRequerimientosItem,
  },
  props: {
    requerimientosList: {
      type: Array,
      required: true,
    },
    loadingList: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    listEmpty() {
      return this.requerimientosList.length === 0
    },
  },
}
</script>

<style lang="scss" scoped></style>
