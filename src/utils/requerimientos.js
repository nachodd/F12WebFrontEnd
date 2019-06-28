/* export function filterByAsuntoAndDescripcion(reqs, descripcion) {
  const searchString = descripcion.toLowerCase()
  return reqs.filter(req => {
    return (
      req.asunto.toLowerCase().includes(searchString) ||
      req.descripcion.toLowerCase().includes(searchString)
    )
  })
}
export function filterBySistema(reqs, sistemaId) {
  return reqs.filter(req => {
    return req.sistema.id == sistemaId
  })
}

export function filterByTipoRequerimiento(reqs, tipoRequerimientoId) {
  return reqs.filter(req => {
    return req.tipo.id == tipoRequerimientoId
  })
}

export function filterByTipoRequerimiento(reqs, tipoRequerimientoId) {
  return reqs.filter(req => {
    return req.tipo.id == tipoRequerimientoId
  })
} */

export function filterByAsuntoAndDescripcion(descripcion) {
  return reqs => {
    const searchString = descripcion.toLowerCase()
    return reqs.filter(req => {
      return (
        req.asunto.toLowerCase().includes(searchString) ||
        req.descripcion.toLowerCase().includes(searchString)
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
