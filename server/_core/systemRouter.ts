import { supabaseAdmin } from './supabaseServer'

export async function getSystemHealth() {
  const { data, error } = await supabaseAdmin.from('system_status').select('*').limit(1)
  if (error) throw error
  return { ok: true, data }
}

// ✅ เพิ่ม default export สำหรับ router
export const systemRouter = {
  getSystemHealth,
}
