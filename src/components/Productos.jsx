import { useEffect, useRef, useState } from 'react'

function Productos({ productos, agregarAlCarrito }) {
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
    <section className="productos-section">
      <h2>Productos destacados</h2>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <div className="producto-imagen"></div>

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
    </section>
  )
}

export default Productos
