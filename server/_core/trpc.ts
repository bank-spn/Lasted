// server/_core/trpc.ts
import { initTRPC } from "@trpc/server";
import { supabaseAdmin } from "./supabaseServer";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ next }) => {
  // mock auth
  return next();
});

export const trpcContext = {
  supabase: supabaseAdmin,
};
