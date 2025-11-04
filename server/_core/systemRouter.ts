// server/_core/systemRouter.ts
import { publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'System is running'
    };
  }),
});

