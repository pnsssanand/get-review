# How to Update Social Media Links

## 📍 Location
All social media links are located in: `src/pages/Index.tsx`

## 🔧 How to Update Links

1. Open the file: `src/pages/Index.tsx`
2. Find the `links` array (around line 15-50)
3. Replace the placeholder URLs with your actual social media links

## 📱 Available Social Media Platforms

The following platforms are pre-configured with beautiful icons:

### Current Links (Update These!)

```javascript
const links = [
  {
    id: "1",
    platform: "WhatsApp",
    url: "https://wa.me/919876543210", // ⚠️ UPDATE THIS
  },
  {
    id: "2",
    platform: "Facebook",
    url: "https://facebook.com/anandtravelagency", // ⚠️ UPDATE THIS
  },
  {
    id: "3",
    platform: "Instagram",
    url: "https://instagram.com/anandtravelagency", // ⚠️ UPDATE THIS
  },
  {
    id: "4",
    platform: "YouTube",
    url: "https://youtube.com/@anandtravelagency", // ⚠️ UPDATE THIS
  },
  {
    id: "5",
    platform: "LinkedIn",
    url: "https://linkedin.com/company/anandtravelagency", // ⚠️ UPDATE THIS
  },
  {
    id: "6",
    platform: "Twitter/X",
    url: "https://twitter.com/anandtravel", // ⚠️ UPDATE THIS
  },
  {
    id: "7",
    platform: "TikTok",
    url: "https://tiktok.com/@anandtravel", // ⚠️ UPDATE THIS
  },
  {
    id: "8",
    platform: "Google Review",
    url: "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review", // ⚠️ UPDATE THIS
  },
];
```

## 📝 Platform-Specific Instructions

### WhatsApp
- Format: `https://wa.me/COUNTRY_CODE_PHONE_NUMBER`
- Example: `https://wa.me/919876543210` (for India +91 9876543210)
- No spaces, no plus sign, just the country code and number

### Facebook
- Format: `https://facebook.com/YOUR_PAGE_NAME`
- Or use your page ID: `https://facebook.com/100012345678901`

### Instagram
- Format: `https://instagram.com/YOUR_USERNAME`
- Example: `https://instagram.com/anandtravelagency`

### YouTube
- Format: `https://youtube.com/@YOUR_CHANNEL_HANDLE`
- Or: `https://youtube.com/channel/YOUR_CHANNEL_ID`

### LinkedIn
- Company Page: `https://linkedin.com/company/YOUR_COMPANY`
- Personal Profile: `https://linkedin.com/in/YOUR_NAME`

### Twitter/X
- Format: `https://twitter.com/YOUR_HANDLE`
- Or: `https://x.com/YOUR_HANDLE`

### TikTok
- Format: `https://tiktok.com/@YOUR_USERNAME`

### Google Review
- Get your Google Business review link from Google My Business
- Format: `https://g.page/r/YOUR_BUSINESS_ID/review`
- Or use the direct Maps link

## ➕ Adding More Platforms

Want to add more platforms? Here are additional supported icons:

```javascript
// Add to the links array:
{
  id: "9",
  platform: "Play Store", // For your mobile app
  url: "https://play.google.com/store/apps/details?id=your.app.id",
},
```

**Supported platforms with icons:**
- WhatsApp
- Facebook
- Instagram
- YouTube
- LinkedIn
- Twitter/X
- TikTok
- Google (for reviews/maps)
- Play Store
- Any other URL (will show a generic link icon)

## 🗑️ Removing Links

To remove a social media platform:

1. Simply delete the entire object from the array
2. For example, to remove TikTok, delete:
```javascript
{
  id: "7",
  platform: "TikTok",
  url: "https://tiktok.com/@anandtravel",
  icon: "tiktok",
},
```

## 📋 Best Practices

1. **Test Your Links**: Click each button after updating to ensure they work
2. **Keep URLs Clean**: Remove tracking parameters if not needed
3. **Use HTTPS**: Always use secure URLs (https://)
4. **Order Matters**: The order in the array is the order they appear on the page
5. **Keep IDs Unique**: Each link should have a unique ID

## 🎨 Customizing Display

### Change Grid Layout
In `Index.tsx`, find this line (around line 175):
```javascript
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
```

Modify the numbers to change how many buttons appear per row:
- `grid-cols-2`: 2 columns on mobile
- `sm:grid-cols-3`: 3 columns on small screens
- `md:grid-cols-4`: 4 columns on medium+ screens

### Change Button Size
Adjust the `size` prop in the `SocialIcon` component:
```javascript
<SocialIcon platform={link.platform} size={28} /> // Change 28 to larger/smaller
```

## 🚀 After Making Changes

1. Save the file (`Ctrl+S` or `Cmd+S`)
2. The website will automatically reload with your changes
3. Test all links to ensure they work correctly
4. If the site doesn't update, try refreshing your browser

## ⚠️ Common Issues

### Link Doesn't Open
- Check for typos in the URL
- Ensure the URL starts with `https://`
- Test the URL in a browser first

### Icon Not Showing
- Check the `platform` name matches one of the supported platforms
- Platform names are case-insensitive
- If unsure, it will show a generic link icon

### WhatsApp Not Working
- Use format: `https://wa.me/COUNTRYNUMBER` (no spaces)
- Include country code without the + symbol
- Example: For +91 9876543210, use `https://wa.me/919876543210`

## 📞 Example: Complete WhatsApp Setup

```javascript
{
  id: "1",
  platform: "WhatsApp",
  url: "https://wa.me/919876543210", // India number
  // Or with a pre-filled message:
  // url: "https://wa.me/919876543210?text=Hi%20Anand%20Travel%20Agency",
}
```

---

**Need Help?** Contact the developer: Mr. Anand Pinisetty - Dream Team
