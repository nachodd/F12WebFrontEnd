// import { required, alpha } from "vuelidate/lib/validators"
import { date } from "quasar"
import { getBase64 } from "@utils/helpers"

export default class Requerimiento {
  constructor(req = {}) {
    this.id = req.id ? req.id : null
    this.asunto = req.asunto ? req.asunto : ""
    this.descripcion = req.descripcion ? req.descripcion : ""
    this.area = req.area ? req.area : null
    this.sistema = req.sistema ? req.sistema : null
    this.requerimientoTipo = req.requerimiento_tipo
      ? req.requerimiento_tipo
      : null
    this.importante = req.importante && req.importante === "SI" ? true : false
    this.prioridad = req.prioridad ? req.prioridad : 5
    this.adjuntos = []
    this.adjuntosCargados = req.adjuntos ? req.adjuntos : []

    // this.fechaLimite = req.fecha_limite ? req.fecha_limite : null
    // Consevervamos la original
    this._fechaLimite = req.fecha_limite ? req.fecha_limite : null
    this.fechaLimite =
      req.fecha_limite && date.isValid(req.fecha_limite)
        ? date.formatDate(req.fecha_limite, "DD/MM/YYYY")
        : null
    this.motivoLimite = req.motivo_limite ? req.motivo_limite : ""

    this.estado = req.estado ? req.estado : null
    // Consevervamos la original
    this._fechaAlta = req.fecha_alta ? req.fecha_alta : null
    this.fechaAlta =
      req.fecha_alta && date.isValid(req.fecha_alta)
        ? date.formatDate(req.fecha_alta, "DD/MM/YYYY")
        : null

    this.movimientos = req.movimientos ? req.movimientos : null
    this.usuario = req.usuario ? req.usuario : null
  }

  // get name() {
  //   return this.brand.concat(" ", this.model)
  // }
  get vence() {
    return this.fechaLimite !== null
  }

  async toCreatePayload() {
    let fechaLimite = this.fechaLimite
    if (fechaLimite !== null && fechaLimite.split("/").length === 3) {
      const aux = fechaLimite.split("/")
      fechaLimite = `${aux[2]}-${aux[1]}-${aux[0]}`
    }

    let filesBase64 = []
    if (this.adjuntos.length > 0) {
      filesBase64 = await Promise.all(
        _.map(this.adjuntos, async file => {
          return await getBase64(file)
        }),
      )
    }

    return {
      asunto: this.asunto,
      descripcion: this.descripcion,
      area: this.area ? this.area.id : null,
      sistema: this.sistema ? this.sistema.id : null,
      requerimiento_tipo: this.requerimientoTipo
        ? this.requerimientoTipo.id
        : null,
      fecha_limite: fechaLimite,
      motivo_limite: this.motivoLimite,
      importante: +this.importante, // + to Parse Boolean to Number
      prioridad: this.prioridad,
      adjuntos: filesBase64,
    }
  }

  // Vuelidate validations
  // static get validations() {
  //   return {
  //     brand: { required, alpha }
  //   }
  // }
}
