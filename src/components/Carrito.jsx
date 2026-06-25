import { useEffect } from 'react'

function Carrito({
  abierto,
  cerrarCarrito,
  carrito,
  sumarProducto,
  restarProducto,
  eliminarProducto,
  telefono
}) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')

  useEffect(() => {
    if (!abierto) return undefined

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflowAnterior
    }
  }, [abierto])

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )

  const mensaje = carrito
    .map((item) => (
      `${item.nombre}${item.color ? ` (${item.color})` : ''} x${item.cantidad} - $${formatoPrecio.format(item.precio * item.cantidad)}`
    ))
    .join('\n')

  const mensajeFinal = `Hola, quiero consultar por estos productos:\n\n${mensaje}\n\nTotal aproximado: $${formatoPrecio.format(total)}`

  const linkWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensajeFinal)}`

  return (
    <>
      {abierto && (
        <button
          className="carrito-backdrop"
          aria-label="Cerrar carrito"
          onClick={cerrarCarrito}
        />
      )}

      <aside className={abierto ? 'carrito-panel abierto' : 'carrito-panel'}>
        <div className="carrito-header">
          <div>
            <span>Pedido por WhatsApp</span>
            <h2>Carrito</h2>
          </div>

          <button className="cerrar-carrito-btn" onClick={cerrarCarrito}>
            X
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <p>Todavía no agregaste productos.</p>
          </div>
        ) : (
          <div className="carrito-items">
            {carrito.map((producto) => (
              <div className="carrito-item" key={producto.cartItemId}>
                <h4>{producto.nombre}</h4>
                {producto.color && (
                  <span className="carrito-color">Color: {producto.color}</span>
                )}

                <p>
                  ${formatoPrecio.format(producto.precio)} x {producto.cantidad}
                </p>

                <h5>
                  ${formatoPrecio.format(producto.precio * producto.cantidad)}
                </h5>

                <div className="carrito-controles">
                  <button onClick={() => restarProducto(producto.cartItemId)}>
                    -
                  </button>

                  <span>{producto.cantidad}</span>

                  <button onClick={() => sumarProducto(producto.cartItemId)}>
                    +
                  </button>

                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarProducto(producto.cartItemId)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="carrito-total">
              <h3>Total: ${formatoPrecio.format(total)}</h3>

              <a
                href={linkWhatsApp}
                target="_blank"
                rel="noreferrer"
              >
                <button className="whatsapp-btn">
                  Confirmar compra
                </button>
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default Carrito
