import { supabaseAdmin } from './supabaseServer'

export const SupabaseSDK = {
  select: async (table: string, fields: string = '*') => {
    const { data, error } = await supabaseAdmin.from(table).select(fields)
    if (error) throw error
    return data
  },

  insert: async (table: string, payload: any) => {
    const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single()
    if (error) throw error
    return data
  },

  update: async (table: string, id: string, payload: any) => {
    const { data, error } = await supabaseAdmin.from(table).update(payload).eq('id', id).select().single()
    if (error) throw error
    return data
  },
}
