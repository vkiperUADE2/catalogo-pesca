import { useState } from 'react'
import Header from './components/Header'
import Productos from './components/Productos'
import Categorias from './components/Categorias'
import Excursiones from './components/Excursiones'
import Carrito from './components/Carrito'
import Contacto from './components/Contacto'
import hero from './assets/hero.jpg'

const categorias = [
  'Cañas',
  'Reeles',
  'Boyas y Líneas',
  'Señuelos',
  'Camping',
  'Excursiones'
]

const productos = [
  {
    id: 1,
    nombre: 'Caña pejerrey telescópica',
    categoria: 'Cañas',
    precio: 45000
  },
  {
    id: 2,
    nombre: 'Reel frontal liviano',
    categoria: 'Reeles',
    precio: 38000
  },
  {
    id: 3,
    nombre: 'Línea pejerrey 3 boyas',
    categoria: 'Boyas y Líneas',
    precio: 9500
  }
]

const excursiones = [
  {
    id: 1,
    titulo: 'Excursión de pejerrey',
    descripcion: 'Salidas de pesca embarcada para temporada de pejerrey.'
  },
  {
    id: 2,
    titulo: 'Salida de pesca guiada',
    descripcion: 'Consultá fechas disponibles, horarios y condiciones.'
  }
]

const telefonoWhatsApp = '5491178929344'

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [carrito, setCarrito] = useState([])

  const cantidadCarrito = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  )

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find((item) => item.id === producto.id)

    if (productoExistente) {
      const carritoActualizado = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )

      setCarrito(carritoActualizado)
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }

    setCarritoAbierto(true)
  }

  function sumarProducto(id) {
    const carritoActualizado = carrito.map((item) =>
      item.id === id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    )

    setCarrito(carritoActualizado)
  }

  function restarProducto(id) {
    const carritoActualizado = carrito
      .map((item) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter((item) => item.cantidad > 0)

    setCarrito(carritoActualizado)
  }

  function eliminarProducto(id) {
    const carritoActualizado = carrito.filter((item) => item.id !== id)

    setCarrito(carritoActualizado)
  }

  return (
    <div>
      <Header
        abrirCarrito={() => setCarritoAbierto(true)}
        cantidadCarrito={cantidadCarrito}
      />

      <Carrito
        abierto={carritoAbierto}
        cerrarCarrito={() => setCarritoAbierto(false)}
        carrito={carrito}
        sumarProducto={sumarProducto}
        restarProducto={restarProducto}
        eliminarProducto={eliminarProducto}
        telefono={telefonoWhatsApp}
      />

      <main id="inicio">
        <section
          className="hero-section"
          style={{
            backgroundImage: `url(${hero})`
          }}
        >
          <div className="hero-overlay">
            <div className="hero-content">
              <span className="hero-kicker">Casa de Pesca Pierre Bandenay</span>

              <h2>Todo para tu próxima jornada de pesca</h2>

              <p>
                Artículos de pesca, accesorios y
                excursiones para preparar la salida con confianza.
              </p>

              <a href="#catalogo">
                <button>Ver catálogo</button>
              </a>
            </div>
          </div>
        </section>

        <Categorias categorias={categorias} />

        <Productos
          productos={productos}
          agregarAlCarrito={agregarAlCarrito}
        />

        <Excursiones excursiones={excursiones} telefono={telefonoWhatsApp} />

        <Contacto telefono={telefonoWhatsApp} />
      </main>
    </div>
  )
}

export default App
