function Productos({
  productos,
  titulo = 'Productos destacados',
  vacio = 'No encontramos productos con esa busqueda.',
  verProducto
}) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')

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
                onClick={(event) => {
                  event.stopPropagation()
                  verProducto?.(producto)
                }}
              >
                Ver producto
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Productos
