function Carrito({ abierto, cerrarCarrito }) {
  return (
    <aside className={abierto ? "carrito-panel abierto" : "carrito-panel"}>
      <div className="carrito-header">
        <h2>Carrito</h2>
        <button onClick={cerrarCarrito}>X</button>
      </div>

      <p>Todavía no agregaste productos al carrito.</p>

      <button className="whatsapp-btn">
        Consultar por WhatsApp
      </button>
    </aside>
  )
}

export default Carrito