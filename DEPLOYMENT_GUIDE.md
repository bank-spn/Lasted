# SPN rOS - Complete Deployment Guide

## 🎯 Overview

This guide covers complete deployment of SPN rOS Restaurant ERP System to Vercel with Supabase backend.

## ✅ Prerequisites Checklist

- [x] Supabase project created and configured
- [x] Database schema deployed (15 tables)
- [x] RLS policies configured (public access)
- [x] Realtime enabled on all tables
- [x] Edge Functions deployed (audit-logger, inventory-update)
- [x] Seed data inserted
- [x] GitHub repository ready
- [ ] Vercel account
- [ ] Environment variables configured

## 📋 Step-by-Step Deployment

### 1. Prepare Environment Variables

Get your Supabase credentials from: https://supabase.com/dashboard/project/lqrrjotvbmxbuyzjcoiz/settings/api

Required variables:
```env
VITE_SUPABASE_URL=https://lqrrjotvbmxbuyzjcoiz.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import from GitHub: `bank-spn/Lasted`
3. Configure Project:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `client/dist`
   - Install Command: `pnpm install`

4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

5. Click **Deploy**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd /path/to/spn-ros-erp
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: spn-ros-erp
# - Directory: ./
# - Override settings? Yes
#   - Build Command: pnpm build
#   - Output Directory: client/dist
#   - Development Command: pnpm dev

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### 3. Verify Deployment

After deployment, test these features:

#### ✅ Dashboard
- [ ] KPI cards show real data from Supabase
- [ ] Recent orders display correctly
- [ ] Low stock items appear
- [ ] Realtime updates work

#### ✅ CMS
- [ ] Categories list loads
- [ ] Can add/edit/delete categories
- [ ] Menu items list loads
- [ ] Can add/edit/delete menu items
- [ ] Toast notifications appear

#### ✅ POS
- [ ] Menu items load by category
- [ ] Can add items to cart
- [ ] Cart sidebar works
- [ ] Payment modal functions

#### ✅ Realtime
- [ ] Open app in 2 tabs
- [ ] Add category in tab 1
- [ ] Verify it appears in tab 2 instantly

## 🔧 Post-Deployment Configuration

### Update System Settings

Access Supabase Dashboard → Table Editor → system_settings

Update these values:
```json
{
  "key": "restaurant_name",
  "value": {"th": "ชื่อร้านของคุณ", "en": "Your Restaurant Name"}
}
```

### Add More Seed Data

Use the CMS interface or Supabase Table Editor to add:
- More categories
- Complete menu items
- Suppliers
- Employees
- Initial inventory

## 🚀 Performance Optimization

### Enable Vercel Analytics

```bash
pnpm add @vercel/analytics
```

Add to `client/src/main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// In render:
<Analytics />
```

### Enable Vercel Speed Insights

```bash
pnpm add @vercel/speed-insights
```

Add to `client/src/main.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react'

// In render:
<SpeedInsights />
```

## 🔒 Security Hardening (Production)

### 1. Restrict Supabase Access

Currently all tables have public access. For production:

```sql
-- Remove public policies
DROP POLICY "Allow all on categories" ON categories;

-- Add role-based policies
CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

### 2. Enable Supabase Auth

If you need user authentication:

1. Enable Email/Password in Supabase Dashboard → Authentication → Providers
2. Update RLS policies to use `auth.uid()`
3. Implement login/signup in frontend

### 3. Add Rate Limiting

In Vercel:
1. Go to Project Settings → Edge Config
2. Enable rate limiting
3. Configure limits per endpoint

## 📊 Monitoring

### Vercel Logs
- View deployment logs: `vercel logs`
- View production logs: `vercel logs --prod`

### Supabase Logs
- Database logs: Supabase Dashboard → Logs → Database
- Edge Function logs: Supabase Dashboard → Edge Functions → Logs

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Error:** `TypeScript errors`
```bash
# Check types
pnpm tsc --noEmit
```

### Supabase Connection Issues

**Error:** `Failed to fetch`
- Verify VITE_SUPABASE_URL is correct
- Check VITE_SUPABASE_ANON_KEY is valid
- Ensure RLS policies allow access

**Error:** `Realtime not working`
```sql
-- Verify publication includes tables
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### Environment Variables Not Working

- Ensure variables start with `VITE_` for client-side access
- Redeploy after adding new variables: `vercel --prod`
- Check Vercel Dashboard → Settings → Environment Variables

## 🔄 Continuous Deployment

### Auto-deploy from GitHub

1. Vercel Dashboard → Project Settings → Git
2. Connect to GitHub repository
3. Configure:
   - Production Branch: `main`
   - Auto-deploy: Enabled

Now every push to `main` triggers automatic deployment!

### Deploy Previews

Every pull request gets a preview deployment automatically.

## 📱 Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain: `your-restaurant.com`
3. Update DNS records as instructed
4. SSL certificate auto-generated

## 💾 Backup Strategy

### Database Backups

Supabase provides:
- Automatic daily backups (retained 7 days)
- Manual backups via Dashboard → Database → Backups

### Export Data

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or via pg_dump
pg_dump "postgresql://postgres:[password]@db.lqrrjotvbmxbuyzjcoiz.supabase.co:5432/postgres" > backup.sql
```

## 📈 Scaling Considerations

### Database
- Supabase Free tier: 500MB database, 2GB bandwidth
- Upgrade to Pro: Unlimited database, 8GB bandwidth
- Consider connection pooling for high traffic

### Vercel
- Free tier: 100GB bandwidth
- Pro tier: 1TB bandwidth, better performance
- Enterprise: Custom limits

## ✅ Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Seed data complete
- [ ] RLS policies reviewed
- [ ] Edge Functions tested
- [ ] Realtime working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics enabled
- [ ] Performance tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested

## 🎉 You're Live!

Your restaurant ERP system is now deployed and ready to use!

**Next Steps:**
1. Train staff on using the system
2. Add complete menu and inventory
3. Configure cash drawer settings
4. Set up employee records
5. Start processing orders!

## 📞 Support

- **Vercel Issues:** https://vercel.com/support
- **Supabase Issues:** https://supabase.com/support
- **Project Issues:** https://github.com/bank-spn/Lasted/issues

---

**Deployed:** Ready for production  
**Last Updated:** October 24, 2025

