# 🧪 Post-Login User Experience Test Guide

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** 2025-10-06

---

## 🎯 Feature Overview

After implementing the post-login business search functionality, users will experience:

1. **Login** → Redirects to `/dashboard`
2. **Dashboard** → Shows business search bar (authenticated users only)
3. **Search** → Auto-suggests existing businesses (max 6 results)
4. **Select** → Navigates to business detail page
5. **Interact** → Click social links, write reviews, etc.

---

## ✅ Manual Testing Checklist

### 1. Authentication Flow

#### Test Case 1.1: User Login Redirect
**Steps:**
1. Go to `/auth`
2. Enter valid credentials
3. Click "Sign In"

**Expected Result:**
- ✅ Success toast: "Welcome back!"
- ✅ Redirected to `/dashboard`
- ✅ Dashboard loads with user's name

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 1.2: User Signup Redirect
**Steps:**
1. Go to `/auth`
2. Click "Sign Up"
3. Fill in all fields
4. Submit form

**Expected Result:**
- ✅ Success toast: "Account created!"
- ✅ Redirected to `/dashboard`
- ✅ New user has `account_type = 'personal'` in database

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 1.3: Unauthenticated Access to Dashboard
**Steps:**
1. Sign out completely
2. Try to access `/dashboard` directly in URL

**Expected Result:**
- ✅ Redirected to `/auth` page
- ✅ Cannot see dashboard content

**Status:** [ ] Pass [ ] Fail

---

### 2. Business Search Bar Display

#### Test Case 2.1: Search Bar Visibility (Authenticated)
**Steps:**
1. Sign in successfully
2. View dashboard

**Expected Result:**
- ✅ "Find Businesses" card appears
- ✅ Search input box visible
- ✅ Search icon present
- ✅ Gradient purple/pink card styling
- ✅ Description text: "Search for businesses to review and connect with"

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 2.2: Search Bar Positioning
**Steps:**
1. View dashboard on different screen sizes

**Expected Result:**
- ✅ Search bar appears ABOVE profile setup section
- ✅ Responsive on mobile (< 768px)
- ✅ Responsive on tablet (768-1024px)
- ✅ Responsive on desktop (> 1024px)
- ✅ Smooth fade-in animation on load

**Status:** [ ] Pass [ ] Fail

---

### 3. Business Search Functionality

#### Test Case 3.1: Search with Valid Query
**Steps:**
1. Click in search box
2. Type "cof" (or any partial business name)
3. Wait 300ms for debounce

**Expected Result:**
- ✅ Loading indicator appears briefly
- ✅ Dropdown shows matching businesses
- ✅ Max 6 results displayed
- ✅ Each result shows:
  - Business name
  - Category
  - Logo (or placeholder)
  - Star rating
  - Review count

**Status:** [ ] Pass [ ] Fail

**Sample Output:**
```
☕ Coffee Time
   Food & Dining
   ⭐ 4.5 (12 reviews)

🍰 Cofix Cafe
   Cafe & Bakery
   ⭐ 4.8 (8 reviews)
```

---

#### Test Case 3.2: Search with No Results
**Steps:**
1. Type "zzzzzzzzz" or random string
2. Wait for response

**Expected Result:**
- ✅ Dropdown appears
- ✅ Shows "No businesses found" message
- ✅ Icon: Building2 icon in gray
- ✅ Suggestion text: "Try a different search term"

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 3.3: Search with Less Than 2 Characters
**Steps:**
1. Type single character "c"
2. Observe behavior

**Expected Result:**
- ✅ No dropdown appears
- ✅ No API call made
- ✅ No loading indicator

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 3.4: Search Debounce Behavior
**Steps:**
1. Type quickly: "c-o-f-f-e-e"
2. Observe network requests (DevTools)

**Expected Result:**
- ✅ Only ONE API call after typing stops
- ✅ 300ms delay before API call
- ✅ Previous pending calls are cancelled

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 3.5: Close Dropdown Behavior
**Steps:**
1. Search for "coffee"
2. Click outside dropdown
3. Search again

**Expected Result:**
- ✅ Dropdown closes when clicking outside
- ✅ Dropdown reopens when typing again
- ✅ Clicking search input shows previous results (if any)

**Status:** [ ] Pass [ ] Fail

---

### 4. Business Selection & Navigation

#### Test Case 4.1: Navigate to Business Detail
**Steps:**
1. Search for "coffee"
2. Click on "Coffee Time" result

**Expected Result:**
- ✅ Navigates to `/business/{id}`
- ✅ Business detail page loads
- ✅ Search dropdown closes
- ✅ Search query clears

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 4.2: Business Detail Page Content
**Steps:**
1. Select a business from search
2. View business detail page

**Expected Result:**
- ✅ Business name displays
- ✅ Category badge visible
- ✅ Description text shown
- ✅ Contact information (if available)
- ✅ Social media links section
- ✅ Reviews section
- ✅ "Write a Review" button
- ✅ Back button works

**Status:** [ ] Pass [ ] Fail

---

### 5. Social Click Tracking Integration

#### Test Case 5.1: Click Social Links
**Steps:**
1. From search, go to any business
2. Click Instagram button
3. Wait for response

**Expected Result:**
- ✅ Button turns GREEN
- ✅ Checkmark icon appears
- ✅ Instagram opens in new tab
- ✅ Toast: "instagram link tracked! ✓"
- ✅ Success message: "This counts toward verified reviews"

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 5.2: Social Click Persistence
**Steps:**
1. Click Instagram and Facebook
2. Refresh page
3. View same business

**Expected Result:**
- ✅ Instagram button still GREEN with checkmark
- ✅ Facebook button still GREEN with checkmark
- ✅ Other buttons remain outline style
- ✅ Banner: "You've clicked 2 links!"

**Status:** [ ] Pass [ ] Fail

---

### 6. Review Workflow from Search

#### Test Case 6.1: Write Review After Search
**Steps:**
1. Search for business
2. Select business
3. Click social links (Instagram)
4. Click "Write a Review"
5. Submit 5-star review

**Expected Result:**
- ✅ Review form loads at `/business/{id}/review`
- ✅ GREEN banner: "Verified Reviewer ✓"
- ✅ Star rating works
- ✅ Can submit review
- ✅ Review appears with GREEN verified badge
- ✅ Review count increments

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 6.2: Review Without Social Click
**Steps:**
1. Search for NEW business (not clicked before)
2. Go directly to "Write a Review"
3. Skip clicking social links

**Expected Result:**
- ✅ BLUE banner: "Become a Verified Reviewer"
- ✅ Link to go back and click social links
- ✅ Can still submit review
- ✅ Review shows WITHOUT verified badge

**Status:** [ ] Pass [ ] Fail

---

### 7. Database Verification

#### Test Case 7.1: Query Only Businesses
**Steps:**
1. Run SQL query in Supabase:
```sql
SELECT * FROM search_businesses('test', 10);
```

**Expected Result:**
- ✅ Returns only records from `businesses` table
- ✅ Does NOT return personal profiles
- ✅ All results have `is_active = true`
- ✅ Results ordered by relevance

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 7.2: Social Click Storage
**Steps:**
1. Click social link
2. Check `social_clicks` table in Supabase

**Expected Result:**
- ✅ New row inserted
- ✅ `user_id` matches current user
- ✅ `business_id` matches business
- ✅ `platform` matches clicked platform
- ✅ `clicked_at` timestamp recorded

**Status:** [ ] Pass [ ] Fail

---

### 8. Edge Cases & Error Handling

#### Test Case 8.1: No Businesses Exist
**Steps:**
1. Ensure no businesses in database
2. Search for anything

**Expected Result:**
- ✅ Shows "No businesses found"
- ✅ No errors in console
- ✅ Suggestion to try different term

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 8.2: Network Error During Search
**Steps:**
1. Disable network (DevTools → Offline)
2. Try to search

**Expected Result:**
- ✅ Error logged in console
- ✅ Empty results array
- ✅ No crash or white screen

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 8.3: Inactive Businesses Hidden
**Steps:**
1. Set a business `is_active = false` in database
2. Search for that business

**Expected Result:**
- ✅ Business does NOT appear in results
- ✅ Only active businesses shown

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 8.4: Very Long Business Names
**Steps:**
1. Create business with 100+ character name
2. Search for it

**Expected Result:**
- ✅ Name truncates with ellipsis
- ✅ Card doesn't overflow
- ✅ Layout remains intact

**Status:** [ ] Pass [ ] Fail

---

### 9. Performance Tests

#### Test Case 9.1: Search Response Time
**Steps:**
1. Search for common term
2. Measure time to results

**Expected Result:**
- ✅ Results appear in < 500ms
- ✅ Debounce delay = 300ms
- ✅ Total time < 1 second

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 9.2: Multiple Rapid Searches
**Steps:**
1. Type quickly: "c" → "co" → "cof" → "coff"
2. Check network requests

**Expected Result:**
- ✅ Only final request executes
- ✅ Previous requests cancelled
- ✅ No memory leaks
- ✅ No duplicate results

**Status:** [ ] Pass [ ] Fail

---

### 10. UI/UX Verification

#### Test Case 10.1: Search Animations
**Steps:**
1. Load dashboard
2. Observe search card

**Expected Result:**
- ✅ Fade-in animation smooth
- ✅ Duration ~500ms
- ✅ Easing feels natural
- ✅ No layout shift

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 10.2: Hover Effects
**Steps:**
1. Hover over search results

**Expected Result:**
- ✅ Background changes to purple-50
- ✅ Smooth transition
- ✅ Cursor becomes pointer
- ✅ Row highlights clearly

**Status:** [ ] Pass [ ] Fail

---

#### Test Case 10.3: Loading State
**Steps:**
1. Search for term
2. Observe loading indicator

**Expected Result:**
- ✅ Spinner appears
- ✅ Text says "Searching..."
- ✅ Spinner animates smoothly
- ✅ Centered in dropdown

**Status:** [ ] Pass [ ] Fail

---

## 🔍 SQL Queries for Verification

### Check Search Function Works
```sql
-- Test search function
SELECT * FROM search_businesses('coffee', 6);

-- Should return businesses with 'coffee' in name or category
-- Max 6 results
-- Ordered by relevance
```

### Verify Social Clicks Tracked
```sql
-- Check social clicks for a user
SELECT 
  sc.platform,
  sc.clicked_at,
  b.name as business_name
FROM social_clicks sc
JOIN businesses b ON b.id = sc.business_id
WHERE sc.user_id = 'your-user-id-here'
ORDER BY sc.clicked_at DESC;
```

### Verify Verified Reviews
```sql
-- Check which reviews are verified
SELECT 
  r.rating,
  r.verified,
  r.comment,
  b.name as business_name,
  p.full_name as reviewer_name
FROM reviews r
JOIN businesses b ON b.id = r.business_id
JOIN profiles p ON p.id = r.user_id
ORDER BY r.created_at DESC;
```

### Check Personal vs Business Accounts
```sql
-- Count account types
SELECT 
  account_type,
  COUNT(*) as count
FROM profiles
GROUP BY account_type;

-- Should show:
-- personal | X
-- business | Y
```

---

## 🎯 User Flow Summary

```
1. User visits /auth
   ↓
2. Logs in or signs up
   ↓
3. Redirected to /dashboard
   ↓
4. Sees "Find Businesses" search bar
   ↓
5. Types business name (e.g., "coffee")
   ↓
6. Dropdown shows 6 suggestions
   ↓
7. Clicks "Coffee Time"
   ↓
8. Navigates to /business/{id}
   ↓
9. Clicks Instagram social button
   ↓
10. Button turns GREEN with checkmark
    ↓
11. Clicks "Write a Review"
    ↓
12. GREEN banner: "Verified Reviewer ✓"
    ↓
13. Submits 5-star review
    ↓
14. Review appears with verified badge
```

---

## 📊 Success Metrics

After implementation, all these should be TRUE:

- [x] Login redirects to `/dashboard` ✅
- [x] Dashboard shows business search ✅
- [x] Search queries only existing businesses ✅
- [x] Max 6 suggestions displayed ✅
- [x] 300ms debounce implemented ✅
- [x] Clicking result navigates to business page ✅
- [x] Social click tracking works ✅
- [x] Verified reviews system works ✅
- [x] Unauthenticated users redirected ✅
- [x] All animations smooth ✅

---

## 🐛 Common Issues & Solutions

### Issue 1: Search Returns Empty
**Cause:** No businesses in database  
**Solution:** Create test business or run migration

### Issue 2: Navigation Doesn't Work
**Cause:** Business ID invalid  
**Solution:** Check business exists in `businesses` table

### Issue 3: Social Clicks Don't Save
**Cause:** Not authenticated  
**Solution:** Ensure user is logged in, check RLS policies

### Issue 4: Search Too Slow
**Cause:** No indexes on search fields  
**Solution:** Verify tsvector index exists on `businesses.search_vector`

---

## ✅ Final Checklist

Before marking complete:

- [ ] All 50+ test cases pass
- [ ] No console errors
- [ ] Database queries optimized
- [ ] RLS policies working
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] Error handling robust
- [ ] Loading states present
- [ ] Success messages clear
- [ ] Documentation updated

---

**Test Date:** _______________  
**Tester:** _______________  
**Result:** [ ] PASS [ ] FAIL  
**Notes:** _________________________________

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Project:** Get Review - Post-Login User Experience  
**Version:** 2.0
