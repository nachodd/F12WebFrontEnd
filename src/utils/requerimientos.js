export function filterByAsuntoAndDescripcion(descripcion) {
  return reqs => {
    const searchString = descripcion.toLowerCase().trim()
    return reqs.filter(req => {
      const usuarioAsig = _.get(req, "estado.asignacion.usuario_nombre", "")
      const usuarioAlta = _.get(req, "usuario.nombre", "")
      return (
        req.asunto.toLowerCase().includes(searchString) ||
        req.descripcion.toLowerCase().includes(searchString) ||
        usuarioAsig.toLowerCase().includes(searchString) ||
        usuarioAlta.toLowerCase().includes(searchString) ||
        String(req.id) === searchString
      )
    })
  }
}
export function filterBySistema(sistemaId) {
  return reqs => {
    return reqs.filter(req => {
      return req.sistema.id == sistemaId
    })
  }
}

export function filterByTipoRequerimiento(tipoRequerimientoId) {
  return reqs => {
    return reqs.filter(req => {
      return req.tipo.id == tipoRequerimientoId
    })
  }
}

export function filterByUsuarioAltaId(usuarioAltaId) {
  return reqs => {
    return reqs.filter(req => {
      return req.usuario.id == usuarioAltaId
    })
  }
}

// Set: https://dev.to/healeycodes/solving-puzzles-with-high-performance-javascript-3o4k
export function filterByUsuariosAsignados(usuariosAsignados) {
  return reqs => {
    // Crea un Set de valores con los id de los usuarios asignados.
    const usuariosAsignadosIds = new Set(usuariosAsignados.map(ua => ua.value))

    return reqs.filter(req => {
      // Si no tiene usuario asignado
      return usuariosAsignadosIds.has(req.estado.asignacion.usuario_id)
    })
  }
}

export function UpdatePendingPayloadPriorizarReq(requerimientos) {
  return requerimientos.map(req => {
    const result = {
      id: req.id,
      aprobado: req.estado_priorizacion.id == 2,
      comentario: req.comentario || null,
    }

    result.prioridad = req.prioridad

    return result
  })
}
