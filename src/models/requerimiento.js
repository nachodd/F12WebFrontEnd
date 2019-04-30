// import { required, alpha } from "vuelidate/lib/validators"
// import { date } from "quasar"

export default class Requerimiento {
  constructor(req = {}) {
    this.id = req.id ? req.id : null
    this.asunto = req.asunto ? req.asunto : ""
    this.descripcion = req.descripcion ? req.descripcion : ""
    this.area = req.area ? req.area : ""
    this.sistema = req.sistema ? req.sistema : ""
    this.requerimientoTipo = req.requerimiento_tipo
      ? req.requerimiento_tipo
      : ""
    this.fechaLimite = req.fecha_limite ? req.fecha_limite : ""
    this.motivoLimite = req.motivo_limite ? req.motivo_limite : ""
    this.importante = req.importante ? req.importante : false

    // Validations of properites can be more complex
    // this.producedAt =
    //   req.producedAt && date.isValid(req.producedAt)
    //   ? date.formatDate(req.producedAt, "DD/MM/YYYY")
    //     : null
  }

  // get name() {
  //   return this.brand.concat(" ", this.model)
  // }

  toCreatePayload() {
    return {
      asunto: this.asunto,
      descripcion: this.descripcion,
      area: this.area,
      sistema: this.sistema,
      requerimiento_tipo: this.requerimientoTipo,
      fecha_limite: this.fechaLimite,
      motivo_limite: this.motivoLimite,
      importante: +this.importante, // + to Parse Boolean to Number
    }
  }

  // Vuelidate validations
  // static get validations() {
  //   return {
  //     brand: { required, alpha }
  //   }
  // }
}
