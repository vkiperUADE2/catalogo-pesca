import Header from './components/Header'
import Productos from './components/Productos'
import Categorias from './components/Categorias'
import Excursiones from './components/Excursiones'
import Carrito from './components/Carrito'
import { useState } from 'react'

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

const excursiones = [
  {
    id: 1,
    titulo: "Excursión de pejerrey",
    descripcion: "Salidas de pesca embarcada para temporada de pejerrey."
  },
  {
    id: 2,
    titulo: "Salida de pesca guiada",
    descripcion: "Consultá fechas disponibles, horarios y condiciones."
  }
]

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  return (
    <div>
      <Header abrirCarrito={() => setCarritoAbierto(true)} />

      <Carrito 
        abierto={carritoAbierto}
        cerrarCarrito={() => setCarritoAbierto(false)}
      />

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

        <Excursiones excursiones={excursiones} />
      </main>
    </div>
  )
}

export default App