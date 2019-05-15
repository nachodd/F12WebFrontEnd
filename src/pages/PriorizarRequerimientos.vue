<template>
  <q-page padding>
    <page-header title="Priorizar Requerimientos" />
    <div class="row q-col-gutter-md">
      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Requerimientos A ORDENAR"
          group-name="requerimientos"
          :requerimientos-list.sync="reqsPendientesAprobacion"
          list-name="source"
        />
      </div>

      <div class="col-sm-6 col-xs-12">
        <draggable-list
          title="Requerimientos ORDENADOS"
          group-name="requerimientos"
          :requerimientos-list.sync="reqsAprobadosPriorizados"
          list-name="target"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from "vuex"
import PageHeader from "@comp/Common/PageHeader"
import pageLoading from "@mixins/pageLoading"
import { getRequerimientosByUserAndEstado } from "@api/requerimientos"
import dummyRequerimientosList from "@utils/dummyRequerimientosList"
import dummyRequerimientosList2 from "@utils/dummyRequerimientosList2"
import DraggableList from "@comp/PriorizarRequerimientos/DraggableList"

export default {
  name: "PriorizarRequerimientos",
  components: {
    PageHeader,
    DraggableList,
  },
  mixins: [pageLoading],
  data() {
    return {
      reqsPendientesAprobacion: dummyRequerimientosList,
      reqsAprobadosPriorizados: dummyRequerimientosList2,
      sourceAcceptDrop: true,
    }
  },
  computed: {
    ...mapState("auth", {
      user: state => state.user,
    }),
    ...mapState("requerimientos", {
      reqEstados: state => state.estados,
    }),
  },
  watch: {
    reqsPendientesAprobacion(val) {
      console.log("reqsPendientesAprobacion", val)
    },
    reqsAprobadosPriorizados(val) {
      console.log("reqsAprobadosPriorizados", val)
    },
  },
  async created() {
    this.$store.dispatch("app/loadingInc")
    try {
      const userId = this.user.Id
      const estadoPendienteId = _.find(this.reqEstados, { codigo: "PEND" }).id
      const estadoAprobadoId = _.find(this.reqEstados, { codigo: "APRV" }).id
      // FIXME: hacer un promise.all o bien incrementar el contador en 2, de loading y luego ir restandolo
      // FIXME: ver que en el hijo no se actualiza los listados cuando se los pasa por params

      getRequerimientosByUserAndEstado(userId, estadoPendienteId).then(
        ({ data: { data } }) => {
          this.reqsPendientesAprobacion = data
        },
      )

      getRequerimientosByUserAndEstado(userId, estadoAprobadoId).then(
        ({ data: { data } }) => {
          this.reqsAprobadosPriorizados = data
        },
      )

      //this.reqsPendientesAprobacion = getRequerimientosByUserAndEstado()
    } catch (e) {
    } finally {
      this.$store.dispatch("app/loadingDec")
    }
  },
  methods: {},
}
</script>
