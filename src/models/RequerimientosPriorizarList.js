export default class RequerimientosPriorizarList {
  constructor(list = [], aprobado) {
    this.aprobado = aprobado
    // ordenamos el listado
    // this.list = _.sortBy(list, ["prioridad"])
    // this.updateEstado()
    this.list = list
  }

  set list(list) {
    this.listValue = list
    // this.updateEstado()
  }
  get list() {
    return this.listValue
  }

  updateEstado() {
    // Mapeo el valor del estado aca, porque si se produce un cambio de estado local
    // (de pendiente a aprobado y vicerversa) el nuevo listado va a tener el valor correcto en el campo estado
    this.listValue = this.listValue.map(req => {
      if (this.aprobado) {
        req.estado = { id: 2, descripcion: "Aprobado" }
      } else {
        req.estado = { id: 1, descripcion: "Pendiente aprobación" }
      }
      return req
    })
  }

  updatePrioridad() {
    // Actualizo localmente la prioridad
    this.listValue = this.listValue.map((req, index) => {
      req.prioridad = index + 1
      return req
    })
  }

  sortByPrioridad() {
    this.listValue = _.sortBy(this.listValue, ["prioridad"])
  }

  toUpdatePayload() {
    // this.updatePrioridad()
    // this.updateEstado()

    return this.listValue.map(req => {
      const result = {
        id: req.id,
        aprobado: this.aprobado,
        comentario: req.comentario || null,
      }
      // // le envio solo la prioridad si es el listado de aprobados
      // if (this.aprobado) {
      result.prioridad = req.prioridad
      // }
      return result
    })
  }

  toUpdatePendingPayload() {
    // this.updatePrioridad()

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
