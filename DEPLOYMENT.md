# SPN rOS - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account with repository access
- Vercel account
- Supabase project

### Step 1: Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project: `https://lqrrjotvbmxbuyzjcoiz.supabase.co`
3. Navigate to **SQL Editor**
4. Copy and paste content from `supabase/schema.sql`
5. Click **Run** to create all tables, indexes, and policies

### Step 2: Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref lqrrjotvbmxbuyzjcoiz

# Deploy functions
supabase functions deploy audit-logger
supabase functions deploy inventory-update
```

### Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import repository: `https://github.com/bank-spn/Lasted`
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `pnpm install && pnpm build`
   - **Output Directory**: `dist`

4. Add Environment Variables:

```env
# Database
DATABASE_URL=mysql://[user]:[password]@[host]:[port]/[database]

# Supabase
VITE_SUPABASE_URL=https://lqrrjotvbmxbuyzjcoiz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcnJqb3R2Ym14YnV5empjb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwMDYsImV4cCI6MjA3NjczMjAwNn0.Q0kZeluRqlGQIZTjfsyV2hVV5huZ7JskcPQcgwbmvYs

# App Config
VITE_APP_TITLE=SPN rOS
VITE_APP_LOGO=/logo.png
```

5. Click **Deploy**

### Step 4: Post-Deployment

1. Verify database connection
2. Test realtime subscriptions
3. Check edge functions are working
4. Test all CRUD operations

## 📦 Manual Deployment

### Build Locally

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deploy to Other Platforms

#### Netlify
```bash
# Build command
pnpm install && pnpm build

# Publish directory
dist
```

#### Railway
```bash
# Add buildpack
railway link

# Deploy
railway up
```

## 🔧 Configuration

### Supabase Realtime

Enable realtime for these tables in Supabase Dashboard > Database > Replication:
- orders
- order_items
- inventory
- audit_log
- cash_drawer

### Database Migration

```bash
# Generate migration
pnpm db:push

# Apply migration
pnpm db:migrate
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 📊 Monitoring

- **Supabase Dashboard**: Monitor database performance
- **Vercel Analytics**: Track web vitals
- **Edge Functions Logs**: Debug serverless functions

## 🔐 Security

- All tables have RLS policies enabled
- API keys are environment variables
- CORS configured for production domain
- Rate limiting on edge functions

## 📝 Notes

- Default language: Thai (TH)
- Currency: Thai Baht (฿)
- Timezone: Asia/Bangkok (GMT+7)
- Theme: Light/Dark switchable

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf node_modules .next dist
pnpm install
```

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules
- Ensure IP whitelist includes Vercel IPs

### Realtime Not Working
- Check Supabase project status
- Verify realtime is enabled for tables
- Check browser console for WebSocket errors

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

