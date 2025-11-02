import { supabaseAdmin } from './supabaseServer'

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).single()
  if (error) throw error
  return data
}

// ✅ เพิ่ม placeholder ฟังก์ชันเก่า (ป้องกัน build error)
export function registerOAuthRoutes() {
  console.log('⚠️ registerOAuthRoutes() called - placeholder only')
}
