import { useEffect, useState } from 'react'
import {
  cerrarSesion,
  iniciarSesionAdmin,
  obtenerSesionActual,
  verificarAdmin
} from '../services/authService'
import {
  actualizarColoresProducto,
  actualizarCategoria,
  actualizarExcursion,
  actualizarFiltroCatalogo,
  actualizarFiltrosProducto,
  actualizarProducto,
  actualizarSubcategoria,
  crearCategoria,
  crearExcursion,
  crearFiltroCatalogo,
  crearProducto,
  crearSubcategoria,
  eliminarCategoriaDefinitiva,
  eliminarExcursionDefinitiva,
  eliminarFiltroCatalogo,
  eliminarImagenExcursion,
  eliminarImagenProducto,
  eliminarProductoDefinitivo,
  eliminarSubcategoriaDefinitiva,
  obtenerCategoriasAdmin,
  obtenerExcursionesAdmin,
  obtenerExcursionesEliminadasAdmin,
  obtenerFiltrosCatalogo,
  obtenerProductosAdmin,
  obtenerProductosEliminadosAdmin,
  obtenerSubcategoriasAdmin,
  subirImagenExcursion,
  subirImagenProducto
} from '../services/catalogService'

const productoInicial = {
  title: '',
  brand: '',
  price: '',
  category_id: '',
  subcategory_id: '',
  description: '',
  is_featured: false,
  filter_ids: [],
  available_colors: [],
  custom_color: ''
}

const coloresPredefinidos = [
  'Rojo',
  'Amarillo',
  'Azul',
  'Verde',
  'Naranja',
  'Violeta',
  'Blanco',
  'Negro',
  'Rosa',
  'Celeste',
  'Gris',
  'Marron'
]

const categoriaInicial = {
  name: '',
  sort_order: 0
}

const subcategoriaInicial = {
  category_id: '',
  name: '',
  sort_order: 0
}

const excursionInicial = {
  title: '',
  price: '',
  description: '',
  departure_place: '',
  destination_place: '',
  duration: ''
}

const filtroInicial = {
  name: '',
  category_id: '',
  subcategory_ids: [],
  busquedaSubcategorias: ''
}

const MAX_IMAGENES = 10

const slotsImagenesIniciales = Array.from({ length: MAX_IMAGENES }, () => ({
  existente: null,
  archivo: null
}))

function Admin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [seccionActiva, setSeccionActiva] = useState('productos')
  const [productos, setProductos] = useState([])
  const [productosEliminados, setProductosEliminados] = useState([])
  const [excursiones, setExcursiones] = useState([])
  const [excursionesEliminadas, setExcursionesEliminadas] = useState([])
  const [filtrosCatalogo, setFiltrosCatalogo] = useState([])
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState('')
  const [mostrarFormularioProducto, setMostrarFormularioProducto] = useState(false)
  const [mostrarFormularioExcursion, setMostrarFormularioExcursion] = useState(false)
  const [mostrarFormularioFiltro, setMostrarFormularioFiltro] = useState(false)
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = useState(false)
  const [mostrarFormularioSubcategoria, setMostrarFormularioSubcategoria] = useState(false)
  const [productoForm, setProductoForm] = useState(productoInicial)
  const [excursionForm, setExcursionForm] = useState(excursionInicial)
  const [filtroForm, setFiltroForm] = useState(filtroInicial)
  const [categoriaForm, setCategoriaForm] = useState(categoriaInicial)
  const [subcategoriaForm, setSubcategoriaForm] = useState(subcategoriaInicial)
  const [productoEditandoId, setProductoEditandoId] = useState(null)
  const [excursionEditandoId, setExcursionEditandoId] = useState(null)
  const [filtroEditandoId, setFiltroEditandoId] = useState(null)
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null)
  const [subcategoriaEditandoId, setSubcategoriaEditandoId] = useState(null)
  const [imagenesProducto, setImagenesProducto] = useState(slotsImagenesIniciales)
  const [imagenesExcursion, setImagenesExcursion] = useState(slotsImagenesIniciales)
  const [guardandoProducto, setGuardandoProducto] = useState(false)
  const [guardandoExcursion, setGuardandoExcursion] = useState(false)
  const [guardandoFiltro, setGuardandoFiltro] = useState(false)
  const [guardandoCategoria, setGuardandoCategoria] = useState(false)
  const [guardandoSubcategoria, setGuardandoSubcategoria] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')
  const [filtrosProductos, setFiltrosProductos] = useState({
    busqueda: '',
    category_id: '',
    subcategory_id: ''
  })
  const [filtrosSubcategorias, setFiltrosSubcategorias] = useState({
    busqueda: '',
    category_id: ''
  })

  const formatoPrecio = new Intl.NumberFormat('es-AR')
  const subcategoriasDisponibles = subcategorias.filter(
    (subcategoria) => subcategoria.category_id === productoForm.category_id
  )
  const filtrosDisponiblesProducto = obtenerFiltrosPorSubcategoria(
    filtrosCatalogo,
    productoForm.subcategory_id
  )
  const filtrosConDetalle = filtrosCatalogo.map((filtro) => ({
    ...filtro,
    category: categorias.find((categoria) => categoria.id === filtro.category_id),
    subcategories: subcategorias.filter((subcategoria) =>
      filtro.subcategory_ids?.includes(subcategoria.id)
    )
  }))
  const subcategoriasFiltroProductos = subcategorias.filter(
    (subcategoria) =>
      subcategoria.status !== 'Eliminado' &&
      (!filtrosProductos.category_id ||
        subcategoria.category_id === filtrosProductos.category_id)
  )
  const productosFiltrados = filtrarProductosAdmin(productos, filtrosProductos)
  const subcategoriasFiltradas = filtrarSubcategoriasAdmin(
    subcategorias.filter((subcategoria) => subcategoria.status !== 'Eliminado'),
    filtrosSubcategorias
  )

  useEffect(() => {
    async function cargarSesion() {
      try {
        const sesionActual = await obtenerSesionActual()

        if (sesionActual) {
          const esAdmin = await verificarAdmin()
          setSession(esAdmin ? sesionActual : null)
        }
      } catch (errorSesion) {
        console.error('No se pudo verificar la sesion de admin.', errorSesion)
      } finally {
        setCargando(false)
      }
    }

    cargarSesion()
  }, [])

  useEffect(() => {
    if (!session) return

    async function cargarDatosAdmin() {
      setCargandoProductos(true)
      setErrorProductos('')

      try {
        const [
          productosAdmin,
          productosEliminadosAdmin,
          excursionesAdmin,
          excursionesEliminadasAdmin,
          filtrosAdmin,
          categoriasAdmin,
          subcategoriasAdmin
        ] = await Promise.all([
          obtenerProductosAdmin(),
          obtenerProductosEliminadosAdmin(),
          obtenerExcursionesAdmin(),
          obtenerExcursionesEliminadasAdmin(),
          obtenerFiltrosCatalogo(),
          obtenerCategoriasAdmin(),
          obtenerSubcategoriasAdmin()
        ])

        setProductos(productosAdmin)
        setProductosEliminados(productosEliminadosAdmin)
        setExcursiones(excursionesAdmin)
        setExcursionesEliminadas(excursionesEliminadasAdmin)
        setFiltrosCatalogo(filtrosAdmin)
        setCategorias(categoriasAdmin)
        setSubcategorias(subcategoriasAdmin)
      } catch (errorCarga) {
        setErrorProductos('No se pudieron cargar los datos del admin.')
        console.error('No se pudieron cargar los datos del admin.', errorCarga)
      } finally {
        setCargandoProductos(false)
      }
    }

    cargarDatosAdmin()
  }, [session])

  async function recargarProductos() {
    const [productosAdmin, productosEliminadosAdmin] = await Promise.all([
      obtenerProductosAdmin(),
      obtenerProductosEliminadosAdmin()
    ])

    setProductos(productosAdmin)
    setProductosEliminados(productosEliminadosAdmin)
  }

  async function recargarExcursiones() {
    const [excursionesAdmin, excursionesEliminadasAdmin] = await Promise.all([
      obtenerExcursionesAdmin(),
      obtenerExcursionesEliminadasAdmin()
    ])

    setExcursiones(excursionesAdmin)
    setExcursionesEliminadas(excursionesEliminadasAdmin)
  }

  async function recargarTaxonomia() {
    const [categoriasAdmin, subcategoriasAdmin] = await Promise.all([
      obtenerCategoriasAdmin(),
      obtenerSubcategoriasAdmin()
    ])

    setCategorias(categoriasAdmin)
    setSubcategorias(subcategoriasAdmin)
  }

  async function recargarFiltros() {
    const filtrosAdmin = await obtenerFiltrosCatalogo()
    setFiltrosCatalogo(filtrosAdmin)
  }

  async function manejarLogin(event) {
    event.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const sesionAdmin = await iniciarSesionAdmin(email, password)
      setSession(sesionAdmin)
      setPassword('')
    } catch (errorLogin) {
      setError(errorLogin.message || 'No se pudo iniciar sesion.')
    } finally {
      setEnviando(false)
    }
  }

  async function manejarCerrarSesion() {
    await cerrarSesion()
    setSession(null)
    setEmail('')
    setPassword('')
  }

  function actualizarProductoForm(campo, valor) {
    setProductoForm((productoActual) => ({
      ...productoActual,
      [campo]: valor,
      ...(campo === 'category_id' ? { subcategory_id: '', filter_ids: [] } : {}),
      ...(campo === 'subcategory_id' ? { filter_ids: [] } : {})
    }))
  }

  function actualizarCategoriaForm(campo, valor) {
    setCategoriaForm((categoriaActual) => ({
      ...categoriaActual,
      [campo]: valor
    }))
  }

  function actualizarExcursionForm(campo, valor) {
    setExcursionForm((excursionActual) => ({
      ...excursionActual,
      [campo]: valor
    }))
  }

  function actualizarFiltroForm(campo, valor) {
    setFiltroForm((filtroActual) => ({
      ...filtroActual,
      [campo]: valor,
      ...(campo === 'category_id' ? { subcategory_ids: [] } : {})
    }))
  }

  function actualizarSubcategoriaForm(campo, valor) {
    setSubcategoriaForm((subcategoriaActual) => ({
      ...subcategoriaActual,
      [campo]: valor
    }))
  }

  function actualizarFiltroProducto(campo, valor) {
    setFiltrosProductos((filtrosActuales) => ({
      ...filtrosActuales,
      [campo]: valor,
      ...(campo === 'category_id' ? { subcategory_id: '' } : {})
    }))
  }

  function actualizarFiltroSubcategoria(campo, valor) {
    setFiltrosSubcategorias((filtrosActuales) => ({
      ...filtrosActuales,
      [campo]: valor
    }))
  }

  async function manejarGuardarProducto(event) {
    event.preventDefault()
    setErrorFormulario('')
    setGuardandoProducto(true)

    try {
      const precio = Number(productoForm.price)

      if (!Number.isInteger(precio) || precio <= 0) {
        throw new Error('El precio tiene que ser un numero mayor a 0.')
      }

      const productoPayload = {
        title: productoForm.title.trim(),
        brand: productoForm.brand.trim(),
        price: precio,
        category_id: productoForm.category_id,
        subcategory_id: productoForm.subcategory_id || null,
        description: productoForm.description.trim(),
        is_featured: productoForm.is_featured
      }

      const imagenesFinales = imagenesProducto.filter(
        (slot) => slot.existente || slot.archivo
      )
      const totalImagenes = imagenesFinales.length

      if (totalImagenes > MAX_IMAGENES) {
        throw new Error(`Un producto puede tener como maximo ${MAX_IMAGENES} imagenes.`)
      }

      const filterIds = (productoForm.filter_ids || []).filter((filterId) =>
        filtrosDisponiblesProducto.some((filtro) => filtro.id === filterId)
      )

      if (filtrosDisponiblesProducto.length > 0 && filterIds.length === 0) {
        throw new Error('Tenes que elegir al menos un filtro para esta subcategoria.')
      }

      let productoGuardado

      if (productoEditandoId) {
        productoGuardado = await actualizarProducto(productoEditandoId, productoPayload)
      } else {
        productoGuardado = await crearProducto({
          ...productoPayload,
          slug: generarSlug(productoForm.title),
          status: 'Inactivo'
        })
      }

      await actualizarColoresProducto(
        productoGuardado.id,
        productoForm.available_colors
      )
      await actualizarFiltrosProducto(productoGuardado.id, filterIds)

      for (const [indice, slot] of imagenesProducto.entries()) {
        if (!slot.archivo) continue

        if (slot.existente) {
          await eliminarImagenProducto(slot.existente)
        }

        await subirImagenProducto(productoGuardado.id, slot.archivo, indice)
      }

      cerrarFormularioProducto()
      await recargarProductos()
    } catch (errorGuardar) {
      setErrorFormulario(obtenerMensajeErrorAdmin(errorGuardar, 'producto'))
    } finally {
      setGuardandoProducto(false)
    }
  }

  async function manejarGuardarExcursion(event) {
    event.preventDefault()
    setErrorFormulario('')
    setGuardandoExcursion(true)

    try {
      const precio = Number(excursionForm.price)

      if (!Number.isInteger(precio) || precio <= 0) {
        throw new Error('El precio tiene que ser un numero mayor a 0.')
      }

      const excursionPayload = {
        title: excursionForm.title.trim(),
        price: precio,
        description: excursionForm.description.trim(),
        departure_place: excursionForm.departure_place.trim(),
        destination_place: excursionForm.destination_place.trim(),
        duration: excursionForm.duration.trim()
      }

      if (!excursionPayload.title) throw new Error('El titulo es obligatorio.')
      if (!excursionPayload.description) throw new Error('La descripcion es obligatoria.')
      if (!excursionPayload.departure_place) {
        throw new Error('El lugar de salida es obligatorio.')
      }
      if (!excursionPayload.destination_place) {
        throw new Error('El lugar de excursion es obligatorio.')
      }
      if (!excursionPayload.duration) throw new Error('La duracion es obligatoria.')

      const totalImagenes = imagenesExcursion.filter(
        (slot) => slot.existente || slot.archivo
      ).length

      if (totalImagenes > MAX_IMAGENES) {
        throw new Error(`Una excursion puede tener como maximo ${MAX_IMAGENES} imagenes.`)
      }

      let excursionGuardada

      if (excursionEditandoId) {
        excursionGuardada = await actualizarExcursion(
          excursionEditandoId,
          excursionPayload
        )
      } else {
        excursionGuardada = await crearExcursion({
          ...excursionPayload,
          slug: generarSlug(excursionForm.title),
          status: 'Inactivo'
        })
      }

      for (const [indice, slot] of imagenesExcursion.entries()) {
        if (!slot.archivo) continue

        if (slot.existente) {
          await eliminarImagenExcursion(slot.existente)
        }

        await subirImagenExcursion(excursionGuardada.id, slot.archivo, indice)
      }

      cerrarFormularioExcursion()
      await recargarExcursiones()
    } catch (errorGuardar) {
      setErrorFormulario(obtenerMensajeErrorAdmin(errorGuardar, 'excursion'))
    } finally {
      setGuardandoExcursion(false)
    }
  }

  async function manejarGuardarFiltro(event) {
    event.preventDefault()
    setErrorFormulario('')
    setGuardandoFiltro(true)

    try {
      const nombre = filtroForm.name.trim()
      const subcategoryIds = filtroForm.subcategory_ids

      if (!nombre) throw new Error('El nombre del filtro es obligatorio.')
      if (!filtroForm.category_id) throw new Error('Tenes que elegir una categoria.')
      if (subcategoryIds.length === 0) {
        throw new Error('Tenes que elegir al menos una subcategoria.')
      }

      const payload = {
        name: nombre,
        slug: generarSlug(nombre),
        category_id: filtroForm.category_id
      }

      if (filtroEditandoId) {
        await actualizarFiltroCatalogo(filtroEditandoId, payload, subcategoryIds)
      } else {
        await crearFiltroCatalogo(payload, subcategoryIds)
      }

      cerrarFormularioFiltro()
      await recargarFiltros()
    } catch (errorGuardar) {
      setErrorFormulario(obtenerMensajeErrorAdmin(errorGuardar, 'filtro'))
    } finally {
      setGuardandoFiltro(false)
    }
  }

  async function manejarGuardarCategoria(event) {
    event.preventDefault()
    setErrorFormulario('')
    setGuardandoCategoria(true)

    try {
      const nombre = categoriaForm.name.trim()
      const orden = Number(categoriaForm.sort_order) || 0

      if (!nombre) throw new Error('El nombre de la categoria es obligatorio.')

      const payload = {
        name: nombre,
        sort_order: orden
      }

      if (categoriaEditandoId) {
        await actualizarCategoria(categoriaEditandoId, payload)
      } else {
        await crearCategoria({
          ...payload,
          slug: generarSlug(nombre),
          status: 'Activo'
        })
      }

      cerrarFormularioCategoria()
      await recargarTaxonomia()
    } catch (errorGuardar) {
      setErrorFormulario(obtenerMensajeErrorAdmin(errorGuardar, 'categoria'))
    } finally {
      setGuardandoCategoria(false)
    }
  }

  async function manejarGuardarSubcategoria(event) {
    event.preventDefault()
    setErrorFormulario('')
    setGuardandoSubcategoria(true)

    try {
      const nombre = subcategoriaForm.name.trim()
      const orden = Number(subcategoriaForm.sort_order) || 0

      if (!subcategoriaForm.category_id) {
        throw new Error('Tenes que elegir una categoria.')
      }

      if (!nombre) throw new Error('El nombre de la subcategoria es obligatorio.')

      const payload = {
        category_id: subcategoriaForm.category_id,
        name: nombre,
        sort_order: orden
      }

      if (subcategoriaEditandoId) {
        await actualizarSubcategoria(subcategoriaEditandoId, payload)
      } else {
        await crearSubcategoria({
          ...payload,
          slug: generarSlug(nombre),
          status: 'Activo'
        })
      }

      cerrarFormularioSubcategoria()
      await recargarTaxonomia()
    } catch (errorGuardar) {
      setErrorFormulario(obtenerMensajeErrorAdmin(errorGuardar, 'subcategoria'))
    } finally {
      setGuardandoSubcategoria(false)
    }
  }

  async function moverProductoAPapelera(producto) {
    const confirmar = window.confirm(
      `Vas a mover "${producto.title}" a la papelera. No se va a ver en el listado de productos ni en la web publica.`
    )

    if (!confirmar) return

    try {
      await actualizarProducto(producto.id, { status: 'Eliminado' })
      await recargarProductos()
    } catch (errorMover) {
      setErrorProductos('No se pudo mover el producto a la papelera.')
      console.error('No se pudo mover el producto a la papelera.', errorMover)
    }
  }

  async function moverExcursionAPapelera(excursion) {
    const confirmar = window.confirm(
      `Vas a mover "${excursion.title}" a la papelera. No se va a ver en la web publica.`
    )

    if (!confirmar) return

    try {
      await actualizarExcursion(excursion.id, { status: 'Eliminado' })
      await recargarExcursiones()
    } catch (errorMover) {
      setErrorProductos('No se pudo mover la excursion a la papelera.')
      console.error('No se pudo mover la excursion a la papelera.', errorMover)
    }
  }

  async function cambiarEstadoCategoria(categoria) {
    const siguienteEstado = categoria.status === 'Activo' ? 'Inactivo' : 'Activo'
    const cantidadProductos = contarProductosPorCategoria(categoria.id, productos)

    const mensajeAdvertencia = siguienteEstado === 'Inactivo' && cantidadProductos > 0
      ? `\n\nATENCION: tambien se van a inactivar ${cantidadProductos} producto(s) dentro de esta categoria.`
      : ''

    const confirmar = window.confirm(
      siguienteEstado === 'Activo'
        ? `Vas a activar la categoria "${categoria.name}".`
        : `Vas a inactivar la categoria "${categoria.name}". No se va a ver en la web publica.${mensajeAdvertencia}`
    )

    if (!confirmar) return

    try {
      await actualizarCategoria(categoria.id, { status: siguienteEstado })
      await Promise.all([recargarTaxonomia(), recargarProductos()])
    } catch (errorEstado) {
      setErrorProductos('No se pudo cambiar el estado de la categoria.')
      console.error('No se pudo cambiar el estado de la categoria.', errorEstado)
    }
  }

  async function moverCategoriaAPapelera(categoria) {
    const cantidadProductos = contarProductosPorCategoria(categoria.id, productos)
    const confirmar = window.confirm(
      `Vas a mover "${categoria.name}" a la papelera. No se va a ver en la web publica.${
        cantidadProductos > 0
          ? `\n\nATENCION: tambien se van a inactivar ${cantidadProductos} producto(s) dentro de esta categoria.`
          : ''
      }`
    )

    if (!confirmar) return

    try {
      await actualizarCategoria(categoria.id, { status: 'Eliminado' })
      await Promise.all([recargarTaxonomia(), recargarProductos()])
    } catch (errorMover) {
      setErrorProductos('No se pudo mover la categoria a la papelera.')
      console.error('No se pudo mover la categoria a la papelera.', errorMover)
    }
  }

  async function restaurarCategoria(categoria) {
    try {
      await actualizarCategoria(categoria.id, { status: 'Inactivo' })
      await recargarTaxonomia()
    } catch (errorRestaurar) {
      setErrorProductos('No se pudo restaurar la categoria.')
      console.error('No se pudo restaurar la categoria.', errorRestaurar)
    }
  }

  async function eliminarCategoriaParaSiempre(categoria) {
    const cantidadProductos = contarProductosPorCategoria(categoria.id, [
      ...productos,
      ...productosEliminados
    ])
    const cantidadSubcategorias = subcategorias.filter(
      (subcategoria) => subcategoria.category_id === categoria.id
    ).length

    if (cantidadProductos > 0 || cantidadSubcategorias > 0) {
      window.alert(
        'No se puede eliminar definitivamente esta categoria porque tiene productos o subcategorias asociadas. Primero movelas o eliminalas.'
      )
      return
    }

    const confirmar = window.confirm(
      `Vas a eliminar definitivamente "${categoria.name}". Esta accion no se puede deshacer.`
    )

    if (!confirmar) return

    try {
      await eliminarCategoriaDefinitiva(categoria.id)
      await recargarTaxonomia()
    } catch (errorEliminar) {
      setErrorProductos('No se pudo eliminar definitivamente la categoria.')
      console.error('No se pudo eliminar definitivamente la categoria.', errorEliminar)
    }
  }

  async function cambiarEstadoSubcategoria(subcategoria) {
    const siguienteEstado = subcategoria.status === 'Activo' ? 'Inactivo' : 'Activo'
    const cantidadProductos = contarProductosPorSubcategoria(subcategoria.id, productos)

    const mensajeAdvertencia = siguienteEstado === 'Inactivo' && cantidadProductos > 0
      ? `\n\nATENCION: tambien se van a inactivar ${cantidadProductos} producto(s) dentro de esta subcategoria.`
      : ''

    const confirmar = window.confirm(
      siguienteEstado === 'Activo'
        ? `Vas a activar la subcategoria "${subcategoria.name}".`
        : `Vas a inactivar la subcategoria "${subcategoria.name}". No se va a ver en la web publica.${mensajeAdvertencia}`
    )

    if (!confirmar) return

    try {
      await actualizarSubcategoria(subcategoria.id, { status: siguienteEstado })
      await Promise.all([recargarTaxonomia(), recargarProductos()])
    } catch (errorEstado) {
      setErrorProductos('No se pudo cambiar el estado de la subcategoria.')
      console.error('No se pudo cambiar el estado de la subcategoria.', errorEstado)
    }
  }

  async function moverSubcategoriaAPapelera(subcategoria) {
    const cantidadProductos = contarProductosPorSubcategoria(subcategoria.id, productos)
    const confirmar = window.confirm(
      `Vas a mover "${subcategoria.name}" a la papelera. No se va a ver en la web publica.${
        cantidadProductos > 0
          ? `\n\nATENCION: tambien se van a inactivar ${cantidadProductos} producto(s) dentro de esta subcategoria.`
          : ''
      }`
    )

    if (!confirmar) return

    try {
      await actualizarSubcategoria(subcategoria.id, { status: 'Eliminado' })
      await Promise.all([recargarTaxonomia(), recargarProductos()])
    } catch (errorMover) {
      setErrorProductos('No se pudo mover la subcategoria a la papelera.')
      console.error('No se pudo mover la subcategoria a la papelera.', errorMover)
    }
  }

  async function restaurarSubcategoria(subcategoria) {
    try {
      await actualizarSubcategoria(subcategoria.id, { status: 'Inactivo' })
      await recargarTaxonomia()
    } catch (errorRestaurar) {
      setErrorProductos('No se pudo restaurar la subcategoria.')
      console.error('No se pudo restaurar la subcategoria.', errorRestaurar)
    }
  }

  async function eliminarSubcategoriaParaSiempre(subcategoria) {
    const cantidadProductos = contarProductosPorSubcategoria(subcategoria.id, [
      ...productos,
      ...productosEliminados
    ])

    if (cantidadProductos > 0) {
      window.alert(
        'No se puede eliminar definitivamente esta subcategoria porque tiene productos asociados. Primero movelos o eliminalos.'
      )
      return
    }

    const confirmar = window.confirm(
      `Vas a eliminar definitivamente "${subcategoria.name}". Esta accion no se puede deshacer.`
    )

    if (!confirmar) return

    try {
      await eliminarSubcategoriaDefinitiva(subcategoria.id)
      await recargarTaxonomia()
    } catch (errorEliminar) {
      setErrorProductos('No se pudo eliminar definitivamente la subcategoria.')
      console.error('No se pudo eliminar definitivamente la subcategoria.', errorEliminar)
    }
  }

  async function cambiarEstadoProducto(producto) {
    const siguienteEstado = producto.status === 'Activo' ? 'Inactivo' : 'Activo'

    if (siguienteEstado === 'Activo') {
      const errores = obtenerErroresActivacionProducto(producto, filtrosCatalogo)

      if (errores.length > 0) {
        window.alert(
          `No se puede activar este producto todavia:\n\n${errores
            .map((error) => `- ${error}`)
            .join('\n')}`
        )
        return
      }
    }

    const confirmar = window.confirm(
      siguienteEstado === 'Activo'
        ? `Vas a activar "${producto.title}". Se va a poder mostrar en la web publica.`
        : `Vas a inactivar "${producto.title}". Ya no se va a mostrar en la web publica.`
    )

    if (!confirmar) return

    try {
      await actualizarProducto(producto.id, { status: siguienteEstado })
      await recargarProductos()
    } catch (errorEstado) {
      setErrorProductos('No se pudo cambiar el estado del producto.')
      console.error('No se pudo cambiar el estado del producto.', errorEstado)
    }
  }

  async function cambiarEstadoExcursion(excursion) {
    const siguienteEstado = excursion.status === 'Activo' ? 'Inactivo' : 'Activo'

    if (siguienteEstado === 'Activo') {
      const errores = obtenerErroresActivacionExcursion(excursion)

      if (errores.length > 0) {
        window.alert(
          `No se puede activar esta excursion todavia:\n\n${errores
            .map((error) => `- ${error}`)
            .join('\n')}`
        )
        return
      }
    }

    const confirmar = window.confirm(
      siguienteEstado === 'Activo'
        ? `Vas a activar "${excursion.title}". Se va a poder mostrar en la web publica.`
        : `Vas a inactivar "${excursion.title}". Ya no se va a mostrar en la web publica.`
    )

    if (!confirmar) return

    try {
      await actualizarExcursion(excursion.id, { status: siguienteEstado })
      await recargarExcursiones()
    } catch (errorEstado) {
      setErrorProductos('No se pudo cambiar el estado de la excursion.')
      console.error('No se pudo cambiar el estado de la excursion.', errorEstado)
    }
  }

  async function restaurarProducto(producto) {
    try {
      await actualizarProducto(producto.id, { status: 'Inactivo' })
      await recargarProductos()
    } catch (errorRestaurar) {
      setErrorProductos('No se pudo restaurar el producto.')
      console.error('No se pudo restaurar el producto.', errorRestaurar)
    }
  }

  async function restaurarExcursion(excursion) {
    try {
      await actualizarExcursion(excursion.id, { status: 'Inactivo' })
      await recargarExcursiones()
    } catch (errorRestaurar) {
      setErrorProductos('No se pudo restaurar la excursion.')
      console.error('No se pudo restaurar la excursion.', errorRestaurar)
    }
  }

  async function eliminarProductoParaSiempre(producto) {
    const confirmar = window.confirm(
      `Vas a eliminar definitivamente "${producto.title}". Esta accion no se puede deshacer.`
    )

    if (!confirmar) return

    try {
      await eliminarProductoDefinitivo(producto.id)
      await recargarProductos()
    } catch (errorEliminar) {
      setErrorProductos('No se pudo eliminar definitivamente el producto.')
      console.error('No se pudo eliminar definitivamente el producto.', errorEliminar)
    }
  }

  async function eliminarExcursionParaSiempre(excursion) {
    const confirmar = window.confirm(
      `Vas a eliminar definitivamente "${excursion.title}". Esta accion no se puede deshacer.`
    )

    if (!confirmar) return

    try {
      await eliminarExcursionDefinitiva(excursion.id)
      await recargarExcursiones()
    } catch (errorEliminar) {
      setErrorProductos('No se pudo eliminar definitivamente la excursion.')
      console.error('No se pudo eliminar definitivamente la excursion.', errorEliminar)
    }
  }

  async function eliminarItemsPapelera(items) {
    try {
      await Promise.all(
        items.productos.map((producto) => eliminarProductoDefinitivo(producto.id))
      )
      await Promise.all(
        items.excursiones.map((excursion) => eliminarExcursionDefinitiva(excursion.id))
      )
      await Promise.all(
        items.subcategorias.map((subcategoria) =>
          eliminarSubcategoriaDefinitiva(subcategoria.id)
        )
      )
      await Promise.all(
        items.categorias.map((categoria) => eliminarCategoriaDefinitiva(categoria.id))
      )

      await Promise.all([recargarProductos(), recargarExcursiones(), recargarTaxonomia()])
      setErrorProductos('')
    } catch (errorEliminar) {
      setErrorProductos(
        'No se pudo eliminar todo lo seleccionado. Revisá si alguna categoria o subcategoria todavía tiene elementos asociados.'
      )
      console.error('No se pudo eliminar la seleccion de papelera.', errorEliminar)
    }
  }

  async function eliminarSeleccionPapelera(items) {
    const total =
      items.productos.length +
      items.excursiones.length +
      items.categorias.length +
      items.subcategorias.length

    if (total === 0) {
      window.alert('Seleccioná al menos un elemento para eliminar.')
      return false
    }

    const confirmar = window.confirm(
      `Vas a eliminar definitivamente ${total} elemento(s). Esta accion no se puede deshacer.`
    )

    if (!confirmar) return false

    await eliminarItemsPapelera(items)
    return true
  }

  async function vaciarPapelera() {
    const items = {
      productos: productosEliminados,
      excursiones: excursionesEliminadas,
      categorias: categorias.filter((categoria) => categoria.status === 'Eliminado'),
      subcategorias: subcategorias.filter(
        (subcategoria) => subcategoria.status === 'Eliminado'
      )
    }
    const total =
      items.productos.length +
      items.excursiones.length +
      items.categorias.length +
      items.subcategorias.length

    if (total === 0) return false

    const confirmar = window.confirm(
      `Vas a vaciar toda la papelera (${total} elemento(s)). Esta accion no se puede deshacer.`
    )

    if (!confirmar) return false

    await eliminarItemsPapelera(items)
    return true
  }

  async function eliminarFiltroParaSiempre(filtro) {
    const confirmar = window.confirm(
      `Vas a eliminar definitivamente el filtro "${filtro.name}". Se va a quitar tambien de los productos que lo usen.`
    )

    if (!confirmar) return

    try {
      await eliminarFiltroCatalogo(filtro.id)
      await Promise.all([recargarFiltros(), recargarProductos()])
    } catch (errorEliminar) {
      setErrorProductos('No se pudo eliminar el filtro.')
      console.error('No se pudo eliminar el filtro.', errorEliminar)
    }
  }

  async function quitarImagenExcursionExistente(indice) {
    const slot = imagenesExcursion[indice]
    if (!slot?.existente) return

    const confirmar = window.confirm(
      'Vas a eliminar esta imagen de la excursion. Esta accion no se puede deshacer.'
    )

    if (!confirmar) return

    try {
      await eliminarImagenExcursion(slot.existente)
      setImagenesExcursion((imagenesActuales) => {
        const imagenesNuevas = imagenesActuales.map((imagen) => ({ ...imagen }))
        imagenesNuevas[indice] = { existente: null, archivo: null }
        return imagenesNuevas
      })
      await recargarExcursiones()
    } catch (errorQuitar) {
      setErrorFormulario('No se pudo eliminar la imagen.')
      console.error('No se pudo eliminar la imagen de la excursion.', errorQuitar)
    }
  }

  async function quitarImagenExistente(indice) {
    const slot = imagenesProducto[indice]
    if (!slot?.existente) return

    const confirmar = window.confirm(
      'Vas a eliminar esta imagen del producto. Esta accion no se puede deshacer.'
    )

    if (!confirmar) return

    try {
      await eliminarImagenProducto(slot.existente)
      setImagenesProducto((imagenesActuales) => {
        const imagenesNuevas = imagenesActuales.map((imagen) => ({ ...imagen }))
        imagenesNuevas[indice] = { existente: null, archivo: null }
        return imagenesNuevas
      })
      await recargarProductos()
    } catch (errorQuitar) {
      setErrorFormulario('No se pudo eliminar la imagen.')
      console.error('No se pudo eliminar la imagen del producto.', errorQuitar)
    }
  }

  function editarProducto(producto) {
    setProductoEditandoId(producto.id)
    const slotsImagenes = Array.from({ length: MAX_IMAGENES }, (_, indice) => ({
      existente:
        producto.images?.find((imagen) => imagen.sort_order === indice) || null,
      archivo: null
    }))

    setProductoForm({
      title: producto.title,
      brand: producto.brand,
      price: String(producto.price),
      category_id: producto.category_id,
      subcategory_id: producto.subcategory_id || '',
      description: producto.description,
      is_featured: producto.is_featured,
      filter_ids: producto.filter_ids || [],
      available_colors: obtenerColoresProducto(producto),
      custom_color: ''
    })
    setImagenesProducto(slotsImagenes)
    setErrorFormulario('')
    setMostrarFormularioProducto(true)
    setSeccionActiva('productos')
  }

  function editarExcursion(excursion) {
    setExcursionEditandoId(excursion.id)
    const slotsImagenes = Array.from({ length: MAX_IMAGENES }, (_, indice) => ({
      existente:
        excursion.images?.find((imagen) => imagen.sort_order === indice) || null,
      archivo: null
    }))

    setExcursionForm({
      title: excursion.title,
      price: String(excursion.price),
      description: excursion.description,
      departure_place: excursion.departure_place,
      destination_place: excursion.destination_place || '',
      duration: excursion.duration
    })
    setImagenesExcursion(slotsImagenes)
    setErrorFormulario('')
    setMostrarFormularioExcursion(true)
    setSeccionActiva('excursiones')
  }

  function editarFiltro(filtro) {
    setFiltroEditandoId(filtro.id)
    setFiltroForm({
      name: filtro.name,
      category_id: filtro.category_id,
      subcategory_ids: filtro.subcategory_ids || [],
      busquedaSubcategorias: ''
    })
    setErrorFormulario('')
    setMostrarFormularioFiltro(true)
    setSeccionActiva('filtros')
  }

  function editarCategoria(categoria) {
    setCategoriaEditandoId(categoria.id)
    setCategoriaForm({
      name: categoria.name,
      sort_order: categoria.sort_order
    })
    setErrorFormulario('')
    setMostrarFormularioCategoria(true)
    setSeccionActiva('categorias')
  }

  function editarSubcategoria(subcategoria) {
    setSubcategoriaEditandoId(subcategoria.id)
    setSubcategoriaForm({
      category_id: subcategoria.category_id,
      name: subcategoria.name,
      sort_order: subcategoria.sort_order
    })
    setErrorFormulario('')
    setMostrarFormularioSubcategoria(true)
    setSeccionActiva('subcategorias')
  }

  function cerrarFormularioProducto() {
    setProductoForm(productoInicial)
    setProductoEditandoId(null)
    setImagenesProducto(slotsImagenesIniciales)
    setMostrarFormularioProducto(false)
    setErrorFormulario('')
  }

  function cerrarFormularioExcursion() {
    setExcursionForm(excursionInicial)
    setExcursionEditandoId(null)
    setImagenesExcursion(slotsImagenesIniciales)
    setMostrarFormularioExcursion(false)
    setErrorFormulario('')
  }

  function cerrarFormularioFiltro() {
    setFiltroForm(filtroInicial)
    setFiltroEditandoId(null)
    setMostrarFormularioFiltro(false)
    setErrorFormulario('')
  }

  function cerrarFormularioCategoria() {
    setCategoriaForm(categoriaInicial)
    setCategoriaEditandoId(null)
    setMostrarFormularioCategoria(false)
    setErrorFormulario('')
  }

  function cerrarFormularioSubcategoria() {
    setSubcategoriaForm(subcategoriaInicial)
    setSubcategoriaEditandoId(null)
    setMostrarFormularioSubcategoria(false)
    setErrorFormulario('')
  }

  function cambiarSeccion(seccion) {
    cerrarFormularioProducto()
    cerrarFormularioExcursion()
    cerrarFormularioFiltro()
    cerrarFormularioCategoria()
    cerrarFormularioSubcategoria()
    setSeccionActiva(seccion)
  }

  if (cargando) {
    return (
      <main className="admin-page">
        <p className="admin-status">Cargando Admin Pierre Bandenay...</p>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="admin-page admin-login-page">
        <form className="admin-login-card" onSubmit={manejarLogin}>
          <span className="admin-kicker">Panel privado</span>
          <h1>Admin Pierre Bandenay</h1>
          <p>Ingresa con el email autorizado para administrar el catalogo.</p>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contrasena
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-page admin-dashboard">
      <aside className="admin-sidebar">
        <h1>Admin Pierre Bandenay</h1>
        <nav aria-label="Secciones del panel">
          <button
            className={`admin-nav-item ${seccionActiva === 'productos' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('productos')}
          >
            Productos
          </button>
          <button
            className={`admin-nav-item ${seccionActiva === 'excursiones' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('excursiones')}
          >
            Excursiones
          </button>
          <button
            className={`admin-nav-item ${seccionActiva === 'categorias' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('categorias')}
          >
            Categorias
          </button>
          <button
            className={`admin-nav-item ${seccionActiva === 'subcategorias' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('subcategorias')}
          >
            Subcategorias
          </button>
          <button
            className={`admin-nav-item ${seccionActiva === 'filtros' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('filtros')}
          >
            Filtros
          </button>
          <button
            className={`admin-nav-item ${seccionActiva === 'papelera' ? 'activo' : ''}`}
            onClick={() => cambiarSeccion('papelera')}
          >
            Papelera
          </button>
        </nav>
        <button className="admin-logout" onClick={manejarCerrarSesion}>
          Cerrar sesion
        </button>
      </aside>

      <section className="admin-content">
        {seccionActiva === 'productos' && (
          <EncabezadoProductos
            mostrarFormularioProducto={mostrarFormularioProducto}
            abrirFormulario={() => setMostrarFormularioProducto(true)}
            cerrarFormulario={cerrarFormularioProducto}
          />
        )}

        {seccionActiva === 'excursiones' && (
          <EncabezadoAdmin
            kicker="Salidas"
            titulo="Excursiones"
            boton={mostrarFormularioExcursion ? 'Cerrar formulario' : 'Nueva excursion'}
            onClick={mostrarFormularioExcursion
              ? cerrarFormularioExcursion
              : () => setMostrarFormularioExcursion(true)}
          />
        )}

        {seccionActiva === 'categorias' && (
          <EncabezadoAdmin
            kicker="Catalogo"
            titulo="Categorias"
            boton={mostrarFormularioCategoria ? 'Cerrar formulario' : 'Nueva categoria'}
            onClick={mostrarFormularioCategoria
              ? cerrarFormularioCategoria
              : () => setMostrarFormularioCategoria(true)}
          />
        )}

        {seccionActiva === 'subcategorias' && (
          <EncabezadoAdmin
            kicker="Catalogo"
            titulo="Subcategorias"
            boton={mostrarFormularioSubcategoria ? 'Cerrar formulario' : 'Nueva subcategoria'}
            onClick={mostrarFormularioSubcategoria
              ? cerrarFormularioSubcategoria
              : () => setMostrarFormularioSubcategoria(true)}
          />
        )}

        {seccionActiva === 'filtros' && (
          <EncabezadoAdmin
            kicker="Catalogo"
            titulo="Filtros"
            boton={mostrarFormularioFiltro ? 'Cerrar formulario' : 'Nuevo filtro'}
            onClick={mostrarFormularioFiltro
              ? cerrarFormularioFiltro
              : () => setMostrarFormularioFiltro(true)}
          />
        )}

        {seccionActiva === 'papelera' && (
          <div className="admin-section-header">
            <div>
              <span className="admin-kicker">Eliminados</span>
              <h2>Papelera</h2>
            </div>
          </div>
        )}

        {errorProductos && <p className="admin-error">{errorProductos}</p>}

        {seccionActiva === 'productos' && mostrarFormularioProducto && (
          <FormularioProducto
            productoEditandoId={productoEditandoId}
            productoForm={productoForm}
            categorias={categorias}
            subcategoriasDisponibles={subcategoriasDisponibles}
            filtrosDisponiblesProducto={filtrosDisponiblesProducto}
            guardandoProducto={guardandoProducto}
            errorFormulario={errorFormulario}
            imagenesProducto={imagenesProducto}
            actualizarProductoForm={actualizarProductoForm}
            cambiarImagenProducto={(indice, archivo) => {
              setImagenesProducto((imagenesActuales) => {
                const imagenesNuevas = imagenesActuales.map((slot) => ({ ...slot }))
                imagenesNuevas[indice].archivo = archivo
                return imagenesNuevas
              })
            }}
            quitarImagenExistente={quitarImagenExistente}
            manejarGuardarProducto={manejarGuardarProducto}
            cerrarFormularioProducto={cerrarFormularioProducto}
          />
        )}

        {seccionActiva === 'excursiones' && mostrarFormularioExcursion && (
          <FormularioExcursion
            excursionEditandoId={excursionEditandoId}
            excursionForm={excursionForm}
            guardandoExcursion={guardandoExcursion}
            errorFormulario={errorFormulario}
            imagenesExcursion={imagenesExcursion}
            actualizarExcursionForm={actualizarExcursionForm}
            cambiarImagenExcursion={(indice, archivo) => {
              setImagenesExcursion((imagenesActuales) => {
                const imagenesNuevas = imagenesActuales.map((slot) => ({ ...slot }))
                imagenesNuevas[indice].archivo = archivo
                return imagenesNuevas
              })
            }}
            quitarImagenExcursionExistente={quitarImagenExcursionExistente}
            manejarGuardarExcursion={manejarGuardarExcursion}
            cerrarFormularioExcursion={cerrarFormularioExcursion}
          />
        )}

        {seccionActiva === 'productos' && (
          <FiltrosProductos
            filtros={filtrosProductos}
            categorias={categorias.filter((categoria) => categoria.status !== 'Eliminado')}
            subcategorias={subcategoriasFiltroProductos}
            actualizarFiltro={actualizarFiltroProducto}
          />
        )}

        {seccionActiva === 'categorias' && mostrarFormularioCategoria && (
          <FormularioCategoria
            categoriaEditandoId={categoriaEditandoId}
            categoriaForm={categoriaForm}
            guardandoCategoria={guardandoCategoria}
            errorFormulario={errorFormulario}
            actualizarCategoriaForm={actualizarCategoriaForm}
            manejarGuardarCategoria={manejarGuardarCategoria}
            cerrarFormularioCategoria={cerrarFormularioCategoria}
          />
        )}

        {seccionActiva === 'subcategorias' && mostrarFormularioSubcategoria && (
          <FormularioSubcategoria
            subcategoriaEditandoId={subcategoriaEditandoId}
            subcategoriaForm={subcategoriaForm}
            categorias={categorias.filter((categoria) => categoria.status !== 'Eliminado')}
            guardandoSubcategoria={guardandoSubcategoria}
            errorFormulario={errorFormulario}
            actualizarSubcategoriaForm={actualizarSubcategoriaForm}
            manejarGuardarSubcategoria={manejarGuardarSubcategoria}
            cerrarFormularioSubcategoria={cerrarFormularioSubcategoria}
          />
        )}

        {seccionActiva === 'filtros' && mostrarFormularioFiltro && (
          <FormularioFiltro
            filtroEditandoId={filtroEditandoId}
            filtroForm={filtroForm}
            categorias={categorias.filter((categoria) => categoria.status !== 'Eliminado')}
            subcategorias={subcategorias.filter((subcategoria) => subcategoria.status !== 'Eliminado')}
            guardandoFiltro={guardandoFiltro}
            errorFormulario={errorFormulario}
            actualizarFiltroForm={actualizarFiltroForm}
            manejarGuardarFiltro={manejarGuardarFiltro}
            cerrarFormularioFiltro={cerrarFormularioFiltro}
          />
        )}

        {seccionActiva === 'subcategorias' && (
          <FiltrosSubcategorias
            filtros={filtrosSubcategorias}
            categorias={categorias.filter((categoria) => categoria.status !== 'Eliminado')}
            actualizarFiltro={actualizarFiltroSubcategoria}
          />
        )}

        {cargandoProductos ? (
          <p className="admin-status">Cargando productos...</p>
        ) : seccionActiva === 'papelera' ? (
          <PapeleraAdmin
            productosEliminados={productosEliminados}
            excursionesEliminadas={excursionesEliminadas}
            categoriasEliminadas={categorias.filter((categoria) => categoria.status === 'Eliminado')}
            subcategoriasEliminadas={subcategorias.filter((subcategoria) => subcategoria.status === 'Eliminado')}
            formatoPrecio={formatoPrecio}
            restaurarProducto={restaurarProducto}
            eliminarProductoParaSiempre={eliminarProductoParaSiempre}
            restaurarExcursion={restaurarExcursion}
            eliminarExcursionParaSiempre={eliminarExcursionParaSiempre}
            restaurarCategoria={restaurarCategoria}
            eliminarCategoriaParaSiempre={eliminarCategoriaParaSiempre}
            restaurarSubcategoria={restaurarSubcategoria}
            eliminarSubcategoriaParaSiempre={eliminarSubcategoriaParaSiempre}
            eliminarSeleccionPapelera={eliminarSeleccionPapelera}
            vaciarPapelera={vaciarPapelera}
          />
        ) : seccionActiva === 'productos' ? (
          <TablaProductos
            productos={productosFiltrados}
            formatoPrecio={formatoPrecio}
            vacioTitulo="Todavia no hay productos cargados"
            vacioTexto="Cuando creemos el formulario, aca van a aparecer los productos para editar, activar, inactivar o enviar a papelera."
            renderAcciones={(producto) => (
              <div className="admin-row-actions">
                <button
                  type="button"
                  className="admin-small-btn"
                  onClick={() => editarProducto(producto)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="admin-small-btn admin-state-btn"
                  onClick={() => cambiarEstadoProducto(producto)}
                >
                  {producto.status === 'Activo' ? 'Inactivar' : 'Activar'}
                </button>
                <button
                  type="button"
                  className="admin-small-btn admin-danger-btn"
                  onClick={() => moverProductoAPapelera(producto)}
                >
                  Mover a papelera
                </button>
              </div>
            )}
          />
        ) : seccionActiva === 'excursiones' ? (
          <TablaExcursiones
            excursiones={excursiones}
            formatoPrecio={formatoPrecio}
            editarExcursion={editarExcursion}
            cambiarEstadoExcursion={cambiarEstadoExcursion}
            moverExcursionAPapelera={moverExcursionAPapelera}
          />
        ) : seccionActiva === 'filtros' ? (
          <TablaFiltros
            filtros={filtrosConDetalle}
            editarFiltro={editarFiltro}
            eliminarFiltroParaSiempre={eliminarFiltroParaSiempre}
          />
        ) : seccionActiva === 'categorias' ? (
          <TablaCategorias
            categorias={categorias.filter((categoria) => categoria.status !== 'Eliminado')}
            productos={productos}
            subcategorias={subcategorias}
            editarCategoria={editarCategoria}
            cambiarEstadoCategoria={cambiarEstadoCategoria}
            moverCategoriaAPapelera={moverCategoriaAPapelera}
          />
        ) : (
          <TablaSubcategorias
            subcategorias={subcategoriasFiltradas}
            productos={productos}
            editarSubcategoria={editarSubcategoria}
            cambiarEstadoSubcategoria={cambiarEstadoSubcategoria}
            moverSubcategoriaAPapelera={moverSubcategoriaAPapelera}
          />
        )}
      </section>
    </main>
  )
}

function EncabezadoProductos({
  mostrarFormularioProducto,
  abrirFormulario,
  cerrarFormulario
}) {
  return (
    <div className="admin-section-header">
      <div>
        <span className="admin-kicker">Catalogo</span>
        <h2>Productos</h2>
      </div>
      <button
        type="button"
        onClick={mostrarFormularioProducto ? cerrarFormulario : abrirFormulario}
      >
        {mostrarFormularioProducto ? 'Cerrar formulario' : 'Nuevo producto'}
      </button>
    </div>
  )
}

function EncabezadoAdmin({ kicker, titulo, boton, onClick }) {
  return (
    <div className="admin-section-header">
      <div>
        <span className="admin-kicker">{kicker}</span>
        <h2>{titulo}</h2>
      </div>
      <button type="button" onClick={onClick}>
        {boton}
      </button>
    </div>
  )
}

function FiltrosProductos({
  filtros,
  categorias,
  subcategorias,
  actualizarFiltro
}) {
  return (
    <div className="admin-filters">
      <label>
        Buscar producto
        <input
          type="search"
          placeholder="Titulo, marca o categoria"
          value={filtros.busqueda}
          onChange={(event) => actualizarFiltro('busqueda', event.target.value)}
        />
      </label>

      <label>
        Categoria
        <select
          value={filtros.category_id}
          onChange={(event) => actualizarFiltro('category_id', event.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Subcategoria
        <select
          value={filtros.subcategory_id}
          onChange={(event) => actualizarFiltro('subcategory_id', event.target.value)}
          disabled={!filtros.category_id}
        >
          <option value="">Todas</option>
          {subcategorias.map((subcategoria) => (
            <option key={subcategoria.id} value={subcategoria.id}>
              {subcategoria.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function FiltrosSubcategorias({ filtros, categorias, actualizarFiltro }) {
  return (
    <div className="admin-filters">
      <label>
        Buscar subcategoria
        <input
          type="search"
          placeholder="Nombre o categoria"
          value={filtros.busqueda}
          onChange={(event) => actualizarFiltro('busqueda', event.target.value)}
        />
      </label>

      <label>
        Categoria
        <select
          value={filtros.category_id}
          onChange={(event) => actualizarFiltro('category_id', event.target.value)}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function FormularioCategoria({
  categoriaEditandoId,
  categoriaForm,
  guardandoCategoria,
  errorFormulario,
  actualizarCategoriaForm,
  manejarGuardarCategoria,
  cerrarFormularioCategoria
}) {
  return (
    <form className="admin-product-form" onSubmit={manejarGuardarCategoria}>
      <h3>{categoriaEditandoId ? 'Editar categoria' : 'Nueva categoria'}</h3>

      <div className="admin-form-grid admin-form-grid-compact">
        <label>
          Nombre
          <input
            type="text"
            value={categoriaForm.name}
            onChange={(event) => actualizarCategoriaForm('name', event.target.value)}
            required
          />
        </label>

        <label>
          Orden
          <input
            type="number"
            step="1"
            value={categoriaForm.sort_order}
            onChange={(event) =>
              actualizarCategoriaForm('sort_order', event.target.value)
            }
          />
        </label>
      </div>

      {errorFormulario && <p className="admin-error">{errorFormulario}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={guardandoCategoria}>
          {guardandoCategoria ? 'Guardando...' : 'Guardar categoria'}
        </button>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={cerrarFormularioCategoria}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function FormularioSubcategoria({
  subcategoriaEditandoId,
  subcategoriaForm,
  categorias,
  guardandoSubcategoria,
  errorFormulario,
  actualizarSubcategoriaForm,
  manejarGuardarSubcategoria,
  cerrarFormularioSubcategoria
}) {
  return (
    <form className="admin-product-form" onSubmit={manejarGuardarSubcategoria}>
      <h3>{subcategoriaEditandoId ? 'Editar subcategoria' : 'Nueva subcategoria'}</h3>

      <div className="admin-form-grid">
        <label>
          Categoria
          <select
            value={subcategoriaForm.category_id}
            onChange={(event) =>
              actualizarSubcategoriaForm('category_id', event.target.value)
            }
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nombre
          <input
            type="text"
            value={subcategoriaForm.name}
            onChange={(event) => actualizarSubcategoriaForm('name', event.target.value)}
            required
          />
        </label>

        <label>
          Orden
          <input
            type="number"
            step="1"
            value={subcategoriaForm.sort_order}
            onChange={(event) =>
              actualizarSubcategoriaForm('sort_order', event.target.value)
            }
          />
        </label>
      </div>

      {errorFormulario && <p className="admin-error">{errorFormulario}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={guardandoSubcategoria}>
          {guardandoSubcategoria ? 'Guardando...' : 'Guardar subcategoria'}
        </button>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={cerrarFormularioSubcategoria}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function FormularioFiltro({
  filtroEditandoId,
  filtroForm,
  categorias,
  subcategorias,
  guardandoFiltro,
  errorFormulario,
  actualizarFiltroForm,
  manejarGuardarFiltro,
  cerrarFormularioFiltro
}) {
  const subcategoriasCategoria = subcategorias.filter(
    (subcategoria) => subcategoria.category_id === filtroForm.category_id
  )
  const busqueda = filtroForm.busquedaSubcategorias.trim().toLowerCase()
  const subcategoriasFiltradas = busqueda
    ? subcategoriasCategoria.filter((subcategoria) =>
        [subcategoria.name, subcategoria.category?.name]
          .join(' ')
          .toLowerCase()
          .includes(busqueda)
      )
    : subcategoriasCategoria

  function alternarSubcategoria(subcategoryId) {
    const seleccionadas = filtroForm.subcategory_ids || []

    actualizarFiltroForm(
      'subcategory_ids',
      seleccionadas.includes(subcategoryId)
        ? seleccionadas.filter((id) => id !== subcategoryId)
        : [...seleccionadas, subcategoryId]
    )
  }

  function seleccionarTodas() {
    actualizarFiltroForm(
      'subcategory_ids',
      subcategoriasCategoria.map((subcategoria) => subcategoria.id)
    )
  }

  return (
    <form className="admin-product-form" onSubmit={manejarGuardarFiltro}>
      <h3>{filtroEditandoId ? 'Editar filtro' : 'Nuevo filtro'}</h3>

      <div className="admin-form-grid">
        <label>
          Nombre del filtro
          <input
            type="text"
            value={filtroForm.name}
            onChange={(event) => actualizarFiltroForm('name', event.target.value)}
            placeholder="Ej: 4.20 m"
            required
          />
        </label>

        <label>
          Categoria
          <select
            value={filtroForm.category_id}
            onChange={(event) => actualizarFiltroForm('category_id', event.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Buscar subcategoria
          <input
            type="text"
            value={filtroForm.busquedaSubcategorias}
            onChange={(event) =>
              actualizarFiltroForm('busquedaSubcategorias', event.target.value)
            }
            placeholder="Ej: Pejerrey"
            disabled={!filtroForm.category_id}
          />
        </label>
      </div>

      <div className="admin-filter-subcategories">
        <div className="admin-filter-subcategories-header">
          <strong>Subcategorias donde aplica</strong>
          <button
            type="button"
            className="admin-secondary-btn"
            onClick={seleccionarTodas}
            disabled={!filtroForm.category_id || subcategoriasCategoria.length === 0}
          >
            Aplicar a todas
          </button>
        </div>

        {!filtroForm.category_id ? (
          <p>Elegí una categoria para ver sus subcategorias.</p>
        ) : subcategoriasFiltradas.length === 0 ? (
          <p>No encontramos subcategorias con esa busqueda.</p>
        ) : (
          <div className="admin-filter-subcategories-list">
            {subcategoriasFiltradas.map((subcategoria) => (
              <label key={subcategoria.id}>
                <input
                  type="checkbox"
                  checked={filtroForm.subcategory_ids.includes(subcategoria.id)}
                  onChange={() => alternarSubcategoria(subcategoria.id)}
                />
                {subcategoria.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {errorFormulario && <p className="admin-error">{errorFormulario}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={guardandoFiltro}>
          {guardandoFiltro ? 'Guardando...' : 'Guardar filtro'}
        </button>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={cerrarFormularioFiltro}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function FormularioProducto({
  productoEditandoId,
  productoForm,
  categorias,
  subcategoriasDisponibles,
  filtrosDisponiblesProducto,
  guardandoProducto,
  errorFormulario,
  imagenesProducto,
  actualizarProductoForm,
  cambiarImagenProducto,
  quitarImagenExistente,
  manejarGuardarProducto,
  cerrarFormularioProducto
}) {
  function alternarColor(color) {
    const coloresActuales = productoForm.available_colors || []
    const existe = coloresActuales.some(
      (colorActual) => colorActual.toLowerCase() === color.toLowerCase()
    )

    actualizarProductoForm(
      'available_colors',
      existe
        ? coloresActuales.filter(
            (colorActual) => colorActual.toLowerCase() !== color.toLowerCase()
          )
        : [...coloresActuales, color]
    )
  }

  function agregarColorPersonalizado() {
    const color = productoForm.custom_color.trim()
    if (!color) return

    const coloresActuales = productoForm.available_colors || []
    const existe = coloresActuales.some(
      (colorActual) => colorActual.toLowerCase() === color.toLowerCase()
    )

    actualizarProductoForm(
      'available_colors',
      existe ? coloresActuales : [...coloresActuales, color]
    )
    actualizarProductoForm('custom_color', '')
  }

  function alternarFiltroProducto(filterId) {
    const filtrosActuales = productoForm.filter_ids || []

    actualizarProductoForm(
      'filter_ids',
      filtrosActuales.includes(filterId)
        ? filtrosActuales.filter((id) => id !== filterId)
        : [...filtrosActuales, filterId]
    )
  }

  return (
    <form className="admin-product-form" onSubmit={manejarGuardarProducto}>
      <h3>{productoEditandoId ? 'Editar producto' : 'Nuevo producto'}</h3>

      <div className="admin-form-grid">
        <label>
          Titulo
          <input
            type="text"
            value={productoForm.title}
            onChange={(event) => actualizarProductoForm('title', event.target.value)}
            required
          />
        </label>

        <label>
          Marca
          <input
            type="text"
            value={productoForm.brand}
            onChange={(event) => actualizarProductoForm('brand', event.target.value)}
            required
          />
        </label>

        <label>
          Precio
          <input
            type="number"
            min="1"
            step="1"
            value={productoForm.price}
            onChange={(event) => actualizarProductoForm('price', event.target.value)}
            required
          />
        </label>

        <label>
          Categoria
          <select
            value={productoForm.category_id}
            onChange={(event) => actualizarProductoForm('category_id', event.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subcategoria
          <select
            value={productoForm.subcategory_id}
            onChange={(event) => actualizarProductoForm('subcategory_id', event.target.value)}
            disabled={!productoForm.category_id || subcategoriasDisponibles.length === 0}
          >
            <option value="">Sin subcategoria</option>
            {subcategoriasDisponibles.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.name}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={productoForm.is_featured}
            onChange={(event) =>
              actualizarProductoForm('is_featured', event.target.checked)
            }
          />
          Destacado
        </label>
      </div>

      <div className="admin-product-filters-field">
        <div>
          <strong>Filtros</strong>
          <span>
            {filtrosDisponiblesProducto.length > 0
              ? 'Elegí uno o más filtros donde mostrar este producto.'
              : 'No hay filtros para la subcategoria seleccionada.'}
          </span>
        </div>
        {!productoForm.subcategory_id ? (
          <p>Selecciona una subcategoria para ver sus filtros.</p>
        ) : filtrosDisponiblesProducto.length > 0 ? (
          <div className="admin-product-filters-list">
            {filtrosDisponiblesProducto.map((filtro) => (
              <label key={filtro.id}>
                <input
                  type="checkbox"
                  checked={(productoForm.filter_ids || []).includes(filtro.id)}
                  onChange={() => alternarFiltroProducto(filtro.id)}
                />
                {filtro.name}
              </label>
            ))}
          </div>
        ) : (
          <p>Este producto se va a mostrar sin filtros especificos.</p>
        )}
      </div>

      <label>
        Descripcion
        <textarea
          value={productoForm.description}
          onChange={(event) => actualizarProductoForm('description', event.target.value)}
          rows="5"
          required
        />
      </label>

      <div className="admin-colors-field">
        <div>
          <strong>Colores disponibles</strong>
          <span>
            Opcional. Si cargas colores, el cliente va a tener que elegir uno antes
            de agregar el producto al carrito.
          </span>
        </div>

        <div className="admin-color-options">
          {coloresPredefinidos.map((color) => {
            const activo = productoForm.available_colors?.some(
              (colorActual) => colorActual.toLowerCase() === color.toLowerCase()
            )

            return (
              <button
                type="button"
                className={activo ? 'admin-color-chip activo' : 'admin-color-chip'}
                key={color}
                onClick={() => alternarColor(color)}
              >
                {color}
              </button>
            )
          })}
        </div>

        <div className="admin-custom-color">
          <input
            type="text"
            value={productoForm.custom_color}
            onChange={(event) =>
              actualizarProductoForm('custom_color', event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              agregarColorPersonalizado()
            }}
            placeholder="Ej: Naranja/negro"
          />
          <button type="button" onClick={agregarColorPersonalizado}>
            Agregar color
          </button>
        </div>

        {productoForm.available_colors?.length > 0 && (
          <div className="admin-selected-colors">
            {productoForm.available_colors.map((color) => (
              <button
                type="button"
                className="admin-selected-color"
                key={color}
                onClick={() => alternarColor(color)}
                title="Quitar color"
              >
                {color} x
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="admin-file-label">
        Imagenes
        <div className="admin-image-slots">
          {imagenesProducto.map((slot, indice) => (
            <label className="admin-image-slot" key={indice}>
              <span>{indice === 0 ? 'Imagen principal' : `Imagen ${indice + 1}`}</span>
              {slot.existente && (
                <img
                  className="admin-image-preview"
                  src={slot.existente.image_url}
                  alt={`Imagen ${indice + 1} del producto`}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  cambiarImagenProducto(indice, event.target.files?.[0] || null)
                }
              />
              <small>
                {slot.archivo
                  ? `Nueva: ${slot.archivo.name}`
                  : slot.existente
                    ? 'Imagen cargada'
                    : 'Sin imagen seleccionada'}
              </small>
              {slot.existente && (
                <button
                  type="button"
                  className="admin-remove-image-btn"
                  onClick={() => quitarImagenExistente(indice)}
                >
                  Quitar imagen
                </button>
              )}
            </label>
          ))}
        </div>
      </div>

      {errorFormulario && <p className="admin-error">{errorFormulario}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={guardandoProducto}>
          {guardandoProducto
            ? 'Guardando...'
            : productoEditandoId
              ? 'Guardar cambios'
              : 'Guardar producto inactivo'}
        </button>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={cerrarFormularioProducto}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function FormularioExcursion({
  excursionEditandoId,
  excursionForm,
  guardandoExcursion,
  errorFormulario,
  imagenesExcursion,
  actualizarExcursionForm,
  cambiarImagenExcursion,
  quitarImagenExcursionExistente,
  manejarGuardarExcursion,
  cerrarFormularioExcursion
}) {
  return (
    <form className="admin-product-form" onSubmit={manejarGuardarExcursion}>
      <h3>{excursionEditandoId ? 'Editar excursion' : 'Nueva excursion'}</h3>

      <div className="admin-form-grid">
        <label>
          Titulo
          <input
            type="text"
            value={excursionForm.title}
            onChange={(event) => actualizarExcursionForm('title', event.target.value)}
            required
          />
        </label>

        <label>
          Precio
          <input
            type="number"
            min="1"
            step="1"
            value={excursionForm.price}
            onChange={(event) => actualizarExcursionForm('price', event.target.value)}
            required
          />
        </label>

        <label>
          Lugar de salida
          <input
            type="text"
            value={excursionForm.departure_place}
            onChange={(event) =>
              actualizarExcursionForm('departure_place', event.target.value)
            }
            required
          />
        </label>

        <label>
          Lugar de excursion
          <input
            type="text"
            value={excursionForm.destination_place}
            onChange={(event) =>
              actualizarExcursionForm('destination_place', event.target.value)
            }
            placeholder="Ej: Laguna de Chascomus"
            required
          />
        </label>

        <label>
          Duracion
          <input
            type="text"
            value={excursionForm.duration}
            onChange={(event) => actualizarExcursionForm('duration', event.target.value)}
            placeholder="Ej: Jornada completa"
            required
          />
        </label>
      </div>

      <label>
        Descripcion larga
        <textarea
          value={excursionForm.description}
          onChange={(event) => actualizarExcursionForm('description', event.target.value)}
          rows="6"
          required
        />
      </label>

      <div className="admin-file-label">
        Fotos
        <div className="admin-image-slots">
          {imagenesExcursion.map((slot, indice) => (
            <label className="admin-image-slot" key={indice}>
              <span>{indice === 0 ? 'Foto principal' : `Foto ${indice + 1}`}</span>
              {slot.existente && (
                <img
                  className="admin-image-preview"
                  src={slot.existente.image_url}
                  alt={`Foto ${indice + 1} de la excursion`}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  cambiarImagenExcursion(indice, event.target.files?.[0] || null)
                }
              />
              <small>
                {slot.archivo
                  ? `Nueva: ${slot.archivo.name}`
                  : slot.existente
                    ? 'Foto cargada'
                    : 'Sin foto seleccionada'}
              </small>
              {slot.existente && (
                <button
                  type="button"
                  className="admin-remove-image-btn"
                  onClick={() => quitarImagenExcursionExistente(indice)}
                >
                  Quitar foto
                </button>
              )}
            </label>
          ))}
        </div>
      </div>

      {errorFormulario && <p className="admin-error">{errorFormulario}</p>}

      <div className="admin-form-actions">
        <button type="submit" disabled={guardandoExcursion}>
          {guardandoExcursion
            ? 'Guardando...'
            : excursionEditandoId
              ? 'Guardar cambios'
              : 'Guardar excursion inactiva'}
        </button>
        <button
          type="button"
          className="admin-secondary-btn"
          onClick={cerrarFormularioExcursion}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function TablaProductos({
  productos,
  formatoPrecio,
  vacioTitulo,
  vacioTexto,
  renderAcciones,
  seleccionados = [],
  alternarSeleccion = null
}) {
  if (productos.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>{vacioTitulo}</h3>
        <p>{vacioTexto}</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {alternarSeleccion && <th>Sel.</th>}
            <th>Producto</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Imagenes</th>
            <th>Colores</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              {alternarSeleccion && (
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(producto.id)}
                    onChange={() => alternarSeleccion(producto.id)}
                    aria-label={`Seleccionar ${producto.title}`}
                  />
                </td>
              )}
              <td>
                <strong>{producto.title}</strong>
                <span>{producto.brand}</span>
              </td>
              <td>
                {producto.category?.name || '-'}
                {producto.subcategory?.name ? ` / ${producto.subcategory.name}` : ''}
              </td>
              <td>${formatoPrecio.format(producto.price)}</td>
              <td>
                <span className={`admin-status-badge ${producto.status.toLowerCase()}`}>
                  {producto.status}
                </span>
              </td>
              <td>{producto.images?.length || 0}</td>
              <td>{obtenerColoresProducto(producto).join(', ') || '-'}</td>
              <td>{producto.is_featured ? 'Si' : 'No'}</td>
              <td>{renderAcciones(producto)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TablaFiltros({
  filtros,
  editarFiltro,
  eliminarFiltroParaSiempre
}) {
  if (filtros.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>Todavia no hay filtros cargados</h3>
        <p>Cuando crees filtros, van a aparecer aca para asignarlos a productos.</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Filtro</th>
            <th>Categoria</th>
            <th>Subcategorias</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtros.map((filtro) => (
            <tr key={filtro.id}>
              <td>
                <strong>{filtro.name}</strong>
                <span>{filtro.slug}</span>
              </td>
              <td>{filtro.category?.name || '-'}</td>
              <td>
                {filtro.subcategories?.length > 0
                  ? filtro.subcategories.map((subcategoria) => subcategoria.name).join(', ')
                  : '-'}
              </td>
              <td>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="admin-small-btn"
                    onClick={() => editarFiltro(filtro)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-small-btn admin-danger-btn"
                    onClick={() => eliminarFiltroParaSiempre(filtro)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TablaExcursiones({
  excursiones,
  formatoPrecio,
  editarExcursion,
  cambiarEstadoExcursion,
  moverExcursionAPapelera
}) {
  if (excursiones.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>Todavia no hay excursiones cargadas</h3>
        <p>Cuando crees excursiones, van a aparecer aca para editarlas.</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Excursion</th>
            <th>Salida</th>
            <th>Excursion</th>
            <th>Duracion</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Fotos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {excursiones.map((excursion) => (
            <tr key={excursion.id}>
              <td>
                <strong>{excursion.title}</strong>
                <span>{excursion.description}</span>
              </td>
              <td>{excursion.departure_place}</td>
              <td>{excursion.destination_place || '-'}</td>
              <td>{excursion.duration}</td>
              <td>${formatoPrecio.format(excursion.price)}</td>
              <td>
                <span className={`admin-status-badge ${excursion.status.toLowerCase()}`}>
                  {excursion.status}
                </span>
              </td>
              <td>{excursion.images?.length || 0}</td>
              <td>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="admin-small-btn"
                    onClick={() => editarExcursion(excursion)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="admin-small-btn admin-state-btn"
                    onClick={() => cambiarEstadoExcursion(excursion)}
                  >
                    {excursion.status === 'Activo' ? 'Inactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    className="admin-small-btn admin-danger-btn"
                    onClick={() => moverExcursionAPapelera(excursion)}
                  >
                    Mover a papelera
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TablaCategorias({
  categorias,
  productos,
  subcategorias,
  editarCategoria,
  cambiarEstadoCategoria,
  moverCategoriaAPapelera
}) {
  if (categorias.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>Todavia no hay categorias cargadas</h3>
        <p>Cuando crees categorias, van a aparecer aca para editarlas.</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Categoria</th>
            <th>Orden</th>
            <th>Estado</th>
            <th>Subcategorias</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => {
            const cantidadProductos = contarProductosPorCategoria(categoria.id, productos)
            const cantidadSubcategorias = subcategorias.filter(
              (subcategoria) =>
                subcategoria.category_id === categoria.id &&
                subcategoria.status !== 'Eliminado'
            ).length

            return (
              <tr key={categoria.id}>
                <td>
                  <strong>{categoria.name}</strong>
                  <span>{categoria.slug}</span>
                </td>
                <td>{categoria.sort_order}</td>
                <td>
                  <span className={`admin-status-badge ${categoria.status.toLowerCase()}`}>
                    {categoria.status}
                  </span>
                </td>
                <td>{cantidadSubcategorias}</td>
                <td>{cantidadProductos}</td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-small-btn"
                      onClick={() => editarCategoria(categoria)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="admin-small-btn admin-state-btn"
                      onClick={() => cambiarEstadoCategoria(categoria)}
                    >
                      {categoria.status === 'Activo' ? 'Inactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      className="admin-small-btn admin-danger-btn"
                      onClick={() => moverCategoriaAPapelera(categoria)}
                    >
                      Mover a papelera
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function TablaSubcategorias({
  subcategorias,
  productos,
  editarSubcategoria,
  cambiarEstadoSubcategoria,
  moverSubcategoriaAPapelera
}) {
  if (subcategorias.length === 0) {
    return (
      <div className="admin-empty-state">
        <h3>Todavia no hay subcategorias cargadas</h3>
        <p>Cuando crees subcategorias, van a aparecer aca para editarlas.</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Subcategoria</th>
            <th>Categoria</th>
            <th>Orden</th>
            <th>Estado</th>
            <th>Productos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subcategorias.map((subcategoria) => {
            const cantidadProductos = contarProductosPorSubcategoria(
              subcategoria.id,
              productos
            )

            return (
              <tr key={subcategoria.id}>
                <td>
                  <strong>{subcategoria.name}</strong>
                  <span>{subcategoria.slug}</span>
                </td>
                <td>{subcategoria.category?.name || '-'}</td>
                <td>{subcategoria.sort_order}</td>
                <td>
                  <span className={`admin-status-badge ${subcategoria.status.toLowerCase()}`}>
                    {subcategoria.status}
                  </span>
                </td>
                <td>{cantidadProductos}</td>
                <td>
                  <div className="admin-row-actions">
                    <button
                      type="button"
                      className="admin-small-btn"
                      onClick={() => editarSubcategoria(subcategoria)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="admin-small-btn admin-state-btn"
                      onClick={() => cambiarEstadoSubcategoria(subcategoria)}
                    >
                      {subcategoria.status === 'Activo' ? 'Inactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      className="admin-small-btn admin-danger-btn"
                      onClick={() => moverSubcategoriaAPapelera(subcategoria)}
                    >
                      Mover a papelera
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function PapeleraAdmin({
  productosEliminados,
  excursionesEliminadas,
  categoriasEliminadas,
  subcategoriasEliminadas,
  formatoPrecio,
  restaurarProducto,
  eliminarProductoParaSiempre,
  restaurarExcursion,
  eliminarExcursionParaSiempre,
  restaurarCategoria,
  eliminarCategoriaParaSiempre,
  restaurarSubcategoria,
  eliminarSubcategoriaParaSiempre,
  eliminarSeleccionPapelera,
  vaciarPapelera
}) {
  const [seleccion, setSeleccion] = useState({
    productos: [],
    excursiones: [],
    categorias: [],
    subcategorias: []
  })
  const vacia =
    productosEliminados.length === 0 &&
    excursionesEliminadas.length === 0 &&
    categoriasEliminadas.length === 0 &&
    subcategoriasEliminadas.length === 0

  if (vacia) {
    return (
      <div className="admin-empty-state">
        <h3>La papelera esta vacia</h3>
        <p>Los elementos eliminados van a aparecer aca para restaurarlos.</p>
      </div>
    )
  }

  const totalSeleccion =
    seleccion.productos.length +
    seleccion.excursiones.length +
    seleccion.categorias.length +
    seleccion.subcategorias.length
  const itemsSeleccionados = {
    productos: productosEliminados.filter((producto) =>
      seleccion.productos.includes(producto.id)
    ),
    excursiones: excursionesEliminadas.filter((excursion) =>
      seleccion.excursiones.includes(excursion.id)
    ),
    categorias: categoriasEliminadas.filter((categoria) =>
      seleccion.categorias.includes(categoria.id)
    ),
    subcategorias: subcategoriasEliminadas.filter((subcategoria) =>
      seleccion.subcategorias.includes(subcategoria.id)
    )
  }

  function alternarSeleccion(tipo, id) {
    setSeleccion((seleccionActual) => {
      const seleccionTipo = seleccionActual[tipo]

      return {
        ...seleccionActual,
        [tipo]: seleccionTipo.includes(id)
          ? seleccionTipo.filter((itemId) => itemId !== id)
          : [...seleccionTipo, id]
      }
    })
  }

  function limpiarSeleccion() {
    setSeleccion({
      productos: [],
      excursiones: [],
      categorias: [],
      subcategorias: []
    })
  }

  async function manejarEliminarSeleccion() {
    const eliminado = await eliminarSeleccionPapelera(itemsSeleccionados)
    if (eliminado) limpiarSeleccion()
  }

  async function manejarVaciarPapelera() {
    const eliminado = await vaciarPapelera()
    if (eliminado) limpiarSeleccion()
  }

  return (
    <div className="admin-trash-groups">
      <div className="admin-trash-actions">
        <span>{totalSeleccion} seleccionado(s)</span>
        <div className="admin-row-actions">
          <button
            type="button"
            className="admin-small-btn admin-danger-btn"
            onClick={manejarEliminarSeleccion}
            disabled={totalSeleccion === 0}
          >
            Eliminar seleccionados
          </button>
          <button
            type="button"
            className="admin-small-btn admin-danger-btn"
            onClick={manejarVaciarPapelera}
          >
            Vaciar papelera
          </button>
        </div>
      </div>

      {productosEliminados.length > 0 && (
        <div>
          <h3>Productos</h3>
          <TablaProductos
            productos={productosEliminados}
            formatoPrecio={formatoPrecio}
            seleccionados={seleccion.productos}
            alternarSeleccion={(id) => alternarSeleccion('productos', id)}
            renderAcciones={(producto) => (
              <div className="admin-row-actions">
                <button
                  type="button"
                  className="admin-small-btn"
                  onClick={() => restaurarProducto(producto)}
                >
                  Restaurar
                </button>
                <button
                  type="button"
                  className="admin-small-btn admin-danger-btn"
                  onClick={() => eliminarProductoParaSiempre(producto)}
                >
                  Eliminar definitivamente
                </button>
              </div>
            )}
          />
        </div>
      )}

      {excursionesEliminadas.length > 0 && (
        <div>
          <h3>Excursiones</h3>
          <TablaSimplePapelera
            items={excursionesEliminadas}
            obtenerTitulo={(excursion) => excursion.title}
            obtenerDetalle={(excursion) =>
              `${excursion.departure_place} > ${
                excursion.destination_place || '-'
              } / ${excursion.duration}`
            }
            restaurar={restaurarExcursion}
            eliminar={eliminarExcursionParaSiempre}
            seleccionados={seleccion.excursiones}
            alternarSeleccion={(id) => alternarSeleccion('excursiones', id)}
          />
        </div>
      )}

      {categoriasEliminadas.length > 0 && (
        <div>
          <h3>Categorias</h3>
          <TablaSimplePapelera
            items={categoriasEliminadas}
            obtenerTitulo={(categoria) => categoria.name}
            obtenerDetalle={(categoria) => categoria.slug}
            restaurar={restaurarCategoria}
            eliminar={eliminarCategoriaParaSiempre}
            seleccionados={seleccion.categorias}
            alternarSeleccion={(id) => alternarSeleccion('categorias', id)}
          />
        </div>
      )}

      {subcategoriasEliminadas.length > 0 && (
        <div>
          <h3>Subcategorias</h3>
          <TablaSimplePapelera
            items={subcategoriasEliminadas}
            obtenerTitulo={(subcategoria) => subcategoria.name}
            obtenerDetalle={(subcategoria) =>
              `${subcategoria.category?.name || '-'} / ${subcategoria.slug}`
            }
            restaurar={restaurarSubcategoria}
            eliminar={eliminarSubcategoriaParaSiempre}
            seleccionados={seleccion.subcategorias}
            alternarSeleccion={(id) => alternarSeleccion('subcategorias', id)}
          />
        </div>
      )}
    </div>
  )
}

function TablaSimplePapelera({
  items,
  obtenerTitulo,
  obtenerDetalle,
  restaurar,
  eliminar,
  seleccionados = [],
  alternarSeleccion = null
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {alternarSeleccion && <th>Sel.</th>}
            <th>Elemento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {alternarSeleccion && (
                <td>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(item.id)}
                    onChange={() => alternarSeleccion(item.id)}
                    aria-label={`Seleccionar ${obtenerTitulo(item)}`}
                  />
                </td>
              )}
              <td>
                <strong>{obtenerTitulo(item)}</strong>
                <span>{obtenerDetalle(item)}</span>
              </td>
              <td>
                <div className="admin-row-actions">
                  <button
                    type="button"
                    className="admin-small-btn"
                    onClick={() => restaurar(item)}
                  >
                    Restaurar
                  </button>
                  <button
                    type="button"
                    className="admin-small-btn admin-danger-btn"
                    onClick={() => eliminar(item)}
                  >
                    Eliminar definitivamente
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function filtrarProductosAdmin(productos, filtros) {
  const busqueda = filtros.busqueda.trim().toLowerCase()

  return productos.filter((producto) => {
    const coincideBusqueda = busqueda
      ? [
          producto.title,
          producto.brand,
          producto.category?.name,
          producto.subcategory?.name
        ]
          .join(' ')
          .toLowerCase()
          .includes(busqueda)
      : true
    const coincideCategoria = filtros.category_id
      ? producto.category_id === filtros.category_id
      : true
    const coincideSubcategoria = filtros.subcategory_id
      ? producto.subcategory_id === filtros.subcategory_id
      : true

    return coincideBusqueda && coincideCategoria && coincideSubcategoria
  })
}

function filtrarSubcategoriasAdmin(subcategorias, filtros) {
  const busqueda = filtros.busqueda.trim().toLowerCase()

  return subcategorias.filter((subcategoria) => {
    const coincideBusqueda = busqueda
      ? [subcategoria.name, subcategoria.slug, subcategoria.category?.name]
          .join(' ')
          .toLowerCase()
          .includes(busqueda)
      : true
    const coincideCategoria = filtros.category_id
      ? subcategoria.category_id === filtros.category_id
      : true

    return coincideBusqueda && coincideCategoria
  })
}

function contarProductosPorCategoria(categoriaId, productos) {
  return productos.filter((producto) => producto.category_id === categoriaId).length
}

function contarProductosPorSubcategoria(subcategoriaId, productos) {
  return productos.filter(
    (producto) => producto.subcategory_id === subcategoriaId
  ).length
}

function generarSlug(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function obtenerErroresActivacionProducto(producto, filtrosCatalogo = []) {
  const errores = []

  if (!producto.title?.trim()) errores.push('Falta el titulo.')
  if (!producto.brand?.trim()) errores.push('Falta la marca.')
  if (!producto.price || producto.price <= 0) errores.push('Falta un precio valido.')
  if (!producto.category_id) errores.push('Falta la categoria.')
  if (!producto.description?.trim()) errores.push('Falta la descripcion.')
  if (!producto.images || producto.images.length === 0) {
    errores.push('Falta al menos una imagen.')
  }
  const filtrosSubcategoria = obtenerFiltrosPorSubcategoria(
    filtrosCatalogo,
    producto.subcategory_id
  )

  if (filtrosSubcategoria.length > 0 && (!producto.filter_ids || producto.filter_ids.length === 0)) {
    errores.push('Falta asignar un filtro.')
  }

  return errores
}

function obtenerMensajeErrorAdmin(error, entidad) {
  if (esErrorDuplicado(error)) {
    const mensajes = {
      producto: 'Producto ya creado.',
      categoria: 'Categoria ya creada.',
      subcategoria: 'Subcategoria ya creada.',
      excursion: 'Excursion ya creada.',
      filtro: 'Filtro ya creado.'
    }

    return mensajes[entidad] || 'Este elemento ya fue creado.'
  }

  const mensajesGenericos = {
    producto: 'No se pudo guardar el producto.',
    categoria: 'No se pudo guardar la categoria.',
    subcategoria: 'No se pudo guardar la subcategoria.',
    excursion: 'No se pudo guardar la excursion.',
    filtro: 'No se pudo guardar el filtro.'
  }

  return error?.message || mensajesGenericos[entidad] || 'No se pudo guardar.'
}

function esErrorDuplicado(error) {
  return (
    error?.code === '23505' ||
    error?.message?.includes('duplicate key value') ||
    error?.message?.includes('violates unique constraint')
  )
}

function obtenerErroresActivacionExcursion(excursion) {
  const errores = []

  if (!excursion.title?.trim()) errores.push('Falta el titulo.')
  if (!excursion.price || excursion.price <= 0) errores.push('Falta un precio valido.')
  if (!excursion.description?.trim()) errores.push('Falta la descripcion.')
  if (!excursion.departure_place?.trim()) errores.push('Falta el lugar de salida.')
  if (!excursion.destination_place?.trim()) {
    errores.push('Falta el lugar de excursion.')
  }
  if (!excursion.duration?.trim()) errores.push('Falta la duracion.')
  if (!excursion.images || excursion.images.length === 0) {
    errores.push('Falta al menos una foto.')
  }

  return errores
}

function obtenerColoresProducto(producto) {
  return (producto.attributes || [])
    .filter((attribute) => attribute.name === 'Color')
    .map((attribute) => attribute.value)
    .filter(Boolean)
}

function obtenerFiltrosPorSubcategoria(filtros, subcategoryId) {
  if (!subcategoryId) return []

  return filtros.filter((filtro) =>
    filtro.subcategory_ids?.includes(subcategoryId)
  )
}

export default Admin
