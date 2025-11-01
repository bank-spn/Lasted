import { supabaseAdmin } from './_core/supabaseServer'

export async function uploadFile(bucket: string, path: string, file: Buffer) {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })
  if (error) throw error
  return data
}

export async function getPublicUrl(bucket: string, path: string) {
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
