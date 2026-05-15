import { useEffect, useState } from 'react'
import Header from './components/Header'
import Productos from './components/Productos'
import Categorias from './components/Categorias'
import Excursiones from './components/Excursiones'
import Carrito from './components/Carrito'
import Contacto from './components/Contacto'
import Admin from './components/Admin'
import bannerLocal from './assets/banner-local.png'
import bannerLocalMobile from './assets/banner-local-mobile.png'
import segundoBanner from './assets/segundo-banner.png'
import segundoBannerMobile from './assets/segundo-banner-mobile.png'
import tercerBanner from './assets/tercer-banner.png'
import tercerBannerMobile from './assets/tercer-banner-mobile.jpg'
import categoriaCanas from './assets/categoria-canas.jpg'
import categoriaReels from './assets/categoria-reels.jpg'
import categoriaBoyasLineas from './assets/categoria-boyas-lieneas.jpg'
import categoriaSenuelos from './assets/categoria-senuelos.jpg'
import categoriaCamping from './assets/categoria-camping.jpg'
import categoriaCarnada from './assets/catalogo-carnada.jpg'
import categoriaNautica from './assets/catalogo-nautica.jpg'
import categoriaAccesorios from './assets/catalogo-accesorios.jpg'
import {
  obtenerCategorias,
  obtenerExcursiones,
  obtenerFiltrosCatalogo,
  obtenerProductos,
  obtenerSubcategorias
} from './services/catalogService'

const categoriasIniciales = [
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

const banners = [
  {
    etiqueta: 'Casa de Pesca Pierre Bandenay',
    titulo: 'Atencion de local, confianza de siempre',
    texto: 'Equipate con asesoramiento real y productos elegidos para pescar mejor.',
    boton: 'Ver cat\u00e1logo',
    href: '#catalogo',
    imagen: bannerLocal,
    imagenMobile: bannerLocalMobile,
    posicion: 'center'
  },
  {
    etiqueta: 'Excursiones',
    titulo: 'Salidas guiadas para vivir la pesca de verdad',
    texto: 'Experiencias organizadas con gente del local, buena pesca y todo listo para disfrutar.',
    boton: 'Ver excursiones',
    href: '#excursiones',
    imagen: segundoBanner,
    imagenMobile: segundoBannerMobile,
    posicion: 'center'
  },
  {
    imagen: tercerBanner,
    imagenMobile: tercerBannerMobile,
    posicion: 'center',
    mostrarTexto: false
  }
]

const telefonoWhatsApp = '5491130352558'

function adaptarCategoria(categoria) {
  const categoriaInicial = categoriasIniciales.find(
    (item) => item.slug === categoria.slug
  )

  return {
    id: categoria.id,
    nombre: categoria.name,
    slug: categoria.slug,
    inicial: categoriaInicial?.inicial || categoria.name.slice(0, 2).toUpperCase(),
    imagen: categoria.image_url || categoriaInicial?.imagen,
    estado: categoria.status,
    orden: categoria.sort_order
  }
}

function adaptarProducto(producto) {
  const imagenPrincipal = producto.images?.[0]?.image_url

  return {
    id: producto.id,
    nombre: producto.title,
    marca: producto.brand,
    categoria: producto.category?.name || '',
    categoriaSlug: producto.category?.slug || '',
    subcategoria: producto.subcategory?.slug || '',
    subcategoriaNombre: producto.subcategory?.name || '',
    precio: producto.price,
    descripcion: producto.description,
    destacado: producto.is_featured,
    imagen: imagenPrincipal,
    imagenes: producto.images || [],
    colores: obtenerColoresProducto(producto),
    filterIds: producto.filter_ids || [],
    slug: producto.slug,
    creado: producto.created_at
  }
}

function adaptarFiltro(filtro) {
  return {
    id: filtro.id,
    nombre: filtro.name,
    slug: filtro.slug,
    categoriaId: filtro.category_id,
    subcategoriaIds: filtro.subcategory_ids || []
  }
}

function adaptarExcursion(excursion) {
  return {
    id: excursion.id,
    titulo: excursion.title,
    precio: excursion.price,
    descripcion: excursion.description,
    lugarSalida: excursion.departure_place,
    lugarExcursion: excursion.destination_place || '',
    duracion: excursion.duration,
    imagen: excursion.images?.[0]?.image_url,
    imagenes: excursion.images || [],
    slug: excursion.slug
  }
}

function agruparSubcategoriasPorCategoria(subcategorias) {
  return subcategorias.reduce((acc, subcategoria) => {
    const categoriaSlug = subcategoria.category?.slug
    if (!categoriaSlug) return acc

    const subcategoriasCategoria = acc[categoriaSlug] || []

    return {
      ...acc,
      [categoriaSlug]: [
        ...subcategoriasCategoria,
        {
          id: subcategoria.id,
          nombre: subcategoria.name,
          slug: subcategoria.slug,
          estado: subcategoria.status,
          orden: subcategoria.sort_order
        }
      ]
    }
  }, {})
}

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
  const [categoriasCatalogo, setCategoriasCatalogo] = useState(categoriasIniciales)
  const [subdivisionesCatalogoActuales, setSubdivisionesCatalogoActuales] = useState(subdivisionesCatalogo)
  const [productosCatalogo, setProductosCatalogo] = useState([])
  const [excursionesCatalogo, setExcursionesCatalogo] = useState([])
  const [ordenProductosCategoria, setOrdenProductosCategoria] = useState('recientes')
  const [filtrosCatalogo, setFiltrosCatalogo] = useState([])
  const [filtrosCategoriaSeleccionados, setFiltrosCategoriaSeleccionados] = useState([])

  const [categoriaRuta, subcategoriaRuta] = rutaActual.split('/')
  const esRutaProducto = categoriaRuta === 'producto'
  const esRutaExcursion = categoriaRuta === 'excursion'
  const productoDetalle = esRutaProducto
    ? productosCatalogo.find((producto) => producto.slug === subcategoriaRuta)
    : null
  const excursionDetalle = esRutaExcursion
    ? excursionesCatalogo.find((excursion) => excursion.slug === subcategoriaRuta)
    : null
  const categoriaActiva = categoriasCatalogo.find(
    (categoria) =>
      !esRutaProducto && !esRutaExcursion && categoria.slug === categoriaRuta
  )
  const subcategoriaActiva = categoriaActiva
    ? subdivisionesCatalogoActuales[categoriaActiva.slug]?.find(
        (subcategoria) => subcategoria.slug === subcategoriaRuta
      )
    : null
  const subcategoriasCategoriaActiva = categoriaActiva
    ? subdivisionesCatalogoActuales[categoriaActiva.slug] || []
    : []
  const filtrosSubcategoriaActiva = subcategoriaActiva
    ? filtrosCatalogo.filter((filtro) =>
        filtro.subcategoriaIds.includes(subcategoriaActiva.id)
      )
    : []

  const cantidadCarrito = carrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  )

  const busquedaNormalizada = busqueda.trim().toLowerCase()
  const productosDestacadosAdmin = productosCatalogo
    .filter((producto) => producto.destacado)
    .slice(0, 6)
  const productosRecientesAdmin = productosCatalogo.slice(0, 6)
  const productosHome = busquedaNormalizada
    ? productosCatalogo.filter((producto) =>
        [producto.nombre, producto.categoria]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : productosDestacadosAdmin.length > 0
      ? productosDestacadosAdmin
      : productosRecientesAdmin

  const productosCategoria = categoriaActiva
    ? productosCatalogo.filter((producto) => {
        const coincideCategoria = producto.categoria === categoriaActiva.nombre
        const coincideSubcategoria = subcategoriaActiva
          ? producto.subcategoria === subcategoriaActiva.slug
          : true

        return coincideCategoria && coincideSubcategoria
      })
    : []

  const productosCategoriaConFiltros = filtrosCategoriaSeleccionados.length > 0
    ? productosCategoria.filter((producto) =>
        filtrosCategoriaSeleccionados.some((filterId) =>
          producto.filterIds.includes(filterId)
        )
      )
    : productosCategoria

  const productosCategoriaBuscados = busquedaNormalizada
    ? productosCategoriaConFiltros.filter((producto) =>
        [producto.nombre, producto.categoria]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : productosCategoriaConFiltros
  const productosCategoriaFiltrados = ordenarProductosCategoria(
    productosCategoriaBuscados,
    ordenProductosCategoria
  )

  const excursionesFiltradas = busquedaNormalizada
    ? excursionesCatalogo.filter((excursion) =>
        [
          excursion.titulo,
          excursion.descripcion,
          excursion.lugarSalida,
          excursion.lugarExcursion,
          excursion.duracion
        ]
          .join(' ')
          .toLowerCase()
          .includes(busquedaNormalizada)
      )
    : excursionesCatalogo
  const resultadosBusqueda = obtenerResultadosBusqueda({
    busqueda,
    categorias: categoriasCatalogo,
    subdivisionesCatalogo: subdivisionesCatalogoActuales,
    productos: productosCatalogo,
    excursiones: excursionesCatalogo
  })

  useEffect(() => {
    const intervalo = setInterval(() => {
      setBannerActivo((bannerActual) => (bannerActual + 1) % banners.length)
    }, 8200)

    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    function actualizarRuta() {
      setRutaActual(obtenerRutaActual())
    }

    window.addEventListener('popstate', actualizarRuta)
    return () => window.removeEventListener('popstate', actualizarRuta)
  }, [])

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const categoriasSupabase = await obtenerCategorias()
        setCategoriasCatalogo(categoriasSupabase.map(adaptarCategoria))
      } catch (error) {
        console.error('No se pudieron cargar las categorias.', error)
      }
    }

    cargarCategorias()
  }, [])

  useEffect(() => {
    async function cargarSubcategorias() {
      try {
        const subcategoriasSupabase = await obtenerSubcategorias()
        setSubdivisionesCatalogoActuales(
          agruparSubcategoriasPorCategoria(subcategoriasSupabase)
        )
      } catch (error) {
        console.error('No se pudieron cargar las subcategorias.', error)
      }
    }

    cargarSubcategorias()
  }, [])

  useEffect(() => {
    async function cargarProductos() {
      try {
        const productosSupabase = await obtenerProductos()
        setProductosCatalogo(productosSupabase.map(adaptarProducto))
      } catch (error) {
        console.error('No se pudieron cargar los productos.', error)
      }
    }

    cargarProductos()
  }, [])

  useEffect(() => {
    async function cargarExcursiones() {
      try {
        const excursionesSupabase = await obtenerExcursiones()
        setExcursionesCatalogo(excursionesSupabase.map(adaptarExcursion))
      } catch (error) {
        console.error('No se pudieron cargar las excursiones.', error)
      }
    }

    cargarExcursiones()
  }, [])

  useEffect(() => {
    async function cargarFiltros() {
      try {
        const filtrosSupabase = await obtenerFiltrosCatalogo()
        setFiltrosCatalogo(filtrosSupabase.map(adaptarFiltro))
      } catch (error) {
        console.error('No se pudieron cargar los filtros.', error)
      }
    }

    cargarFiltros()
  }, [])

  function navegarA(ruta) {
    window.history.pushState({}, '', ruta)
    setRutaActual(obtenerRutaActual())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function seleccionarCategoria(event, slug) {
    event.preventDefault()
    setBusqueda('')
    setFiltrosCategoriaSeleccionados([])
    navegarA(`/${slug}`)
  }

  function irASeccion(seccion) {
    window.history.pushState({}, '', `/#${seccion}`)
    setRutaActual('')

    window.setTimeout(() => {
      const elemento = document.getElementById(seccion)
      if (!elemento) return

      const headerAltura = document.querySelector('header')?.offsetHeight || 0
      const posicion = elemento.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: Math.max(posicion - headerAltura, 0),
        behavior: 'smooth'
      })
    }, 0)
  }

  function seleccionarSubcategoria(event, categoriaSlug, subcategoriaSlug) {
    event.preventDefault()
    setBusqueda('')
    setFiltrosCategoriaSeleccionados([])
    navegarA(`/${categoriaSlug}/${subcategoriaSlug}`)
  }

  function seleccionarSubcategoriaFiltro(slug) {
    setBusqueda('')
    setFiltrosCategoriaSeleccionados([])

    if (!categoriaActiva) return
    navegarA(slug ? `/${categoriaActiva.slug}/${slug}` : `/${categoriaActiva.slug}`)
  }

  function alternarFiltroCategoria(filterId) {
    setFiltrosCategoriaSeleccionados((filtrosActuales) =>
      filtrosActuales.includes(filterId)
        ? filtrosActuales.filter((id) => id !== filterId)
        : [...filtrosActuales, filterId]
    )
  }

  function verProducto(producto) {
    if (!producto.slug) return
    navegarA(`/producto/${producto.slug}`)
  }

  function verExcursion(excursion) {
    if (!excursion.slug) return
    navegarA(`/excursion/${excursion.slug}`)
  }

  function navegarASeccion(event, seccion) {
    event.preventDefault()
    setBusqueda('')
    irASeccion(seccion)
  }

  function seleccionarResultadoBusqueda(resultado) {
    setBusqueda('')

    if (resultado.tipo === 'seccion') {
      irASeccion(resultado.seccion)
      return
    }

    if (resultado.tipo === 'categoria') {
      navegarA(`/${resultado.slug}`)
      return
    }

    if (resultado.tipo === 'subcategoria') {
      navegarA(`/${resultado.categoriaSlug}/${resultado.slug}`)
      return
    }

    if (resultado.tipo === 'producto') {
      verProducto(resultado.item)
      return
    }

    if (resultado.tipo === 'excursion') {
      verExcursion(resultado.item)
    }
  }

  function cambiarBanner(direccion) {
    setBannerActivo((bannerActual) => {
      const siguiente = bannerActual + direccion
      if (siguiente < 0) return banners.length - 1
      if (siguiente >= banners.length) return 0
      return siguiente
    })
  }

  function agregarAlCarrito(producto, colorElegido = '', cantidadElegida = 1) {
    const color = String(colorElegido).trim()
    const cantidad = Math.max(Number(cantidadElegida) || 1, 1)

    if (producto.colores?.length > 0 && !color) {
      window.alert('Elegi un color antes de agregar este producto al carrito.')
      return false
    }

    const cartItemId = `${producto.id}-${color || 'sin-color'}`
    const productoExistente = carrito.find((item) => item.cartItemId === cartItemId)

    if (productoExistente) {
      const carritoActualizado = carrito.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      )

      setCarrito(carritoActualizado)
    } else {
      setCarrito([...carrito, { ...producto, cartItemId, color, cantidad }])
    }

    return true
  }

  function sumarProducto(cartItemId) {
    const carritoActualizado = carrito.map((item) =>
      item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad + 1 } : item
    )

    setCarrito(carritoActualizado)
  }

  function restarProducto(cartItemId) {
    const carritoActualizado = carrito
      .map((item) =>
        item.cartItemId === cartItemId ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      .filter((item) => item.cantidad > 0)

    setCarrito(carritoActualizado)
  }

  function eliminarProducto(cartItemId) {
    const carritoActualizado = carrito.filter((item) => item.cartItemId !== cartItemId)

    setCarrito(carritoActualizado)
  }

  if (rutaActual === 'admin') {
    return <Admin />
  }

  return (
    <div>
      <Header
        abrirCarrito={() => setCarritoAbierto(true)}
        cantidadCarrito={cantidadCarrito}
        busqueda={busqueda}
        cambiarBusqueda={setBusqueda}
        navegarASeccion={navegarASeccion}
        categorias={categoriasCatalogo}
        subdivisionesCatalogo={subdivisionesCatalogoActuales}
        seleccionarCategoria={seleccionarCategoria}
        seleccionarSubcategoria={seleccionarSubcategoria}
        resultadosBusqueda={resultadosBusqueda}
        seleccionarResultadoBusqueda={seleccionarResultadoBusqueda}
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
        href={`https://wa.me/${telefonoWhatsApp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Consultar por WhatsApp"
      >
        <WhatsAppIcon />
      </a>

      <main id="inicio">
        {esRutaProducto ? (
          <ProductoDetalle
            key={productoDetalle?.id || subcategoriaRuta || 'producto'}
            producto={productoDetalle}
            volver={() => navegarA('/')}
            agregarAlCarrito={agregarAlCarrito}
          />
        ) : esRutaExcursion ? (
          <ExcursionDetalle
            key={excursionDetalle?.id || subcategoriaRuta || 'excursion'}
            excursion={excursionDetalle}
            volver={() => navegarA('/')}
            telefono={telefonoWhatsApp}
          />
        ) : categoriaActiva ? (
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

            <div className="categoria-page-layout">
              <FiltrosCategoria
                categoria={categoriaActiva}
                subcategorias={subcategoriasCategoriaActiva}
                subcategoriaActiva={subcategoriaActiva}
                filtros={filtrosSubcategoriaActiva}
                filtrosSeleccionados={filtrosCategoriaSeleccionados}
                orden={ordenProductosCategoria}
                cambiarOrden={setOrdenProductosCategoria}
                seleccionarSubcategoria={seleccionarSubcategoriaFiltro}
                alternarFiltro={alternarFiltroCategoria}
                limpiarFiltros={() => setFiltrosCategoriaSeleccionados([])}
              />

              <Productos
                productos={productosCategoriaFiltrados}
                verProducto={verProducto}
                titulo=""
                vacio="No encontramos productos en esta categoria."
              />
            </div>
          </section>
        ) : (
          <>
            <section
              className={
                banners[bannerActivo].mostrarTexto === false
                  ? 'hero-section hero-section-sin-texto'
                  : 'hero-section'
              }
            >
              {banners.map((banner, index) => (
                <div
                  className={`hero-slide ${bannerActivo === index ? 'activo' : ''}`}
                  key={banner.titulo}
                  style={
                    banner.imagen
                      ? {
                          '--hero-imagen': `url(${banner.imagen})`,
                          '--hero-imagen-mobile': `url(${banner.imagenMobile || banner.imagen})`,
                          backgroundPosition: banner.posicion || 'center'
                        }
                      : undefined
                  }
                />
              ))}

              <div
                className={
                  banners[bannerActivo].mostrarTexto === false
                    ? 'hero-overlay hero-overlay-sin-texto'
                    : 'hero-overlay'
                }
              >
                {banners[bannerActivo].mostrarTexto !== false && (
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
                )}

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
              categorias={categoriasCatalogo}
              seleccionarCategoria={seleccionarCategoria}
            />

            <Productos
              productos={productosHome}
              verProducto={verProducto}
              titulo={busquedaNormalizada ? 'Resultados de busqueda' : 'Productos destacados'}
            />

            <Excursiones
              excursiones={excursionesFiltradas}
              verExcursion={verExcursion}
            />

            <Contacto telefono={telefonoWhatsApp} />
          </>
        )}
      </main>
    </div>
  )
}

function ExcursionDetalle({ excursion, volver, telefono }) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')
  const [imagenActiva, setImagenActiva] = useState(0)

  if (!excursion) {
    return (
      <section className="producto-detalle-page">
        <button className="volver-catalogo-btn" onClick={volver}>
          {'< Volver al inicio'}
        </button>
        <p className="sin-resultados">No encontramos esta excursion.</p>
      </section>
    )
  }

  const imagenes = excursion.imagenes?.length > 0
    ? excursion.imagenes
    : [{ image_url: excursion.imagen }]
  const imagenPrincipal = imagenes[imagenActiva]?.image_url || excursion.imagen
  const mensajeWhatsApp = [
    `Hola, quiero consultar por la excursion: ${excursion.titulo}`,
    `Salida: ${excursion.lugarSalida}`,
    excursion.lugarExcursion ? `Lugar de excursion: ${excursion.lugarExcursion}` : '',
    `Duracion: ${excursion.duracion}`,
    `Precio aproximado: $${formatoPrecio.format(excursion.precio)}`
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <section className="producto-detalle-page">
      <button className="volver-catalogo-btn" onClick={volver}>
        {'< Volver al inicio'}
      </button>

      <div className="producto-detalle-layout">
        <div className="producto-detalle-galeria">
          {imagenPrincipal && (
            <img
              className="producto-detalle-imagen"
              src={imagenPrincipal}
              alt={excursion.titulo}
            />
          )}

          {imagenes.length > 1 && (
            <div className="producto-detalle-thumbs">
              {imagenes.map((imagen, index) => (
                <button
                  className={imagenActiva === index ? 'activo' : ''}
                  key={imagen.id || imagen.image_url}
                  onClick={() => setImagenActiva(index)}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img src={imagen.image_url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="producto-detalle-info excursion-detalle-info">
          <span className="section-kicker">Excursion</span>
          <h2>{excursion.titulo}</h2>
          <h3>${formatoPrecio.format(excursion.precio)}</h3>

          <div className="excursion-detalle-meta">
            <span>Salida: {excursion.lugarSalida}</span>
            {excursion.lugarExcursion && (
              <span>Lugar de excursion: {excursion.lugarExcursion}</span>
            )}
            <span>Duracion: {excursion.duracion}</span>
          </div>

          <p className="producto-detalle-descripcion">{excursion.descripcion}</p>

          <a
            href={`https://wa.me/${telefono}?text=${encodeURIComponent(mensajeWhatsApp)}`}
            target="_blank"
            rel="noreferrer"
          >
            <button>Consultar por WhatsApp</button>
          </a>
        </div>
      </div>
    </section>
  )
}

function FiltrosCategoria({
  categoria,
  subcategorias,
  subcategoriaActiva,
  filtros,
  filtrosSeleccionados,
  orden,
  cambiarOrden,
  seleccionarSubcategoria,
  alternarFiltro,
  limpiarFiltros
}) {
  return (
    <aside className="categoria-filtros" aria-label="Filtros de categoria">
      <div className="categoria-filtros-grupo">
        <h3>Subcategorias</h3>
        <button
          type="button"
          className={!subcategoriaActiva ? 'activo' : ''}
          onClick={() => seleccionarSubcategoria('')}
        >
          Todas las {categoria.nombre}
        </button>

        {subcategorias.map((subcategoria) => (
          <button
            type="button"
            className={
              subcategoriaActiva?.slug === subcategoria.slug ? 'activo' : ''
            }
            key={subcategoria.slug}
            onClick={() => seleccionarSubcategoria(subcategoria.slug)}
          >
            {subcategoria.nombre}
          </button>
        ))}
      </div>

      {subcategoriaActiva && filtros.length > 0 && (
        <div className="categoria-filtros-grupo categoria-filtros-valores">
          <h3>Filtros</h3>
          {filtros.map((filtro) => (
            <label key={filtro.id}>
              <input
                type="checkbox"
                checked={filtrosSeleccionados.includes(filtro.id)}
                onChange={() => alternarFiltro(filtro.id)}
              />
              {filtro.nombre}
            </label>
          ))}
          {filtrosSeleccionados.length > 0 && (
            <button type="button" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <label className="categoria-orden">
        Ordenar
        <select
          value={orden}
          onChange={(event) => cambiarOrden(event.target.value)}
        >
          <option value="recientes">Mas recientes</option>
          <option value="precio-menor">Menor precio</option>
          <option value="precio-mayor">Mayor precio</option>
        </select>
      </label>
    </aside>
  )
}

function ProductoDetalle({ producto, volver, agregarAlCarrito }) {
  const formatoPrecio = new Intl.NumberFormat('es-AR')
  const [imagenActiva, setImagenActiva] = useState(0)
  const [colorSeleccionado, setColorSeleccionado] = useState('')
  const [errorColor, setErrorColor] = useState('')
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1)

  if (!producto) {
    return (
      <section className="producto-detalle-page">
        <button className="volver-catalogo-btn" onClick={volver}>
          {'< Volver al inicio'}
        </button>
        <p className="sin-resultados">No encontramos este producto.</p>
      </section>
    )
  }

  const imagenes = producto.imagenes?.length > 0
    ? producto.imagenes
    : [{ image_url: producto.imagen }]
  const imagenPrincipal = imagenes[imagenActiva]?.image_url || producto.imagen
  const requiereColor = producto.colores?.length > 0

  function manejarAgregarDetalle() {
    if (requiereColor && !colorSeleccionado) {
      setErrorColor('Elegi un color antes de agregarlo al carrito.')
      return
    }

    const agregado = agregarAlCarrito(
      producto,
      colorSeleccionado,
      cantidadSeleccionada
    )
    if (agregado) setErrorColor('')
  }

  return (
    <section className="producto-detalle-page">
      <button className="volver-catalogo-btn" onClick={volver}>
        {'< Volver al inicio'}
      </button>

      <div className="producto-detalle-layout">
        <div className="producto-detalle-galeria">
          {imagenPrincipal && (
            <img
              className="producto-detalle-imagen"
              src={imagenPrincipal}
              alt={producto.nombre}
            />
          )}

          {imagenes.length > 1 && (
            <div className="producto-detalle-thumbs">
              {imagenes.map((imagen, index) => (
                <button
                  className={imagenActiva === index ? 'activo' : ''}
                  key={imagen.id || imagen.image_url}
                  onClick={() => setImagenActiva(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img src={imagen.image_url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="producto-detalle-info">
          <span className="section-kicker">
            {producto.categoria}
            {producto.subcategoriaNombre ? ` > ${producto.subcategoriaNombre}` : ''}
          </span>
          <h2>{producto.nombre}</h2>
          <p className="producto-detalle-marca">{producto.marca}</p>
          <h3>${formatoPrecio.format(producto.precio)}</h3>
          <p className="producto-detalle-descripcion">{producto.descripcion}</p>

          {requiereColor && (
            <div className="producto-detalle-colores">
              <strong>Color</strong>
              <div className="producto-color-options detalle">
                {producto.colores.map((color) => (
                  <button
                    type="button"
                    className={
                      colorSeleccionado === color
                        ? 'producto-color-chip activo'
                        : 'producto-color-chip'
                    }
                    key={color}
                    onClick={() => {
                      setColorSeleccionado(color)
                      setErrorColor('')
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errorColor && <span className="producto-color-error">{errorColor}</span>}
            </div>
          )}

          <div className="producto-detalle-cantidad">
            <strong>Cantidad</strong>
            <div className="cantidad-control">
              <button
                type="button"
                onClick={() =>
                  setCantidadSeleccionada((cantidadActual) =>
                    Math.max(cantidadActual - 1, 1)
                  )
                }
              >
                -
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={cantidadSeleccionada}
                onChange={(event) =>
                  setCantidadSeleccionada(
                    Math.max(Number(event.target.value) || 1, 1)
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  setCantidadSeleccionada((cantidadActual) => cantidadActual + 1)
                }
              >
                +
              </button>
            </div>
          </div>

          <button onClick={manejarAgregarDetalle}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  )
}

function ordenarProductosCategoria(productos, orden) {
  const productosOrdenados = [...productos]

  if (orden === 'precio-menor') {
    return productosOrdenados.sort((a, b) => a.precio - b.precio)
  }

  if (orden === 'precio-mayor') {
    return productosOrdenados.sort((a, b) => b.precio - a.precio)
  }

  return productosOrdenados.sort(
    (a, b) => new Date(b.creado) - new Date(a.creado)
  )
}

function obtenerResultadosBusqueda({
  busqueda,
  categorias,
  subdivisionesCatalogo,
  productos,
  excursiones
}) {
  const termino = normalizarTexto(busqueda)
  if (termino.length < 2) return []

  const resultados = []
  const coincideExcursiones = ['excursion', 'excursiones', 'salida', 'salidas'].some(
    (texto) => texto.includes(termino) || termino.includes(texto)
  )

  if (coincideExcursiones) {
    resultados.push({
      id: 'seccion-excursiones',
      tipo: 'seccion',
      titulo: 'Ir a Excursiones',
      detalle: 'Ver todas las salidas disponibles',
      seccion: 'excursiones'
    })
  }

  categorias.forEach((categoria) => {
    if (normalizarTexto(categoria.nombre).includes(termino)) {
      resultados.push({
        id: `categoria-${categoria.slug}`,
        tipo: 'categoria',
        titulo: categoria.nombre,
        detalle: 'Ver categoria',
        slug: categoria.slug
      })
    }

    ;(subdivisionesCatalogo[categoria.slug] || []).forEach((subcategoria) => {
      if (normalizarTexto(subcategoria.nombre).includes(termino)) {
        resultados.push({
          id: `subcategoria-${categoria.slug}-${subcategoria.slug}`,
          tipo: 'subcategoria',
          titulo: subcategoria.nombre,
          detalle: categoria.nombre,
          categoriaSlug: categoria.slug,
          slug: subcategoria.slug
        })
      }
    })
  })

  productos
    .filter((producto) =>
      [
        producto.nombre,
        producto.marca,
        producto.categoria,
        producto.subcategoriaNombre
      ]
        .map(normalizarTexto)
        .join(' ')
        .includes(termino)
    )
    .slice(0, 5)
    .forEach((producto) => {
      resultados.push({
        id: `producto-${producto.id}`,
        tipo: 'producto',
        titulo: producto.nombre,
        detalle: `${producto.categoria}${
          producto.subcategoriaNombre ? ` > ${producto.subcategoriaNombre}` : ''
        }`,
        item: producto
      })
    })

  excursiones
    .filter((excursion) =>
      [
        excursion.titulo,
        excursion.descripcion,
        excursion.lugarSalida,
        excursion.lugarExcursion,
        excursion.duracion
      ]
        .map(normalizarTexto)
        .join(' ')
        .includes(termino)
    )
    .slice(0, 5)
    .forEach((excursion) => {
      resultados.push({
        id: `excursion-${excursion.id}`,
        tipo: 'excursion',
        titulo: excursion.titulo,
        detalle: excursion.lugarExcursion || 'Ver excursion',
        item: excursion
      })
    })

  return resultados.slice(0, 12)
}

function normalizarTexto(texto = '') {
  return String(texto)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function obtenerColoresProducto(producto) {
  return (producto.attributes || [])
    .filter((attribute) => attribute.name === 'Color')
    .map((attribute) => attribute.value)
    .filter(Boolean)
}

export default App
