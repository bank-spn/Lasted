import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

/**
 * Main tRPC router
 * Note: This app uses Supabase directly from the frontend for data operations.
 * These routes are kept minimal for compatibility.
 */
export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(() => {
      // Auth is handled by Supabase on the frontend
      return null;
    }),
    logout: publicProcedure.mutation(() => {
      // Logout is handled by Supabase on the frontend
      return {
        success: true,
      } as const;
    }),
  }),

  // Health check endpoint
  health: router({
    check: publicProcedure.query(() => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'SPN rOS API is running'
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;

