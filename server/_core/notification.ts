import { supabaseAdmin } from './supabaseServer'

export async function addAuditLog(action: string, entity: string, details: any, userId?: string) {
  await supabaseAdmin.from('audit_log').insert({
    action,
    entity_type: entity,
    details,
    user_id: userId || null,
    created_at: new Date().toISOString(),
  })
}
