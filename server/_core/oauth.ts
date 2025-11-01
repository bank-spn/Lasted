import { supabaseAdmin } from './supabaseServer'

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).single()
  if (error) throw error
  return data
}
