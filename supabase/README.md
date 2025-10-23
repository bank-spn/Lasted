# Supabase Database Setup - SPN rOS ERP

## ✅ Setup Complete

Database schema, RLS policies, realtime channels, functions, triggers, and Edge Functions are all configured and ready to use.

## 📊 Database Schema

### Tables (15 total)

1. **categories** - Menu categories with multilingual support
2. **menu_items** - Food menu items with pricing
3. **inventory** - Stock management with supplier tracking
4. **suppliers** - Supplier information
5. **orders** - Customer orders with payment tracking
6. **order_items** - Individual items in orders
7. **employees** - Employee management
8. **attendance** - Employee check-in/check-out with auto work hours calculation
9. **payroll** - Monthly salary processing
10. **cash_drawer** - Cash register shift management
11. **cash_transactions** - Cash flow tracking
12. **accounting_transactions** - Income and expense records
13. **budgets** - Budget planning and tracking
14. **audit_log** - System activity logging
15. **system_settings** - Application configuration (JSONB)

## 🔐 RLS Policies

All tables have **public access** enabled (no authentication required):
- Policy: `Allow all on [table_name]`
- Access: Full CRUD operations (SELECT, INSERT, UPDATE, DELETE)

## 🔄 Realtime Enabled

All 15 tables are enabled for realtime subscriptions.

## ⚡ Database Functions

### Auto-Update Functions
- `update_updated_at_column()` - Auto updates `updated_at` timestamp
- `generate_order_number()` - Auto-generate order numbers (ORD-YYYYMMDD-0001)
- `calculate_order_total(order_id)` - Calculate order total from items
- `get_low_stock_items()` - Get items where quantity <= min_stock
- `calculate_work_hours(check_in, check_out)` - Calculate work hours
- `auto_calculate_work_hours` trigger on attendance

## 🚀 Edge Functions

1. **audit-logger** - Log system activities
2. **inventory-update** - Process inventory deduction

## 📝 Seed Data

- 4 Categories (Main Dishes, Beverages, Desserts, Appetizers)
- 2 Sample Menu Items
- 3 System Settings (restaurant_name, tax_rate, currency)

## 🔗 Connection

**Project:** https://lqrrjotvbmxbuyzjcoiz.supabase.co

**Environment Variables:**
```env
VITE_SUPABASE_URL=https://lqrrjotvbmxbuyzjcoiz.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

**Status:** ✅ Production Ready
