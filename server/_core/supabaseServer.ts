// server/_core/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

// ✅ อ่านค่าจาก environment เฉพาะฝั่ง server
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('❌ Missing Supabase server environment variables (SUPABASE_SERVICE_ROLE_KEY or URL).')
}

// ✅ สร้าง client แบบ admin สำหรับ server (ใช้ service role key)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
})
