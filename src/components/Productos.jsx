function Productos({ productos, agregarAlCarrito }) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')

  return (
    <section>
      <h2>Productos destacados</h2>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <div className="producto-imagen"></div>

            <h3>{producto.nombre}</h3>

            <p>{producto.categoria}</p>

            <h4>${formatoPrecio.format(producto.precio)}</h4>

            <button onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Productos
