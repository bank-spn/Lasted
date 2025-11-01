import { supabaseAdmin } from './_core/supabaseServer'

export async function getAll(table: string) {
  const { data, error } = await supabaseAdmin.from(table).select('*')
  if (error) throw error
  return data
}

export async function getById(table: string, id: string) {
  const { data, error } = await supabaseAdmin.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data
}

export async function insertData(table: string, payload: any) {
  const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateData(table: string, id: string, payload: any) {
  const { data, error } = await supabaseAdmin.from(table).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}
