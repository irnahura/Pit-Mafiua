# Payout Algorithm Test Plan

## Algorithm Overview
The `finalizeMarketResults` function implements a **FIRST-BET-WINS** algorithm:
1. Admin selects a closed market
2. Admin enters the winning team name
3. System finds all bets with matching selection
4. System sorts by submission time (earliest first)
5. **ONLY THE FIRST BET WINS** - gets full payout
6. All other bets are marked as lost
7. Winner's account is credited with `potentialReturn` amount

## Test Scenarios

### Scenario 1: Single Winner
**Setup:**
- Market: "Race Winner" (3x odds)
- User A bets 100 PC on "APEX 5" at 10:00 AM
- User B bets 200 PC on "ORION" at 10:05 AM
- User C bets 150 PC on "APEX 5" at 10:10 AM

**Admin Action:**
- Close market
- Finalize with winning team: "APEX 5"

**Expected Result:**
- User A: +300 PC (100 × 3x) ✅ WINNER
- User B: Loses 200 PC ❌
- User C: Loses 150 PC ❌ (even though they picked correctly, they were second)

### Scenario 2: No Winners
**Setup:**
- Market: "Race Winner" (2.5x odds)
- User A bets 100 PC on "APEX 5"
- User B bets 200 PC on "ORION"

**Admin Action:**
- Finalize with winning team: "MAREVICKS"

**Expected Result:**
- User A: Loses 100 PC ❌
- User B: Loses 200 PC ❌
- System returns: `winnersCount: 0`

### Scenario 3: Case-Insensitive Matching
**Setup:**
- Market: "Race Winner" (5x odds)
- User A bets 500 PC on "apex 5" (lowercase)
- User B bets 300 PC on "APEX 5" (uppercase)

**Admin Action:**
- Finalize with winning team: "APEX 5"

**Expected Result:**
- User A: +2500 PC (500 × 5x) ✅ WINNER (first bet)
- User B: Loses 300 PC ❌ (second bet, even with correct pick)

### Scenario 4: Podium Bet (Multiple Selections)
**Setup:**
- Market: "Podium Finish" (3x odds)
- User A bets 200 PC on "APEX 5, ORION, MAREVICKS" at 10:00 AM
- User B bets 300 PC on "APEX 5, ORION, FORCE-BLR" at 10:05 AM

**Admin Action:**
- Finalize with winning selection: "APEX 5, ORION, MAREVICKS"

**Expected Result:**
- User A: +600 PC (200 × 3x) ✅ WINNER (exact match, first)
- User B: Loses 300 PC ❌ (wrong third place)

## Manual Testing Steps

### Step 1: Create Test Market
1. Sign in as admin: `wulo@gmail.com` / `Luadrahotum`
2. Go to `/Nevada`
3. Create a new market:
   - Bet Name: "Test Race Winner"
   - Summary: "Testing payout algorithm"
   - Bet Type: "Race Winner"
   - Odds: 3.0x
   - Start Time: (current time + 2 minutes)
   - Duration: 1h

### Step 2: Place Test Bets
1. Sign out and create/sign in as Test User 1
2. Go to `/betting`
3. Place bet: 100 PC on "APEX 5"
4. Note the exact time

5. Sign out and create/sign in as Test User 2
6. Place bet: 200 PC on "APEX 5" (same team, but later)
7. Note the exact time

8. Sign out and create/sign in as Test User 3
9. Place bet: 150 PC on "ORION" (different team)

### Step 3: Close Market
1. Sign in as admin
2. Go to `/Nevada`
3. Click "Close" on the test market

### Step 4: Finalize Results
1. Click "Select" on the closed market
2. Enter winning team: "APEX 5"
3. Click "FINALIZE & PAY WINNER"
4. Confirm the action

### Step 5: Verify Payouts
1. Check Test User 1's balance:
   - Should have: Original Balance - 100 + 300 = Original + 200 PC ✅

2. Check Test User 2's balance:
   - Should have: Original Balance - 200 PC ❌ (lost)

3. Check Test User 3's balance:
   - Should have: Original Balance - 150 PC ❌ (lost)

4. Check admin panel:
   - Should show "1 winner(s) paid out"
   - Market status should be "finalized"

### Step 6: Verify Database
1. Check `bets` collection:
   - Test User 1's bet: `status: 'won'`
   - Test User 2's bet: `status: 'lost'`
   - Test User 3's bet: `status: 'lost'`

2. Check `users` collection:
   - Test User 1: `totalWins: +1`, `totalEarnings: +300`
   - Test User 2: No changes to wins/earnings
   - Test User 3: No changes to wins/earnings

## Edge Cases Handled

✅ **Case-insensitive team names**: "apex 5" matches "APEX 5"
✅ **Special characters removed**: "APEX-5" matches "APEX 5"
✅ **Whitespace normalized**: "APEX  5" matches "APEX 5"
✅ **No winners**: All bets marked as lost, no payouts
✅ **Multiple correct bets**: Only first bet wins
✅ **Podium/Top5 bets**: Order matters, exact match required

## Security Checks

✅ **Admin-only access**: Only `wulo@gmail.com` can finalize
✅ **Market must be closed**: Cannot finalize open markets
✅ **Pending bets only**: Only processes bets with `status: 'pending'`
✅ **Atomic operations**: Uses Firestore transactions/batches
✅ **Audit trail**: Logs all finalization actions

## Performance Considerations

- ✅ Uses indexed queries (`marketId`, `status`)
- ✅ Batch updates for losing bets
- ✅ Retry logic with exponential backoff
- ✅ Proper error handling and logging
