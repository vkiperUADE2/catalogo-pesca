import logo from '../assets/logo.png'

function Header({ abrirCarrito, cantidadCarrito }) {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="Logo Pierre Bandenay" />
        <h1>PierreBandenay</h1>
      </div>

      <nav>
        <a href="#inicio">Inicio</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#excursiones">Excursiones</a>
        <a href="#contacto">Contacto</a>
        <button className="carrito-btn" onClick={abrirCarrito}>
          Carrito
          {cantidadCarrito > 0 && (
            <span className="carrito-badge">{cantidadCarrito}</span>
          )}
        </button>
      </nav>
    </header>
  )
}

export default Header
