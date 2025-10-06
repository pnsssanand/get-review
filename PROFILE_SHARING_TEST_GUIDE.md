# 🧪 Profile Sharing - Quick Test Guide

**Quick steps to test the new profile sharing feature**

---

## 🚀 Test the Feature (5 Minutes)

### Step 1: View a Profile

1. Open your app: http://localhost:8081/
2. Sign in with your account
3. Navigate to any profile page:
   - User profile: Click on a user from the dashboard
   - OR Business profile: Search for a business and click on it

### Step 2: Test Share Button

Look for the **"Share"** button:
- **User profiles:** Below the profile name in the header card
- **Business profiles:** Next to the category badge

Click the "Share" button - a modal should open with sharing options.

---

## ✅ Quick Test Checklist

### 1️⃣ Copy Link (30 seconds)

- [ ] Click **"Copy"** button
- [ ] Button changes to **"Copied!"** with checkmark ✓
- [ ] Toast notification appears: "Link copied to clipboard!"
- [ ] Paste in another tab - profile loads without login

**Expected URL format:**
```
http://localhost:8081/profile/{user-id}
or
http://localhost:8081/business/{business-id}
```

---

### 2️⃣ QR Code (1 minute)

- [ ] QR code displays in the modal (160x160px, white background)
- [ ] Text below says "Scan to open this profile"
- [ ] Click **"Download QR Code"** button
- [ ] PNG file downloads with name: `{profile-name}-qr-code.png`
- [ ] Open downloaded file - QR code is clear and readable

**To test scanning:**
- Open QR code scanner on your phone
- Scan the QR code on screen or from downloaded file
- Profile should open in mobile browser

---

### 3️⃣ Social Media Sharing (2 minutes)

Test each social media button:

#### WhatsApp
- [ ] Click **WhatsApp** button
- [ ] New window opens with `api.whatsapp.com` or WhatsApp app
- [ ] Message includes: "Check out {Name} on Get Review!"
- [ ] Profile URL is included in message

#### Facebook
- [ ] Click **Facebook** button
- [ ] Facebook share dialog opens
- [ ] Profile URL is in the share field

#### X (Twitter)
- [ ] Click **X (Twitter)** button
- [ ] Twitter compose window opens
- [ ] Tweet includes profile name and URL
- [ ] Character count is reasonable (under 280)

#### LinkedIn
- [ ] Click **LinkedIn** button
- [ ] LinkedIn share dialog opens
- [ ] Profile URL and title are included

**Note:** You may need to be logged into these social media platforms.

---

### 4️⃣ Mobile Web Share API (1 minute)

**Only on mobile devices or certain browsers:**

- [ ] Look for **"Share via device..."** button at bottom of modal
- [ ] If visible, click it
- [ ] Native share sheet opens (iOS/Android)
- [ ] Can select Messages, Email, or other apps
- [ ] Shared content includes profile name and URL

**Note:** This button only appears if your browser supports `navigator.share` API:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Mobile browsers
- ❌ Desktop Chrome (not supported)
- ❌ Desktop Firefox (not supported)

---

### 5️⃣ Public Access (1 minute)

**Test that shared links work without authentication:**

1. Copy a profile link using the share feature
2. Open a **new incognito/private window** (Ctrl+Shift+N)
3. Paste the profile URL
4. Press Enter

**Expected result:**
- [ ] Profile loads successfully
- [ ] No login required
- [ ] All profile information displays
- [ ] Share button still works for visitor

**If profile doesn't load:**
- Check that Supabase migrations were run
- Verify RLS policies allow public SELECT
- Check browser console for errors

---

## 🎨 Visual Checks

### Modal Appearance

**Header:**
- [ ] Share icon (📤) next to title
- [ ] "Share Profile" title
- [ ] Description: "Share {Name}'s profile with others"

**Copy Link Section:**
- [ ] Input field shows full profile URL
- [ ] Input is read-only (can't edit)
- [ ] Clicking input selects all text
- [ ] Copy button is styled with secondary variant
- [ ] Copied state shows green checkmark

**QR Code Section:**
- [ ] Label: "QR Code"
- [ ] White square with black QR pattern
- [ ] Gray background around QR code
- [ ] Text: "Scan to open this profile"
- [ ] Download button with link icon

**Social Media Grid:**
- [ ] Label: "Share via Social Media"
- [ ] 2x2 grid layout (4 buttons)
- [ ] Each button has colored icon + platform name:
  - WhatsApp (green)
  - Facebook (blue)
  - X/Twitter (light blue)
  - LinkedIn (dark blue)

**Native Share (if available):**
- [ ] Full-width button at bottom
- [ ] Share icon + "Share via device..." text
- [ ] Primary button styling (blue)

---

## 🐛 Common Issues

### Issue: Modal doesn't open
**Fix:** Check browser console for errors. Ensure lucide-react icons are installed.

### Issue: Copy button doesn't work
**Fix:** 
- Only works on HTTPS or localhost
- Check clipboard permissions in browser
- Try in different browser

### Issue: QR code doesn't display
**Fix:** 
- Verify `qrcode.react` is installed: `npm list qrcode.react`
- Check for console errors
- Refresh page

### Issue: Social buttons don't open
**Fix:**
- Pop-ups may be blocked - allow pop-ups for localhost
- Check if URLs are encoded correctly
- Try different browser

### Issue: Shared link shows 404
**Fix:**
- Verify profile exists in database
- Check Supabase RLS policies allow public SELECT
- Ensure migrations were run

### Issue: Native share button doesn't appear
**Not an issue:** This button only appears on mobile devices or browsers that support Web Share API. Desktop Chrome/Firefox don't show it.

---

## 📸 Screenshot Checklist

Take screenshots to confirm:

1. [ ] Share button on user profile page
2. [ ] Share button on business profile page
3. [ ] Open share modal showing all options
4. [ ] Copy button in "Copied!" state
5. [ ] QR code display
6. [ ] Social media buttons grid
7. [ ] Downloaded QR code file
8. [ ] Profile loading in incognito window (public access)

---

## ✨ Success Criteria

**All systems go if:**

✅ Share button appears on both profile types  
✅ Modal opens and closes smoothly  
✅ Copy link works and shows feedback  
✅ QR code displays and downloads  
✅ All 4 social buttons open correct platforms  
✅ Shared links work in incognito window  
✅ No console errors  
✅ UI is responsive and looks good  

---

## 🎉 Next Steps

If all tests pass:

1. ✅ Feature is ready to use!
2. 📤 Share with your team/friends
3. 📱 Test on real mobile devices
4. 🔍 Monitor usage and feedback
5. 📊 (Optional) Add analytics tracking

If some tests fail:

1. 🐛 Note which tests failed
2. 📋 Check the troubleshooting section
3. 🔍 Look at browser console for errors
4. 📖 Refer to PROFILE_SHARING_DOCUMENTATION.md
5. 🆘 Report issues with specific error messages

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** October 7, 2025  
**Total Test Time:** ~5 minutes
