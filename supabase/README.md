# Supabase Setup for SPN rOS

## Database Schema

Run the SQL schema file to create all tables, indexes, RLS policies, and seed data:

```bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase Dashboard SQL Editor
# Copy and paste content from schema.sql
```

## Edge Functions

Deploy edge functions for automated workflows:

```bash
# Deploy audit logger function
supabase functions deploy audit-logger

# Deploy inventory update function
supabase functions deploy inventory-update
```

## Realtime Setup

The following tables are configured for realtime subscriptions:
- `orders` - Real-time order updates
- `order_items` - Order item changes
- `inventory` - Stock level changes
- `audit_log` - System activity logging
- `cash_drawer` - Cash drawer transactions

## Environment Variables

Set these in your Supabase project settings:

```
SUPABASE_URL=https://lqrrjotvbmxbuyzjcoiz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcnJqb3R2Ym14YnV5empjb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwMDYsImV4cCI6MjA3NjczMjAwNn0.Q0kZeluRqlGQIZTjfsyV2hVV5huZ7JskcPQcgwbmvYs
```

## RLS Policies

All tables have Row Level Security enabled with the following policies:

- **Public Access**: Categories and menu items are publicly readable
- **Authenticated Access**: All CRUD operations require authentication
- **Service Role**: Audit logs can be inserted by service role

## Database Functions

### `update_updated_at_column()`
Automatically updates the `updated_at` timestamp on row updates.

Applied to tables:
- categories
- menu_items
- inventory
- suppliers
- employees
- budgets

## Testing Realtime

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Subscribe to order changes
supabase
  .channel('orders')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'orders' },
    (payload) => console.log('Order changed:', payload)
  )
  .subscribe()
```

## Backup & Restore

```bash
# Backup database
supabase db dump -f backup.sql

# Restore database
supabase db reset
```

