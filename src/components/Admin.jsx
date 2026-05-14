import { useEffect, useState } from 'react'
import {
  cerrarSesion,
  iniciarSesionAdmin,
  obtenerSesionActual,
  verificarAdmin
} from '../services/authService'
import {
  actualizarProducto,
  crearProducto,
  eliminarImagenProducto,
  eliminarProductoDefinitivo,
  obtenerCategorias,
  obtenerProductosAdmin,
  obtenerProductosEliminadosAdmin,
  obtenerSubcategorias,
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
  const [productoForm, setProductoForm] = useState(productoInicial)
  const [productoEditandoId, setProductoEditandoId] = useState(null)
  const [imagenesProducto, setImagenesProducto] = useState(slotsImagenesIniciales)
  const [guardandoProducto, setGuardandoProducto] = useState(false)
  const [errorFormulario, setErrorFormulario] = useState('')

  const formatoPrecio = new Intl.NumberFormat('es-AR')
  const subcategoriasDisponibles = subcategorias.filter(
    (subcategoria) => subcategoria.category_id === productoForm.category_id
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
          obtenerCategorias(),
          obtenerSubcategorias()
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

  function cerrarFormularioProducto() {
    setProductoForm(productoInicial)
    setProductoEditandoId(null)
    setImagenesProducto(slotsImagenesIniciales)
    setMostrarFormularioProducto(false)
    setErrorFormulario('')
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
            onClick={() => setSeccionActiva('productos')}
          >
            Productos
          </button>
          <button className="admin-nav-item">Excursiones</button>
          <button className="admin-nav-item">Categorias</button>
          <button className="admin-nav-item">Subcategorias</button>
          <button
            className={`admin-nav-item ${seccionActiva === 'papelera' ? 'activo' : ''}`}
            onClick={() => {
              cerrarFormularioProducto()
              setSeccionActiva('papelera')
            }}
          >
            Papelera
          </button>
        </nav>
        <button className="admin-logout" onClick={manejarCerrarSesion}>
          Cerrar sesion
        </button>
      </aside>

      <section className="admin-content">
        {seccionActiva === 'productos' ? (
          <EncabezadoProductos
            mostrarFormularioProducto={mostrarFormularioProducto}
            abrirFormulario={() => setMostrarFormularioProducto(true)}
            cerrarFormulario={cerrarFormularioProducto}
          />
        ) : (
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

        {cargandoProductos ? (
          <p className="admin-status">Cargando productos...</p>
        ) : seccionActiva === 'papelera' ? (
          <TablaProductos
            productos={productosEliminados}
            formatoPrecio={formatoPrecio}
            vacioTitulo="La papelera esta vacia"
            vacioTexto="Los productos movidos a papelera van a aparecer aca para restaurarlos o eliminarlos definitivamente."
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
        ) : (
          <TablaProductos
            productos={productos}
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
                  className="admin-small-btn admin-danger-btn"
                  onClick={() => moverProductoAPapelera(producto)}
                >
                  Mover a papelera
                </button>
              </div>
            )}
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

function generarSlug(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default Admin
