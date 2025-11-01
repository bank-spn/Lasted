# Supabase Setup Instructions

## 📋 Quick Setup Guide

Follow these steps to set up your Supabase database for SPN rOS Restaurant ERP System.

### Prerequisites
- Supabase account at https://supabase.com
- New Supabase project created
- Project URL and Anon Key ready

### Step-by-Step Installation

#### 1. Open Supabase SQL Editor
Go to your Supabase project dashboard:
```
https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/sql/new
```

#### 2. Run SQL Files in Order

**IMPORTANT**: Run these files **one by one** in the exact order below. Wait for each to complete before running the next.

##### File 1: Create Tables
- Open `01_create_tables.sql`
- Copy all content
- Paste into SQL Editor
- Click **Run**
- Wait for "Success" message
- ✅ This creates all 15 tables

##### File 2: Create Indexes
- Open `02_create_indexes.sql`
- Copy all content
- Paste into SQL Editor
- Click **Run**
- Wait for "Success" message
- ✅ This creates performance indexes

##### File 3: Enable RLS
- Open `03_enable_rls.sql`
- Copy all content
- Paste into SQL Editor
- Click **Run**
- Wait for "Success" message
- ✅ This enables Row Level Security with public access policies

##### File 4: Functions & Triggers
- Open `04_functions_triggers.sql`
- Copy all content
- Paste into SQL Editor
- Click **Run**
- Wait for "Success" message
- ✅ This creates helper functions and auto-update triggers

##### File 5: Seed Data
- Open `05_seed_data.sql`
- Copy all content
- Paste into SQL Editor
- Click **Run**
- Wait for "Success" message
- ✅ This inserts sample data for testing

### 3. Enable Realtime

Go to **Database** → **Replication** in your Supabase dashboard.

Enable realtime for these tables (click the toggle switch for each):
- ✅ categories
- ✅ menu_items
- ✅ orders
- ✅ order_items
- ✅ inventory
- ✅ employees
- ✅ cash_drawer
- ✅ accounting_transactions
- ✅ audit_log
- ✅ system_settings

### 4. Verify Installation

Run this query in SQL Editor to verify data:
```sql
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'inventory', COUNT(*) FROM inventory;
```

**Expected Results:**
- categories: 4
- menu_items: 2
- orders: 7
- employees: 5
- inventory: 6

### 5. Update Environment Variables

In your Manus project, go to **Settings** → **Secrets** and update:
- `VITE_SUPABASE_URL` = Your project URL
- `VITE_SUPABASE_ANON_KEY` = Your anon/public key

### 6. Test Connection

1. Restart your development server
2. Go to **Settings** page in your app
3. Check "Database Connection Status"
4. Should show: ✅ Connected

## 🔧 Troubleshooting

### Error: "relation already exists"
- This is normal if you're re-running the scripts
- The `IF NOT EXISTS` clauses prevent errors
- Safe to ignore

### Error: "permission denied"
- Make sure you're using the SQL Editor in Supabase Dashboard
- Don't try to run via API (requires service role key)

### Realtime not working
- Verify tables are enabled in Database → Replication
- Check browser console for WebSocket errors
- Try refreshing the page (Ctrl+Shift+R)

### No data showing
- Verify seed data was inserted (run verification query above)
- Check browser console for errors
- Ensure RLS policies are created

## 📁 File Structure

```
supabase/setup/
├── README.md                    ← You are here
├── 01_create_tables.sql        ← Run first
├── 02_create_indexes.sql       ← Run second
├── 03_enable_rls.sql           ← Run third
├── 04_functions_triggers.sql   ← Run fourth
└── 05_seed_data.sql            ← Run last
```

## ⏱️ Estimated Time
- Total setup time: ~5-10 minutes
- Each SQL file takes: ~30-60 seconds

## 🎯 What Gets Created

### Tables (15)
- categories, menu_items, inventory, suppliers
- orders, order_items
- employees, attendance, payroll
- cash_drawer, cash_transactions
- accounting_transactions, budgets
- audit_log, system_settings

### Indexes (40+)
- Performance indexes on all foreign keys
- Indexes on frequently queried columns
- Date and status indexes

### RLS Policies (60+)
- Public access for development
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

### Functions & Triggers (10+)
- Auto-update timestamps
- Generate order numbers
- Calculate totals and work hours

### Sample Data
- 4 categories
- 2 menu items
- 7 orders
- 5 employees
- 6 inventory items
- 1 open cash drawer
- 3 accounting transactions
- 4 system settings

## ✅ Success Checklist

- [ ] All 5 SQL files executed successfully
- [ ] Realtime enabled for 10 tables
- [ ] Verification query shows correct counts
- [ ] Environment variables updated
- [ ] App Settings page shows "Connected"
- [ ] Dashboard shows real data

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs in Dashboard → Logs
3. Check browser console for errors
4. Refer to main documentation: `SUPABASE_SETUP_COMPLETE.md`

---

**Last Updated**: November 1, 2025  
**Version**: 1.0

