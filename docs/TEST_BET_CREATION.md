# 🧪 Test Bet Creation - Step by Step

**Let's verify that bet creation is working correctly.**

---

## ✅ Pre-Test Checklist

Before testing, verify:

- [ ] Firebase rules deployed (case-insensitive admin check)
- [ ] Signed in as `wulo@gmail.com`
- [ ] App running on http://localhost:3000
- [ ] Browser cache cleared (Ctrl + Shift + Delete)

---

## 🎯 Test 1: Admin - Create Betting Market

### Steps:

1. **Go to Admin Panel:**
   ```
   http://localhost:3000/Nevada
   ```

2. **Fill in the form:**
   - Bet Name: `Race Winner`
   - Summary: `Predict the race winner`
   - Start Time: (any future time)
   - Duration: `1 Hour`
   - Icon: `Trophy`
   - Color: `Primary`
   - Odds: `2.5`

3. **Click "CREATE BET"**

### Expected Result:
- ✅ Alert: "Betting market created successfully!"
- ✅ No permission errors
- ✅ Market appears in "Active Bettors" section

### If Error:
- ❌ "Missing or insufficient permissions"
  - **Cause:** Rules not deployed
  - **Fix:** Deploy rules to Firebase Console
  
- ❌ "You must be signed in as admin"
  - **Cause:** Not signed in as wulo@gmail.com
  - **Fix:** Sign out and sign in with wulo@gmail.com

---

## 🎯 Test 2: User - Place Bet

### Steps:

1. **Go to Betting Page:**
   ```
   http://localhost:3000/betting
   ```

2. **Check if markets appear:**
   - Should see the "Race Winner" market you just created
   - Should show time remaining
   - Should show odds

3. **Place a bet:**
   - Enter prediction: `Marc Marquez`
   - Enter amount: `100` (between 50-500)
   - Click "PLACE BET"

### Expected Result:
- ✅ Alert: "Bet placed successfully! Potential return: 250 PC"
- ✅ Balance decreases by 100 PC
- ✅ Bet appears in dashboard
- ✅ No permission errors

### If Error:
- ❌ "Missing or insufficient permissions"
  - **Cause:** Rules not deployed or user not authenticated
  - **Fix:** 
    1. Deploy rules to Firebase Console
    2. Ensure you're signed in
    3. Clear browser cache and refresh

- ❌ "Minimum bet is 50 PC"
  - **Cause:** Amount less than 50
  - **Fix:** Enter amount between 50-500

- ❌ "Maximum bet is 500 PC"
  - **Cause:** Amount more than 500
  - **Fix:** Enter amount between 50-500

- ❌ "Insufficient balance"
  - **Cause:** Not enough PitCoins
  - **Fix:** Check your balance (should start with 2000 PC)

---

## 🎯 Test 3: Verify in Firebase Console

### Steps:

1. **Open Firebase Console:**
   ```
   https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/data
   ```

2. **Check Collections:**

   **betting_markets:**
   - Should see your "Race Winner" market
   - Check fields: betName, summary, startTime, status, etc.

   **bets:**
   - Should see your bet
   - Check fields: userId, marketType, selection, stakeAmount, status
   - Status should be "pending"

   **users:**
   - Should see your user document
   - Check pitcoinBalance (should be 1900 if you bet 100)
   - Check totalBets (should be 1)

### Expected Result:
- ✅ All data appears in Firebase
- ✅ Data is correctly structured
- ✅ Balance is updated

---

## 🎯 Test 4: Browser Console Check

### Steps:

1. **Open DevTools (F12)**
2. **Go to Console tab**
3. **Look for messages:**

### Expected Messages:
```
✅ Firebase initialized successfully
✓ Betting market created: [market-id]
✓ Bet logged: [bet-id]
✓ PitCoin deducted. New balance: 1900
```

### Error Messages to Watch For:
```
❌ FirebaseError: Missing or insufficient permissions
   → Rules not deployed

❌ Error logging bet: Insufficient PitCoin balance
   → Not enough balance

❌ Minimum bet amount is 50 PitCoins
   → Amount validation working (good!)

❌ Maximum bet amount is 500 PitCoins
   → Amount validation working (good!)
```

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Admin: Create Market | ⏳ Pending | Test this first |
| User: Place Bet | ⏳ Pending | Test after creating market |
| Firebase Data | ⏳ Pending | Verify in console |
| Browser Console | ⏳ Pending | Check for errors |

---

## 🐛 Common Issues & Solutions

### Issue 1: "Missing or insufficient permissions"

**Diagnosis:**
1. Check if rules are deployed:
   - Go to: https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules
   - Should see your updated rules with `.lower()`

2. Check if you're signed in:
   - Open DevTools → Console
   - Type: `firebase.auth().currentUser?.email`
   - Should show: `wulo@gmail.com`

**Solution:**
- Deploy rules if not deployed
- Sign in if not signed in
- Clear cache and refresh

### Issue 2: No betting markets appear

**Diagnosis:**
- Check if markets were created successfully
- Check Firebase Console → betting_markets collection

**Solution:**
- Create a market in admin panel first
- Refresh betting page
- Check browser console for errors

### Issue 3: Balance not updating

**Diagnosis:**
- Check if bet was actually created
- Check Firebase Console → bets collection
- Check users collection → pitcoinBalance field

**Solution:**
- Refresh page
- Check browser console for errors
- Verify bet creation succeeded

---

## ✅ Success Criteria

All tests pass if:

1. ✅ Admin can create betting markets without errors
2. ✅ Users can place bets without errors
3. ✅ Data appears correctly in Firebase Console
4. ✅ Balance updates correctly
5. ✅ No permission errors in browser console
6. ✅ Betting limits (50-500 PC) are enforced
7. ✅ All validations work correctly

---

## 🎯 Quick Test Commands

### Check Current User:
```javascript
// In browser console (F12)
firebase.auth().currentUser?.email
```

### Check Balance:
```javascript
// In browser console
// (After page loads)
console.log('Balance:', document.querySelector('[data-balance]')?.textContent);
```

### Force Refresh:
```
Ctrl + Shift + Delete (Clear cache)
Ctrl + F5 (Hard refresh)
```

---

## 📝 Test Report Template

After testing, fill this out:

```
Date: [Date]
Tester: [Your name]

Test 1 - Create Market: [ ] Pass [ ] Fail
  Error (if any): _______________

Test 2 - Place Bet: [ ] Pass [ ] Fail
  Error (if any): _______________

Test 3 - Firebase Data: [ ] Pass [ ] Fail
  Issues (if any): _______________

Test 4 - Console Check: [ ] Pass [ ] Fail
  Errors (if any): _______________

Overall Status: [ ] All Pass [ ] Some Fail

Notes:
_______________
```

---

## 🚀 Next Steps After Testing

If all tests pass:
- ✅ Bet creation is working
- ✅ Firebase rules are correct
- ✅ App is fully functional
- ✅ Ready for production

If tests fail:
- 🔍 Check error messages
- 📝 Follow troubleshooting guide
- 🔧 Fix issues
- 🔄 Re-test

---

**Start testing now and let me know the results!** 🧪
