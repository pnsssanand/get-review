# ✅ Pre-Launch Checklist - Get Review Business Features

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** 2025-10-06

Use this checklist to ensure everything is properly set up before launching the new business features.

---

## 🗄️ Database Setup

### Migration Execution
- [ ] Opened Supabase Dashboard (https://supabase.com/dashboard)
- [ ] Navigated to SQL Editor
- [ ] Copied migration from `supabase/migrations/20251006000001_add_businesses_and_features.sql`
- [ ] Pasted and executed in SQL Editor
- [ ] Verified no errors in execution

### Table Verification
- [ ] `businesses` table exists in Table Editor
- [ ] `social_clicks` table exists in Table Editor
- [ ] `reviews` table exists in Table Editor
- [ ] `profiles` table has `account_type` column
- [ ] `profiles` table has `business_id` column

### Function Verification
Run these queries in SQL Editor:

```sql
-- Check functions exist (should return 3 rows)
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('search_businesses', 'record_social_click', 'has_social_click');
```

- [ ] `search_businesses` function exists
- [ ] `record_social_click` function exists
- [ ] `has_social_click` function exists

### RLS Policy Verification

```sql
-- Check RLS policies (should return multiple rows)
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('businesses', 'social_clicks', 'reviews')
ORDER BY tablename;
```

- [ ] `businesses` table has RLS policies
- [ ] `social_clicks` table has RLS policies
- [ ] `reviews` table has RLS policies

---

## 💻 Application Testing

### Development Environment
- [ ] Dependencies installed (`npm install`)
- [ ] No errors when starting dev server (`npm run dev`)
- [ ] Application loads at http://localhost:8080
- [ ] No console errors on homepage
- [ ] No TypeScript compilation errors (except harmless Framer Motion warnings)

### Authentication Flow
- [ ] Can sign up with new email/password
- [ ] New user has `account_type = 'personal'` (check Supabase Table Editor)
- [ ] User redirected to Dashboard after signup
- [ ] Can sign in with existing account
- [ ] Can sign out successfully

---

## 🔍 Business Search Feature

### Homepage Search
- [ ] Search box visible on homepage
- [ ] Typing shows loading indicator
- [ ] Results appear after 2+ characters
- [ ] Results show business name, category, logo
- [ ] Results show rating and review count
- [ ] Clicking result navigates to business detail page
- [ ] Clicking outside closes dropdown
- [ ] "No results" message appears for non-existent business

### Search Performance
- [ ] Search has 300ms debounce (doesn't search on every keystroke)
- [ ] Results load quickly (< 1 second)
- [ ] No console errors during search

---

## 🏢 Business Creation

### Convert to Business Button
- [ ] Floating button appears on Dashboard (bottom-right)
- [ ] Button animates on page load
- [ ] Button has gradient purple-pink-orange design
- [ ] Clicking opens modal dialog
- [ ] Modal has "Create Your Business Profile" title

### Business Form
- [ ] All form fields render correctly
- [ ] Business Name field (required)
- [ ] Category field (required)
- [ ] Description textarea
- [ ] Email field (pre-filled with user email)
- [ ] Phone field
- [ ] Website field
- [ ] Address fields (street, city, state, country)
- [ ] "Convert my personal account" checkbox
- [ ] Submit button enabled when required fields filled

### Business Creation Flow
- [ ] Can fill and submit form
- [ ] Success toast appears after submission
- [ ] Redirected to business detail page
- [ ] Business visible in Table Editor
- [ ] If "Convert account" checked, `account_type` changed to 'business'
- [ ] Floating button disappears after conversion

---

## 📊 Business Detail Page

### Page Layout
- [ ] Cover image area displays (or gradient if no image)
- [ ] Back button works (returns to homepage)
- [ ] Business logo displays (or placeholder)
- [ ] Business name shows correctly
- [ ] Category badge displays
- [ ] Description text shows
- [ ] Contact information displays (if provided)
- [ ] Star rating shows correctly
- [ ] Review count is accurate

### Social Media Section
- [ ] "Connect with us" heading displays
- [ ] Social media buttons render for each link
- [ ] Platform icons display correctly
- [ ] Buttons have proper colors/styling
- [ ] Instructions text about verified reviews shows

### Social Click Tracking (IMPORTANT!)
- [ ] **Before clicking**: Buttons are outline style
- [ ] **After clicking**: Button turns green
- [ ] **After clicking**: Checkmark icon appears
- [ ] **After clicking**: Link opens in new tab
- [ ] **After clicking**: Toast notification shows
- [ ] **After reload**: Green checkmarks persist (data saved to database)
- [ ] **Info banner**: Shows "You've clicked X links" message

### Reviews Section
- [ ] "Customer Reviews" heading displays
- [ ] Verification progress bar shows (if verified reviews exist)
- [ ] "Write a Review" button visible
- [ ] Reviews display with user info
- [ ] Star ratings display correctly
- [ ] Verified badge shows on verified reviews (green)
- [ ] "No reviews yet" message if no reviews
- [ ] Review dates display correctly

---

## ⭐ Review Writing

### Review Form Access
- [ ] "Write a Review" button navigates to `/business/:id/review`
- [ ] Form title shows "Write a Review for [Business Name]"
- [ ] Back button returns to business page

### Verification Status Banner
**If user clicked social links:**
- [ ] Green banner shows "Verified Reviewer ✓"
- [ ] Message says review will be marked as verified

**If user hasn't clicked social links:**
- [ ] Blue banner shows "Become a Verified Reviewer"
- [ ] Link to go back and click social links

### Review Form Fields
- [ ] Star rating selector (1-5 stars)
- [ ] Stars animate on hover
- [ ] Selected rating displays text (Poor, Fair, Good, Very Good, Excellent)
- [ ] Title field (optional) with character counter
- [ ] Comment textarea (optional) with character counter
- [ ] Cancel button works
- [ ] Submit button disabled until rating selected

### Review Submission
- [ ] Can submit with just rating (no title/comment)
- [ ] Can submit with title and comment
- [ ] Success toast appears after submission
- [ ] Redirected back to business detail page
- [ ] New review appears in list immediately
- [ ] Verified badge appears if social links were clicked
- [ ] Duplicate review error if already reviewed

---

## 🔐 Security & Permissions

### Authentication Checks
- [ ] Unauthenticated users can view businesses
- [ ] Unauthenticated users can view reviews
- [ ] Unauthenticated users CANNOT create businesses
- [ ] Unauthenticated users CANNOT track social clicks
- [ ] Unauthenticated users CANNOT write reviews
- [ ] Sign-in prompt appears when trying protected actions

### Ownership Checks
- [ ] Users can only edit their own businesses
- [ ] Users can only delete their own reviews
- [ ] Users cannot modify others' social click data
- [ ] Business owners see all clicks on their business

---

## 🎨 UI/UX Verification

### Responsive Design
- [ ] Mobile view (< 768px) displays correctly
- [ ] Tablet view (768px - 1024px) displays correctly
- [ ] Desktop view (> 1024px) displays correctly
- [ ] Search dropdown fits on mobile
- [ ] Business form modal scrolls on mobile
- [ ] Review form is usable on mobile

### Animations & Interactions
- [ ] Floating button animates on load
- [ ] Search results fade in smoothly
- [ ] Button hover effects work
- [ ] Social buttons scale on hover
- [ ] Stars animate on hover in review form
- [ ] Page transitions are smooth
- [ ] No layout shifts during loading

### Visual Consistency
- [ ] Colors match luxury theme (gold/purple/pink)
- [ ] Fonts are consistent
- [ ] Spacing is uniform
- [ ] Icons are properly aligned
- [ ] Images have proper aspect ratios
- [ ] Buttons have consistent styling

---

## 📱 Toast Notifications

Verify toast messages appear for:
- [ ] Business created successfully
- [ ] Account converted to business
- [ ] Social link clicked (with platform name)
- [ ] Review submitted successfully
- [ ] Error messages for failures
- [ ] All toasts auto-dismiss after timeout
- [ ] Toasts are readable and well-positioned

---

## 🔄 Data Flow Testing

### Complete User Journey 1: New User Creates Business

1. [ ] Sign up as new user
2. [ ] Verify `account_type = 'personal'` in database
3. [ ] Click "Convert to Business" button
4. [ ] Fill business form with all fields
5. [ ] Check "Convert my personal account"
6. [ ] Submit form
7. [ ] Verify redirected to business detail page
8. [ ] Verify `account_type = 'business'` in database
9. [ ] Verify business record exists in `businesses` table
10. [ ] Verify `business_id` in profiles table matches business ID

### Complete User Journey 2: Customer Reviews Business

1. [ ] Sign in as different user
2. [ ] Search for business on homepage
3. [ ] Click search result
4. [ ] View business detail page
5. [ ] Click Instagram social button
6. [ ] Verify button turns green with checkmark
7. [ ] Verify Instagram opens in new tab
8. [ ] Click Facebook social button
9. [ ] Verify second checkmark appears
10. [ ] Click "Write a Review"
11. [ ] Verify green "Verified Reviewer" banner shows
12. [ ] Select 5-star rating
13. [ ] Write title and comment
14. [ ] Submit review
15. [ ] Verify review appears with green verified badge
16. [ ] Verify review count incremented on business page
17. [ ] Check database: `verified = true` in reviews table
18. [ ] Check database: 2 records in `social_clicks` table

### Complete User Journey 3: Business Owner Views Analytics

1. [ ] Sign in as business owner
2. [ ] Navigate to business detail page
3. [ ] View all reviews
4. [ ] Check verification percentage
5. [ ] See which users left reviews
6. [ ] Verify verified badge shows correctly

---

## 🐛 Error Handling

### Network Errors
- [ ] Graceful handling if Supabase is down
- [ ] Error toast if migration not run
- [ ] Error message if table doesn't exist
- [ ] Retry mechanism for failed requests

### User Errors
- [ ] Form validation messages clear
- [ ] Duplicate review error message helpful
- [ ] Required field indicators visible
- [ ] Invalid URL format detected
- [ ] Character limits enforced

### Edge Cases
- [ ] Handles business with no reviews
- [ ] Handles business with no social links
- [ ] Handles user with no profile image
- [ ] Handles empty search query
- [ ] Handles very long business names/descriptions

---

## 📊 Database Integrity

### Manual Database Checks

Run these queries to verify data integrity:

```sql
-- Check all new users are 'personal' by default
SELECT account_type, COUNT(*) 
FROM profiles 
GROUP BY account_type;

-- Check social clicks are unique per user/business/platform
SELECT user_id, business_id, platform, COUNT(*) 
FROM social_clicks 
GROUP BY user_id, business_id, platform 
HAVING COUNT(*) > 1;

-- Check reviews are unique per user/business
SELECT user_id, business_id, COUNT(*) 
FROM reviews 
GROUP BY user_id, business_id 
HAVING COUNT(*) > 1;

-- Check verified reviews have social clicks
SELECT r.id, r.verified, 
       (SELECT COUNT(*) FROM social_clicks sc 
        WHERE sc.user_id = r.user_id 
        AND sc.business_id = r.business_id) as click_count
FROM reviews r;

-- Check business owners have valid user_id
SELECT b.id, b.owner_id, p.id 
FROM businesses b 
LEFT JOIN profiles p ON b.owner_id = p.id 
WHERE p.id IS NULL;
```

- [ ] All new profiles have `account_type = 'personal'`
- [ ] No duplicate social clicks
- [ ] No duplicate reviews
- [ ] All verified reviews have associated clicks
- [ ] All business owners exist in profiles

---

## 🚀 Performance Metrics

### Page Load Times (Should be < 3 seconds)
- [ ] Homepage loads quickly
- [ ] Business search responds quickly
- [ ] Business detail page loads quickly
- [ ] Review form loads quickly

### Search Performance
- [ ] Search results appear within 500ms
- [ ] Search doesn't lag when typing
- [ ] Debounce prevents excessive queries

### Database Queries
- [ ] No N+1 query problems
- [ ] Indexes are being used (check query planner)
- [ ] Large result sets are paginated

---

## 📝 Documentation Review

- [ ] README.md updated with business features
- [ ] MIGRATION_GUIDE.md exists and is accurate
- [ ] BUSINESS_FEATURES.md exists and is comprehensive
- [ ] IMPLEMENTATION_SUMMARY.md exists
- [ ] Code comments are clear and helpful
- [ ] TypeScript types are properly defined

---

## 🎓 Final Smoke Test

Run through this complete flow one more time:

1. [ ] Fresh browser (clear cache)
2. [ ] Sign up as brand new user
3. [ ] Create business profile
4. [ ] Add social media links manually in database
5. [ ] Sign out
6. [ ] Sign up as different user
7. [ ] Search for created business
8. [ ] Click social links
9. [ ] Write verified review
10. [ ] Verify everything displays correctly

---

## ✅ Launch Readiness

All items checked? You're ready to launch! 🚀

**Final Checks:**
- [ ] All database migrations successful
- [ ] All tests passing
- [ ] No critical console errors
- [ ] All features working as expected
- [ ] Documentation complete
- [ ] Team has reviewed changes

---

## 📞 Post-Launch Monitoring

After launch, monitor:

1. **Error Logs** - Check Supabase logs for errors
2. **User Feedback** - Watch for user-reported issues
3. **Performance** - Monitor query times and page loads
4. **Usage Metrics** - Track adoption of business features
5. **Review Quality** - Monitor verified review percentage

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** 2025-10-06  
**Status:** Ready for Launch ✅
