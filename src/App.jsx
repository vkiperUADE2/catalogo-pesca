import logo from './assets/logo.png'

const categorias = [
  "Cañas",
  "Reeles",
  "Boyas y Líneas",
  "Señuelos",
  "Camping",
  "Excursiones"
]

const productos = [
  {
    id: 1,
    nombre: "Caña pejerrey telescópica",
    categoria: "Cañas",
    precio: 45000
  },
  {
    id: 2,
    nombre: "Reel frontal liviano",
    categoria: "Reeles",
    precio: 38000
  },
  {
    id: 3,
    nombre: "Línea pejerrey 3 boyas",
    categoria: "Boyas y Líneas",
    precio: 9500
  }
]

function App() {
  return (
    <div>
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
        </nav>
      </header>

      <main id="inicio">
        <section>
          <h2>Todo para tu próxima jornada de pesca</h2>
          <p>
            Artículos de pesca, accesorios y excursiones.
          </p>

          <button>Ver catálogo</button>
        </section>

        <section id="catalogo">
          <h2>Categorías</h2>

          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <div className="categoria-card" key={categoria}>
                <h3>{categoria}</h3>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Productos destacados</h2>

          <div className="productos-grid">
            {productos.map((producto) => (
              <div className="producto-card" key={producto.id}>
                <div className="producto-imagen"></div>

                <h3>{producto.nombre}</h3>

                <p>{producto.categoria}</p>

                <h4>${producto.precio}</h4>

                <button>Consultar por WhatsApp</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App