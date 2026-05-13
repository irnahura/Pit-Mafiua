# Polaris MotoGP - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- Firebase CLI installed (`npm install -g firebase-tools`)
- Vercel account (for deployment)
- GitHub account (for CI/CD)

---

## 📦 Local Development

### 1. Install Dependencies
```bash
cd polaris-motogp-app
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=polarisgp-fd2c3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔥 Firebase Setup

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase (if not already done)
```bash
firebase init
```

Select:
- Firestore
- Hosting (optional)

### 3. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 4. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 5. Verify Deployment
```bash
firebase firestore:indexes
```

---

## ☁️ Vercel Deployment

### Option 1: Vercel CLI

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy to Production
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

### Environment Variables (Vercel)
Add these in Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## 🤖 CI/CD Setup (GitHub Actions)

### 1. Add GitHub Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### Firebase Secrets:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_TOKEN` (get with `firebase login:ci`)

#### Vercel Secrets:
- `VERCEL_TOKEN` (from Vercel Dashboard → Settings → Tokens)
- `VERCEL_ORG_ID` (from `.vercel/project.json`)
- `VERCEL_PROJECT_ID` (from `.vercel/project.json`)

#### App Secrets:
- `APP_URL` (your production URL, e.g., `https://polaris-motogp.vercel.app`)

### 2. Get Firebase Token
```bash
firebase login:ci
```

Copy the token and add it as `FIREBASE_TOKEN` secret.

### 3. Get Vercel IDs
```bash
vercel link
```

Check `.vercel/project.json` for `orgId` and `projectId`.

### 4. Push to Main Branch
```bash
git add .
git commit -m "Deploy v2.3"
git push origin main
```

The CI/CD pipeline will automatically:
1. Build the application
2. Deploy to Vercel
3. Deploy Firestore rules and indexes
4. Run health checks

---

## 🔍 Monitoring & Logging

### View Logs

#### Vercel Logs:
```bash
vercel logs
```

Or visit: Vercel Dashboard → Your Project → Logs

#### Firebase Logs:
```bash
firebase functions:log
```

Or visit: Firebase Console → Functions → Logs

### Performance Monitoring

The app includes built-in performance monitoring:
- Component render tracking
- Operation timing
- User action tracking
- Error logging

To integrate with external services (Sentry, LogRocket):
1. Update `lib/logger.ts`
2. Add service SDK
3. Configure in `lib/config.ts`

---

## 🧪 Testing

### Build Test
```bash
npm run build
```

### Lint Check
```bash
npm run lint
```

### Local Production Build
```bash
npm run build
npm run start
```

---

## 📊 Performance Checklist

Before deploying to production:

- [x] Retry logic enabled on all Firestore operations
- [x] Error boundaries integrated
- [x] Logging system configured
- [x] Memoization applied to heavy components
- [x] Build optimizations enabled (next.config.js)
- [x] Environment variables configured
- [x] Firestore indexes deployed
- [x] Firestore rules deployed
- [x] CI/CD pipeline configured
- [ ] Monitoring service integrated (optional)
- [ ] Load testing completed (optional)

---

## 🔐 Security Checklist

- [x] Firestore rules restrict access
- [x] Admin route protected (`/Nevada`)
- [x] User authentication required for betting
- [x] Betting limits enforced (50-500 PC)
- [x] Max odds capped at 5x
- [x] Market exposure limits enforced
- [x] Environment variables secured
- [ ] Rate limiting configured (optional)
- [ ] DDoS protection enabled (optional)

---

## 🎯 Post-Deployment

### 1. Verify Deployment
```bash
curl https://your-app-url.vercel.app
```

### 2. Test Critical Flows
- [ ] User sign up
- [ ] User sign in
- [ ] Place bet
- [ ] View leaderboard
- [ ] Admin panel access
- [ ] Market creation
- [ ] Result finalization

### 3. Monitor Performance
- Check Vercel Analytics
- Monitor Firebase usage
- Review error logs
- Track user actions

### 4. Set Up Alerts
- Configure Vercel alerts for downtime
- Set up Firebase budget alerts
- Monitor error rates

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Firestore Rules Not Applied
```bash
# Redeploy rules
firebase deploy --only firestore:rules --force
```

### Environment Variables Not Working
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure variables start with `NEXT_PUBLIC_`
3. Redeploy after adding variables

### CI/CD Pipeline Fails
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Ensure Firebase token is valid
4. Check Vercel token permissions

---

## 📈 Scaling Considerations

### For 10k+ Concurrent Users:

1. **Firestore**:
   - Enable automatic scaling (default)
   - Monitor read/write quotas
   - Consider Firestore caching

2. **Vercel**:
   - Upgrade to Pro plan if needed
   - Enable Edge Functions
   - Configure CDN caching

3. **Performance**:
   - Enable lazy loading (future)
   - Implement Redis caching (future)
   - Add rate limiting (future)

---

## 🆘 Support

### Common Issues:

**Issue**: "Firestore not initialized"
**Solution**: Check Firebase configuration in `.env`

**Issue**: "Insufficient permissions"
**Solution**: Redeploy Firestore rules

**Issue**: "Build timeout"
**Solution**: Increase Vercel build timeout or optimize build

**Issue**: "Environment variables undefined"
**Solution**: Ensure variables are prefixed with `NEXT_PUBLIC_`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎉 Success!

Your Polaris MotoGP app is now deployed and ready for production!

**Admin Access**:
- URL: `https://your-app-url.vercel.app/Nevada`
- Email: `wulo@gmail.com`
- Password: `Luadrahotum`

**Features**:
- ✅ User authentication
- ✅ Betting system with 5 bet types
- ✅ Parlay/multi-bets
- ✅ Leaderboard with tie-breakers
- ✅ Admin panel
- ✅ World standings
- ✅ Performance optimizations
- ✅ Error handling
- ✅ Logging & monitoring
- ✅ CI/CD pipeline

**Version**: 2.3 - Production Ready 🚀
