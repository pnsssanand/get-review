# Get Review - Deployment Guide

## 🚀 Quick Deployment Guide

### Prerequisites
- Supabase account
- Cloudinary account  
- Node.js 18+ installed

---

## 📝 Step-by-Step Setup

### 1. **Set Up Supabase**

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Run the migration SQL:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents from `supabase/migrations/20251003094437_*.sql`
   - Execute the SQL script

4. **Create your first admin user:**
   ```sql
   -- After a user signs up, make them admin
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_ID_HERE', 'admin');
   ```

### 2. **Set Up Cloudinary**

Your Cloudinary is already configured:
- **Cloud Name**: `dlvjvskje`
- **Upload Preset**: `GetReview`

Make sure the upload preset exists in your Cloudinary dashboard and is set to "unsigned".

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. **Install & Run Locally**

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:8080`

---

## 🌐 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

---

## 🌐 Deploy to Netlify

### Via GitHub

1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Netlify dashboard
7. Deploy

### Via Drag & Drop

```bash
# Build locally
npm run build

# Drag the 'dist' folder to Netlify
```

---

## 🔧 Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |

---

## 📋 Post-Deployment Checklist

### Essential
- [ ] Set up Supabase project
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Configure environment variables
- [ ] Test authentication (signup/login)
- [ ] Test profile creation
- [ ] Test link addition
- [ ] Test task completion
- [ ] Verify admin dashboard access

### Optional
- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up monitoring/analytics
- [ ] Enable error tracking
- [ ] Set up backup strategy

---

## 🧪 Testing Your Deployment

### 1. Test User Flow
```
1. Visit your deployed URL
2. Click "Get Started"
3. Sign up with email
4. Complete profile setup
5. Add social media links
6. Share your profile link
7. Click links from another browser/device
8. Verify task completions appear
```

### 2. Test Admin Flow
```
1. Login as admin
2. Visit /admin route
3. Verify you can see all users
4. Check analytics are working
5. Test user search
6. Click "View Profile" on any user
```

### 3. Performance Check
```
1. Test mobile responsiveness
2. Check animation smoothness
3. Verify image loading
4. Test navigation speed
```

---

## 🔐 Security Recommendations

### For Production:

1. **Enable RLS** (already done in migration)
2. **Use HTTPS** (automatic on Vercel/Netlify)
3. **Set up CORS** properly in Supabase
4. **Never commit** `.env` files
5. **Rotate keys** periodically
6. **Monitor** authentication logs

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Failed to fetch" errors
- **Solution**: Check Supabase URL and keys are correct

**Issue**: Images not uploading
- **Solution**: Verify Cloudinary upload preset is "unsigned"

**Issue**: Can't access admin dashboard  
- **Solution**: Make sure user has admin role in `user_roles` table

**Issue**: Tasks not completing
- **Solution**: Check browser console for errors, verify RLS policies

**Issue**: Slow performance
- **Solution**: Enable caching, optimize images, check network tab

---

## 📊 Monitoring & Analytics

### Recommended Tools
- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking
- **Google Analytics** - User behavior
- **Supabase Dashboard** - Database metrics

### Set Up Monitoring
```bash
# Install Sentry (optional)
npm install @sentry/react @sentry/vite-plugin

# Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔄 Updating Your Deployment

### Vercel/Netlify (GitHub Integration)
```bash
# Just push to GitHub
git add .
git commit -m "Update features"
git push origin main

# Automatic deployment triggers
```

### Manual Deployment
```bash
# Build locally
npm run build

# Deploy via CLI
vercel --prod
# or
netlify deploy --prod
```

---

## 📱 Mobile Optimization

The site is already mobile-responsive, but for best results:

1. **Test on real devices**
2. **Use Chrome DevTools** mobile simulation
3. **Check touch targets** (minimum 44x44px)
4. **Verify scroll behavior**
5. **Test orientation changes**

---

## 🎉 You're Live!

After deployment, your Get Review platform will be accessible at:
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://your-project.netlify.app`
- Custom domain: `https://your-domain.com`

### Share Your Success!
1. Create your first profile
2. Add your social links
3. Share with your audience
4. Monitor engagement in admin dashboard

---

## 🆘 Need Help?

### Resources
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Guide](https://vitejs.dev/guide/)

### Support Checklist
1. Check browser console for errors
2. Verify environment variables
3. Test Supabase connection
4. Review deployment logs
5. Check network requests

---

## 🌟 Success Metrics

Track these KPIs:
- Number of users registered
- Profile completion rate
- Task completion rate
- Average links per user
- Daily active users
- Admin dashboard usage

---

**Deployment Guide Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Ready for Production ✅

Built with ❤️ by Mr. Anand Pinisetty from Dream Team
