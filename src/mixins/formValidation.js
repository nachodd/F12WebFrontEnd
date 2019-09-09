import { date } from "quasar"

export default {
  methods: {
    notEmpty: val => {
      const msg =
        event && event.target && event.target.name
          ? `El campo '${event.target.name}' es requerido`
          : "El campo es requerido"
      return !!val || msg
    },
    numberPositive: val => {
      const msg =
        event && event.target && event.target.name
          ? `'${event.target.name}' debe ser un entero positivo`
          : "Debe ser un entero positivo"
      return /^[1-9]\d*$/.test(val) || msg
    },
    validDate(value) {
      const valueParsed = value.split("/")
      if (!valueParsed.length === 3) {
        return false
      }
      const dateParsed = date.buildDate({
        year: valueParsed[2],
        month: valueParsed[1],
        date: valueParsed[0],
      })
      return date.isValid(dateParsed.toString())
    },
  },
}
