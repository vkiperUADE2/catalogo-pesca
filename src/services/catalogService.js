import { supabase } from '../lib/supabase'

const BUCKET_IMAGENES = 'catalogo-imagenes'

export async function obtenerCategorias() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('status', 'Activo')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function obtenerCategoriasAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function obtenerSubcategorias() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'Activo')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function obtenerSubcategoriasAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('subcategories')
    .select(`
      *,
      category:categories(*)
    `)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function crearCategoria(categoria) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('categories')
    .insert(categoria)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarCategoria(id, categoria) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('categories')
    .update(categoria)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarCategoriaDefinitiva(id) {
  asegurarSupabaseConfigurado()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function crearSubcategoria(subcategoria) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('subcategories')
    .insert(subcategoria)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarSubcategoria(id, subcategoria) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('subcategories')
    .update(subcategoria)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarSubcategoriaDefinitiva(id) {
  asegurarSupabaseConfigurado()

  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function obtenerProductos() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*),
      images:product_images(*),
      attributes:product_attributes(*)
    `)
    .eq('status', 'Activo')
    .order('created_at', { ascending: false })

  if (error) throw error

  const productos = data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))

  return anexarFiltrosProductos(productos)
}

export async function obtenerProductosAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*),
      images:product_images(*),
      attributes:product_attributes(*)
    `)
    .neq('status', 'Eliminado')
    .order('created_at', { ascending: false })

  if (error) throw error

  const productos = data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))

  return anexarFiltrosProductos(productos)
}

export async function obtenerProductosEliminadosAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*),
      images:product_images(*),
      attributes:product_attributes(*)
    `)
    .eq('status', 'Eliminado')
    .order('updated_at', { ascending: false })

  if (error) throw error

  const productos = data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))

  return anexarFiltrosProductos(productos)
}

export async function crearProducto(producto) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .insert(producto)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarProducto(id, producto) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .update(producto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarColoresProducto(productId, colores) {
  asegurarSupabaseConfigurado()

  const coloresLimpios = normalizarColores(colores)

  const { error: deleteError } = await supabase
    .from('product_attributes')
    .delete()
    .eq('product_id', productId)
    .eq('name', 'Color')

  if (deleteError) throw deleteError

  if (coloresLimpios.length === 0) return []

  const { data, error } = await supabase
    .from('product_attributes')
    .insert(
      coloresLimpios.map((color, index) => ({
        product_id: productId,
        name: 'Color',
        value: color,
        sort_order: index
      }))
    )
    .select()

  if (error) throw error
  return data
}

export async function obtenerFiltrosCatalogo() {
  asegurarSupabaseConfigurado()

  const { data: filtros, error: filtrosError } = await supabase
    .from('catalog_filters')
    .select('*')
    .order('name', { ascending: true })

  if (filtrosError) {
    if (esTablaInexistente(filtrosError)) return []
    throw filtrosError
  }

  const { data: asignaciones, error: asignacionesError } = await supabase
    .from('filter_subcategories')
    .select('*')

  if (asignacionesError) {
    if (esTablaInexistente(asignacionesError)) return []
    throw asignacionesError
  }

  return filtros.map((filtro) => ({
    ...filtro,
    subcategory_ids: asignaciones
      .filter((asignacion) => asignacion.filter_id === filtro.id)
      .map((asignacion) => asignacion.subcategory_id)
  }))
}

export async function crearFiltroCatalogo(filtro, subcategoryIds) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('catalog_filters')
    .insert(filtro)
    .select()
    .single()

  if (error) throw error

  await actualizarSubcategoriasFiltro(data.id, subcategoryIds)
  return data
}

export async function actualizarFiltroCatalogo(id, filtro, subcategoryIds) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('catalog_filters')
    .update(filtro)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  await actualizarSubcategoriasFiltro(id, subcategoryIds)
  return data
}

export async function eliminarFiltroCatalogo(id) {
  asegurarSupabaseConfigurado()

  const { error } = await supabase
    .from('catalog_filters')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function actualizarFiltrosProducto(productId, filterIds) {
  asegurarSupabaseConfigurado()

  const filtrosLimpios = normalizarIds(filterIds)

  const { error: deleteError } = await supabase
    .from('product_filters')
    .delete()
    .eq('product_id', productId)

  if (deleteError) throw deleteError

  if (filtrosLimpios.length === 0) return []

  const { data, error } = await supabase
    .from('product_filters')
    .insert(
      filtrosLimpios.map((filterId) => ({
        product_id: productId,
        filter_id: filterId
      }))
    )
    .select()

  if (error) throw error
  return data
}

export async function eliminarProductoDefinitivo(id) {
  asegurarSupabaseConfigurado()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function subirImagenProducto(productId, archivo, sortOrder) {
  asegurarSupabaseConfigurado()

  const imagenOptimizada = await optimizarImagen(archivo)
  const nombreArchivo = `${crypto.randomUUID()}.jpg`
  const storagePath = `productos/${productId}/${nombreArchivo}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_IMAGENES)
    .upload(storagePath, imagenOptimizada, {
      contentType: 'image/jpeg'
    })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_IMAGENES)
    .getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: publicUrlData.publicUrl,
      storage_path: storagePath,
      sort_order: sortOrder
    })
    .select()
    .single()

  if (error) throw error
  return data
}

async function optimizarImagen(archivo) {
  const imagen = await cargarImagen(archivo)
  const maxLado = 1600
  const escala = Math.min(maxLado / imagen.width, maxLado / imagen.height, 1)
  const ancho = Math.round(imagen.width * escala)
  const alto = Math.round(imagen.height * escala)
  const canvas = document.createElement('canvas')
  const contexto = canvas.getContext('2d')

  canvas.width = ancho
  canvas.height = alto
  contexto.drawImage(imagen, 0, 0, ancho, alto)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo optimizar la imagen.'))
          return
        }

        resolve(blob)
      },
      'image/jpeg',
      0.82
    )
  })
}

function cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo)
    const imagen = new Image()

    imagen.onload = () => {
      URL.revokeObjectURL(url)
      resolve(imagen)
    }

    imagen.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }

    imagen.src = url
  })
}

export async function eliminarImagenProducto(imagen) {
  asegurarSupabaseConfigurado()

  if (imagen.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_IMAGENES)
      .remove([imagen.storage_path])

    if (storageError) throw storageError
  }

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imagen.id)

  if (error) throw error
}

export async function obtenerExcursionesAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('excursions')
    .select(`
      *,
      images:excursion_images(*)
    `)
    .neq('status', 'Eliminado')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((excursion) => ({
    ...excursion,
    images: ordenarPorOrden(excursion.images)
  }))
}

export async function obtenerExcursionesEliminadasAdmin() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('excursions')
    .select(`
      *,
      images:excursion_images(*)
    `)
    .eq('status', 'Eliminado')
    .order('updated_at', { ascending: false })

  if (error) throw error

  return data.map((excursion) => ({
    ...excursion,
    images: ordenarPorOrden(excursion.images)
  }))
}

export async function crearExcursion(excursion) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('excursions')
    .insert(excursion)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarExcursion(id, excursion) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('excursions')
    .update(excursion)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarExcursionDefinitiva(id) {
  asegurarSupabaseConfigurado()

  const { error } = await supabase
    .from('excursions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function subirImagenExcursion(excursionId, archivo, sortOrder) {
  asegurarSupabaseConfigurado()

  const imagenOptimizada = await optimizarImagen(archivo)
  const nombreArchivo = `${crypto.randomUUID()}.jpg`
  const storagePath = `excursiones/${excursionId}/${nombreArchivo}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_IMAGENES)
    .upload(storagePath, imagenOptimizada, {
      contentType: 'image/jpeg'
    })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_IMAGENES)
    .getPublicUrl(storagePath)

  const { data, error } = await supabase
    .from('excursion_images')
    .insert({
      excursion_id: excursionId,
      image_url: publicUrlData.publicUrl,
      storage_path: storagePath,
      sort_order: sortOrder
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarImagenExcursion(imagen) {
  asegurarSupabaseConfigurado()

  if (imagen.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(BUCKET_IMAGENES)
      .remove([imagen.storage_path])

    if (storageError) throw storageError
  }

  const { error } = await supabase
    .from('excursion_images')
    .delete()
    .eq('id', imagen.id)

  if (error) throw error
}

function asegurarSupabaseConfigurado() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }
}

export async function obtenerProductoPorSlug(slug) {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*),
      images:product_images(*),
      attributes:product_attributes(*)
    `)
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    images: ordenarPorOrden(data.images),
    attributes: ordenarPorOrden(data.attributes)
  }
}

export async function obtenerExcursiones() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('excursions')
    .select(`
      *,
      images:excursion_images(*)
    `)
    .eq('status', 'Activo')
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((excursion) => ({
    ...excursion,
    images: ordenarPorOrden(excursion.images)
  }))
}

function ordenarPorOrden(items = []) {
  return [...items].sort((a, b) => {
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
    return new Date(a.created_at) - new Date(b.created_at)
  })
}

function normalizarColores(colores = []) {
  const coloresUnicos = new Map()

  colores.forEach((color) => {
    const colorLimpio = String(color || '').trim()
    if (!colorLimpio) return

    coloresUnicos.set(colorLimpio.toLowerCase(), colorLimpio)
  })

  return [...coloresUnicos.values()]
}

async function actualizarSubcategoriasFiltro(filterId, subcategoryIds) {
  const subcategoriasLimpias = normalizarIds(subcategoryIds)

  const { error: deleteError } = await supabase
    .from('filter_subcategories')
    .delete()
    .eq('filter_id', filterId)

  if (deleteError) throw deleteError

  if (subcategoriasLimpias.length === 0) return []

  const { data, error } = await supabase
    .from('filter_subcategories')
    .insert(
      subcategoriasLimpias.map((subcategoryId) => ({
        filter_id: filterId,
        subcategory_id: subcategoryId
      }))
    )
    .select()

  if (error) throw error
  return data
}

async function anexarFiltrosProductos(productos) {
  if (productos.length === 0) return productos

  const ids = productos.map((producto) => producto.id)
  const { data, error } = await supabase
    .from('product_filters')
    .select('*')
    .in('product_id', ids)

  if (error) {
    if (esTablaInexistente(error)) {
      return productos.map((producto) => ({
        ...producto,
        filter_ids: []
      }))
    }

    throw error
  }

  return productos.map((producto) => ({
    ...producto,
    filter_ids: data
      .filter((asignacion) => asignacion.product_id === producto.id)
      .map((asignacion) => asignacion.filter_id)
  }))
}

function normalizarIds(ids = []) {
  return [...new Set(ids.filter(Boolean))]
}

function esTablaInexistente(error) {
  return (
    error?.message?.includes('Could not find the table') ||
    error?.message?.includes('does not exist') ||
    error?.message?.includes('permission denied') ||
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    error?.code === '42501'
  )
}
