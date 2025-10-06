# Get Review - Premium Review & Profile Platform

## 🎯 Project Overview

**Get Review** is an ultra-premium, world-class platform designed for business owners to create stunning digital profiles, showcase social media presence, collect reviews, and track user engagement with advanced analytics.

**Created by**: Mr. Anand Pinisetty  
**Team**: Dream Team  
**Tech Stack**: React + TypeScript + Vite + Supabase + Framer Motion + Tailwind CSS

---

## ✨ Key Features

### 🆕 Business Features (NEW!)
- **Dual Account System**: Personal and Business account types
- **Business Search**: Full-text search with autocomplete suggestions
- **Business Profiles**: Complete business listings with contact info, location, and media
- **Social Click Tracking**: Track when users engage with your social media links
- **Verified Reviews**: Trust system based on actual social engagement
- **Floating CTA Button**: Easy conversion from personal to business account
- **Review System**: Star ratings with verified badges for engaged reviewers
- **Full-Text Search**: PostgreSQL tsvector-based search with relevance ranking

### 📤 Profile Sharing (NEW!)
- **Copy Link**: One-click copy profile URLs to clipboard with visual feedback
- **QR Code Generator**: Generate and download scannable QR codes for any profile
- **Social Media Sharing**: Share profiles directly to WhatsApp, Facebook, X (Twitter), and LinkedIn
- **Web Share API**: Native mobile sharing on iOS/Android devices
- **Public Access**: All shared links work without authentication
- **Beautiful Modal**: Premium UI with animations and responsive design

### 🔐 Authentication & User Management
- Email/Password authentication
- Google OAuth integration  
- Automatic profile creation on signup
- Role-based access control (User/Admin)
- Default 'personal' account type for new signups

### 👤 User Profiles
- Customizable profile with photo upload (Cloudinary integration)
- Business name and personal branding
- Profile image with ring effects and luxury gradients
- Shareable profile URLs
- Account type indicator (Personal/Business)

### 🔗 Social Media Integration
Beautifully branded icons for:
- Instagram (with gradient)
- Facebook (official blue)
- LinkedIn (professional blue)
- YouTube (red)
- Twitter/X (black)
- Google Reviews (4-color logo)
- Play Store (gradient)
- TikTok
- WhatsApp
- Custom links

### 📊 Task Management System
**Small Tasks (Quick Actions)**
- Compact grid layout
- Perfect for quick social follows
- Instant completion feedback
- Animated check marks

**Large Tasks (Featured Links)**
- Prominent display for important platforms
- Full URL visibility
- Enhanced hover effects
- Click tracking

### 🎮 Gamification & Progress Tracking
- Real-time progress bar
- Completion percentage display
- Trophy and target icons
- Confetti animation on task completion
- Success toast notifications with emojis
- Visual completion indicators

### 👑 Admin Dashboard
**Analytics & Metrics**
- Total users count
- Total completions tracking  
- Total links across platform
- Overall completion rate percentage
- Individual user progress bars
- Per-user completion statistics

**User Management**
- Search and filter users
- View all user profiles
- Track which links are completed
- Visual completion status (green for completed)
- Animated cards with hover effects

### 🎨 Premium UI/UX Design
**Visual Design**
- Dark luxury theme with gold/purple gradients
- Glass morphism effects (backdrop blur)
- Neon glow shadows on hover
- Animated particles background
- Smooth transitions and micro-interactions

**Animations**
- Framer Motion for all animations
- Page transition effects
- Staggered card reveals
- Floating elements
- Scale and rotation on hover
- Progress bar animations
- Confetti celebrations

**Responsive Design**
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-optimized interactions
- Sticky navigation

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Cloudinary account (for images)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd elite-link-grow

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:8080`

### Environment Setup

Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Cloudinary is configured with:
- Cloud Name: `dlvjvskje`
- Upload Preset: `GetReview`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── SocialIcons.tsx  # Custom social media icons
│   ├── Confetti.tsx     # Celebration animation
│   └── ProfileSetup.tsx # Profile management
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Signup
│   ├── Dashboard.tsx    # User dashboard
│   ├── Profile.tsx      # Public profile view
│   └── Admin.tsx        # Admin panel
├── integrations/
│   └── supabase/        # Database client
└── lib/
    └── utils.ts         # Utility functions
```

---

## 🗄️ Database Schema

### Tables
1. **profiles** - User profile information
2. **user_roles** - Role-based access (admin/user)
3. **social_links** - Social media links
4. **task_completions** - Track completed tasks

### Row Level Security
- Users can view all profiles
- Users can only edit their own data
- Admins have elevated permissions

---

## 🎯 User Flow

1. **Landing Page** → Beautiful hero with animated particles
2. **Sign Up/Login** → Email or Google authentication
3. **Dashboard** → Set up profile and add social links
4. **Profile Page** → Share link with customers/followers
5. **Task Completion** → Users click links, see progress
6. **Admin View** → Track all user activity and analytics

---

## 🎨 Design System

### Colors
- Primary: Gold (`#FFD700`)
- Secondary: Purple (`#9370DB`)
- Background: Deep Black (`#0A0A0A`)
- Success: Green (`#10B981`)

### Gradients
- Luxury: Gold → Purple
- Gold: Yellow → Orange
- Purple: Purple → Deep Purple

### Shadows
- Glow: Gold neon effect
- Glow Purple: Purple neon effect
- Elegant: Soft deep shadow

---

## 🔧 Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Supabase** - Backend & Auth
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Cloudinary** - Image hosting
- **shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

---

## 📱 Features in Detail

### Profile Setup
Users can:
- Upload profile picture via Cloudinary
- Set full name and business name
- Add unlimited social media links
- Mark links as "Small Task" or "Large Task"
- Reorder links (drag-and-drop ready)
- Delete links anytime

### Task Completion
When a visitor clicks a link:
- Link opens in new tab
- Green checkmark appears
- Confetti animation plays
- Toast notification shows
- Progress bar updates
- Admin dashboard reflects change

### Admin Capabilities
Admins can:
- View all registered users
- See completion statistics
- Track which platforms are most popular
- Monitor overall engagement
- Search and filter users
- View individual progress rates

---

## 🚢 How to Deploy

You can deploy this project using various hosting platforms such as:

- **Vercel**: Connect your GitHub repository and deploy with zero configuration
- **Netlify**: Deploy by connecting your Git repository
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Any static hosting service**: Build the project using `npm run build` and deploy the `dist` folder

### Build Command
```bash
npm run build
```

### Environment Variables
Make sure to set your Supabase credentials in your hosting platform's environment variables.

---

## 🎓 How to Edit This Code

**Use your preferred IDE**

You can clone this repo and push changes directly.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project using various hosting platforms such as:

- **Vercel**: Connect your GitHub repository and deploy with zero configuration
- **Netlify**: Deploy by connecting your Git repository
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Any static hosting service**: Build the project using `npm run build` and deploy the `dist` folder

## Credits

This project is proudly developed by **Mr. Anand Pinisetty** from **Dream Team**.
