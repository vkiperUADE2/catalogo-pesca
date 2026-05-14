import { useEffect, useState } from 'react'
import {
  cerrarSesion,
  iniciarSesionAdmin,
  obtenerSesionActual,
  verificarAdmin
} from '../services/authService'
import {
  actualizarCategoria,
  actualizarProducto,
  actualizarSubcategoria,
  crearCategoria,
  crearProducto,
  crearSubcategoria,
  eliminarCategoriaDefinitiva,
  eliminarImagenProducto,
  eliminarProductoDefinitivo,
  eliminarSubcategoriaDefinitiva,
  obtenerCategoriasAdmin,
  obtenerProductosAdmin,
  obtenerProductosEliminadosAdmin,
  obtenerSubcategoriasAdmin,
  subirImagenProducto
} from '../services/catalogService'

const productoInicial = {
  title: '',
  brand: '',
  price: '',
  category_id: '',
  subcategory_id: '',
  description: '',
  is_featured: false
}

const categoriaInicial = {
  name: '',
  sort_order: 0
}

const subcategoriaInicial = {
  category_id: '',
  name: '',
  sort_order: 0
}

const slotsImagenesIniciales = Array.from({ length: 5 }, () => ({
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
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [cargandoProductos, setCargandoProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState('')
  const [mostrarFormularioProducto, setMostrarFormularioProducto] = useState(false)
  const [mostrarFormularioCategoria, setMostrarFormularioCategoria] = useState(false)
  const [mostrarFormularioSubcategoria, setMostrarFormularioSubcategoria] = useState(false)
  const [productoForm, setProductoForm] = useState(productoInicial)
  const [categoriaForm, setCategoriaForm] = useState(categoriaInicial)
  const [subcategoriaForm, setSubcategoriaForm] = useState(subcategoriaInicial)
  const [productoEditandoId, setProductoEditandoId] = useState(null)
  const [categoriaEditandoId, setCategoriaEditandoId] = useState(null)
  const [subcategoriaEditandoId, setSubcategoriaEditandoId] = useState(null)
  const [imagenesProducto, setImagenesProducto] = useState(slotsImagenesIniciales)
  const [guardandoProducto, setGuardandoProducto] = useState(false)
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
          categoriasAdmin,
          subcategoriasAdmin
        ] = await Promise.all([
          obtenerProductosAdmin(),
          obtenerProductosEliminadosAdmin(),
          obtenerCategoriasAdmin(),
          obtenerSubcategoriasAdmin()
        ])

        setProductos(productosAdmin)
        setProductosEliminados(productosEliminadosAdmin)
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

  async function recargarTaxonomia() {
    const [categoriasAdmin, subcategoriasAdmin] = await Promise.all([
      obtenerCategoriasAdmin(),
      obtenerSubcategoriasAdmin()
    ])

    setCategorias(categoriasAdmin)
    setSubcategorias(subcategoriasAdmin)
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
      ...(campo === 'category_id' ? { subcategory_id: '' } : {})
    }))
  }

  function actualizarCategoriaForm(campo, valor) {
    setCategoriaForm((categoriaActual) => ({
      ...categoriaActual,
      [campo]: valor
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

      const productoActual = productoEditandoId
        ? productos.find((producto) => producto.id === productoEditandoId)
        : null
      const imagenesFinales = imagenesProducto.filter(
        (slot) => slot.existente || slot.archivo
      )
      const totalImagenes = imagenesFinales.length

      if (totalImagenes > 5) {
        throw new Error('Un producto puede tener como maximo 5 imagenes.')
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
      setErrorFormulario(errorGuardar.message || 'No se pudo guardar el producto.')
    } finally {
      setGuardandoProducto(false)
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
      setErrorFormulario(errorGuardar.message || 'No se pudo guardar la categoria.')
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
      setErrorFormulario(errorGuardar.message || 'No se pudo guardar la subcategoria.')
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
      const errores = obtenerErroresActivacionProducto(producto)

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

  async function restaurarProducto(producto) {
    try {
      await actualizarProducto(producto.id, { status: 'Inactivo' })
      await recargarProductos()
    } catch (errorRestaurar) {
      setErrorProductos('No se pudo restaurar el producto.')
      console.error('No se pudo restaurar el producto.', errorRestaurar)
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
    const slotsImagenes = Array.from({ length: 5 }, (_, indice) => ({
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
      is_featured: producto.is_featured
    })
    setImagenesProducto(slotsImagenes)
    setErrorFormulario('')
    setMostrarFormularioProducto(true)
    setSeccionActiva('productos')
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
          <button className="admin-nav-item">Excursiones</button>
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
            categoriasEliminadas={categorias.filter((categoria) => categoria.status === 'Eliminado')}
            subcategoriasEliminadas={subcategorias.filter((subcategoria) => subcategoria.status === 'Eliminado')}
            formatoPrecio={formatoPrecio}
            restaurarProducto={restaurarProducto}
            eliminarProductoParaSiempre={eliminarProductoParaSiempre}
            restaurarCategoria={restaurarCategoria}
            eliminarCategoriaParaSiempre={eliminarCategoriaParaSiempre}
            restaurarSubcategoria={restaurarSubcategoria}
            eliminarSubcategoriaParaSiempre={eliminarSubcategoriaParaSiempre}
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

function FormularioProducto({
  productoEditandoId,
  productoForm,
  categorias,
  subcategoriasDisponibles,
  guardandoProducto,
  errorFormulario,
  imagenesProducto,
  actualizarProductoForm,
  cambiarImagenProducto,
  quitarImagenExistente,
  manejarGuardarProducto,
  cerrarFormularioProducto
}) {
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

      <label>
        Descripcion
        <textarea
          value={productoForm.description}
          onChange={(event) => actualizarProductoForm('description', event.target.value)}
          rows="5"
          required
        />
      </label>

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

function TablaProductos({
  productos,
  formatoPrecio,
  vacioTitulo,
  vacioTexto,
  renderAcciones
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
            <th>Producto</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Imagenes</th>
            <th>Destacado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
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
              <td>{producto.is_featured ? 'Si' : 'No'}</td>
              <td>{renderAcciones(producto)}</td>
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
  categoriasEliminadas,
  subcategoriasEliminadas,
  formatoPrecio,
  restaurarProducto,
  eliminarProductoParaSiempre,
  restaurarCategoria,
  eliminarCategoriaParaSiempre,
  restaurarSubcategoria,
  eliminarSubcategoriaParaSiempre
}) {
  const vacia =
    productosEliminados.length === 0 &&
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

  return (
    <div className="admin-trash-groups">
      {productosEliminados.length > 0 && (
        <div>
          <h3>Productos</h3>
          <TablaProductos
            productos={productosEliminados}
            formatoPrecio={formatoPrecio}
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

      {categoriasEliminadas.length > 0 && (
        <div>
          <h3>Categorias</h3>
          <TablaSimplePapelera
            items={categoriasEliminadas}
            obtenerTitulo={(categoria) => categoria.name}
            obtenerDetalle={(categoria) => categoria.slug}
            restaurar={restaurarCategoria}
            eliminar={eliminarCategoriaParaSiempre}
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
  eliminar
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Elemento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
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

function obtenerErroresActivacionProducto(producto) {
  const errores = []

  if (!producto.title?.trim()) errores.push('Falta el titulo.')
  if (!producto.brand?.trim()) errores.push('Falta la marca.')
  if (!producto.price || producto.price <= 0) errores.push('Falta un precio valido.')
  if (!producto.category_id) errores.push('Falta la categoria.')
  if (!producto.description?.trim()) errores.push('Falta la descripcion.')
  if (!producto.images || producto.images.length === 0) {
    errores.push('Falta al menos una imagen.')
  }

  return errores
}

export default Admin
