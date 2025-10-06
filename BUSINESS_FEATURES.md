# 🌟 Get Review - Business Features Documentation

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Last Updated:** 2025-10-06

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Account Types](#account-types)
3. [Business Search](#business-search)
4. [Business Profiles](#business-profiles)
5. [Social Click Tracking](#social-click-tracking)
6. [Verified Reviews](#verified-reviews)
7. [User Flows](#user-flows)
8. [API Reference](#api-reference)

---

## 🎯 Overview

Get Review now supports comprehensive business features including:

- **Dual Account System**: Personal and Business account types
- **Business Discovery**: Full-text search with autocomplete
- **Social Engagement**: Track when users interact with your social media
- **Trust Building**: Verified review system based on actual engagement
- **Seamless Conversion**: Easy upgrade from personal to business account

---

## 👤 Account Types

### Personal Accounts (Default)

**Created when:**
- User signs up via Auth page
- All new registrations default to 'personal'

**Features:**
- Create profile with social links
- Leave reviews on businesses
- Track task completions
- View personal dashboard

**Limitations:**
- Cannot create business listings
- Cannot receive reviews from others
- No business analytics

### Business Accounts

**Created when:**
- User clicks "Convert to Business" button
- Completes business profile form
- Optionally converts existing personal account

**Features:**
- Everything from Personal accounts PLUS:
- Create business listings
- Receive reviews from customers
- Track social media engagement
- View business analytics
- Appear in search results
- Get verified badge (after approval)

**Database Structure:**
```typescript
interface Profile {
  account_type: 'personal' | 'business';
  business_id: string | null; // Links to owned business
}
```

---

## 🔍 Business Search

### Features

1. **Autocomplete Search**
   - Real-time suggestions as you type
   - Minimum 2 characters to trigger
   - 300ms debounce to optimize performance
   - Maximum 6 results displayed

2. **Full-Text Search**
   - Searches business name, description, and category
   - Uses PostgreSQL `tsvector` for performance
   - Ranked results (relevance + popularity)

3. **Result Display**
   - Business logo or placeholder
   - Business name and category
   - Average star rating
   - Total review count

### Usage

**Component Location:** `src/components/BusinessSearch.tsx`

**Implementation:**
```typescript
import { BusinessSearch } from "@/components/BusinessSearch";

// In your page component:
<BusinessSearch />
```

**Backend Function:**
```sql
SELECT * FROM search_businesses('restaurant', 6);
-- Returns top 6 results matching 'restaurant'
```

### User Experience

1. User types in search box on homepage
2. Results appear in dropdown after 2+ characters
3. Click any result to navigate to business detail page
4. Search closes automatically on selection

---

## 🏢 Business Profiles

### Profile Information

**Basic Details:**
- Business name (required)
- Category (required)
- Description (optional)

**Contact Information:**
- Email
- Phone
- Website URL

**Location:**
- Street address
- City, State, Country
- Postal code

**Media:**
- Logo image
- Cover image
- Gallery images (array)

**Social Media:**
Stored as JSONB for flexibility:
```json
{
  "instagram": "https://instagram.com/business",
  "facebook": "https://facebook.com/business",
  "website": "https://business.com"
}
```

**Status Fields:**
- `is_verified`: Boolean (admin approval)
- `is_active`: Boolean (soft delete)

### Creating a Business Profile

**UI Flow:**

1. **Trigger**: Click floating "Convert to Business" button
   - Appears on Dashboard for personal accounts
   - Animated entrance (scale + fade)
   - Gradient purple-pink-orange design

2. **Form Modal**:
   - Multi-section form:
     - Basic Information
     - Contact Information  
     - Location
   - Checkbox: "Convert my personal account to business"
   - Validation on required fields

3. **Submission**:
   - Creates business in `businesses` table
   - Optionally updates `profiles.account_type` to 'business'
   - Navigates to business detail page
   - Shows success toast notification

**Code Example:**
```typescript
const { data, error } = await supabase
  .from("businesses")
  .insert({
    owner_id: user.id,
    name: "Pizza Palace",
    category: "Restaurant",
    social_links: {
      instagram: "https://instagram.com/pizzapalace",
      facebook: "https://facebook.com/pizzapalace"
    }
  });
```

---

## 📊 Social Click Tracking

### How It Works

1. **Business Detail Page** displays social media buttons
2. User clicks a button (e.g., Instagram)
3. System records click in `social_clicks` table
4. Link opens in new tab
5. Button turns green with checkmark
6. Status persists across sessions

### Features

**Persistent Tracking:**
- One record per user/business/platform combination
- UNIQUE constraint prevents duplicates
- `clicked_at` timestamp updates on re-click

**Visual Feedback:**
- Unclicked: Outline button with platform icon
- Clicked: Green filled button with checkmark icon
- Hover effects and animations

**Security:**
- Requires authentication (signed-in users only)
- Row Level Security policies enforce ownership
- Business owners can view all clicks on their business

### Database Schema

```sql
CREATE TABLE social_clicks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL, -- Who clicked
  business_id UUID NOT NULL, -- Which business
  platform TEXT NOT NULL, -- Which social platform
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id, platform)
);
```

### Usage

**Frontend:**
```typescript
const handleSocialClick = async (platform: string, url: string) => {
  const { data } = await supabase.rpc("record_social_click", {
    p_business_id: businessId,
    p_platform: platform,
  });
  
  // Update UI state
  setClickedPlatforms(prev => new Set([...prev, platform]));
  
  // Open link
  window.open(url, "_blank");
};
```

**Checking Status:**
```typescript
const { data: clicksData } = await supabase
  .from("social_clicks")
  .select("platform")
  .eq("business_id", businessId)
  .eq("user_id", userId);

const clickedPlatforms = new Set(clicksData.map(c => c.platform));
```

---

## ⭐ Verified Reviews

### Trust System

Reviews are automatically verified based on social engagement:

**Verified Review Criteria:**
- User has clicked **at least one** social link for the business
- Verification happens automatically via database trigger
- Verified status cannot be manually changed

**Visual Indicators:**
- Verified reviews show green badge with checkmark
- Progress bar shows % of verified reviews
- Prominent display on business page

### Review Process

**Before Reviewing:**

1. User visits business detail page
2. Clicks social media links (optional but recommended)
3. System tracks clicks
4. Green checkmarks appear on clicked links

**Writing Review:**

1. Click "Write a Review" button
2. Review form checks social click status
3. Shows verification status banner:
   - 🟢 Green: "You're a verified reviewer"
   - 🔵 Blue: "Click social links to become verified"
4. User selects star rating (1-5)
5. Optionally adds title and comment
6. Submits review

**After Submission:**

1. Database trigger checks `has_social_click(user_id, business_id)`
2. Sets `verified` flag automatically
3. Review appears with appropriate badge
4. One review per user per business (unique constraint)

### Database Trigger

```sql
CREATE TRIGGER trigger_set_review_verified
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION set_review_verified();

-- Function checks social clicks and sets verified flag
CREATE FUNCTION set_review_verified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.verified := has_social_click(NEW.user_id, NEW.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Review Schema

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  business_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  verified BOOLEAN DEFAULT false, -- Auto-set by trigger
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_id) -- One review per user
);
```

---

## 🔄 User Flows

### Flow 1: New User Sign Up → Business Creation

```
1. User visits homepage → Clicks "Get Started"
2. Auth page → Signs up with email/password
3. Redirected to Dashboard (account_type = 'personal')
4. Sees "Convert to Business" floating button
5. Clicks button → Opens modal form
6. Fills business details → Checks "Convert account" → Submits
7. Account updated to 'business', business created
8. Redirected to business detail page
9. Can now add social links, receive reviews
```

### Flow 2: Customer Discovering & Reviewing Business

```
1. User visits homepage
2. Types "pizza" in search box
3. Sees autocomplete results with ratings
4. Clicks "Pizza Palace" → Navigates to business page
5. Sees social media buttons (all white/outline)
6. Clicks Instagram button:
   - System records click
   - Button turns green with checkmark
   - Instagram opens in new tab
7. Returns to page, clicks Facebook too (another checkmark)
8. Clicks "Write a Review" button
9. Review form shows: "✅ You're a verified reviewer!"
10. Rates 5 stars, writes comment, submits
11. Review appears with green "Verified" badge
```

### Flow 3: Business Owner Viewing Analytics

```
1. Business owner logs in
2. Dashboard shows their business
3. Can view business detail page
4. Sees all reviews with verification %
5. Admin dashboard (if admin role) shows:
   - Total clicks on social links
   - Review statistics
   - Verified review percentage
   - User engagement metrics
```

---

## 🔌 API Reference

### Supabase Functions

#### `search_businesses(query, limit)`

**Purpose:** Full-text search for businesses

**Parameters:**
- `search_query`: TEXT - Search term
- `result_limit`: INTEGER (default: 6) - Max results

**Returns:** Array of business results with ratings

```typescript
const { data, error } = await supabase.rpc('search_businesses', {
  search_query: 'restaurant',
  result_limit: 10
});

// Returns:
[{
  id: "uuid",
  name: "Pizza Palace",
  category: "Restaurant",
  logo_url: "https://...",
  rating: 4.5,
  review_count: 23
}, ...]
```

#### `record_social_click(business_id, platform)`

**Purpose:** Track when user clicks social media link

**Parameters:**
- `p_business_id`: UUID - Business ID
- `p_platform`: TEXT - Platform name (e.g., 'instagram')

**Returns:** JSON result object

```typescript
const { data, error } = await supabase.rpc('record_social_click', {
  p_business_id: businessId,
  p_platform: 'instagram'
});

// Returns:
{ ok: true, clicked: true, platform: 'instagram' }
```

#### `has_social_click(user_id, business_id)`

**Purpose:** Check if user has clicked any social link

**Parameters:**
- `user_uuid`: UUID - User ID
- `business_uuid`: UUID - Business ID

**Returns:** BOOLEAN

```typescript
const { data, error } = await supabase.rpc('has_social_click', {
  user_uuid: userId,
  business_uuid: businessId
});

// Returns: true or false
```

### Table Queries

#### Get Business with Reviews

```typescript
const { data, error } = await supabase
  .from('businesses')
  .select(`
    *,
    reviews (
      *,
      profiles:user_id (
        full_name,
        profile_image_url
      )
    )
  `)
  .eq('id', businessId)
  .single();
```

#### Get User's Clicked Platforms

```typescript
const { data, error } = await supabase
  .from('social_clicks')
  .select('platform')
  .eq('user_id', userId)
  .eq('business_id', businessId);

const platforms = new Set(data.map(c => c.platform));
```

#### Create Review

```typescript
const { data, error } = await supabase
  .from('reviews')
  .insert({
    business_id: businessId,
    user_id: userId,
    rating: 5,
    title: "Amazing!",
    comment: "Best pizza ever"
    // verified flag is set automatically by trigger
  });
```

---

## 🎨 Component Reference

### BusinessSearch Component

**Location:** `src/components/BusinessSearch.tsx`

**Features:**
- Debounced search (300ms)
- Animated results dropdown
- Click outside to close
- Keyboard navigation ready

**Props:** None (standalone component)

**Usage:**
```tsx
import { BusinessSearch } from "@/components/BusinessSearch";

<BusinessSearch />
```

### ConvertToBusinessButton Component

**Location:** `src/components/ConvertToBusinessButton.tsx`

**Features:**
- Floating button (bottom-right)
- Animated entrance
- Modal form with validation
- Account type conversion option

**Props:**
```typescript
interface Props {
  currentUser: User;
  currentProfile: Profile;
}
```

**Usage:**
```tsx
import { ConvertToBusinessButton } from "@/components/ConvertToBusinessButton";

<ConvertToBusinessButton 
  currentUser={user} 
  currentProfile={profile} 
/>
```

### BusinessDetail Page

**Location:** `src/pages/BusinessDetail.tsx`

**Features:**
- Business info display
- Social click tracking
- Review list with verification badges
- Responsive layout
- Progress bars for verification %

**Route:** `/business/:id`

### WriteReview Page

**Location:** `src/pages/WriteReview.tsx`

**Features:**
- Star rating selector (animated)
- Verification status banner
- Character counters
- Form validation

**Route:** `/business/:id/review`

---

## 🔐 Security & Permissions

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**Businesses:**
- SELECT: Anyone can view active businesses
- INSERT: Authenticated users (must be owner)
- UPDATE: Only business owner
- DELETE: Only business owner

**Social Clicks:**
- SELECT: Users see their own, owners see all for their business
- INSERT: Authenticated users (must be own user_id)

**Reviews:**
- SELECT: Anyone can view
- INSERT: Authenticated users (must be own user_id)
- UPDATE: Only review author
- DELETE: Only review author

### Authentication Requirements

**Public Access (No Auth):**
- Homepage with search
- View business listings
- Read reviews

**Requires Authentication:**
- Create business profile
- Click social links (tracking)
- Write reviews
- Convert account type

**Admin Only:**
- Verify businesses
- View all users
- Access admin dashboard

---

## 📈 Analytics & Metrics

### Business Metrics

Track these key metrics on business detail page:

1. **Total Reviews** - Count of all reviews
2. **Verified Reviews** - Count with `verified = true`
3. **Verification Rate** - Percentage of verified reviews
4. **Average Rating** - Mean of all rating values
5. **Social Engagement** - Total unique social clicks

### User Engagement

Track user behavior:

1. **Click-Through Rate** - % of visitors who click social links
2. **Review Conversion** - % of social clickers who leave reviews
3. **Verified Review Rate** - % of reviews that are verified

---

## 🚀 Performance Optimizations

### Database Indexes

- `businesses.search_vector` - GIN index for full-text search
- `businesses.category` - B-tree for category filtering
- `businesses.owner_id` - Foreign key index
- `social_clicks(user_id, business_id)` - Composite for fast lookups
- `reviews.business_id` - Fast review queries

### Frontend Optimizations

- Debounced search (300ms)
- Lazy loading of business images
- Paginated review display (ready for implementation)
- Cached search results
- Optimistic UI updates for clicks

---

## 🎓 Best Practices

### For Business Owners

1. **Complete your profile** - Add logo, cover image, description
2. **Add social links** - More links = more engagement opportunities
3. **Encourage reviews** - Ask satisfied customers to review
4. **Respond to reviews** - Show you care about feedback
5. **Keep info updated** - Update hours, contact info regularly

### For Reviewers

1. **Click social links first** - Get verified badge
2. **Be honest and detailed** - Help others make informed decisions
3. **Rate fairly** - Consider overall experience
4. **Update reviews** - If experience changes

### For Developers

1. **Always check auth state** - Before social tracking
2. **Handle offline gracefully** - Queue clicks for sync
3. **Validate input** - Sanitize user-generated content
4. **Test RLS policies** - Ensure proper access control
5. **Monitor performance** - Watch for slow queries

---

## 🐛 Common Issues & Solutions

### Issue: Social clicks not tracking

**Solution:**
- Verify user is authenticated
- Check browser allows third-party cookies
- Ensure RLS policies are correct
- Check network tab for failed requests

### Issue: Search returns no results

**Solution:**
- Verify businesses exist with `is_active = true`
- Check search_vector is populated
- Ensure minimum 2 characters entered
- Test directly: `SELECT * FROM search_businesses('test', 10);`

### Issue: Reviews not showing verified badge

**Solution:**
- Check user clicked social link before review
- Verify trigger exists: `trigger_set_review_verified`
- Test function: `SELECT has_social_click(user_id, business_id);`
- Ensure social_clicks record exists

### Issue: Convert button not showing

**Solution:**
- Verify `account_type` is 'personal'
- Check user and profile objects are loaded
- Ensure ConvertToBusinessButton is rendered
- Check browser console for errors

---

## 📝 Future Enhancements

Potential features to add:

1. **Business Categories** - Predefined list with icons
2. **Advanced Search Filters** - Location, rating, category
3. **Business Hours** - Open/closed status
4. **Photo Gallery** - Multiple image upload
5. **Review Responses** - Business owner replies
6. **Review Moderation** - Flag inappropriate content
7. **Analytics Dashboard** - Detailed metrics for owners
8. **Email Notifications** - New review alerts
9. **Review Incentives** - Rewards for verified reviews
10. **Social Proof** - "X people clicked Instagram this week"

---

## 📞 Support & Feedback

For issues or feature requests:

1. Check this documentation first
2. Review MIGRATION_GUIDE.md for setup issues
3. Check Supabase logs for errors
4. Review browser console for client-side errors

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Project:** Get Review - Premium Review Platform  
**Version:** 2.0 with Business Features  
**Last Updated:** 2025-10-06
