# Testing Guide: Enhanced Betting System

## Prerequisites
- Admin account: `wulo@gmail.com` / `Luadrahotum`
- Test user account (any email)
- Firebase project: `polarisgp-fd2c3`

## Test Scenarios

### 1. Test User Bet Locking

**Steps**:
1. Sign in as a regular user (not admin)
2. Navigate to `/betting`
3. Find an open betting market
4. Place a bet:
   - Enter prediction (e.g., "Jorge Martin")
   - Enter amount (50-500 PC)
   - Click "Lock Prediction"
5. **Expected Result**: 
   - Bet placed successfully
   - Card shows lock icon
   - Displays your active bet details
   - Form is replaced with bet info
   - Message: "Wait for this bet to end before placing another"

**Verify**:
- [ ] Lock icon appears on the card
- [ ] Active bet details are shown (prediction, stake, potential return)
- [ ] Cannot place another bet on same market
- [ ] Can still bet on other markets

### 2. Test Duplicate Bet Prevention

**Steps**:
1. After placing a bet (from Test 1)
2. Try to place another bet on the same market
3. **Expected Result**: 
   - Form is disabled/hidden
   - Shows locked state
   - Cannot submit another bet

**Verify**:
- [ ] Betting form is not accessible
- [ ] Error message if somehow attempted
- [ ] Lock persists after page refresh

### 3. Test Admin Market Management

**Steps**:
1. Sign in as admin (`wulo@gmail.com`)
2. Navigate to `/Nevada` (admin panel)
3. Scroll to "Betting Markets Control" section
4. **Expected Result**:
   - See all betting markets
   - Markets show status (open/closed/finalized)
   - Color-coded borders (cyan=open, red=closed, green=finalized)

**Verify**:
- [ ] All markets are displayed
- [ ] Status is correct for each market
- [ ] Can see bet name, odds, summary

### 4. Test Create Betting Market

**Steps**:
1. In admin panel, find "Create Bet" form
2. Fill in:
   - Bet Name: "Fastest Lap"
   - Summary: "Who will set the fastest lap?"
   - Start Time: (future date/time)
   - Duration: 1h
   - Icon: timer
   - Color: tertiary
   - Odds: 3.0
3. Click "CREATE BET"
4. **Expected Result**:
   - Success message
   - New market appears in "Betting Markets Control"
   - Market status is "open"
   - Users can see it in `/betting`

**Verify**:
- [ ] Market created successfully
- [ ] Appears in admin panel
- [ ] Appears in user betting page
- [ ] All details are correct

### 5. Test Close Betting Market

**Steps**:
1. In admin panel, find an open market
2. Click "Close" button on the market card
3. Confirm the action
4. **Expected Result**:
   - Market status changes to "closed"
   - Border color changes to red
   - "Close" button changes to "Select" button
   - Users can no longer place bets on this market

**Verify**:
- [ ] Market status updated to "closed"
- [ ] Visual indicator changes
- [ ] Users see "Betting Closed" on this market
- [ ] Existing bets remain locked

### 6. Test Finalize Results (First-Bet-Wins)

**Setup**:
1. Create a test market
2. Have 3 users place bets with same prediction at different times:
   - User A: "Jorge Martin" at 10:00:00
   - User B: "Jorge Martin" at 10:00:05
   - User C: "Jorge Martin" at 10:00:10
3. Close the market

**Steps**:
1. In admin panel, click "Select" on the closed market
2. Enter winning selection: "Jorge Martin"
3. Read the warning: "Only the FIRST bet with this selection will win"
4. Click "FINALIZE & PAY WINNER"
5. Confirm the action
6. **Expected Result**:
   - Only User A wins (earliest bet)
   - User A receives payout (balance increases)
   - User B and C marked as lost (no payout)
   - Market status changes to "finalized"
   - Success message shows "1 winner(s) paid out"

**Verify**:
- [ ] Only first bet wins
- [ ] Winner's balance increased by potentialReturn
- [ ] Other bets marked as lost
- [ ] Market status is "finalized"
- [ ] Cannot finalize again

### 7. Test Wrong Prediction

**Setup**:
1. Create a test market
2. Have users place bets:
   - User A: "Jorge Martin"
   - User B: "Pecco Bagnaia"
   - User C: "Marc Marquez"
3. Close the market

**Steps**:
1. Finalize with winning selection: "Pecco Bagnaia"
2. **Expected Result**:
   - Only User B wins
   - User A and C marked as lost
   - Only User B receives payout

**Verify**:
- [ ] Correct winner identified
- [ ] Wrong predictions marked as lost
- [ ] Only winner receives payout

### 8. Test No Winners

**Setup**:
1. Create a test market
2. Have users place bets:
   - User A: "Jorge Martin"
   - User B: "Pecco Bagnaia"
3. Close the market

**Steps**:
1. Finalize with winning selection: "Marc Marquez" (no one bet on this)
2. **Expected Result**:
   - Message: "0 winner(s) paid out"
   - All bets marked as lost
   - No payouts
   - Market still finalized

**Verify**:
- [ ] All bets marked as lost
- [ ] No balance changes
- [ ] Market finalized correctly

### 9. Test Multiple Markets

**Steps**:
1. Create 3 different markets
2. As a user, place bets on all 3 markets
3. **Expected Result**:
   - Can place one bet per market
   - Each market shows locked state after betting
   - All 3 bets are independent

**Verify**:
- [ ] Can bet on multiple markets
- [ ] Each market locks independently
- [ ] Balance deducted for each bet

### 10. Test Balance Validation

**Steps**:
1. Check user balance (e.g., 2000 PC)
2. Try to place bet for 2500 PC
3. **Expected Result**:
   - Error: "Insufficient balance"
   - Bet not placed

**Verify**:
- [ ] Cannot bet more than balance
- [ ] Error message shown
- [ ] Balance unchanged

### 11. Test Betting Limits

**Steps**:
1. Try to place bet for 30 PC
2. **Expected Result**: Error "Minimum bet is 50 PC"
3. Try to place bet for 600 PC
4. **Expected Result**: Error "Maximum bet is 500 PC"

**Verify**:
- [ ] Minimum 50 PC enforced
- [ ] Maximum 500 PC enforced
- [ ] Error messages clear

### 12. Test Page Refresh Persistence

**Steps**:
1. Place a bet on a market
2. Refresh the page
3. **Expected Result**:
   - Locked state persists
   - Active bet details still shown
   - Cannot place another bet

**Verify**:
- [ ] Lock state persists after refresh
- [ ] Bet details load correctly
- [ ] No duplicate bets possible

## Edge Cases to Test

### Edge Case 1: Simultaneous Bets
- Two users place bets at exact same time
- First one to reach database wins (by submissionTime)

### Edge Case 2: Market Closed While Betting
- User starts filling form
- Admin closes market
- User tries to submit
- Should fail gracefully

### Edge Case 3: Insufficient Balance After Bet
- User has 100 PC
- Places bet for 80 PC
- Tries to place another bet for 50 PC
- Should fail with "Insufficient balance"

### Edge Case 4: Admin Finalizes Open Market
- Should not be possible
- Must close market first

## Performance Tests

1. **Load 50 markets**: Check if page loads smoothly
2. **100 users betting**: Check if locking works correctly
3. **Finalize with 1000 bets**: Check if first-bet-wins logic is fast

## Security Tests

1. **Non-admin tries to close market**: Should fail
2. **Non-admin tries to finalize results**: Should fail
3. **User tries to bet on closed market**: Should fail
4. **User tries to modify bet after placing**: Should fail

## Checklist Summary

- [ ] User bet locking works
- [ ] Duplicate bet prevention works
- [ ] Admin can view all markets
- [ ] Admin can create markets
- [ ] Admin can close markets
- [ ] Admin can finalize results
- [ ] First-bet-wins logic correct
- [ ] Winner receives payout
- [ ] Losers marked correctly
- [ ] Balance validation works
- [ ] Betting limits enforced
- [ ] Multiple markets work independently
- [ ] Page refresh persistence works
- [ ] Edge cases handled
- [ ] Security rules enforced

## Troubleshooting

### Issue: Locked state not showing
- Check browser console for errors
- Verify `getUserActiveBet()` is being called
- Check Firebase rules allow reading bets

### Issue: Cannot place bet
- Check user balance
- Verify betting limits (50-500 PC)
- Check if market is open
- Check if user already has active bet

### Issue: Admin functions not working
- Verify signed in as `wulo@gmail.com`
- Check Firebase rules for admin permissions
- Check browser console for errors

### Issue: First-bet-wins not working
- Check `submissionTime` field exists on bets
- Verify sorting logic in `finalizeMarketResults()`
- Check if multiple bets have same timestamp

---

**Last Updated**: May 13, 2026  
**Version**: 1.0
