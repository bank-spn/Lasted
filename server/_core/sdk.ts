import { supabaseAdmin } from './supabaseServer'

export const SupabaseSDK = {
  select: async (table: string, fields: string = '*') => {
    const { data, error } = await supabaseAdmin.from(table).select(fields)
    if (error) throw error
    return data
  },
}

// ✅ เพิ่ม alias export ให้ match import
export const sdk = SupabaseSDK
