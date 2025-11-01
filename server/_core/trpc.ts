import { supabaseAdmin } from './supabaseServer'

export const trpcContext = {
  supabase: supabaseAdmin,
}
