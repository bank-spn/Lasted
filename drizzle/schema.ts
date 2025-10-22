import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "cashier", "manager"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Restaurant settings and configuration
 */
export const restaurantSettings = mysqlTable("restaurant_settings", {
  id: int("id").autoincrement().primaryKey(),
  restaurantName: varchar("restaurantName", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  taxRate: int("taxRate").default(7).notNull(), // Tax percentage (e.g., 7 for 7%)
  currency: varchar("currency", { length: 10 }).default("THB").notNull(),
  logo: text("logo"), // URL to logo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RestaurantSettings = typeof restaurantSettings.$inferSelect;

/**
 * Menu categories (e.g., Appetizers, Main Course, Desserts)
 */
export const menuCategories = mysqlTable("menu_categories", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameTh: varchar("nameTh", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuCategory = typeof menuCategories.$inferSelect;

/**
 * Menu items (food and beverages)
 */
export const menuItems = mysqlTable("menu_items", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  nameTh: varchar("nameTh", { length: 255 }).notNull(),
  descriptionEn: text("descriptionEn"),
  descriptionTh: text("descriptionTh"),
  price: int("price").notNull(), // Price in cents/satang
  cost: int("cost").default(0).notNull(), // Cost in cents/satang
  image: text("image"), // URL to image
  isAvailable: boolean("isAvailable").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;

/**
 * Inventory items (ingredients and supplies)
 */
export const inventoryItems = mysqlTable("inventory_items", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  unit: varchar("unit", { length: 50 }).notNull(), // e.g., kg, liter, piece
  currentStock: int("currentStock").default(0).notNull(),
  minStock: int("minStock").default(0).notNull(), // Minimum stock level for alerts
  unitCost: int("unitCost").default(0).notNull(), // Cost per unit in cents/satang
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InventoryItem = typeof inventoryItems.$inferSelect;

/**
 * Purchase orders for inventory
 */
export const purchaseOrders = mysqlTable("purchase_orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  supplierId: int("supplierId"),
  supplierName: varchar("supplierName", { length: 255 }),
  status: mysqlEnum("status", ["pending", "approved", "received", "cancelled"]).default("pending").notNull(),
  totalAmount: int("totalAmount").default(0).notNull(),
  notes: text("notes"),
  orderedBy: int("orderedBy").notNull(),
  orderedAt: timestamp("orderedAt").defaultNow().notNull(),
  receivedAt: timestamp("receivedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PurchaseOrder = typeof purchaseOrders.$inferSelect;

/**
 * Purchase order items
 */
export const purchaseOrderItems = mysqlTable("purchase_order_items", {
  id: int("id").autoincrement().primaryKey(),
  purchaseOrderId: int("purchaseOrderId").notNull(),
  inventoryItemId: int("inventoryItemId").notNull(),
  quantity: int("quantity").notNull(),
  unitCost: int("unitCost").notNull(),
  totalCost: int("totalCost").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;

/**
 * Cashier shifts
 */
export const cashierShifts = mysqlTable("cashier_shifts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  openingCash: int("openingCash").default(0).notNull(),
  closingCash: int("closingCash"),
  expectedCash: int("expectedCash"),
  cashDifference: int("cashDifference"),
  status: mysqlEnum("status", ["open", "closed"]).default("open").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CashierShift = typeof cashierShifts.$inferSelect;

/**
 * Orders (POS transactions)
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  tableNumber: varchar("tableNumber", { length: 50 }),
  cashierShiftId: int("cashierShiftId"),
  userId: int("userId").notNull(), // Cashier who created the order
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  subtotal: int("subtotal").default(0).notNull(),
  tax: int("tax").default(0).notNull(),
  discount: int("discount").default(0).notNull(),
  total: int("total").default(0).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "credit_card", "qr_code"]),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "refunded"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Order = typeof orders.$inferSelect;

/**
 * Order items
 */
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  menuItemId: int("menuItemId").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: int("unitPrice").notNull(),
  totalPrice: int("totalPrice").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;

/**
 * Employees
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"), // Link to users table if employee has login
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  salary: int("salary").default(0).notNull(),
  hireDate: timestamp("hireDate").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "terminated"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;

/**
 * Employee time tracking
 */
export const timeTracking = mysqlTable("time_tracking", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(),
  clockIn: timestamp("clockIn").notNull(),
  clockOut: timestamp("clockOut"),
  totalHours: int("totalHours"), // Total hours in minutes
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TimeTracking = typeof timeTracking.$inferSelect;

/**
 * Audit log for tracking all system actions
 */
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(), // e.g., "order", "menu_item"
  entityId: int("entityId"),
  details: json("details"), // JSON object with additional details
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;

/**
 * Expenses tracking
 */
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  amount: int("amount").notNull(),
  expenseDate: timestamp("expenseDate").notNull(),
  recordedBy: int("recordedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;

