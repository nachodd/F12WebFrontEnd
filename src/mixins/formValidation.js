export default {
  methods: {
    notEmpty: val => {
      const msg =
        event && event.target && event.target.id
          ? `El campo '${event.target.id}' es requeido`
          : "El campo es requerido"
      return !!val || msg
    },
  },
}
