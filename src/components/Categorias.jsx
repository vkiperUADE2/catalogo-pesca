import { useEffect, useState } from 'react'

function obtenerCategoriasPorVista() {
  if (typeof window === 'undefined') return 4
  if (window.matchMedia('(max-width: 620px)').matches) return 1
  if (window.matchMedia('(max-width: 980px)').matches) return 2
  return 4
}

function Categorias({ categorias, seleccionarCategoria }) {
  const [inicio, setInicio] = useState(0)
  const [categoriasPorVista, setCategoriasPorVista] = useState(obtenerCategoriasPorVista)
  const ultimoInicio = Math.max(categorias.length - categoriasPorVista, 0)
  const inicioVisible = Math.min(inicio, ultimoInicio)

  useEffect(() => {
    function actualizarCategoriasPorVista() {
      setCategoriasPorVista(obtenerCategoriasPorVista())
    }

    actualizarCategoriasPorVista()
    window.addEventListener('resize', actualizarCategoriasPorVista)

    return () => window.removeEventListener('resize', actualizarCategoriasPorVista)
  }, [])

  function cambiarCategorias(direccion) {
    setInicio((inicioActual) => {
      const siguiente = Math.min(inicioActual, ultimoInicio) + direccion
      if (siguiente < 0) return 0
      if (siguiente > ultimoInicio) return ultimoInicio
      return siguiente
    })
  }

  return (
    <section id="catalogo">
      <span className="section-kicker">{'Cat\u00e1logo'}</span>
      <h2>Productos</h2>

      <div className="categorias-carousel">
        <button
          className="categoria-flecha"
          onClick={() => cambiarCategorias(-1)}
          disabled={inicioVisible === 0}
          aria-label="Ver categorias anteriores"
        >
          {'<'}
        </button>

        <div className="categorias-viewport">
          <div className="categorias-grid" style={{ '--indice-categoria': inicioVisible }}>
            {categorias.map((categoria) => (
              <a
                className={`categoria-card ${categoria.nombre === 'Boyas y L\u00edneas' ? 'categoria-card-larga' : ''}`}
                href={`/${categoria.slug}`}
                key={categoria.nombre}
                onClick={(event) => seleccionarCategoria(event, categoria.slug)}
              >
                {categoria.imagen ? (
                  <img src={categoria.imagen} alt={categoria.nombre} />
                ) : (
                <div className="categoria-placeholder" aria-hidden="true">
                  <span>{categoria.inicial}</span>
                </div>
              )}
              <h3>{categoria.nombre}</h3>
              {categoria.textoImagen && <small>{categoria.textoImagen}</small>}
            </a>
            ))}
          </div>
        </div>

        <button
          className="categoria-flecha"
          onClick={() => cambiarCategorias(1)}
          disabled={inicioVisible === ultimoInicio}
          aria-label="Ver mas categorias"
        >
          {'>'}
        </button>
      </div>
    </section>
  )
}

export default Categorias
