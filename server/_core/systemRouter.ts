// server/_core/systemRouter.ts
import { supabaseAdmin } from "./supabaseServer";

export const systemRouter = {
  async getSystemHealth() {
    const { data, error } = await supabaseAdmin.from("system_status").select("*").limit(1);
    if (error) throw error;
    return { ok: true, data };
  },
};
