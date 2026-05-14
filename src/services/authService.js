import { supabase } from '../lib/supabase'

export async function obtenerSesionActual() {
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function iniciarSesionAdmin(email, password) {
  asegurarSupabaseConfigurado()

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
  asegurarSupabaseConfigurado()

  const { data, error } = await supabase
    .from('admin_users')
    .select('email')
    .limit(1)

  if (error) throw error
  return data.length > 0
}

export async function cerrarSesion() {
  asegurarSupabaseConfigurado()

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

function asegurarSupabaseConfigurado() {
  if (!supabase) {
    throw new Error('Supabase no esta configurado.')
  }
}
