import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Menu Categories
  menuCategories: router({
    list: publicProcedure.query(async () => {
      return await db.getMenuCategories();
    }),
    create: protectedProcedure
      .input(z.object({
        nameEn: z.string(),
        nameTh: z.string(),
        description: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.createMenuCategory(input);
        return { success: true };
      }),
  }),

  // Menu Items
  menuItems: router({
    list: publicProcedure
      .input(z.object({ categoryId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getMenuItems(input?.categoryId);
      }),
    create: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        nameEn: z.string(),
        nameTh: z.string(),
        descriptionEn: z.string().optional(),
        descriptionTh: z.string().optional(),
        price: z.number(),
        cost: z.number().default(0),
        image: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.createMenuItem(input);
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          nameEn: z.string().optional(),
          nameTh: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionTh: z.string().optional(),
          price: z.number().optional(),
          cost: z.number().optional(),
          image: z.string().optional(),
          isAvailable: z.boolean().optional(),
          sortOrder: z.number().optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        await db.updateMenuItem(input.id, input.data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteMenuItem(input.id);
        return { success: true };
      }),
  }),

  // Orders (POS)
  orders: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }).optional())
      .query(async ({ input }) => {
        return await db.getOrders(input?.limit);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrderById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        orderNumber: z.string(),
        tableNumber: z.string().optional(),
        cashierShiftId: z.number().optional(),
        items: z.array(z.object({
          menuItemId: z.number(),
          quantity: z.number(),
          unitPrice: z.number(),
          notes: z.string().optional(),
        })),
        subtotal: z.number(),
        tax: z.number(),
        discount: z.number().default(0),
        total: z.number(),
        paymentMethod: z.enum(["cash", "credit_card", "qr_code"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { items, ...orderData } = input;
        
        // Create order
        const orderResult = await db.createOrder({
          ...orderData,
          userId: ctx.user.id,
          status: "pending",
          paymentStatus: "pending",
        });

        const orderId = Number(orderResult[0].insertId);

        // Create order items
        for (const item of items) {
          await db.createOrderItem({
            orderId,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            notes: item.notes,
          });
        }

        // Log audit
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "create_order",
          entity: "order",
          entityId: orderId,
          details: { orderNumber: input.orderNumber, total: input.total },
        });

        return { success: true, orderId };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "cancelled"]),
        paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
        paymentMethod: z.enum(["cash", "credit_card", "qr_code"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const updateData: any = { status: input.status };
        
        if (input.paymentStatus) updateData.paymentStatus = input.paymentStatus;
        if (input.paymentMethod) updateData.paymentMethod = input.paymentMethod;
        if (input.status === "completed") updateData.completedAt = new Date();

        await db.updateOrder(input.id, updateData);

        await db.createAuditLog({
          userId: ctx.user.id,
          action: "update_order_status",
          entity: "order",
          entityId: input.id,
          details: { status: input.status, paymentStatus: input.paymentStatus },
        });

        return { success: true };
      }),
  }),

  // Inventory
  inventory: router({
    list: protectedProcedure.query(async () => {
      return await db.getInventoryItems();
    }),
    lowStock: protectedProcedure.query(async () => {
      return await db.getLowStockItems();
    }),
    updateStock: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateInventoryStock(input.id, input.quantity);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "update_inventory_stock",
          entity: "inventory_item",
          entityId: input.id,
          details: { quantity: input.quantity },
        });

        return { success: true };
      }),
  }),

  // Cashier
  cashier: router({
    getCurrentShift: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCurrentShift(ctx.user.id);
    }),
    openShift: protectedProcedure
      .input(z.object({
        openingCash: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createCashierShift({
          userId: ctx.user.id,
          startTime: new Date(),
          openingCash: input.openingCash,
          status: "open",
          notes: input.notes,
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          action: "open_cashier_shift",
          entity: "cashier_shift",
          entityId: Number(result[0].insertId),
          details: { openingCash: input.openingCash },
        });

        return { success: true };
      }),
    closeShift: protectedProcedure
      .input(z.object({
        shiftId: z.number(),
        closingCash: z.number(),
        expectedCash: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.closeCashierShift(input.shiftId, {
          closingCash: input.closingCash,
          expectedCash: input.expectedCash,
          notes: input.notes,
        });

        await db.createAuditLog({
          userId: ctx.user.id,
          action: "close_cashier_shift",
          entity: "cashier_shift",
          entityId: input.shiftId,
          details: { 
            closingCash: input.closingCash, 
            expectedCash: input.expectedCash,
            difference: input.closingCash - input.expectedCash,
          },
        });

        return { success: true };
      }),
  }),

  // Employees
  employees: router({
    list: protectedProcedure.query(async () => {
      return await db.getEmployees();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getEmployeeById(input.id);
      }),
  }),

  // Time Tracking
  timeTracking: router({
    clockIn: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.clockIn(input.employeeId);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "clock_in",
          entity: "time_tracking",
          entityId: Number(result[0].insertId),
          details: { employeeId: input.employeeId },
        });

        return { success: true };
      }),
    clockOut: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.clockOut(input.id);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "clock_out",
          entity: "time_tracking",
          entityId: input.id,
          details: {},
        });

        return { success: true };
      }),
  }),

  // Audit Log
  auditLog: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }).optional())
      .query(async ({ input }) => {
        return await db.getAuditLogs(input?.limit);
      }),
  }),

  // Dashboard
  dashboard: router({
    stats: protectedProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getDashboardStats(input?.startDate, input?.endDate);
      }),
  }),

  // Restaurant Settings
  settings: router({
    get: protectedProcedure.query(async () => {
      return await db.getRestaurantSettings();
    }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          restaurantName: z.string().optional(),
          address: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          taxRate: z.number().optional(),
          currency: z.string().optional(),
          logo: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateRestaurantSettings(input.id, input.data);
        
        await db.createAuditLog({
          userId: ctx.user.id,
          action: "update_restaurant_settings",
          entity: "restaurant_settings",
          entityId: input.id,
          details: input.data,
        });

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

