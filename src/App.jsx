import Header from './components/Header'
import Productos from './components/Productos'
import Categorias from './components/Categorias'

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
      <Header />

      <main id="inicio">
        <section>
          <h2>Todo para tu próxima jornada de pesca</h2>
          <p>
            Artículos de pesca, accesorios y excursiones.
          </p>

          <button>Ver catálogo</button>
        </section>

        <Categorias categorias={categorias} />

        <Productos productos={productos} />
      </main>
    </div>
  )
}

export default App