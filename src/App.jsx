import { useEffect, useState } from 'react'
import Header from './components/Header'
import Productos from './components/Productos'
import Categorias from './components/Categorias'
import Excursiones from './components/Excursiones'
import Carrito from './components/Carrito'
import Contacto from './components/Contacto'
import hero from './assets/hero.jpg'
import canaPejerrey from './assets/cana-pejerrey.jpg'
import reelFrontalLiviano from './assets/reel-frontal-liviano.jpg'
import lineaTresBoyas from './assets/linea-3-boyas.jpg'
import excursionPejerrey from './assets/excursion-pejerrey.jpg'
import pescaGuiada from './assets/pesca-guiada.jpg'

const categorias = [
  { nombre: 'Ca\u00f1as', inicial: 'CA', textoImagen: 'Foto vertical pendiente' },
  { nombre: 'Reeles', inicial: 'RE', textoImagen: 'Foto vertical pendiente' },
  { nombre: 'Boyas y L\u00edneas', inicial: 'BL', textoImagen: 'Foto vertical pendiente' },
  { nombre: 'Se\u00f1uelos', inicial: 'SE', textoImagen: 'Foto vertical pendiente' },
  { nombre: 'Camping', inicial: 'CO', textoImagen: 'Foto vertical pendiente' },
  { nombre: 'Indumentaria', inicial: 'IN', textoImagen: 'Foto vertical pendiente' }
]

const productos = [
  {
    id: 1,
    nombre: 'Ca\u00f1a pejerrey telesc\u00f3pica',
    categoria: 'Ca\u00f1as',
    precio: 45000,
    imagen: canaPejerrey
  },
  {
    id: 2,
    nombre: 'Reel frontal liviano',
    categoria: 'Reeles',
    precio: 38000,
    imagen: reelFrontalLiviano
  },
  {
    id: 3,
    nombre: 'L\u00ednea pejerrey 3 boyas',
    categoria: 'Boyas y L\u00edneas',
    precio: 9500,
    imagen: lineaTresBoyas
  }
]

const excursiones = [
  {
    id: 1,
    titulo: 'Excursi\u00f3n de pejerrey',
    descripcion: 'Salidas de pesca embarcada para temporada de pejerrey.',
    imagen: excursionPejerrey
  },
  {
    id: 2,
    titulo: 'Salida de pesca guiada',
    descripcion: 'Consult\u00e1 fechas disponibles, horarios y condiciones.',
    imagen: pescaGuiada
  }
]

const banners = [
  {
    etiqueta: 'Casa de Pesca Pierre Bandenay',
    titulo: 'Todo para tu pr\u00f3xima jornada de pesca',
    texto: 'Art\u00edculos de pesca, accesorios, camping e indumentaria para preparar la salida con confianza.',
    boton: 'Ver cat\u00e1logo',
    href: '#catalogo',
    imagen: hero
  },
  {
    etiqueta: 'Beneficios',
    titulo: 'Compr\u00e1 mejor en el local',
    texto: 'Env\u00edo gratis desde $100.000, 3 cuotas sin inter\u00e9s desde $100.000 y 10% OFF abonando en efectivo o transferencia.',
    boton: 'Consultar promos',
    href: '#contacto'
  },
  {
    etiqueta: 'Pr\u00f3ximo banner',
    titulo: 'Espacio listo para imagen',
    texto: 'Cuando tengas la foto del cliente, la cargamos en src/assets y la conectamos ac\u00e1.',
    boton: 'Contactar',
    href: '#contacto'
  }
]

const telefonoWhatsApp = '5491178929344'

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [carrito, setCarrito] = useState([])
  const [bannerActivo, setBannerActivo] = useState(0)

  const cantidadCarrito = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  )

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActivo((bannerActual) => (bannerActual + 1) % banners.length)
    }, 5200)

    return () => clearInterval(intervalo)
  }, [])

  function cambiarBanner(direccion) {
    setBannerActivo((bannerActual) => {
      const siguiente = bannerActual + direccion
      if (siguiente < 0) return banners.length - 1
      if (siguiente >= banners.length) return 0
      return siguiente
    })
  }

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
  }

  function sumarProducto(id) {
    const carritoActualizado = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    )

    setCarrito(carritoActualizado)
  }

  function restarProducto(id) {
    const carritoActualizado = carrito
      .map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
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
        <section className="hero-section">
          {banners.map((banner, index) => (
            <div
              className={`hero-slide ${bannerActivo === index ? 'activo' : ''}`}
              key={banner.titulo}
              style={
                banner.imagen
                  ? { backgroundImage: `url(${banner.imagen})` }
                  : undefined
              }
            />
          ))}

          <div className="hero-overlay">
            <div className="hero-content">
              <span className="hero-kicker">
                {banners[bannerActivo].etiqueta}
              </span>

              <h2>{banners[bannerActivo].titulo}</h2>

              <p>{banners[bannerActivo].texto}</p>

              <a href={banners[bannerActivo].href}>
                <button>{banners[bannerActivo].boton}</button>
              </a>
            </div>

            <div className="hero-controls" aria-label="Controles del banner">
              <button onClick={() => cambiarBanner(-1)} aria-label="Banner anterior">
                {'<'}
              </button>
              <div className="hero-dots">
                {banners.map((banner, index) => (
                  <button
                    className={bannerActivo === index ? 'activo' : ''}
                    key={banner.titulo}
                    onClick={() => setBannerActivo(index)}
                    aria-label={`Ver banner ${index + 1}`}
                  />
                ))}
              </div>
              <button onClick={() => cambiarBanner(1)} aria-label="Banner siguiente">
                {'>'}
              </button>
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
