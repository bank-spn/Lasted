import { supabaseAdmin } from './supabaseServer'

// ✅ เพิ่ม placeholders ให้ไฟล์ที่ import หาเจอ
export const router = {}
export const publicProcedure = () => {}
export const protectedProcedure = () => {}

export const trpcContext = {
  supabase: supabaseAdmin,
}
