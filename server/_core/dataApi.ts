import { supabaseAdmin } from './supabaseServer'

export async function fetchTable(table: string) {
  const { data, error } = await supabaseAdmin.from(table).select('*')
  if (error) throw error
  return data
}

export async function fetchFiltered(table: string, field: string, value: string) {
  const { data, error } = await supabaseAdmin.from(table).select('*').eq(field, value)
  if (error) throw error
  return data
}
