// server/_core/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

// ✅ อ่านค่าจาก environment เฉพาะฝั่ง server
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Create placeholder if env vars missing (allows build to succeed)
if (!supabaseUrl || !serviceRoleKey) {
  console.warn('⚠️ Supabase server env vars not set. Using placeholder.');
}

// ✅ สร้าง client แบบ admin สำหรับ server (ใช้ service role key)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-key',
  {
  auth: {
    persistSession: false,
  },
})
