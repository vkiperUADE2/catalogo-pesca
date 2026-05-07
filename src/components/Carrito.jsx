function Carrito({
  abierto,
  cerrarCarrito,
  carrito,
  sumarProducto,
  restarProducto,
  eliminarProducto
}) {
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const telefono = "5491178929344"

  const mensaje = carrito
    .map((item) => `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`)
    .join("\n")

  const mensajeFinal = `Hola, quiero consultar por estos productos:\n\n${mensaje}\n\nTotal aproximado: $${total}`

  const linkWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeFinal)}`

  return (
    <aside className={abierto ? "carrito-panel abierto" : "carrito-panel"}>
      <div className="carrito-header">
        <h2>Carrito</h2>

        <button onClick={cerrarCarrito}>
          X
        </button>
      </div>

      {carrito.length === 0 ? (
        <p>Todavía no agregaste productos.</p>
      ) : (
        <div className="carrito-items">
          {carrito.map((producto) => (
            <div className="carrito-item" key={producto.id}>
              <h4>{producto.nombre}</h4>

              <p>
                ${producto.precio} x {producto.cantidad}
              </p>

              <h5>
                ${producto.precio * producto.cantidad}
              </h5>

              <div className="carrito-controles">
                <button onClick={() => restarProducto(producto.id)}>
                  -
                </button>

                <span>{producto.cantidad}</span>

                <button onClick={() => sumarProducto(producto.id)}>
                  +
                </button>

                <button
                  className="eliminar-btn"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <div className="carrito-total">
            <h3>Total: ${total}</h3>

            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noreferrer"
            >
              <button className="whatsapp-btn">
                Consultar por WhatsApp
              </button>
            </a>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Carrito