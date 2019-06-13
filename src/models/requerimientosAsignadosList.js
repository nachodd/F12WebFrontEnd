export default class RequerimientosAsignadosList {
  constructor(list = [], aprobado) {
    this.aprobado = aprobado
    this.list = list
  }

  set list(list) {
    this.listValue = list
  }
  get list() {
    return this.listValue
  }

  get listLength() {
    return this.listValue.length
  }

  sortByPrioridad() {
    this.listValue = _.sortBy(this.listValue, ["prioridad"])
  }

  toUpdatePayload() {
    return this.listValue.map(req => {
      const result = {
        id: req.id,
        aprobado: this.aprobado,
        comentario: req.comentario || null,
      }

      result.prioridad = req.prioridad

      return result
    })
  }

  toUpdatePendingPayload() {
    return this.listValue.map(req => {
      const result = {
        id: req.id,
        aprobado: this.aprobado,
        prioridad: req.prioridad,
      }
      return result
    })
  }
}
