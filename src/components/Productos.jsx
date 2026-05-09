import { useEffect, useRef, useState } from 'react'

function Productos({
  productos,
  agregarAlCarrito,
  titulo = 'Productos destacados',
  vacio = 'No encontramos productos con esa busqueda.'
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
            <div className="producto-card" key={producto.id}>
              <img
                className="producto-imagen"
                src={producto.imagen}
                alt={producto.nombre}
              />

              <h3>{producto.nombre}</h3>

              <p>{producto.categoria}</p>

              <h4>${formatoPrecio.format(producto.precio)}</h4>

              <button
                className={productoAgregadoId === producto.id ? 'producto-agregado-btn' : ''}
                onClick={() => manejarAgregar(producto)}
              >
                {productoAgregadoId === producto.id
                  ? 'Agregado correctamente'
                  : 'Agregar al carrito'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Productos
