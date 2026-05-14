import { useEffect, useRef, useState } from 'react'

function Productos({
  productos,
  agregarAlCarrito,
  titulo = 'Productos destacados',
  vacio = 'No encontramos productos con esa busqueda.',
  verProducto
}) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')
  const [productoAgregadoId, setProductoAgregadoId] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  function manejarAgregar(producto) {
    agregarAlCarrito(producto)
    setProductoAgregadoId(producto.id)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setProductoAgregadoId(null)
    }, 1500)
  }

  return (
    <section className="productos-section" id="productos">
      {titulo && <h2>{titulo}</h2>}

      {productos.length === 0 ? (
        <p className="sin-resultados">{vacio}</p>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <article
              className="producto-card"
              key={producto.id}
              onClick={() => verProducto?.(producto)}
            >
              {producto.imagen ? (
                <img
                  className="producto-imagen"
                  src={producto.imagen}
                  alt={producto.nombre}
                />
              ) : (
                <div className="producto-imagen producto-imagen-placeholder" />
              )}

              <h3>{producto.nombre}</h3>

              <p>
                {producto.categoria}
                {producto.subcategoriaNombre ? ` > ${producto.subcategoriaNombre}` : ''}
              </p>

              <h4>${formatoPrecio.format(producto.precio)}</h4>

              <button
                className={productoAgregadoId === producto.id ? 'producto-agregado-btn' : ''}
                onClick={(event) => {
                  event.stopPropagation()
                  manejarAgregar(producto)
                }}
              >
                {productoAgregadoId === producto.id
                  ? 'Agregado correctamente'
                  : 'Agregar al carrito'}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Productos
