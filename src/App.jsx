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
import categoriaCanas from './assets/categoria-canas.jpg'
import categoriaReels from './assets/categoria-reels.jpg'
import categoriaBoyasLineas from './assets/categoria-boyas-lieneas.jpg'
import categoriaSenuelos from './assets/categoria-senuelos.jpg'
import categoriaCamping from './assets/categoria-camping.jpg'
import categoriaCarnada from './assets/catalogo-carnada.jpg'
import categoriaNautica from './assets/catalogo-nautica.jpg'
import categoriaAccesorios from './assets/catalogo-accesorios.jpg'

const categorias = [
  { nombre: 'Ca\u00f1as', slug: 'canas', inicial: 'CA', imagen: categoriaCanas },
  { nombre: 'Reeles', slug: 'reeles', inicial: 'RE', imagen: categoriaReels },
  { nombre: 'Boyas y L\u00edneas', slug: 'boyas-lineas', inicial: 'BL', imagen: categoriaBoyasLineas },
  { nombre: 'Se\u00f1uelos', slug: 'senuelos', inicial: 'SE', imagen: categoriaSenuelos },
  { nombre: 'Camping', slug: 'camping', inicial: 'CM', imagen: categoriaCamping },
  { nombre: 'Carnada', slug: 'carnada', inicial: 'CN', imagen: categoriaCarnada },
  { nombre: 'N\u00e1utica', slug: 'nautica', inicial: 'NA', imagen: categoriaNautica },
  { nombre: 'Accesorios', slug: 'accesorios', inicial: 'AC', imagen: categoriaAccesorios }
]

const subdivisionesCatalogo = {
  canas: [
    { nombre: 'Baitcasting', slug: 'baitcasting' },
    { nombre: 'Spinning', slug: 'spinning' },
    { nombre: 'Surfcasting', slug: 'surfcasting' },
    { nombre: 'Variada', slug: 'variada' },
    { nombre: 'Pejerrey', slug: 'pejerrey' },
    { nombre: 'Embarcado', slug: 'embarcado' }
  ],
  reeles: [
    { nombre: 'Frontal', slug: 'frontal' },
    { nombre: 'Rotativo', slug: 'rotativo' },
    { nombre: 'Baitcasting', slug: 'baitcasting' },
    { nombre: 'Pejerrey', slug: 'pejerrey' },
    { nombre: 'Embarcado', slug: 'embarcado' }
  ],
  'boyas-lineas': [
    { nombre: 'Boyas', slug: 'boyas' },
    { nombre: 'Lineas armadas', slug: 'lineas-armadas' },
    { nombre: 'Pejerrey', slug: 'pejerrey' },
    { nombre: 'Paternoster', slug: 'paternoster' },
    { nombre: 'Variada', slug: 'variada' }
  ],
  senuelos: [
    { nombre: 'Baitcast', slug: 'baitcast' },
    { nombre: 'Tararira', slug: 'tararira' },
    { nombre: 'Trolling', slug: 'trolling' },
    { nombre: 'Agua salada', slug: 'agua-salada' },
    { nombre: 'Cucharas y spinners', slug: 'cucharas-spinners' }
  ],
  camping: [
    { nombre: 'Sillas', slug: 'sillas' },
    { nombre: 'Conservadoras', slug: 'conservadoras' },
    { nombre: 'Linternas', slug: 'linternas' },
    { nombre: 'Mesas', slug: 'mesas' },
    { nombre: 'Bolsos termicos', slug: 'bolsos-termicos' }
  ],
  carnada: [
    { nombre: 'Mojarras', slug: 'mojarras' },
    { nombre: 'Lombrices', slug: 'lombrices' },
    { nombre: 'Filet', slug: 'filet' },
    { nombre: 'Masas', slug: 'masas' },
    { nombre: 'Artificial', slug: 'artificial' }
  ],
  nautica: [
    { nombre: 'Chalecos', slug: 'chalecos' },
    { nombre: 'Anclas', slug: 'anclas' },
    { nombre: 'Cabos', slug: 'cabos' },
    { nombre: 'Seguridad', slug: 'seguridad' },
    { nombre: 'Embarcacion', slug: 'embarcacion' }
  ],
  accesorios: [
    { nombre: 'Cajas', slug: 'cajas' },
    { nombre: 'Pinzas y tijeras', slug: 'pinzas-tijeras' },
    { nombre: 'Plomadas', slug: 'plomadas' },
    { nombre: 'Anzuelos', slug: 'anzuelos' },
    { nombre: 'Mosquetones', slug: 'mosquetones' }
  ]
}

const imagenesPorCategoria = {
  Ca\u00f1as: canaPejerrey,
  Reeles: reelFrontalLiviano,
  'Boyas y L\u00edneas': lineaTresBoyas,
  Se\u00f1uelos: categoriaSenuelos,
  Camping: categoriaCamping,
  Carnada: categoriaCarnada,
  N\u00e1utica: categoriaNautica,
  Accesorios: categoriaAccesorios
}

const productosPorCategoria = {
  Ca\u00f1as: [
    ['Ca\u00f1a pejerrey telesc\u00f3pica', 45000, 'pejerrey'],
    ['Ca\u00f1a variada embarcada', 52000, 'embarcado'],
    ['Ca\u00f1a baitcast carbono', 68000, 'baitcasting'],
    ['Ca\u00f1a surfcasting 3.90 m', 79000, 'surfcasting'],
    ['Ca\u00f1a spinning liviana', 41000, 'spinning']
  ],
  Reeles: [
    ['Reel frontal liviano', 38000, 'frontal'],
    ['Reel rotativo perfil bajo', 62000, 'rotativo'],
    ['Reel baitcasting compacto', 62000, 'baitcasting'],
    ['Reel pejerrey micro', 33000, 'pejerrey'],
    ['Reel embarcado reforzado', 74000, 'embarcado']
  ],
  'Boyas y L\u00edneas': [
    ['L\u00ednea pejerrey 3 boyas', 9500, 'pejerrey'],
    ['Boyas chupetonas surtidas', 7200, 'boyas'],
    ['L\u00ednea paternoster armada', 8800, 'paternoster'],
    ['Boyas palito combinadas', 6900, 'boyas'],
    ['L\u00ednea variada laguna', 8300, 'variada']
  ],
  Se\u00f1uelos: [
    ['Se\u00f1uelo minnow floating', 12500, 'baitcast'],
    ['Cuchara ondulante plateada', 6800, 'cucharas-spinners'],
    ['Spinner dorado mediano', 7400, 'cucharas-spinners'],
    ['Se\u00f1uelo tararira superficie', 11800, 'tararira'],
    ['Se\u00f1uelo trolling profundo', 15600, 'trolling']
  ],
  Camping: [
    ['Silla plegable reforzada', 36000, 'sillas'],
    ['Conservadora 24 litros', 58000, 'conservadoras'],
    ['Linterna led recargable', 19000, 'linternas'],
    ['Mesa plegable compacta', 42000, 'mesas'],
    ['Bolso termico outdoor', 31000, 'bolsos-termicos']
  ],
  Carnada: [
    ['Mojarra seleccionada', 6500, 'mojarras'],
    ['Lombriz californiana', 4200, 'lombrices'],
    ['Filet preparado para variada', 5900, 'filet'],
    ['Masa saborizada', 3600, 'masas'],
    ['Carnada artificial soft', 7800, 'artificial']
  ],
  N\u00e1utica: [
    ['Chaleco salvavidas adulto', 49000, 'chalecos'],
    ['Ancla plegable chica', 28000, 'anclas'],
    ['Cabo nautico 10 metros', 14500, 'cabos'],
    ['Balde achicador reforzado', 9800, 'embarcacion'],
    ['Kit seguridad embarcado', 67000, 'seguridad']
  ],
  Accesorios: [
    ['Caja organizadora doble', 22000, 'cajas'],
    ['Pinza multifuncion pesca', 15500, 'pinzas-tijeras'],
    ['Plomadas surtidas', 5200, 'plomadas'],
    ['Anzuelos reforzados pack', 4300, 'anzuelos'],
    ['Mosquetones con esmerillon', 3900, 'mosquetones']
  ]
}

const productos = categorias.flatMap((categoria, categoriaIndex) =>
  productosPorCategoria[categoria.nombre].map(([nombre, precio, subcategoria], productoIndex) => ({
    id: categoriaIndex * 100 + productoIndex + 1,
    nombre,
    categoria: categoria.nombre,
    categoriaSlug: categoria.slug,
    subcategoria,
    precio,
    imagen: imagenesPorCategoria[categoria.nombre]
  }))
)

const productosDestacados = [
  productos[0],
  productos[5],
  productos[10]
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 2C6.55 2 2.08 6.45 2.08 11.92c0 1.92.55 3.72 1.52 5.24L2 22l4.98-1.55a9.9 9.9 0 0 0 5.06 1.39c5.49 0 9.96-4.45 9.96-9.92S17.53 2 12.04 2Zm0 18.18c-1.63 0-3.15-.47-4.43-1.28l-.32-.2-2.7.84.87-2.61-.21-.34a8.12 8.12 0 0 1-1.5-4.67c0-4.56 3.72-8.26 8.29-8.26 4.58 0 8.3 3.7 8.3 8.26s-3.72 8.26-8.3 8.26Zm4.78-6.15c-.26-.13-1.55-.76-1.79-.85-.24-.09-.42-.13-.6.13-.17.26-.68.85-.83 1.02-.15.17-.31.19-.57.06-.26-.13-1.1-.4-2.1-1.29-.78-.69-1.3-1.54-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.6-1.43-.82-1.96-.22-.51-.44-.44-.6-.45h-.51c-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.5 1.05 2.67c.13.17 1.82 2.78 4.41 3.89.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.55-.63 1.77-1.24.22-.61.22-1.14.15-1.24-.06-.11-.24-.18-.5-.31Z" />
    </svg>
  )
}

function obtenerRutaActual() {
  return window.location.pathname.replace(/^\/+|\/+$/g, '')
}

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [carrito, setCarrito] = useState([])
  const [bannerActivo, setBannerActivo] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [rutaActual, setRutaActual] = useState(obtenerRutaActual)

  const [categoriaRuta, subcategoriaRuta] = rutaActual.split('/')
  const categoriaActiva = categorias.find(
    (categoria) => categoria.slug === categoriaRuta
  )
  const subcategoriaActiva = categoriaActiva
    ? subdivisionesCatalogo[categoriaActiva.slug]?.find(
        (subcategoria) => subcategoria.slug === subcategoriaRuta
      )
    : null

  const cantidadCarrito = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  )

  const busquedaNormalizada = busqueda.trim().toLowerCase()
  const productosHome = busquedaNormalizada
    ? productos.filter((producto) =>
        [producto.nombre, producto.categoria]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : productosDestacados

  const productosCategoria = categoriaActiva
    ? productos.filter((producto) => {
        const coincideCategoria = producto.categoria === categoriaActiva.nombre
        const coincideSubcategoria = subcategoriaActiva
          ? producto.subcategoria === subcategoriaActiva.slug
          : true

        return coincideCategoria && coincideSubcategoria
      })
    : []

  const productosCategoriaFiltrados = busquedaNormalizada
    ? productosCategoria.filter((producto) =>
        [producto.nombre, producto.categoria]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : productosCategoria

  const excursionesFiltradas = busquedaNormalizada
    ? excursiones.filter((excursion) =>
        [excursion.titulo, excursion.descripcion]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : excursiones

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActivo((bannerActual) => (bannerActual + 1) % banners.length)
    }, 5200)

    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    function actualizarRuta() {
      setRutaActual(obtenerRutaActual())
    }

    window.addEventListener('popstate', actualizarRuta)
    return () => window.removeEventListener('popstate', actualizarRuta)
  }, [])

  function navegarA(ruta) {
    window.history.pushState({}, '', ruta)
    setRutaActual(obtenerRutaActual())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function seleccionarCategoria(event, slug) {
    event.preventDefault()
    setBusqueda('')
    navegarA(`/${slug}`)
  }

  function seleccionarSubcategoria(event, categoriaSlug, subcategoriaSlug) {
    event.preventDefault()
    setBusqueda('')
    navegarA(`/${categoriaSlug}/${subcategoriaSlug}`)
  }

  function navegarASeccion(event, seccion) {
    event.preventDefault()
    setBusqueda('')
    window.history.pushState({}, '', `/#${seccion}`)
    setRutaActual('')

    window.setTimeout(() => {
      document.getElementById(seccion)?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

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
        busqueda={busqueda}
        cambiarBusqueda={setBusqueda}
        navegarASeccion={navegarASeccion}
        categorias={categorias}
        subdivisionesCatalogo={subdivisionesCatalogo}
        seleccionarCategoria={seleccionarCategoria}
        seleccionarSubcategoria={seleccionarSubcategoria}
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

      <a
        className="whatsapp-flotante"
        href="https://wa.me/1178929344"
        target="_blank"
        rel="noreferrer"
        aria-label="Consultar por WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      <main id="inicio">
        {categoriaActiva ? (
          <section className="categoria-productos-page">
            <div className="categoria-page-header">
              <button className="volver-catalogo-btn" onClick={() => navegarA('/')}>
                {'< Volver al inicio'}
              </button>
              <span className="section-kicker">
                {'Inicio > '}
                {categoriaActiva.nombre}
                {subcategoriaActiva ? ` > ${subcategoriaActiva.nombre}` : ''}
              </span>
              <h2>{subcategoriaActiva?.nombre || categoriaActiva.nombre}</h2>
            </div>

            <Productos
              productos={productosCategoriaFiltrados}
              agregarAlCarrito={agregarAlCarrito}
              titulo=""
              vacio="No encontramos productos en esta categoria."
            />
          </section>
        ) : (
          <>
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

            <Categorias
              categorias={categorias}
              seleccionarCategoria={seleccionarCategoria}
            />

            <Productos
              productos={productosHome}
              agregarAlCarrito={agregarAlCarrito}
              titulo={busquedaNormalizada ? 'Resultados de busqueda' : 'Productos destacados'}
            />

            <Excursiones excursiones={excursionesFiltradas} telefono={telefonoWhatsApp} />

            <Contacto telefono={telefonoWhatsApp} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
