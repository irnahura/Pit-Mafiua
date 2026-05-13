# 🔍 Check Your Authentication Status

The error "Missing or insufficient permissions" when creating a betting market means:

**You are NOT signed in as the admin email: `Wulo@gmail.com`**

---

## ✅ Quick Fix (2 minutes)

### Step 1: Check Who You're Signed In As

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Type this and press Enter:
   ```javascript
   firebase.auth().currentUser?.email
   ```
4. Check the email shown

### Step 2: Sign Out

1. Click your profile icon (top right)
2. Click "Sign Out"

### Step 3: Sign In as Admin

1. Go to: http://localhost:3000/auth
2. Sign in with:
   - **Email:** `Wulo@gmail.com`
   - **Password:** `Luadrahotum`

### Step 4: Go Back to Admin Panel

1. Go to: http://localhost:3000/Nevada
2. Try creating a betting market again
3. Should work now! ✅

---

## 🔍 Why This Happens

### Firebase Rules Check:
```javascript
function isAdmin() {
  return request.auth != null && 
         request.auth.token.email == 'Wulo@gmail.com';
}
```

### What This Means:
- ✅ You must be signed in
- ✅ Your email must be EXACTLY `Wulo@gmail.com`
- ❌ Any other email = Permission denied

---

## 🧪 Verify You're Admin

### Method 1: Browser Console
```javascript
// Open DevTools (F12) → Console
// Paste this:
console.log('Current user:', firebase.auth().currentUser?.email);
console.log('Is admin:', firebase.auth().currentUser?.email === 'Wulo@gmail.com');
```

### Method 2: Check UI
Look at the top right corner of your app:
- Should show: `ADMIN_01` or similar
- Should have admin badge/indicator

---

## 🚨 Common Issues

### Issue 1: Signed in with wrong email
**Solution:** Sign out and sign in with `Wulo@gmail.com`

### Issue 2: Not signed in at all
**Solution:** Go to `/auth` and sign in

### Issue 3: Email case mismatch
**Solution:** Email must be EXACTLY `Wulo@gmail.com` (capital W)

### Issue 4: Account doesn't exist
**Solution:** Create account with email `Wulo@gmail.com` first

---

## 📋 Step-by-Step Verification

1. **Check current email:**
   - Open DevTools (F12)
   - Console tab
   - Type: `firebase.auth().currentUser?.email`
   - Press Enter

2. **If email is NOT `Wulo@gmail.com`:**
   - Sign out
   - Sign in with correct email

3. **If email IS `Wulo@gmail.com`:**
   - Clear browser cache (Ctrl + Shift + Delete)
   - Refresh page (Ctrl + F5)
   - Try again

4. **If still not working:**
   - Check Firebase Console
   - Verify rules are deployed
   - Check authentication users list

---

## 🔗 Quick Links

- **Sign In:** http://localhost:3000/auth
- **Admin Panel:** http://localhost:3000/Nevada
- **Firebase Auth Users:** https://console.firebase.google.com/project/polarisgp-fd2c3/authentication/users
- **Firebase Rules:** https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules

---

## ✅ Expected Behavior

### When Signed In as Admin (`Wulo@gmail.com`):
- ✅ Can create betting markets
- ✅ Can close/open betting
- ✅ Can view all users
- ✅ Can manage system
- ✅ No permission errors

### When Signed In as Regular User:
- ❌ Cannot create betting markets
- ❌ Cannot access admin panel
- ❌ Gets "permission denied" errors
- ✅ Can place bets
- ✅ Can view leaderboard

---

## 🎯 Solution Summary

**The fix is simple:**

1. Sign out
2. Sign in with: `Wulo@gmail.com` / `Luadrahotum`
3. Go to admin panel
4. Try creating betting market
5. Should work! ✅

---

**Current Issue:** You're signed in with a different email  
**Solution:** Sign in as `Wulo@gmail.com`  
**Time Required:** 1 minute
