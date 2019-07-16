<template>
  <q-item :key="notif.id" v-ripple v-close-popup clickable :to="to">
    <q-item-section avatar>
      <q-avatar :icon="icon" text-color="black" class="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1" class="text-black">{{ notif.type }}</q-item-label>
      <q-item-label caption lines="2">
        {{ notif.message }}
      </q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label caption class="notif__time">
        {{ notif.created_at }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
<script>
export default {
  props: {
    notif: {
      type: Object,
      required: true,
    },
  },
  computed: {
    icon() {
      switch (this.notif.type) {
        case "Asignar Requerimiento":
          return "fas fa-mouse-pointer"

        case "Cambio Tipo Requerimiento":
          return "fas fa-random"

        case "Priorizar Requerimiento":
          return "fas fa-sort-amount-down"

        case "Requerimiento Aprobado":
          return "fas fa-check"

        case "Requerimiento Asignado":
          return "fas fa-user-check"

        case "Requerimiento Finalizado":
          return "fas fa-flag-checkered"

        case "Requerimiento Rechazado":
          return "fas fa-ban"

        case "Testear Requerimiento":
          return "fas fa-flask"

        default:
          return "fas fa-dot-circle"
      }
    },
    to() {
      switch (this.notif.type) {
        case "Asignar Requerimiento":
          return "asignar-requerimientos"

        case "Cambio Tipo Requerimiento":
          return "mis-requerimientos"

        case "Priorizar Requerimiento":
          return "priorizar-requerimientos"

        case "Requerimiento Aprobado":
          return "mis-requerimientos"

        case "Requerimiento Asignado":
          return "requerimientos-asignados"

        case "Requerimiento Finalizado":
          return "mis-requerimientos"

        case "Requerimiento Rechazado":
          return "mis-requerimientos"

        case "Testear Requerimiento":
          return "requerimientos-asignados"

        default:
          return ""
      }
    },
  },
}
</script>
<style lang="stylus" scoped>
.icon
  border 1px solid black
.notif__time
  width 40px
  text-align center
</style>
