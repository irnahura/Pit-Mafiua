# Project Brief: Polaris MotoGP — PitCoins Betting League

## 1. Project Overview
**Polaris MotoGP — PitCoins Betting League** is a fictional, entertainment-focused prediction platform built for the Polaris School of Technology. It blends the high-stakes energy of MotoGP racing with an esports-style dashboard aesthetic, allowing students to compete in a risk-free virtual betting environment.

### Core Philosophy
- **Not Gambling:** No real money transactions; purely for entertainment.
- **Skill-Based:** Rewards tactical racing knowledge and telemetry analysis.
- **Community-Driven:** Live leaderboards and campus-event hype.

---

## 2. User Journey & Mechanics

### Initial State
- Each user starts with a **Starter Bank of 2,000 PitCoins (PC)**.
- Authentication via Email or College/Event ID.

### Betting Phase
- **Window:** Opens 15 minutes before race start; closes exactly when Lap 1 begins.
- **Constraints:** Minimum bet of 50 PC; Maximum bet of 500 PC per category.
- **Lock Mechanism:** Once submitted, predictions cannot be edited or retracted.

### Categories & Multipliers
| Category | Multiplier | Description |
| :--- | :--- | :--- |
| **Race Winner** | 5X | Predict the 1st place finisher. |
| **Fastest Lap** | 3X | Predict the rider with the absolute minimum lap time. |
| **Most Accidents** | 3X | Predict which rider/team involved in the most incidents. |
| **Slowest Lap** | 2X | The "underdog" prediction for the highest registered lap time. |
| **Trash Car** | 5X | Predict a total engine failure, severe crash, or mechanical collapse. |

---

## 3. Visual & UX Identity

### Design Direction
- **Theme:** Dark UI, Cyber-racing, Futuristic Dashboard.
- **Palette:** Matte black surfaces, Electric Blue, Neon Pink (#E4AEC5), and tactical Sage Green (#5F7464).
- **Styling:** Glassmorphism cards, neon glows, racing telemetry overlays, and bold sans-serif typography (Anybody).

### Key UX Goals
- **High Energy:** Motion-heavy transitions and live leaderboard effects.
- **Tactical Clarity:** Dense information displayed through clean, telemetry-inspired widgets.
- **Trust:** Constant reinforcement that no real currency is used.

---

## 4. Screen Architecture

1.  **Landing Page:** Event manifesto, "How it Works," and the "Enter the Pit" CTA.
2.  **User Dashboard:** Personal "Race Hub" showing balance, prediction accuracy, and active positions.
3.  **Betting Arena:** The tactical cockpit for distributing PitCoins across categories.
4.  **Live Leaderboard:** F1-inspired timing board with real-time rank shifts and trend indicators.
5.  **Race Results:** Post-race breakdown of winning categories and personal earnings.
6.  **Victory Podium:** Celebration screen for top earners with Amazon voucher conversion (50% of PC balance, capped at ₹5000).
7.  **Admin Panel (Race Control):** Operational hub for opening/closing pools and entering race telemetry.

---

## 5. Technical Stack (Proposed)

- **Frontend:** Next.js, React, TailwindCSS, Framer Motion (for high-fidelity animations).
- **Backend/Database:** Supabase (Real-time subscriptions for leaderboard) or Firebase.
- **Logic:** Tiebreakers based on most correct predictions > race winner prediction > earliest submission time.

---

## 6. Legal & Disclaimer
> "This is a fictional entertainment prediction game and not real-money gambling. No real currency is used or won."
