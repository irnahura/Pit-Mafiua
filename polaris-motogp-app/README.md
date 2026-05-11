# Polaris MotoGP App

This is the main application directory for the Polaris MotoGP esports betting platform.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
app/
├── (protected)/       # Auth-required routes
│   ├── betting/       # Betting arena
│   ├── dashboard/     # User dashboard
│   ├── leaderboard/   # Rankings
│   ├── Nevada/        # Admin panel
│   └── victory/       # Victory podium
├── auth/              # Authentication
├── landing/           # Landing page
└── Nevada-auth/       # Admin login

components/            # Reusable components
hooks/                 # Custom React hooks
lib/                   # Utilities & Firebase
public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Next.js 16.2.6** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v3** - Styling
- **Firebase** - Auth & Database
- **Lucide React** - Icons

## Routes

- `/` - Redirects to landing
- `/landing` - Public landing page
- `/auth` - Sign in/up
- `/dashboard` - User dashboard (protected)
- `/betting` - Betting arena (protected)
- `/leaderboard` - Rankings (protected)
- `/victory` - Victory podium (protected)
- `/Nevada-auth` - Admin login
- `/Nevada` - Admin panel (admin only)

## Admin Access

- **Email:** `Wulo@gmail.com`
- **Password:** `Luadrahotum`
- **Route:** `/Nevada`

## Documentation

See [../PROJECT_DOCUMENTATION.md](../PROJECT_DOCUMENTATION.md) for complete documentation.

## Support

For issues, check:
- Browser console for errors
- Firebase console for auth/database issues
- `.env` file for correct configuration

---

**Version:** 1.0  
**Status:** Production Ready ✅
