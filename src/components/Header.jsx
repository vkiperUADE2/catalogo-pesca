import logo from '../assets/logo.png'

function Header({ abrirCarrito }) {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="Logo Pierre Bandenay" />
        <h1>Casa de Pesca Pierre Bandenay</h1>
      </div>

      <nav>
        <a href="#inicio">Inicio</a>
        <a href="#catalogo">Catálogo</a>
        <a href="#excursiones">Excursiones</a>
        <a href="#contacto">Contacto</a>
        <button className="carrito-btn" onClick={abrirCarrito}>
            🛒 Carrito
        </button>
      </nav>
    </header>
  )
}

export default Header