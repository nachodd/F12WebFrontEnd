// import { required, alpha } from "vuelidate/lib/validators"
import { date } from "quasar"
import { getBase64FromInput, getBase64FromUrl } from "@utils/helpers"

export default class Requerimiento {
  constructor(req = {}) {
    this.id = req.id ? req.id : null
    this.asunto = req.asunto ? req.asunto : ""
    this.descripcion = req.descripcion ? req.descripcion : ""
    this.area = req.area ? req.area : null
    this.sistema = req.sistema ? req.sistema : null
    this.tipo = req.tipo ? req.tipo : null
    this.prioridad = req.prioridad ? req.prioridad : 5
    this.adjuntos = []
    this.adjuntosCargadosUrl = req.adjuntos ? req.adjuntos : []
    this.adjuntosCargadosBase64 = []
    this.procesandoArchivosCargados = false

    // this.fechaLimite = req.fecha_limite ? req.fecha_limite : null
    // Consevervamos la original
    this._fechaLimite = req.fecha_limite ? req.fecha_limite : null
    this.fechaLimite =
      req.fecha_limite && date.isValid(req.fecha_limite)
        ? date.formatDate(req.fecha_limite, "DD/MM/YYYY")
        : null
    this.motivoLimite = req.motivo_limite ? req.motivo_limite : ""

    // el estado puede estar setiado en estado o estado_general por eso va este ternario
    this.estado = req.estado
      ? req.estado
      : req.estado_priorizacion
      ? req.estado_priorizacion
      : null
    // Consevervamos la original
    this._fechaAlta = req.fecha_alta ? req.fecha_alta : null
    this.fechaAlta =
      req.fecha_alta && date.isValid(req.fecha_alta)
        ? date.formatDate(req.fecha_alta, "DD/MM/YYYY")
        : null

    this.movimientos = req.movimientos ? req.movimientos : null
    this.usuario = req.usuario ? req.usuario : null
    this.comentario = req.comentario ? req.comentario : null
    this.movimientos = req.movimientos ? req.movimientos : []
  }

  // get name() {
  //   return this.brand.concat(" ", this.model)
  // }
  get vence() {
    return this.fechaLimite !== null
  }

  get diasToVencimiento() {
    if (this.vence) {
      const diff = date.getDateDiff(
        new Date(this._fechaLimite),
        new Date(),
        "days",
      )
      return diff
    }
    return null
  }

  async toCreatePayload() {
    const fechaLimite = this.parseFechaLimite()

    let filesBase64 = []
    if (this.adjuntos.length > 0) {
      filesBase64 = await Promise.all(
        _.map(this.adjuntos, async file => {
          return await getBase64FromInput(file)
        }),
      )
    }

    return {
      asunto: this.asunto,
      descripcion: this.descripcion,
      // area: this.area ? this.area.id : null,
      sistema: this.sistema ? this.sistema.id : null,
      requerimiento_tipo: this.tipo ? this.tipo.id : null,
      fecha_limite: fechaLimite,
      motivo_limite: this.motivoLimite,
      // importante: +this.importante, // + to Parse Boolean to Number
      prioridad: this.prioridad,
      adjuntos: filesBase64,
    }
  }

  async toUpdatePayload() {
    const fechaLimite = this.parseFechaLimite()

    const payload = {
      id: this.id,
      asunto: this.asunto,
      descripcion: this.descripcion,
      // area: this.area ? this.area.id : null,
      sistema: this.sistema ? this.sistema.id : null,
      requerimiento_tipo: this.tipo ? this.tipo.id : null,
      fecha_limite: fechaLimite,
      motivo_limite: this.motivoLimite,
      prioridad: this.prioridad,
    }

    // Cheuqeo si hubo cambios en los archivos:
    // - Si cargo un adjunto nuevo (adjuntos.length > 0)
    // - Si eliminó un archivo ya cargado (adjuntosCargadosUrl.length !== adjuntosCargadosBase64.length)
    if (
      this.adjuntos.length > 0 ||
      this.adjuntosCargadosUrl.length !== this.adjuntosCargadosBase64.length
    ) {
      // mapeo los files del input
      const filesFromInput = await Promise.all(
        _.map(this.adjuntos, async file => {
          return await getBase64FromInput(file)
        }),
      )
      // mapeo los files ya cargados, los busco en el array this.adjuntosCargadosBase64, el campo base64
      const filesUploaded = _.map(this.adjuntosCargadosUrl, url => {
        return _.find(this.adjuntosCargadosBase64, { url }).base64
      })
      payload.adjuntos = [...filesFromInput, ...filesUploaded]
    }
    return payload
  }

  parseFechaLimite() {
    let fechaLimite = this.fechaLimite
    if (fechaLimite !== null && fechaLimite.split("/").length === 3) {
      const aux = fechaLimite.split("/")
      fechaLimite = `${aux[2]}-${aux[1]}-${aux[0]}`
    }
    return fechaLimite
  }

  async tryConvertDownloadedFiles() {
    if (this.adjuntosCargadosUrl.length > 0) {
      this.procesandoArchivosCargados = true
      this.adjuntosCargadosBase64 = await Promise.all(
        _.map(this.adjuntosCargadosUrl, async url => {
          const res = await getBase64FromUrl(url)
          return {
            url,
            base64: res,
          }
        }),
      )
      this.procesandoArchivosCargados = false
    }
    return []
  }

  // Vuelidate validations
  // static get validations() {
  //   return {
  //     brand: { required, alpha }
  //   }
  // }
}
