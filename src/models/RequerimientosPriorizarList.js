export default class RequerimientosPriorizarList {
  constructor(list = [], aprobado) {
    this.aprobado = aprobado
    this.list = list
    // this.list = list.map(req => {
    //   req.aprobado = aprobado
    //   return req
    // })
  }

  setComentarioForRequerimiento(reqId, comentario) {
    const req = _.find(this.list, { id: reqId })
    req.comentario = comentario
  }

  toUpdatePayload() {
    return this.list.map((req, index) => {
      const result = {
        id: req.id,
        aprobado: this.aprobado,
        comentario: req.comentario || null,
      }
      // le envio solo la prioridad si es el listado de aprobados
      if (this.aprobado) {
        result.prioridad = index + 1
      }

      return result
    })
  }
}
