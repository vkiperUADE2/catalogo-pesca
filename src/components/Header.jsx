import logo from '../assets/logo.png'

function Header({ abrirCarrito, cantidadCarrito }) {
  return (
    <header>
      <div className="header-main">
        <div className="header-left">
          <label className="search-box" aria-label="Buscar en el catalogo">
            <input type="search" placeholder={'\u00bfQu\u00e9 est\u00e1s buscando?'} />
            <span>Buscar</span>
          </label>

          <nav>
            <a href="#inicio">Inicio</a>
            <a href="#catalogo">{'Cat\u00e1logo'}</a>
            <a href="#excursiones">Excursiones</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>

        <a className="logo-container" href="#inicio" aria-label="Ir al inicio">
          <img src={logo} alt="Logo Pierre Bandenay" />
          <h1>
            <span>Pierre</span>
            <span>Bandenay</span>
          </h1>
        </a>

        <div className="header-right">
          <button className="carrito-btn" onClick={abrirCarrito}>
            <span className="carrito-icon" aria-hidden="true">[]</span>
            Consulta
            {cantidadCarrito > 0 && (
              <span className="carrito-badge">{cantidadCarrito}</span>
            )}
          </button>

          <div className="header-benefits" aria-label="Beneficios de compra">
            <span>10% OFF efectivo</span>
            <span>{'3 cuotas sin inter\u00e9s'}</span>
            <span>{'Env\u00edo gratis CABA'}</span>
          </div>
        </div>
      </div>

      <div className="promo-strip" aria-label="Promociones">
        <span>{'Env\u00edo gratis desde $100.000'}</span>
        <span>{'3 cuotas sin inter\u00e9s desde $100.000'}</span>
        <span>10% OFF transferencia/efectivo</span>
      </div>
    </header>
  )
}

export default Header
