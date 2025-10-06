# 📍 Profile Sharing - Visual Location Guide

**Quick visual reference for where Share buttons appear**

---

## 👤 User Profile Page (`/profile/:id`)

```
┌─────────────────────────────────────────────────────────┐
│  [Back to Home]                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    ┌───────────┐                        │
│                    │  Profile  │                        │
│                    │   Image   │                        │
│                    └───────────┘                        │
│                                                          │
│                  John Smith                             │
│                My Cool Business                         │
│                                                          │
│              [📤 Share Button]  ← HERE!                │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Your Progress                                          │
│  ████████░░░░░░░░░░░ 40% Complete                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Quick Actions                                          │
│  [Instagram] [Facebook] [Twitter] [LinkedIn]           │
└─────────────────────────────────────────────────────────┘
```

**Location:** Inside the profile header card, centered below the name(s)

---

## 🏢 Business Profile Page (`/business/:id`)

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]                                               │
│                                                          │
│  ╔════════════════════════════════════════════════╗    │
│  ║       Cover Image / Banner                     ║    │
│  ╚════════════════════════════════════════════════╝    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ┌───────┐                                              │
│  │ Logo  │  My Business Name  [✓ Verified]            │
│  │ 120px │                                              │
│  └───────┘  [Retail] [📤 Share] ← HERE!               │
│                                                          │
│             ⭐ 4.8 (12 reviews)                        │
│                                                          │
│  This is the business description text that explains   │
│  what the business does and why customers love it.     │
│                                                          │
│  📍 123 Main St, City, State                           │
│  🌐 www.business.com                                   │
│  📧 contact@business.com                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  About This Business                                    │
│  ...detailed information...                            │
└─────────────────────────────────────────────────────────┘
```

**Location:** Next to the category badge, below the business name

---

## 📱 Share Modal Appearance

When you click the Share button, this modal opens:

```
┌─────────────────────────────────────────────────────────┐
│  📤 Share Profile                                  [✕]  │
│  Share John's profile with others                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Profile Link                                           │
│  ┌──────────────────────────────────────────┐         │
│  │ http://localhost:8081/profile/abc123     │ [Copy]  │
│  └──────────────────────────────────────────┘         │
│                                                          │
│  QR Code                                                │
│  ┌──────────────────────────────────────────┐         │
│  │                                            │         │
│  │         ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀              │         │
│  │         ▀ ▄▄▄ ▀ ▄▄ ▀ ▄▄▄ ▀              │         │
│  │         ▀ ▀▀▀ ▀ ▄▄ ▀ ▀▀▀ ▀              │         │
│  │         QR Code Pattern                  │         │
│  │         ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀              │         │
│  │                                            │         │
│  └──────────────────────────────────────────┘         │
│  Scan to open this profile                            │
│  [🔗 Download QR Code]                                │
│                                                          │
│  Share via Social Media                                │
│  ┌────────────────┐  ┌────────────────┐               │
│  │ 💬 WhatsApp    │  │ 📘 Facebook   │               │
│  └────────────────┘  └────────────────┘               │
│  ┌────────────────┐  ┌────────────────┐               │
│  │ 🐦 X (Twitter) │  │ 💼 LinkedIn   │               │
│  └────────────────┘  └────────────────┘               │
│                                                          │
│  [📤 Share via device...]  ← Only on mobile           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual Design Elements

### Share Button Design

**Default State:**
```
┌─────────────────┐
│ 📤 Share        │  ← Outline button
└─────────────────┘
```

**Hover State:**
```
┌─────────────────┐
│ 📤 Share        │  ← Slightly darker background
└─────────────────┘
     ↑
   Shadow effect
```

### Copy Button States

**Before Copy:**
```
[📋 Copy]
```

**After Copy (2 seconds):**
```
[✓ Copied]  ← Green checkmark with animation
```

### Social Media Buttons

```
Grid Layout (2 columns):

[💬 WhatsApp ]  [📘 Facebook  ]
   Green icon      Blue icon

[🐦 X/Twitter]  [💼 LinkedIn  ]
  Light blue       Dark blue
```

---

## 📏 Button Sizes & Spacing

### User Profile Page
- **Button Size:** Small (`size="sm"`)
- **Spacing:** 24px margin top (mt-6)
- **Width:** Auto-width based on content
- **Alignment:** Center

### Business Profile Page
- **Button Size:** Small (`size="sm"`)
- **Spacing:** Inline with category badge
- **Width:** Auto-width based on content
- **Alignment:** Left (inline)

### Modal Dimensions
- **Width:** 448px on desktop (sm:max-w-md)
- **Width:** Full width on mobile (with padding)
- **Padding:** 24px (p-6)
- **Gap between sections:** 24px (space-y-6)

---

## 🎯 Responsive Behavior

### Desktop (≥768px)
```
Profile Card:
┌─────────────────────────────────────┐
│         Profile Image               │
│         Name                        │
│         [Share Button]              │  ← Centered
└─────────────────────────────────────┘

Modal:
      ┌─────────────────┐
      │  Share Modal    │  ← Fixed width, centered
      │  (448px wide)   │
      └─────────────────┘
```

### Mobile (<768px)
```
Profile Card:
┌───────────────────┐
│   Profile Image   │
│   Name            │
│   [Share Button]  │  ← Full width
└───────────────────┘

Modal:
┌─────────────────────┐
│  Share Modal        │  ← Full width
│  (with padding)     │  ← Vertical scroll
│                     │
│  [Native Share]     │  ← Appears here
└─────────────────────┘
```

---

## 🎬 Animation Details

### Button Click Animation
```
Normal → Click → Scale Down (0.95) → Scale Back (1.0)
                  Duration: 150ms
```

### Modal Open Animation
```
Hidden → Fade In + Scale Up
Opacity: 0 → 1
Scale: 0.95 → 1.0
Duration: 200ms
```

### Copy Success Animation
```
[Copy] → Scale In → [✓ Copied] → Wait 2s → Reset
         Duration: 150ms (spring)
```

---

## 🔍 How to Find the Share Button

### On User Profiles:
1. Navigate to any user profile (`/profile/:id`)
2. Look at the **profile header card** (with profile image and name)
3. Find the Share button **directly below the name(s)**
4. It's centered and has a share icon (📤)

### On Business Profiles:
1. Navigate to any business page (`/business/:id`)
2. Look at the **business header section** (with logo and name)
3. Find the Share button **next to the category badge**
4. It's on the same line as the category, inline with text

### Quick Visual Cues:
- 📤 Icon (share/upload arrow)
- "Share" text label
- Outline button style (not filled)
- Small size button
- Subtle hover effect

---

## 🎨 Color Scheme

### Light Mode (Current)
```
Share Button:
- Background: White
- Border: Gray (border-border)
- Text: Dark gray (foreground)
- Hover: Slight gray background

Modal:
- Background: White
- Header: Dark text
- Borders: Light gray
- Shadow: Subtle elevation
```

### Modal Elements
```
Copy Button (Normal):
- Background: Light gray (secondary)
- Text: Dark
- Icon: Dark

Copy Button (Copied):
- Background: Green
- Text: White
- Icon: White checkmark

Social Buttons:
- Background: White
- Border: Light gray
- Icons: Brand colors
- Hover: Light gray background
```

---

## 📋 Testing Checklist

### Visual Verification

**User Profile:**
- [ ] Share button appears below name
- [ ] Button is centered
- [ ] Proper spacing (24px margin)
- [ ] Icon visible (📤)
- [ ] Text readable

**Business Profile:**
- [ ] Share button next to category badge
- [ ] Inline alignment correct
- [ ] Proper spacing between elements
- [ ] No layout issues
- [ ] Responsive on mobile

**Modal:**
- [ ] Opens centered on screen
- [ ] Proper width (448px desktop)
- [ ] Full width on mobile
- [ ] All sections visible
- [ ] Scroll works if needed
- [ ] Close button (X) visible
- [ ] Close button works
- [ ] Click outside to close works

**Social Buttons:**
- [ ] Grid layout (2x2)
- [ ] Icons colored correctly
- [ ] Text labels visible
- [ ] Hover effects work
- [ ] Click opens correct platform

---

## 🖼️ Expected Screenshots

When testing, your screenshots should look like:

### 1. User Profile with Share Button
- Profile image at top
- User name below image
- Share button centered below name
- Button has outline style
- Share icon visible

### 2. Business Profile with Share Button
- Business logo on left
- Business name and verified badge
- Category badge and Share button on same line
- Share button has outline style

### 3. Open Share Modal
- Modal centered on screen
- Title "Share Profile"
- Copy link input visible
- QR code displayed (black and white pattern)
- 4 social media buttons in grid
- All buttons clearly labeled

### 4. Copy Button Success State
- Button shows "Copied!" text
- Green checkmark icon
- Green background color
- Toast notification visible

### 5. Downloaded QR Code
- PNG file in downloads
- Filename matches profile name
- QR code is clear and scannable
- White background with black pattern

---

**End of Visual Guide**

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Last Updated:** October 7, 2025
