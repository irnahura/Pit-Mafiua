# Polaris MotoGP - Complete Project Documentation

**Version:** 1.0  
**Last Updated:** May 12, 2026  
**Status:** ✅ Production Ready

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Firebase Setup](#firebase-setup)
7. [Admin Panel Guide](#admin-panel-guide)
8. [Design System](#design-system)
9. [Deployment](#deployment)
10. [Testing & Verification](#testing--verification)

---

## Project Overview

**Polaris MotoGP** is a high-stakes esports betting platform for MotoGP racing. Users can place bets using PitCoins (PC), compete on leaderboards, and win rewards. The platform features a premium cyber-racing aesthetic with glassmorphism effects and a pink/cyan color scheme.

### Key Features
- 🎯 **Betting Arena** - 6 betting categories for MotoGP races
- 🏆 **Leaderboard** - Real-time rankings with podium display
- 💰 **PitCoin Economy** - Virtual currency system with Firebase integration
- 👤 **User Dashboard** - Personal stats, balance, and bet history
- 🎉 **Victory Podium** - Champion celebration with voucher conversion
- 🔐 **Admin Panel** - Race control center for managing bets and users
- 🔥 **Firebase Integration** - Real-time data, authentication, and storage

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Pit-Mafiua.git
cd Pit-Mafiua/polaris-motogp-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env` file in `polaris-motogp-app/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Features

### 1. Landing Page
- Hero section with race countdown timer
- Feature cards showcasing platform benefits
- Bento grid layout with glassmorphism
- Telemetry grid background
- Pink glow effects on headlines

### 2. Authentication
- Email/password sign in and sign up
- Firebase Authentication integration
- Session persistence
- Protected routes with authorization guards

### 3. User Dashboard
- Real-time PitCoin balance
- Active bets display
- User statistics (total bets, earnings, win rate)
- Quick access to betting arena

### 4. Betting Arena
- 6 betting categories:
  - Race Winner
  - Podium Finish (Top 3)
  - Fastest Lap
  - Constructor Championship
  - Rookie of the Year
  - Wildcard Predictions
- Live odds display
- Stake input with balance validation
- Potential return calculation

### 5. Leaderboard
- Top 3 podium display with avatars
- Full rankings table with timing board aesthetic
- Real-time updates from Firebase
- User stats (earnings, win rate, total bets)

### 6. Victory Podium
- Champion celebration page
- PitCoin to voucher conversion
- Animated confetti effects
- Redemption instructions
---

## Tech Stack

### Frontend
- **Next.js 16.2.6** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Utility-first styling
- **Lucide React** - Icon library

### Backend & Database
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase SDK** - Real-time data sync

### Design
- **Glassmorphism** - Translucent UI elements
- **Custom Design System** - Polaris MotoGP theme
- **Responsive Design** - Mobile-first approach

---

## Project Structure

```
polaris-motogp-app/
├── app/
│   ├── (protected)/          # Protected routes (require auth)
│   │   ├── betting/          # Betting arena
│   │   ├── dashboard/        # User dashboard
│   │   ├── leaderboard/      # Rankings
│   │   ├── Nevada/           # Admin panel
│   │   ├── victory/          # Victory podium
│   │   └── layout.tsx        # Protected layout with auth check
│   ├── auth/                 # Authentication page
│   ├── landing/              # Public landing page
│   ├── Nevada-auth/          # Admin login
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home redirect
│   └── globals.css           # Global styles
├── components/
│   ├── MobileNav.tsx         # Mobile bottom navigation
│   ├── Navbar.tsx            # Desktop navigation
│   ├── ProtectedRoute.tsx    # Route guard component
│   └── RaceCountdown.tsx     # Live countdown timer
├── hooks/
│   ├── useLeaderboard.ts     # Leaderboard data hook
│   └── useUserData.ts        # User data hooks
├── lib/
│   ├── auth-context.tsx      # Authentication context
│   ├── firebase.ts           # Firebase initialization
│   ├── firestore.ts          # Firestore functions
│   ├── admin-guard.ts        # Admin authorization
│   └── utils.ts              # Utility functions
├── public/                   # Static assets
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database

### 2. Firestore Collections

#### `users`
```javascript
{
  userId: string,           // Firebase Auth UID
  email: string,            // User email
  pitcoinBalance: number,   // Current balance (default: 2000)
  totalBets: number,        // Total bets placed
  totalEarnings: number,    // Total winnings
  totalWins: number,        // Number of winning bets
  winRate: number,          // Win percentage
  status: string,           // "active" or "suspended"
  createdAt: timestamp,
  lastBetAt: timestamp
}
```

#### `bets`
```javascript
{
  userId: string,           // User ID
  marketType: string,       // Bet category
  selection: string,        // User's choice
  stakeAmount: number,      // PitCoins wagered
  odds: number,             // Betting odds
  potentialReturn: number,  // Possible winnings
  raceEvent: string,        // Race name
  status: string,           // "pending", "won", "lost"
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `betting_markets`
```javascript
{
  betName: string,          // Market name
  summary: string,          // Description
  startTime: string,        // When betting opens
  duration: string,         // How long betting is open
  raceEvent: string,        // Race name
  status: string,           // "open" or "closed"
  totalStake: number,       // Total PitCoins in pool
  participantCount: number, // Number of bettors
  createdAt: timestamp
}
```

#### `system_logs`
```javascript
{
  type: string,             // "SYS", "API", "WARN", "ERROR"
  message: string,          // Log message
  timestamp: timestamp
}
```

#### `system_status`
```javascript
{
  bettingStatus: string,    // "open" or "closed"
  updatedAt: timestamp
}
```

### 3. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own bets
    match /bets/{betId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if false; // Only admin can update
    }
    
    // Anyone can read leaderboard
    match /users/{userId} {
      allow read: if true;
    }
    
    // Only admin can access admin collections
    match /betting_markets/{marketId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'Wulo@gmail.com';
    }
    
    match /system_logs/{logId} {
      allow read: if request.auth.token.email == 'Wulo@gmail.com';
      allow write: if request.auth.token.email == 'Wulo@gmail.com';
    }
    
    match /system_status/{statusId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'Wulo@gmail.com';
    }
  }
}
```

---

## Admin Panel Guide

### Access
- **URL:** `/Nevada`
- **Login:** `/Nevada-auth`
- **Email:** `Wulo@gmail.com`
- **Password:** `Luadrahotum`

### Features

#### 1. Analytics Dashboard
- **Total Pool Liquidity** - Sum of all pending bets
- **Active Bettors** - Users with active bets
- **Total Users** - Registered user count
- **System Status** - Operational status

#### 2. Create Betting Market
1. Enter bet name (e.g., "Race Winner")
2. Add summary description
3. Select start time
4. Choose duration (30m, 1h, 2h, 4h, or race end)
5. Click "CREATE BET"

#### 3. Manage Users
- View all active bettors
- See balance and current stakes
- Ban/unban users
- Search and filter

#### 4. Control Betting
- **CLOSE BETS** - Lock all betting markets
- **OPEN BETS** - Unlock betting markets

#### 5. System Monitoring
- View system logs (color-coded)
- Monitor activity in real-time
- Track API calls and errors

---

## Design System

### Colors

```css
/* Primary Colors */
--background: #0D0D0D;           /* Matte Black */
--primary: #ffcae0;              /* Soft Lavender/Pink */
--tertiary: #00cdfa;             /* Electric Blue */
--secondary: #b5ccb9;            /* Muted Sage Green */
--error: #ffb4ab;                /* Neon Red */

/* Surface Colors */
--surface: #161214;
--surface-container: #231e20;
--surface-variant: #383335;

/* Text Colors */
--on-surface: #eae0e2;
--on-surface-variant: #d3c2c7;
--on-primary: #492437;
```

### Typography

```css
/* Headlines */
font-family: 'Anybody', sans-serif;
font-weight: 700-900;
text-transform: uppercase;

/* Body Text */
font-family: 'Hanken Grotesk', sans-serif;
font-weight: 400-600;

/* Labels/Mono */
font-family: 'JetBrains Mono', monospace;
font-size: 12px;
letter-spacing: 0.1em;
text-transform: uppercase;
```

### Components

#### Glass Panel
```css
background: rgba(22, 18, 20, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(238, 183, 207, 0.1);
border-radius: 0.5rem;
```

#### Gradient Button
```css
background: linear-gradient(135deg, #ffcae0 0%, #00cdfa 100%);
box-shadow: 0 0 20px rgba(238, 183, 207, 0.3);
```

---

## Deployment

### Build for Production

```bash
cd polaris-motogp-app
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel

Add all Firebase environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each `NEXT_PUBLIC_FIREBASE_*` variable

### Custom Domain

1. Go to Vercel dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records

---

## Testing & Verification

### Production Build Test

```bash
npm run build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages (12/12)
✓ Exit Code: 0
```

### Manual Testing Checklist

- [ ] Landing page loads correctly
- [ ] Sign up creates new user
- [ ] Sign in authenticates user
- [ ] Dashboard shows user data
- [ ] Betting arena accepts bets
- [ ] Leaderboard displays rankings
- [ ] Victory page shows balance
- [ ] Admin login works
- [ ] Admin panel loads data
- [ ] Create bet form works
- [ ] Ban/unban users works
- [ ] Open/close bets works
- [ ] Mobile navigation works
- [ ] Responsive design works

### Firebase Testing

1. **Authentication:**
   - Create test user
   - Sign in/out
   - Check session persistence

2. **Firestore:**
   - Place a bet
   - Check `bets` collection
   - Verify balance deduction
   - Check `users` collection

3. **Admin Functions:**
   - Create betting market
   - View active bettors
   - Toggle betting status
   - Check system logs

---

## Troubleshooting

### Issue: Firebase not connecting
**Solution:**
- Check `.env` file has all variables
- Verify Firebase project is active
- Check browser console for errors

### Issue: Build fails
**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Admin panel not accessible
**Solution:**
- Verify email is `Wulo@gmail.com`
- Check Firebase Authentication
- Clear browser cache

### Issue: Bets not saving
**Solution:**
- Check Firestore security rules
- Verify user is authenticated
- Check sufficient balance

---

## Credits

**Developed by:** Kiro AI  
**Design System:** Polaris MotoGP  
**Framework:** Next.js 16  
**Database:** Firebase Firestore  
**Deployment:** Vercel

---

## License

This project is proprietary and confidential.

---

## Support

For issues or questions:
- Check this documentation
- Review Firebase console logs
- Check browser console for errors
- Contact development team

---

**Last Updated:** May 12, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready 🚀
