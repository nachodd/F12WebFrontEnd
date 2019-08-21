// import { required, alpha } from "vuelidate/lib/validators"
import * as _ from "lodash"
import { date } from "quasar"
import { getBase64FromInput, getBase64FromUrl } from "utils/helpers"
import { pSBC } from "utils/colorHelper"

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
      : req.estado_general
      ? req.estado_general
      : null
    //this.estado = req.estado ? req.estado : null

    this.estado_priorizacion = req.estado_priorizacion
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
    this.requerimientoAsociado = req.requerimiento_asociado
      ? req.requerimiento_asociado
      : null
    this.usuarioCadena = req.usuario_cadena ? req.usuario_cadena : null
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

  get fueEnviadoAProcesos() {
    return this.requerimientoAsociado !== null
  }

  get estaEnPausa() {
    return _.get(this, "estado.pausado", null) === true
  }

  get estaAsignado() {
    const estaAsignado = _.get(this, "estado.asignacion", null)
    return estaAsignado !== null
  }
  get usuarioAsignado() {
    return _.get(this, "estado.asignacion.usuario_nombre", null)
  }
  get usuarioAsignadoId() {
    return _.get(this, "estado.asignacion.usuario_id", null)
  }
  // get estaEnTesting() {
  //   return _.get(this, "estado.id", null) === Requerimiento.getEstadoId("TEST")
  // }
  get usuarioTesting() {
    return _.get(this, "estado.asignacion_testing.usuario_nombre", null)
  }

  get asignacionOrden() {
    return _.get(this, "estado.asignacion.orden", null)
  }

  get asociadoId() {
    return _.get(this, "requerimientoAsociado.id", null)
  }
  get asociadoEstadoDescripcion() {
    return _.get(this, "requerimientoAsociado.estado.descripcion", null)
  }
  get asociadoUsuario() {
    return _.get(this, "requerimientoAsociado.usuario_asignado", null)
  }

  get colorVencimiento() {
    const rojoMax = "#ef5350"
    const blanco = "#FFFFFF"
    if (!this.vence) {
      return blanco
    }
    const diasVenc = this.diasToVencimiento
    if (diasVenc > 7) {
      return blanco
    } else if (diasVenc > -15 && diasVenc <= 7) {
      const factorDias = (diasVenc + 15) * 100
      const factorAclarado = factorDias / 22 / 100
      return pSBC(factorAclarado, rojoMax, false, true)
    } else {
      return rojoMax
    }
  }
  get colorVencimientoBg() {
    const blanco = "#FFFFFF"
    if (!this.vence) {
      return blanco
    }
    const diasVenc = this.diasToVencimiento
    if (diasVenc > 7) {
      return blanco
    } else {
      const colorGradiente = this.colorVencimiento
      return `linear-gradient(45deg, #fff 0%, #fff 25%, ${colorGradiente} 100%)`
    }
  }

  get colorPrioridad() {
    const res = { text: "", bg: "" }
    switch (this.prioridad) {
      case 1:
        res.bg = "#F0666B"
        break
      case 2:
        res.bg = "#E5766B"
        break
      case 3:
        res.bg = "#DB866C"
        break
      case 4:
        res.bg = "#D1976D"
        break
      case 5:
        res.bg = "#C7A76D"
        break
      case 6:
        res.bg = "#BCB76E"
        break
      case 7:
        res.bg = "#B2C86F"
        break
      case 8:
        res.bg = "#A8D86F"
        break
      case 9:
        res.bg = "#9EE870"
        break
      default:
        res.bg = "#94F971"
    }
    switch (this.prioridad) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        res.text = "#FFFFFF"
        break
      case 6:
      case 7:
        res.text = "#555555"
        break
      case 8:
      case 9:
      default:
        res.text = "#000000"
    }
    return res
  }

  get esArregloRapido() {
    return _.get(this, "tipo.id", null) === Requerimiento.getTipoId("AR")
  }
  get esDesarrollo() {
    return _.get(this, "tipo.id", null) === Requerimiento.getTipoId("DMI")
  }
  get esRevisionProcesos() {
    return _.get(this, "tipo.id", null) === Requerimiento.getTipoId("RP")
  }
  esTipo(tipoCod) {
    return _.get(this, "tipo.id", null) === Requerimiento.tipoId(tipoCod)
  }
  get tipoCodigo() {
    return Requerimiento.getTipoCodigo(_.get(this, "estado.id", null))
  }

  get estadoCodigo() {
    return Requerimiento.getEstadoCodigo(_.get(this, "estado.id", null))
  }
  tieneEstado(estadoCod) {
    // eslint-disable-next-line
    return _.get(this, "estado.id", null) === Requerimiento.getEstadoId(estadoCod)
  }
  tieneEstadoPriorizacion(estadoCod) {
    // eslint-disable-next-line
    return _.get(this, "estado_priorizacion.id", null) === Requerimiento.getEstadoId(estadoCod)
  }

  get tieneAdjuntos() {
    return this.adjuntosCargadosUrl.length > 0
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

    const payload = {
      asunto: this.asunto,
      descripcion: this.descripcion,
      // area: this.area ? this.area.id : null,
      sistema: this.sistema ? this.sistema.id : null,
      requerimiento_tipo: this.tipo ? this.tipo.id : null,
      fecha_limite: fechaLimite,
      motivo_limite: this.motivoLimite,
      prioridad: this.prioridad,
      adjuntos: filesBase64,
    }
    if (this.usuarioCadena !== null) {
      payload.usuario_cadena = this.usuarioCadena
    }
    return payload
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
    if (this.usuarioCadena !== null) {
      payload.usuario_cadena = this.usuarioCadena
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
      try {
        this.adjuntosCargadosBase64 = await Promise.all(
          _.map(this.adjuntosCargadosUrl, async url => {
            const res = await getBase64FromUrl(url)
            return {
              url,
              base64: res,
            }
          }),
        )
      } catch (ex) {
        console.log(ex)
      } finally {
        this.procesandoArchivosCargados = false
      }
    }
    return []
  }

  static getEstadoId(codigo) {
    const arrEstados = {
      PEND: 1,
      APRV: 2,
      NOAS: 3,
      ASSI: 4,
      EXEC: 5,
      RESC: 6,
      REJC: 7,
      INGR: 8,
      STPR: 9,
      TEST: 10,
    }
    return arrEstados[codigo] || null
  }

  static getEstadoCodigo(id) {
    const arrIds = {
      1: "PEND",
      2: "APRV",
      3: "NOAS",
      4: "ASSI",
      5: "EXEC",
      6: "RESC",
      7: "REJC",
      8: "INGR",
      9: "STPR",
      10: "TEST",
    }
    return arrIds[id] || null
  }

  static getTipoId(codigo) {
    const arrTipos = {
      AR: 1, // "Arreglo rápido"
      DMI: 2, // "Desarrollos / Modificaciones / Implementaciones"
      RP: 3, // "Revision procesos"
    }
    return arrTipos[codigo] || null
  }
  static getTipoCodigo(id) {
    const arrTipos = {
      1: "AR",
      2: "DMI",
      3: "RP",
    }
    return arrTipos[id] || null
  }

  // Vuelidate validations
  // static get validations() {
  //   return {
  //     brand: { required, alpha }
  //   }
  // }
}
