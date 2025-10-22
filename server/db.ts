import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  menuCategories, 
  menuItems, 
  orders, 
  orderItems,
  inventoryItems,
  cashierShifts,
  employees,
  timeTracking,
  auditLog,
  expenses,
  purchaseOrders,
  purchaseOrderItems,
  restaurantSettings
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Menu Categories
export async function getMenuCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(menuCategories).where(eq(menuCategories.isActive, true)).orderBy(menuCategories.sortOrder);
}

export async function createMenuCategory(data: typeof menuCategories.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(menuCategories).values(data);
}

// Menu Items
export async function getMenuItems(categoryId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  if (categoryId) {
    return await db.select().from(menuItems)
      .where(and(eq(menuItems.categoryId, categoryId), eq(menuItems.isAvailable, true)))
      .orderBy(menuItems.sortOrder);
  }
  
  return await db.select().from(menuItems)
    .where(eq(menuItems.isAvailable, true))
    .orderBy(menuItems.sortOrder);
}

export async function createMenuItem(data: typeof menuItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(menuItems).values(data);
}

export async function updateMenuItem(id: number, data: Partial<typeof menuItems.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(menuItems).set(data).where(eq(menuItems.id, id));
}

export async function deleteMenuItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(menuItems).set({ isAvailable: false }).where(eq(menuItems.id, id));
}

// Orders
export async function getOrders(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrder(data: typeof orders.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(orders).values(data);
}

export async function updateOrder(id: number, data: Partial<typeof orders.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(orders).set(data).where(eq(orders.id, id));
}

// Order Items
export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function createOrderItem(data: typeof orderItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(orderItems).values(data);
}

// Inventory
export async function getInventoryItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inventoryItems);
}

export async function getLowStockItems() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(inventoryItems)
    .where(sql`${inventoryItems.currentStock} <= ${inventoryItems.minStock}`);
}

export async function updateInventoryStock(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(inventoryItems)
    .set({ currentStock: sql`${inventoryItems.currentStock} + ${quantity}` })
    .where(eq(inventoryItems.id, id));
}

// Cashier Shifts
export async function getCurrentShift(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cashierShifts)
    .where(and(eq(cashierShifts.userId, userId), eq(cashierShifts.status, "open")))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCashierShift(data: typeof cashierShifts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(cashierShifts).values(data);
}

export async function closeCashierShift(id: number, closingData: { closingCash: number; expectedCash: number; notes?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const cashDifference = closingData.closingCash - closingData.expectedCash;
  
  return await db.update(cashierShifts).set({
    endTime: new Date(),
    closingCash: closingData.closingCash,
    expectedCash: closingData.expectedCash,
    cashDifference,
    status: "closed",
    notes: closingData.notes,
  }).where(eq(cashierShifts.id, id));
}

// Employees
export async function getEmployees() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees).where(eq(employees.status, "active"));
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Time Tracking
export async function clockIn(employeeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(timeTracking).values({
    employeeId,
    clockIn: new Date(),
  });
}

export async function clockOut(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const record = await db.select().from(timeTracking).where(eq(timeTracking.id, id)).limit(1);
  if (record.length === 0) throw new Error("Time tracking record not found");
  
  const clockInTime = record[0].clockIn;
  const clockOutTime = new Date();
  const totalMinutes = Math.floor((clockOutTime.getTime() - clockInTime.getTime()) / 60000);
  
  return await db.update(timeTracking).set({
    clockOut: clockOutTime,
    totalHours: totalMinutes,
  }).where(eq(timeTracking.id, id));
}

// Audit Log
export async function createAuditLog(data: typeof auditLog.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(auditLog).values(data);
}

export async function getAuditLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(limit);
}

// Restaurant Settings
export async function getRestaurantSettings() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(restaurantSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateRestaurantSettings(id: number, data: Partial<typeof restaurantSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(restaurantSettings).set(data).where(eq(restaurantSettings.id, id));
}

// Dashboard Stats
export async function getDashboardStats(startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return null;

  const dateFilter = startDate && endDate 
    ? and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate))
    : undefined;

  const ordersData = await db.select({
    totalOrders: sql<number>`count(*)`,
    totalRevenue: sql<number>`sum(${orders.total})`,
    totalTax: sql<number>`sum(${orders.tax})`,
    totalDiscount: sql<number>`sum(${orders.discount})`,
  }).from(orders).where(
    dateFilter 
      ? and(eq(orders.paymentStatus, "paid"), dateFilter)
      : eq(orders.paymentStatus, "paid")
  );

  return ordersData[0];
}

