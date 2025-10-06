# 🚀 Business Features Migration Guide

## Overview
This migration adds comprehensive business features to Get Review:
- **Business Profiles** with full-text search
- **Social Click Tracking** with persistent green checkmarks
- **Verified Reviews** based on social engagement
- **Personal vs Business Accounts**
- **Autocomplete Business Search**

---

## 📋 Prerequisites

Before running the migration, ensure you have:
1. **Supabase Project** - Your project should be set up and running
2. **Supabase CLI** installed (optional but recommended)
3. **Database Access** - Either through Supabase Dashboard or CLI

---

## 🔧 Migration Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. **Open Your Supabase Project**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Execute Migration**
   - Open `supabase/migrations/20251006000001_add_businesses_and_features.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press `Ctrl/Cmd + Enter`

4. **Verify Migration**
   - Go to "Table Editor" in the left sidebar
   - You should see new tables:
     - `businesses`
     - `social_clicks`
     - `reviews`
   - Check that `profiles` table has new columns:
     - `account_type`
     - `business_id`

### Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Run Migration**
   ```bash
   supabase db push
   ```

4. **Verify**
   ```bash
   supabase db diff
   ```

---

## ✅ Post-Migration Verification

After running the migration, verify everything works:

### 1. Check Tables
```sql
-- In SQL Editor, run:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('businesses', 'social_clicks', 'reviews');
```

Expected output: 3 rows (businesses, social_clicks, reviews)

### 2. Check Functions
```sql
-- Verify functions exist:
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('search_businesses', 'record_social_click', 'has_social_click');
```

Expected output: 3 rows

### 3. Check RLS Policies
```sql
-- Verify Row Level Security policies:
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('businesses', 'social_clicks', 'reviews');
```

Expected output: Multiple policies for each table

### 4. Test Search Function
```sql
-- Test business search:
SELECT * FROM search_businesses('test', 5);
```

---

## 🎯 What's Included in This Migration

### New Tables

1. **`businesses`**
   - Complete business profiles
   - Full-text search capability
   - Social media links (JSONB)
   - Location and contact info
   - Verification status

2. **`social_clicks`**
   - Tracks when users click business social links
   - Unique constraint per user/business/platform
   - Enables verified review status

3. **`reviews`**
   - Star ratings (1-5)
   - Optional title and comment
   - **Verified flag** (auto-set based on social clicks)
   - One review per user per business

### Updated Tables

4. **`profiles`** (existing table updated)
   - Added `account_type` ('personal' or 'business')
   - Added `business_id` (links to owned business)
   - Default: 'personal' for new signups

### Helper Functions

5. **`search_businesses(query, limit)`**
   - Full-text search with PostgreSQL tsvector
   - Returns businesses with ratings and review counts
   - Ordered by relevance and popularity

6. **`record_social_click(business_id, platform)`**
   - Records when authenticated user clicks social link
   - Updates existing click timestamp
   - Returns success/error JSON

7. **`has_social_click(user_id, business_id)`**
   - Checks if user has clicked any social link
   - Used for review verification

### Row Level Security (RLS)

All tables have proper RLS policies:
- **Businesses**: Anyone can view active ones, owners can manage
- **Social Clicks**: Users see their own, business owners see all
- **Reviews**: Public read, users manage their own

---

## 🧪 Testing the Features

After migration, test these features:

### 1. Create a Business
```typescript
// In your app, user can click "Convert to Business" button
// Or manually via SQL:
INSERT INTO businesses (owner_id, name, category, description)
VALUES (
  'your-user-id-here',
  'Test Restaurant',
  'Food & Dining',
  'Best pizza in town!'
);
```

### 2. Search for Business
```sql
SELECT * FROM search_businesses('restaurant', 10);
```

### 3. Record Social Click
```sql
SELECT record_social_click(
  'business-id-here'::uuid,
  'instagram'
);
```

### 4. Create Verified Review
```sql
-- First click a social link (above)
-- Then insert review (verified will auto-set to true):
INSERT INTO reviews (business_id, user_id, rating, comment)
VALUES (
  'business-id-here',
  'your-user-id-here',
  5,
  'Amazing service!'
);
```

---

## 🐛 Troubleshooting

### Migration Fails with "relation already exists"
**Solution**: Some tables might already exist. Either:
- Drop existing tables: `DROP TABLE IF EXISTS businesses, social_clicks, reviews CASCADE;`
- Or manually check what exists and run only missing parts

### RLS Policies Block Access
**Solution**: Ensure user is authenticated:
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log(user); // Should not be null
```

### Search Function Returns Empty
**Solution**: Check if businesses exist and are active:
```sql
SELECT * FROM businesses WHERE is_active = true;
```

### Type Errors in TypeScript
**Solution**: Types are already updated in `src/integrations/supabase/types.ts`. If issues persist:
1. Restart your TypeScript server
2. Delete `node_modules/.cache` and restart dev server

---

## 📚 Database Schema Diagram

```
┌─────────────┐         ┌──────────────┐         ┌───────────┐
│  profiles   │         │  businesses  │         │  reviews  │
├─────────────┤         ├──────────────┤         ├───────────┤
│ id (PK)     │────┐    │ id (PK)      │◄────────│ business_ │
│ full_name   │    │    │ owner_id (FK)│         │   id (FK) │
│ account_type│    └───►│ name         │         │ user_id   │
│ business_id │         │ category     │         │ rating    │
│ ...         │         │ social_links │         │ verified  │
└─────────────┘         │ ...          │         │ ...       │
                        └──────────────┘         └───────────┘
                               │                       ▲
                               │                       │
                               ▼                       │
                        ┌──────────────┐              │
                        │social_clicks │              │
                        ├──────────────┤              │
                        │ id (PK)      │              │
                        │ user_id      │──────────────┘
                        │ business_id  │   (determines
                        │ platform     │    verified
                        │ clicked_at   │     status)
                        └──────────────┘
```

---

## 🎉 Success Indicators

You'll know the migration worked when:

✅ New tables visible in Supabase Table Editor  
✅ Business search component loads without errors  
✅ "Convert to Business" button appears on Dashboard  
✅ Can create business profiles  
✅ Social click tracking shows green checkmarks  
✅ Reviews display verified badges  
✅ No console errors related to missing tables/functions

---

## 📞 Support

If you encounter issues:

1. **Check Migration Logs**
   - Supabase Dashboard → Logs → See any errors

2. **Verify Supabase Connection**
   - Check `src/integrations/supabase/client.ts`
   - Ensure environment variables are set

3. **Review Database Permissions**
   - Ensure authenticated users have proper permissions
   - Check RLS policies are active

---

## 🚀 Next Steps

After successful migration:

1. **Restart Dev Server**
   ```bash
   npm run dev
   ```

2. **Test User Flow**
   - Sign up as new user (should be 'personal' account)
   - Click "Convert to Business" button
   - Create business profile
   - Add social media links
   - Test social click tracking
   - Leave a review (should be verified if clicked social link)

3. **Explore Features**
   - Search for businesses on homepage
   - View business detail pages
   - Track social engagement
   - Monitor verified reviews

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** 2025-10-06  
**Version:** 1.0
