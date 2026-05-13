# Betting System Enhancement - User Locking & Admin Controls

## Overview
Enhanced the betting system with user locking after placing bets and comprehensive admin controls for managing betting markets.

## Features Implemented

### 1. User Bet Locking ✅
**Location**: `app/(protected)/betting/page.tsx`

- Users are now locked after placing a bet on a specific market
- Cannot place another bet on the same market until the current bet ends
- Visual feedback shows:
  - Lock icon on the betting card
  - User's active bet details (prediction, stake, potential return)
  - Message: "Wait for this bet to end before placing another"
- Backend validation prevents duplicate bets on same market

**How it works**:
- On page load, checks for user's active bets on each market
- `getUserActiveBet(userId, marketId)` fetches active bet
- If active bet exists, betting form is replaced with bet details
- Lock icon replaces the market icon

### 2. Admin Betting Markets Control ✅
**Location**: `app/(protected)/Nevada/page.tsx`

New section added: **"Betting Markets Control"**

Features:
- **View All Markets**: Displays all betting markets (open, closed, finalized)
- **Market Cards**: Show bet name, status, odds, and summary
- **Status Indicators**: Color-coded borders (cyan=open, red=closed, green=finalized)
- **Close Market**: Admin can close individual markets
- **Select Market**: Admin can select closed markets for finalization

### 3. Finalize Results with First-Bet-Wins Logic ✅
**Location**: `lib/firestore.ts` - `finalizeMarketResults()`

**First-Bet-Wins Rule**:
- Admin enters the winning selection (e.g., "Jorge Martin")
- System finds all bets with that selection
- Sorts by `submissionTime` (earliest first)
- **Only the FIRST bet wins** - all others marked as lost
- Winner receives their `potentialReturn` payout
- All other bets (including other correct predictions) marked as lost

**Admin Interface**:
- Select a closed market
- Enter winning selection
- Warning message about first-bet-wins rule
- "FINALIZE & PAY WINNER" button
- Confirmation dialog before processing

### 4. Enhanced Firebase Functions ✅
**Location**: `lib/firestore.ts`

New functions added:

```typescript
// Get all betting markets (including closed/finalized)
getAllBettingMarkets()

// Check if user has active bet on specific market
checkUserHasActiveBet(userId, marketId)

// Get user's active bet details
getUserActiveBet(userId, marketId)

// Close a specific betting market
closeBettingMarket(marketId)

// Finalize market with first-bet-wins logic
finalizeMarketResults(marketId, winningSelection)
```

Updated functions:

```typescript
// logBet() now includes:
- marketId parameter for tracking
- Check for existing active bet on market
- Prevents duplicate bets with error message
```

### 5. Database Schema Updates ✅

**Bets Collection**:
- Added `marketId` field to track which market the bet is for
- Used for user locking and result finalization

**Betting Markets Collection**:
- `status` field: 'open', 'closed', 'finalized'
- `closedAt` timestamp when market is closed
- `winningSelection` stores the winning prediction
- `finalizedAt` timestamp when results are finalized

## User Flow

### Placing a Bet:
1. User views open betting markets
2. If no active bet on market → Can place bet
3. If active bet exists → Shows locked state with bet details
4. After placing bet → Market card shows lock icon and bet info
5. User must wait for bet to end before placing another on same market

### Admin Finalizing Results:
1. Admin creates betting market (existing feature)
2. Users place bets (with locking)
3. Admin closes the market (new feature)
4. Admin selects closed market
5. Admin enters winning selection
6. System finds all matching bets
7. **Only earliest bet wins** (first-bet-wins logic)
8. Winner gets payout, all others marked as lost
9. Market status set to 'finalized'

## Technical Details

### Bet Locking Implementation:
```typescript
// Check for active bets on page load
useEffect(() => {
  const checkUserBets = async () => {
    const betsPromises = markets.map(market => 
      getUserActiveBet(user.uid, market.id)
    );
    const betsResults = await Promise.all(betsPromises);
    setUserActiveBets(betsMap);
  };
  checkUserBets();
}, [user, markets]);
```

### First-Bet-Wins Logic:
```typescript
// Sort bets by submission time
const winningBets = querySnapshot.docs
  .map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }))
  .sort((a, b) => {
    const timeA = a.submissionTime || a.createdAt?.toMillis?.() || 0;
    const timeB = b.submissionTime || b.createdAt?.toMillis?.() || 0;
    return timeA - timeB;
  });

// Only first bet wins
const firstWinningBet = winningBets[0];
```

## Security

### Firebase Rules:
- Betting limits enforced: 50-500 PC per bet
- Users can only create bets for themselves
- Only admin can close/finalize markets
- Bet status validation: must be 'pending', 'won', or 'lost'

### Backend Validation:
- Duplicate bet prevention in `logBet()`
- Balance checks before placing bet
- Admin-only functions for market management

## Files Modified

1. **lib/firestore.ts**
   - Added 5 new functions
   - Updated `logBet()` with marketId and duplicate check
   - Implemented first-bet-wins logic in `finalizeMarketResults()`

2. **app/(protected)/betting/page.tsx**
   - Added user bet locking UI
   - Added active bet display
   - Added lock icon and status indicators
   - Integrated `getUserActiveBet()` checks

3. **app/(protected)/Nevada/page.tsx**
   - Added "Betting Markets Control" section
   - Added market cards with status indicators
   - Added close market functionality
   - Added finalize results interface
   - Added first-bet-wins warning

4. **hooks/useBettingMarkets.ts**
   - No changes (already working correctly)

5. **firestore.rules**
   - Already has proper validation (no changes needed)

## Testing Checklist

- [ ] User can place bet on open market
- [ ] User sees locked state after placing bet
- [ ] User cannot place second bet on same market
- [ ] Admin can view all markets
- [ ] Admin can close open market
- [ ] Admin can select closed market
- [ ] Admin can finalize results
- [ ] Only first bet with correct prediction wins
- [ ] Winner receives payout
- [ ] All other bets marked as lost
- [ ] Market status updates correctly

## Future Enhancements

1. **Auto-close markets**: Close markets automatically at race start time
2. **Bet history**: Show user's past bets on each market
3. **Market statistics**: Show total bets, participants, pool size per market
4. **Partial refunds**: Option to refund all bets if race is cancelled
5. **Multiple winners**: Option to pay out top N bets instead of just first
6. **Bet editing**: Allow users to modify bet before market closes
7. **Real-time updates**: Use Firestore listeners for live market updates

## Notes

- **First-bet-wins** is a strict rule - only the earliest bet wins
- Users are locked per market, not globally (can bet on multiple markets)
- Admin must manually close markets (no auto-close yet)
- Finalization is irreversible - admin should double-check winning selection
- All timestamps use `submissionTime` field for consistency

---

**Date**: May 13, 2026  
**Status**: ✅ Complete  
**Version**: 1.0
