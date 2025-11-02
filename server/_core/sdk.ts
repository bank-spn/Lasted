// server/_core/sdk.ts
import { supabaseAdmin } from "./supabaseServer";

export const sdk = {
  async select(table: string, fields = "*") {
    const { data, error } = await supabaseAdmin.from(table).select(fields);
    if (error) throw error;
    return data;
  },
  async insert(table: string, payload: any) {
    const { data, error } = await supabaseAdmin.from(table).insert(payload).select().single();
    if (error) throw error;
    return data;
  },
  async update(table: string, id: string, payload: any) {
    const { data, error } = await supabaseAdmin.from(table).update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
};
