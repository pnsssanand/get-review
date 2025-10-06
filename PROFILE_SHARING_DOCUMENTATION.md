# 📤 Profile Sharing Feature Documentation

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** October 7, 2025  
**Feature:** Complete profile sharing system with QR codes, social media, and Web Share API

---

## 🎯 Feature Overview

The profile sharing feature allows visitors and logged-in users to share business and user profiles through multiple channels:

✅ **Copyable Public Link** - Copy profile URL to clipboard  
✅ **QR Code Generator** - Generate and download QR codes  
✅ **Social Media Buttons** - Share to WhatsApp, Facebook, X (Twitter), LinkedIn  
✅ **Web Share API** - Native mobile sharing (iOS/Android)  
✅ **Beautiful UI** - Integrated with shadcn/ui components  
✅ **Public Access** - Profiles accessible without authentication

---

## 📦 What Was Implemented

### 1. Dependencies Installed

```bash
npm install qrcode.react react-icons
```

**Packages:**
- `qrcode.react` - QR code generation component
- `react-icons` - Social media icons (already included via lucide-react)

### 2. ShareProfile Component

**File:** `src/components/ShareProfile.tsx`

**Features:**
- Modal dialog with all sharing options
- Copy link with visual feedback (checkmark animation)
- QR code display (160x160px with high error correction)
- QR code download as PNG
- Social media share buttons with proper URL encoding
- Web Share API integration for mobile devices
- Responsive design with Tailwind CSS
- Framer Motion animations

**Props Interface:**
```typescript
interface ShareProfileProps {
  profileId: string;        // UUID of profile/business
  profileName: string;      // Display name
  profileType?: 'user' | 'business';  // Default: 'user'
  trigger?: React.ReactNode;  // Custom trigger button (optional)
}
```

**Usage Example:**
```tsx
<ShareProfile
  profileId="abc-123-def-456"
  profileName="John's Business"
  profileType="business"
/>
```

### 3. Profile Page Integration

**File:** `src/pages/Profile.tsx`

**Changes:**
- Added ShareProfile import
- Integrated share button below profile name
- Positioned in profile header card
- Animated entrance with Framer Motion

**Location:** Below the profile name and business name, inside the profile header card.

### 4. Business Detail Page Integration

**File:** `src/pages/BusinessDetail.tsx`

**Changes:**
- Added ShareProfile import
- Integrated share button next to category badge
- Updated layout to accommodate share button
- Maintains responsive design

**Location:** Next to the category badge, below the business name.

---

## 🔒 Security & Access

### Public Access Enabled

Both user profiles and business profiles are publicly accessible:

#### User Profiles (profiles table)
```sql
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);
```
✅ Anyone can view any user profile without authentication.

#### Business Profiles (businesses table)
```sql
CREATE POLICY "Anyone can view active businesses"
  ON public.businesses FOR SELECT
  USING (is_active = true);
```
✅ Anyone can view active businesses without authentication.

### What This Means

1. **Shared Links Work Everywhere** - Anyone with the link can view the profile
2. **QR Codes Work** - Scanning QR code opens profile without login
3. **Social Shares Work** - Clicking shared links on social media works
4. **No Authentication Required** - Visitors can browse shared profiles freely

---

## 🌐 Social Media Integration

### Supported Platforms

#### 1. WhatsApp
- **URL Template:** `https://api.whatsapp.com/send?text={MESSAGE}%20{URL}`
- **Opens:** WhatsApp app or web.whatsapp.com
- **Message:** "Check out {Name} on Get Review!"

#### 2. Facebook
- **URL Template:** `https://www.facebook.com/sharer/sharer.php?u={URL}`
- **Opens:** Facebook share dialog
- **Features:** Shows Open Graph preview (if configured)

#### 3. X (Twitter)
- **URL Template:** `https://twitter.com/intent/tweet?text={MESSAGE}&url={URL}`
- **Opens:** Twitter compose dialog
- **Character Limit:** Respects 280 character limit

#### 4. LinkedIn
- **URL Template:** `https://www.linkedin.com/shareArticle?mini=true&url={URL}&title={MESSAGE}`
- **Opens:** LinkedIn share dialog
- **Features:** Professional sharing with title

### Share URL Format

**User Profiles:**
```
https://yourdomain.com/profile/{userId}
```

**Business Profiles:**
```
https://yourdomain.com/business/{businessId}
```

---

## 📱 Mobile Web Share API

### What It Does

On mobile devices (iOS/Android), a native "Share via device..." button appears that uses the device's built-in share sheet.

### Supported Platforms

✅ **iOS Safari** (iOS 12.2+)  
✅ **Android Chrome** (Chrome 75+)  
✅ **Android Firefox** (Firefox 71+)  
✅ **Samsung Internet**  
✅ **Microsoft Edge Mobile**

### Feature Detection

The component automatically detects if `navigator.share` is available:

```typescript
{navigator.share && (
  <Button onClick={handleNativeShare}>
    Share via device...
  </Button>
)}
```

If available, users can share via:
- Messages / SMS
- Email
- Third-party apps (Telegram, Discord, etc.)
- System clipboard
- AirDrop (iOS)
- Nearby Share (Android)

---

## 🎨 UI/UX Features

### Copy Link Feedback

**Before Click:**
```
[ Copy Link ]  <-- Copy icon + "Copy" text
```

**After Click:**
```
[ Copied! ]  <-- Check icon + "Copied" text (green)
```

Animation: Scale transition with Framer Motion  
Duration: Resets after 2 seconds  
Toast: "Link copied to clipboard!"

### QR Code

**Display:**
- Size: 160x160 pixels
- Error Correction: High (Level H)
- Background: White with padding
- Format: Canvas element

**Download:**
- Format: PNG image
- Filename: `{profile-name}-qr-code.png`
- Resolution: Same as display (160x160)

### Modal Design

**Component:** shadcn/ui Dialog  
**Width:** `sm:max-w-md` (448px)  
**Sections:**
1. Header with title and description
2. Copy link input + button
3. QR code display + download button
4. Social media grid (2 columns)
5. Native share button (if available)

**Responsive:**
- Mobile: Single column, full width
- Desktop: Fixed width modal

---

## 🧪 Testing Checklist

### ✅ Basic Functionality

- [ ] Share button appears on user profiles
- [ ] Share button appears on business profiles
- [ ] Clicking share opens modal
- [ ] Modal displays correct profile URL
- [ ] Profile name appears in share text

### ✅ Copy Link

- [ ] Copy button copies URL to clipboard
- [ ] Button changes to "Copied" with checkmark
- [ ] Toast notification appears
- [ ] Resets after 2 seconds
- [ ] Works on different browsers

### ✅ QR Code

- [ ] QR code displays correctly
- [ ] Scanning QR opens correct profile
- [ ] Download button works
- [ ] Downloaded PNG opens correctly
- [ ] Filename matches profile name

### ✅ Social Media Shares

- [ ] WhatsApp button opens WhatsApp
- [ ] Facebook button opens Facebook
- [ ] X (Twitter) button opens Twitter
- [ ] LinkedIn button opens LinkedIn
- [ ] Correct URL is shared
- [ ] Share text includes profile name

### ✅ Mobile Web Share

- [ ] Native share button appears on mobile
- [ ] Share sheet opens on mobile
- [ ] Can share via messages/email
- [ ] Can share via third-party apps

### ✅ Public Access

- [ ] Open shared link in incognito window
- [ ] Profile loads without authentication
- [ ] All profile data displays correctly
- [ ] Scan QR code on different device
- [ ] Profile opens without login

### ✅ Edge Cases

- [ ] Long profile names display correctly
- [ ] Special characters in names work
- [ ] Works with profiles without images
- [ ] Works with minimal profile data
- [ ] Error handling for clipboard failures

---

## 🔧 Configuration

### Customizing Share Message

Edit in `src/components/ShareProfile.tsx`:

```typescript
const shareText = `Check out ${profileName} on Get Review!`;
```

**Examples:**
- `"See ${profileName}'s profile on Get Review!"`
- `"${profileName} is on Get Review - Check it out!"`
- `"Connect with ${profileName} on Get Review"`

### Customizing QR Code

Adjust in `src/components/ShareProfile.tsx`:

```typescript
<QRCodeCanvas
  value={profileUrl}
  size={160}           // Change size (128, 192, 256)
  level="H"            // Error correction: L, M, Q, H
  includeMargin={true} // Add white padding
/>
```

**Size Options:**
- Small: 128px
- Medium: 160px (current)
- Large: 192px
- Extra Large: 256px

**Error Correction Levels:**
- L (Low): ~7% correction
- M (Medium): ~15% correction
- Q (Quartile): ~25% correction
- H (High): ~30% correction (current)

### Adding More Social Platforms

Edit `shareOnSocial()` function:

```typescript
case 'telegram':
  openShare(`https://t.me/share/url?url=${encoded}&text=${text}`);
  break;
case 'reddit':
  openShare(`https://reddit.com/submit?url=${encoded}&title=${text}`);
  break;
case 'pinterest':
  openShare(`https://pinterest.com/pin/create/button/?url=${encoded}`);
  break;
```

Then add buttons to UI:

```tsx
<Button onClick={() => shareOnSocial('telegram')}>
  <Send className="h-4 w-4" />
  Telegram
</Button>
```

---

## 📊 Analytics (Optional)

### Track Social Shares

Uncomment in `ShareProfile.tsx`:

```typescript
const shareOnSocial = (platform) => {
  // ... share logic ...
  
  // Track the share
  trackSocialClick(platform, profileId);
};
```

Then implement tracking:

```typescript
const trackSocialClick = async (platform: string, profileId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from('social_shares').insert({
    profile_id: profileId,
    platform: platform,
    shared_by: user?.id,
    shared_at: new Date().toISOString()
  });
};
```

### Create Shares Table

```sql
CREATE TABLE public.social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  platform TEXT NOT NULL,
  shared_by UUID REFERENCES auth.users(id),
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_profile
    FOREIGN KEY (profile_id)
    REFERENCES profiles(id) ON DELETE CASCADE
);
```

---

## 🚀 Deployment Considerations

### Environment Variables

No additional environment variables needed. Uses:
- `window.location.origin` - Automatically gets current domain
- Supabase client - Already configured

### Production URLs

**Development:**
```
http://localhost:8081/profile/{id}
```

**Production:**
```
https://yourapp.com/profile/{id}
```

URLs are automatically generated based on `window.location.origin`.

### Open Graph Tags (Recommended)

Add to `index.html` for better social media previews:

```html
<meta property="og:title" content="Get Review" />
<meta property="og:description" content="Share your profile and get reviews" />
<meta property="og:image" content="https://yourapp.com/og-image.jpg" />
<meta property="og:url" content="https://yourapp.com" />
<meta name="twitter:card" content="summary_large_image" />
```

For dynamic Open Graph tags per profile, implement server-side rendering or meta tag injection.

---

## 🐛 Troubleshooting

### Issue: Copy doesn't work

**Cause:** Clipboard API requires HTTPS or localhost  
**Fix:** Deploy to HTTPS domain or test on localhost

### Issue: QR code doesn't scan

**Cause:** URL too long or QR code too small  
**Fix:** Increase QR code size or use URL shortener

### Issue: Social share doesn't work

**Cause:** Pop-up blocked by browser  
**Fix:** User must allow pop-ups for site

### Issue: Web Share API doesn't appear

**Cause:** Only available on mobile or HTTPS  
**Fix:** Test on mobile device with HTTPS

### Issue: Shared link shows 404

**Cause:** RLS policies not applied  
**Fix:** Verify migrations were run in Supabase

---

## 📝 Files Modified

### Created
- `src/components/ShareProfile.tsx` (275 lines)
- `PROFILE_SHARING_DOCUMENTATION.md` (this file)

### Modified
- `src/pages/Profile.tsx` (added ShareProfile component)
- `src/pages/BusinessDetail.tsx` (added ShareProfile component)
- `package.json` (added qrcode.react dependency)

### No Changes Required
- `supabase/migrations/*.sql` (RLS policies already correct)

---

## 🎉 Success Criteria

✅ **Functional Requirements:**
- Copy link copies correct URL
- QR code generates and downloads
- All 4 social platforms share correctly
- Web Share API works on mobile
- Public access works for shared links

✅ **Non-Functional Requirements:**
- Modal opens/closes smoothly
- Animations are performant
- UI is responsive on all devices
- No console errors
- TypeScript types are correct

✅ **User Experience:**
- Share button is discoverable
- Copy feedback is clear
- QR code is scannable
- Social buttons open correct apps
- Error messages are helpful

---

## 🔮 Future Enhancements

### Potential Additions

1. **Share Statistics**
   - Track number of shares per platform
   - Dashboard for share analytics
   - Most shared profiles

2. **Custom QR Codes**
   - Add profile logo to QR code center
   - Custom colors matching brand
   - Different QR code styles

3. **Short URLs**
   - Implement URL shortener (e.g., `yourapp.com/p/abc123`)
   - Easier to type and share
   - Better for QR codes

4. **Email Sharing**
   - Add "Share via Email" button
   - Pre-filled email template
   - Include profile preview

5. **Embed Code**
   - Generate iframe embed code
   - Widget for external websites
   - Customizable styling

6. **Share Image Generator**
   - Create beautiful share cards
   - Include profile photo and info
   - One-click download for social media

---

## 📞 Support

**Created by:** Mr. Anand Pinisetty  
**Team:** Dream Team  
**Date:** October 7, 2025

For issues or questions about this feature, refer to:
- Component source: `src/components/ShareProfile.tsx`
- Integration examples: `src/pages/Profile.tsx`, `src/pages/BusinessDetail.tsx`
- This documentation: `PROFILE_SHARING_DOCUMENTATION.md`

---

**End of Documentation**
