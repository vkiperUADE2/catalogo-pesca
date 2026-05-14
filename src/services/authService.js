import { supabase } from '../lib/supabase'

export async function obtenerSesionActual() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function iniciarSesionAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  const esAdmin = await verificarAdmin()
  if (!esAdmin) {
    await cerrarSesion()
    throw new Error('Este usuario no tiene permisos de administrador.')
  }

  return data.session
}

export async function verificarAdmin() {
  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .limit(1)

  if (error) throw error
  return data.length > 0
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
