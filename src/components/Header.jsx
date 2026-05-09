import logo from '../assets/logo.png'

function Header({
  abrirCarrito,
  cantidadCarrito,
  busqueda,
  cambiarBusqueda,
  navegarASeccion,
  categorias,
  subdivisionesCatalogo,
  seleccionarCategoria,
  seleccionarSubcategoria
}) {
  return (
    <header>
      <div className="promo-carousel" aria-label="Promociones">
        <div className="promo-carousel-track">
          <span className="promo-mensaje envio">
            <span className="promo-icono" aria-hidden="true">🚚</span>
            {'Env\u00edo gratis desde $100.000'}
          </span>
          <span className="promo-mensaje destacado">
            <span className="promo-icono" aria-hidden="true">💸</span>
            10% OFF transferencia/efectivo
          </span>
          <span className="promo-mensaje cuotas">
            <span className="promo-icono" aria-hidden="true">💳</span>
            {'3 cuotas sin inter\u00e9s desde $100.000'}
          </span>
          <span className="promo-mensaje envio" aria-hidden="true">
            <span className="promo-icono" aria-hidden="true">🚚</span>
            {'Env\u00edo gratis desde $100.000'}
          </span>
        </div>
      </div>

      <div className="header-main">
        <div className="header-left">
          <label className="search-box" aria-label="Buscar en la pagina">
            <input
              type="search"
              placeholder={'\u00bfQu\u00e9 est\u00e1s buscando?'}
              value={busqueda}
              onChange={(event) => cambiarBusqueda(event.target.value)}
            />
            <span>Buscar</span>
          </label>

          <nav>
            <a href="/#inicio" onClick={(event) => navegarASeccion(event, 'inicio')}>
              Inicio
            </a>
            <div className="catalogo-menu-wrap">
              <a href="/#catalogo" onClick={(event) => navegarASeccion(event, 'catalogo')}>
                {'Cat\u00e1logo'}
              </a>

              <div className="mega-menu">
                <div className="mega-menu-inner">
                  {categorias.map((categoria) => (
                    <div className="mega-menu-col" key={categoria.slug}>
                      <a
                        className="mega-menu-title"
                        href={`/${categoria.slug}`}
                        onClick={(event) => seleccionarCategoria(event, categoria.slug)}
                      >
                        {categoria.nombre}
                      </a>

                      {(subdivisionesCatalogo[categoria.slug] || []).map((subcategoria) => (
                        <a
                          className="mega-menu-link"
                          href={`/${categoria.slug}/${subcategoria.slug}`}
                          key={subcategoria.slug}
                          onClick={(event) =>
                            seleccionarSubcategoria(
                              event,
                              categoria.slug,
                              subcategoria.slug
                            )
                          }
                        >
                          {subcategoria.nombre}
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <a href="/#excursiones" onClick={(event) => navegarASeccion(event, 'excursiones')}>
              Excursiones
            </a>
            <a href="/#contacto" onClick={(event) => navegarASeccion(event, 'contacto')}>
              Contacto
            </a>
          </nav>
        </div>

        <a
          className="logo-container"
          href="/#inicio"
          aria-label="Ir al inicio"
          onClick={(event) => navegarASeccion(event, 'inicio')}
        >
          <img src={logo} alt="Logo Pierre Bandenay" />
          <h1>
            <span>Pierre</span>
            <span>Bandenay</span>
          </h1>
        </a>

        <div className="header-right">
          <button className="carrito-btn" onClick={abrirCarrito}>
            <span aria-hidden="true">🛒</span>
            Carrito
            {cantidadCarrito > 0 && (
              <span className="carrito-badge">{cantidadCarrito}</span>
            )}
          </button>
        </div>
      </div>

    </header>
  )
}

export default Header
