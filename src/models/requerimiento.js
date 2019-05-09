// import { required, alpha } from "vuelidate/lib/validators"
// import { date } from "quasar"
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
    this.fechaLimite = req.fecha_limite ? req.fecha_limite : null
    this.motivoLimite = req.motivo_limite ? req.motivo_limite : ""
    this.importante = req.importante ? req.importante : false
    this.prioridad = req.prioridad ? req.prioridad : 5
    this.files = []

    // Validations of properites can be more complex
    // this.producedAt =
    //   req.producedAt && date.isValid(req.producedAt)
    //   ? date.formatDate(req.producedAt, "DD/MM/YYYY")
    //     : null
  }

  // get name() {
  //   return this.brand.concat(" ", this.model)
  // }

  async toCreatePayload() {
    let fechaLimite = this.fechaLimite
    if (fechaLimite !== null && fechaLimite.split("/").length === 3) {
      const aux = fechaLimite.split("/")
      fechaLimite = `${aux[2]}-${aux[1]}-${aux[0]}`
    }

    debugger
    if (this.files.length > 0) {
      this.files = await getBase64(this.files[0])
    } else {
      this.files = null
    }

    return {
      asunto: this.asunto,
      descripcion: this.descripcion,
      area: this.area,
      sistema: this.sistema,
      requerimiento_tipo: this.requerimientoTipo,
      fecha_limite: fechaLimite,
      motivo_limite: this.motivoLimite,
      importante: +this.importante, // + to Parse Boolean to Number
      prioridad: this.prioridad,
      imagen: this.files,
    }
  }

  // Vuelidate validations
  // static get validations() {
  //   return {
  //     brand: { required, alpha }
  //   }
  // }
}
