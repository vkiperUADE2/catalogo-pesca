function Productos({ productos }) {
  return (
    <section>
      <h2>Productos destacados</h2>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div className="producto-card" key={producto.id}>
            <div className="producto-imagen"></div>

            <h3>{producto.nombre}</h3>

            <p>{producto.categoria}</p>

            <h4>${producto.precio}</h4>

            <button>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Productos