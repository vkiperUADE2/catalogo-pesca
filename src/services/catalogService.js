import { supabase } from '../lib/supabase'

const BUCKET_IMAGENES = 'catalogo-imagenes'

export async function obtenerCategorias() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function obtenerSubcategorias() {
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

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      subcategory:subcategories(*),
      images:product_images(*),
      attributes:product_attributes(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))
}

export async function obtenerProductosAdmin() {
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

  return data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))
}

export async function obtenerProductosEliminadosAdmin() {
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

  return data.map((producto) => ({
    ...producto,
    images: ordenarPorOrden(producto.images),
    attributes: ordenarPorOrden(producto.attributes)
  }))
}

export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from('products')
    .insert(producto)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function actualizarProducto(id, producto) {
  const { data, error } = await supabase
    .from('products')
    .update(producto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function eliminarProductoDefinitivo(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function subirImagenProducto(productId, archivo, sortOrder) {
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

export async function obtenerProductoPorSlug(slug) {
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
  const { data, error } = await supabase
    .from('excursions')
    .select(`
      *,
      images:excursion_images(*)
    `)
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
