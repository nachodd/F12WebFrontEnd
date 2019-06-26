export function filterByAsuntoAndDescripcion(reqs, descripcion) {
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
