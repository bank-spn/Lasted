# Vercel Deployment Guide for SPN rOS

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:
- ✅ GitHub repository: https://github.com/bank-spn/Lasted
- ✅ Supabase project set up (see `supabase/setup/README.md`)
- ✅ Vercel account at https://vercel.com

## 🚀 Deployment Steps

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **GitHub** as the provider
4. Search for `bank-spn/Lasted` repository
5. Click **"Import"**

### Step 2: Configure Project Settings

#### Framework Preset
- Select: **Other** (custom Node.js app)

#### Build & Development Settings
- **Build Command**: `pnpm build`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`
- **Development Command**: `pnpm dev`

#### Root Directory
- Leave as: `.` (root)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these:

#### Required Variables
```
VITE_SUPABASE_URL=https://klaatevvmijzabmtuheo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Built-in Variables (already set in Manus)
These are automatically injected by Manus platform:
- `BUILT_IN_FORGE_API_KEY`
- `BUILT_IN_FORGE_API_URL`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `OWNER_NAME`
- `OWNER_OPEN_ID`
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`
- `VITE_APP_ID`
- `VITE_APP_LOGO`
- `VITE_APP_TITLE`
- `VITE_OAUTH_PORTAL_URL`

**Note**: For Vercel deployment, you may need to set these manually or remove authentication features.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-5 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### Step 5: Verify Deployment

1. Visit your Vercel URL
2. Check Dashboard page loads
3. Verify Supabase connection in Settings page
4. Test realtime updates by adding data in Supabase

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Environment Variables Updates
If you need to update environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update the variable
3. Redeploy: Deployments → Click "..." → Redeploy

## 🐛 Troubleshooting

### Build Fails
**Error**: `Command "pnpm build" exited with 1`
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Try building locally first: `pnpm install && pnpm build`

### 404 Errors on Routes
**Problem**: Refreshing pages shows 404
- Ensure `vercel.json` is present in root
- Check routes configuration in `vercel.json`

### Environment Variables Not Working
**Problem**: App can't connect to Supabase
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Realtime Not Working
**Problem**: Data doesn't update automatically
- Verify Realtime is enabled in Supabase (Database → Replication)
- Check browser console for WebSocket errors
- Ensure RLS policies allow SELECT access

## 📊 Monitoring

### View Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Click "View Function Logs" or "Runtime Logs"

### Analytics
Vercel provides built-in analytics:
- Go to Vercel Dashboard → Your Project → Analytics
- View page views, performance metrics, etc.

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- **Push to `main` branch** → Production deployment
- **Push to other branches** → Preview deployment

### Disable Auto-Deploy (if needed)
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Toggle "Production Branch" or "Preview Branches"

## 📁 Project Structure for Vercel

```
spn-ros-erp/
├── client/              ← Frontend source
│   ├── src/
│   └── index.html
├── server/              ← Backend source
│   ├── _core/
│   └── routers.ts
├── dist/                ← Build output (generated)
│   ├── public/          ← Static files (served by Vercel)
│   └── index.js         ← Server bundle
├── vercel.json          ← Vercel configuration
├── package.json         ← Dependencies & scripts
└── vite.config.ts       ← Build configuration
```

## ⚡ Performance Tips

### Enable Caching
Vercel automatically caches static assets. For API routes:
```typescript
// Add cache headers in your API responses
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
```

### Optimize Images
- Use WebP format for images
- Compress images before uploading
- Use Vercel Image Optimization (if needed)

### Enable Compression
Vercel automatically compresses responses with gzip/brotli.

## 🔐 Security Checklist

Before going to production:
- [ ] Update RLS policies in Supabase (remove public access)
- [ ] Set up proper authentication
- [ ] Enable HTTPS only (Vercel does this by default)
- [ ] Review environment variables (no secrets in code)
- [ ] Set up rate limiting (if needed)
- [ ] Enable CORS properly

## 📞 Support

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Supabase Documentation**: https://supabase.com/docs

---

**Last Updated**: November 1, 2025  
**Version**: 1.0

