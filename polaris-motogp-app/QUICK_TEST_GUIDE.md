# 🚀 Quick Test Guide - Payout Algorithm

## ⚡ 5-Minute Test

### Step 1: Create Test Market (1 min)
1. Go to https://polarispitcoin.in/Nevada-auth
2. Sign in: `wulo@gmail.com` / `Luadrahotum`
3. Navigate to `/Nevada`
4. Create market:
   - Name: "Quick Test"
   - Odds: 3.0x
   - Start Time: Now + 1 minute
   - Click "CREATE BET"

### Step 2: Place Test Bets (2 min)
1. **User 1:**
   - Sign out, create new account or use existing
   - Go to `/betting`
   - Bet 100 PC on "APEX 5"
   - Note the time

2. **User 2:**
   - Sign out, create another account
   - Go to `/betting`
   - Bet 200 PC on "APEX 5" (same team, later time)

3. **User 3:**
   - Sign out, create another account
   - Go to `/betting`
   - Bet 150 PC on "ORION" (different team)

### Step 3: Close & Finalize (2 min)
1. Sign in as admin
2. Go to `/Nevada`
3. Click "Close" on the test market
4. Click "Select" on the closed market
5. Click "APEX 5" quick-select button
6. Click "FINALIZE & PAY WINNER"
7. Confirm

### Step 4: Verify Results (30 sec)
**Expected:**
- ✅ User 1: +200 PC profit (100 stake + 300 payout - 100 stake = +200)
- ❌ User 2: -200 PC (lost, even with correct pick)
- ❌ User 3: -150 PC (lost, wrong pick)
- Alert shows: "1 winner(s) paid out"

---

## 🎯 What to Check

### ✅ Before Finalization:
- [ ] Market shows as "closed" in admin panel
- [ ] All 3 bets visible in "Active Bettors" table
- [ ] Total Pool Liquidity = 450 PC (100+200+150)

### ✅ During Finalization:
- [ ] Quick-select buttons work (click "APEX 5")
- [ ] Confirmation dialog shows correct info
- [ ] Warning about FIRST-BET-WINS displayed

### ✅ After Finalization:
- [ ] Success message shows winner ID
- [ ] Market status = "finalized"
- [ ] User 1 balance increased by 200 PC
- [ ] User 2 balance decreased by 200 PC
- [ ] User 3 balance decreased by 150 PC

---

## 🔍 Quick Verification Commands

### Check User Balance (Firebase Console):
```
Collection: users
Filter: userId == [user_id]
Check: pitcoinBalance, totalWins, totalEarnings
```

### Check Bet Status (Firebase Console):
```
Collection: bets
Filter: marketId == [market_id]
Check: status (should be 'won' or 'lost')
```

### Check Market Status (Firebase Console):
```
Collection: betting_markets
Filter: id == [market_id]
Check: status (should be 'finalized')
```

---

## 🚨 Common Issues

### Issue: Can't create market
**Fix:** Ensure signed in as `wulo@gmail.com`

### Issue: Can't place bet
**Fix:** 
- Check market is "open"
- Ensure sufficient balance (2000 PC default)
- Verify bet amount is 50-500 PC

### Issue: Finalize button disabled
**Fix:** Market must be "closed" first

### Issue: No winners found
**Fix:** 
- Check team name spelling
- Use quick-select buttons
- Verify users actually bet on that team

---

## 📊 Expected Payout Math

**Formula:** `Payout = Stake × Odds`

**Example (3x odds):**
- Stake: 100 PC
- Odds: 3.0x
- Payout: 100 × 3 = 300 PC
- Net Profit: 300 - 100 = +200 PC

**Maximum Payout:**
- Max Stake: 500 PC
- Max Odds: 5.0x
- Max Payout: 500 × 5 = 2,500 PC
- Max Profit: 2,500 - 500 = +2,000 PC

---

## ✅ Success Criteria

The test is successful if:
1. ✅ Only User 1 (earliest bet) wins
2. ✅ User 1 receives exactly 300 PC payout
3. ✅ Users 2 & 3 lose their stakes
4. ✅ Market status changes to "finalized"
5. ✅ No errors in console
6. ✅ All database records updated correctly

---

## 🎓 Team Names for Testing

Quick-select these in admin panel:
- APEX 5
- FORCE-BLR
- MAREVICKS
- ORION
- SKIBDI RACER
- THEONEPEICEISREAL

---

**Test Duration:** ~5 minutes
**Difficulty:** Easy
**Prerequisites:** Admin access + 3 test accounts
**Status:** ✅ Ready to Test

---

**Production URL:** https://polarispitcoin.in
**Admin Panel:** https://polarispitcoin.in/Nevada
**Admin Login:** https://polarispitcoin.in/Nevada-auth
