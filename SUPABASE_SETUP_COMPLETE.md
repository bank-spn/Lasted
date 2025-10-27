# SPN rOS - Supabase Complete Setup Guide

## 📋 Overview
This guide provides complete instructions for setting up Supabase for the SPN rOS Restaurant ERP System.

## 🚀 Quick Start

### Step 1: Create New Supabase Project
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details:
   - **Name**: SPN-rOS-ERP (or your preferred name)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
4. Wait for project to be created (~2 minutes)

### Step 2: Get Project Credentials
After project creation, go to **Project Settings** → **API**:
- Copy `Project URL` → This is your `VITE_SUPABASE_URL`
- Copy `anon public` key → This is your `VITE_SUPABASE_ANON_KEY`
- Copy `Project Reference ID` → This is your `PROJECT_ID`

### Step 3: Configure Environment Variables
Add these to your project's environment variables (Settings → Secrets in Manus UI):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
```

## 🗄️ Database Setup

### Step 4: Run Database Schema
Go to **SQL Editor** in Supabase Dashboard and run the following SQL file:

**File**: `supabase/schema.sql` (see full content below)

This will create:
- ✅ 15 tables (categories, menu_items, orders, order_items, inventory, suppliers, employees, attendance, payroll, cash_drawer, cash_transactions, accounting_transactions, budgets, audit_log, system_settings)
- ✅ Indexes for performance
- ✅ RLS Policies (public access for development)
- ✅ Database functions and triggers
- ✅ Sample seed data

### Step 5: Enable Realtime
Go to **Database** → **Replication** and enable realtime for these tables:
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

### Step 6: Deploy Edge Functions (Optional)
If you want audit logging and inventory automation:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-id
```

4. Deploy functions:
```bash
supabase functions deploy audit-logger
supabase functions deploy inventory-update
```

**Files**: 
- `supabase/functions/audit-logger/index.ts`
- `supabase/functions/inventory-update/index.ts`

## 🔧 Verification

### Step 7: Test Connection
1. Go to your app's Settings page
2. Check "Database Connection Status"
3. Should show: ✅ Connected with latency ~XXms

### Step 8: Verify Data
Run this query in SQL Editor to verify sample data:
```sql
SELECT 'categories' as table_name, COUNT(*) FROM categories
UNION ALL SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'employees', COUNT(*) FROM employees
UNION ALL SELECT 'inventory', COUNT(*) FROM inventory;
```

Expected results:
- categories: 4
- menu_items: 2
- orders: 7
- employees: 5
- inventory: 6

## 📁 Required Files

All setup files are located in the `supabase/` directory:

1. **supabase/schema.sql** - Complete database schema with tables, indexes, RLS, functions, triggers, and seed data
2. **supabase/functions/audit-logger/index.ts** - Edge function for audit logging
3. **supabase/functions/inventory-update/index.ts** - Edge function for inventory updates
4. **supabase/README.md** - Detailed documentation

## 🔑 Important Notes

### Security
- Current RLS policies allow public access for development
- For production, implement proper authentication and row-level security
- Update policies in `supabase/schema.sql` before deploying to production

### Database URL Format
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```
Replace:
- `[PASSWORD]` with your database password
- `[PROJECT-ID]` with your project reference ID

### Realtime Channels
The app subscribes to these channels:
- `categories-changes`
- `menu-items-changes`
- `orders-changes`
- `inventory-changes`
- `employees-changes`
- `cash-drawer-changes`
- `accounting-transactions-changes`
- `audit-log-changes`

## 🆘 Troubleshooting

### Connection Issues
1. Verify environment variables are set correctly
2. Check database password is correct
3. Ensure project is not paused (free tier pauses after inactivity)

### Realtime Not Working
1. Verify tables are enabled in Database → Replication
2. Check browser console for WebSocket errors
3. Ensure RLS policies allow SELECT access

### Missing Data
1. Re-run the seed data section from `schema.sql`
2. Check SQL Editor for any error messages
3. Verify tables were created successfully

## 📞 Support
For issues specific to Supabase setup, refer to:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com

## ✅ Checklist
- [ ] Create Supabase project
- [ ] Copy credentials (URL, anon key, project ID)
- [ ] Set environment variables
- [ ] Run schema.sql in SQL Editor
- [ ] Enable Realtime for all tables
- [ ] Deploy Edge Functions (optional)
- [ ] Test connection in app Settings page
- [ ] Verify sample data exists
- [ ] Test realtime updates

---

**Last Updated**: October 25, 2025
**Version**: 1.0.1
