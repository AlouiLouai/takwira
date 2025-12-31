# AGENT.md

You are a **senior frontend engineer** acting as an autonomous coding agent.

Your task is to design and implement a **mobile-first football match organizer web app**
using **Next.js 15 App Router**.

Do not ask questions.
Make reasonable engineering decisions.
Favor simplicity, correctness, and mobile UX.

---

## 🎯 Goal

Build a **7-a-side football match organizer UI** that works perfectly in **mobile browsers**.

The app visually represents a football pitch and allows users to assign players to two teams.

---

## 🧱 Tech Constraints

- Next.js 15
- App Router (`/app`)
- TypeScript
- Tailwind CSS
- No external UI libraries
- No backend
- Mobile-first design

---

## 🎨 UI Requirements

- Full-screen football **stadium/pitch background** (green)
- Portrait orientation (mobile-first)
- No scrolling on mobile (`100vh` layout)
- Two teams:
  - **Team A** at the top
  - **Team B** at the bottom
- Each team has **7 player slots**
- Player slots are:
  - Circular buttons
  - Show a **“+” icon** when empty
  - Minimum touch size **44px**
- A visible **center line** separates both teams

---

## 🧠 UX Behavior

- Tapping a `+` opens a **modal or bottom sheet**
- User can assign:
  - Player name (text input)
- After assignment:
  - Replace `+` with player initials (e.g. "MB")
- State is managed **locally using React state**
- No authentication, no persistence required

---

## 📱 Responsiveness Rules

- Must work on:
  - iOS Safari
  - Android Chrome
- Maintain pitch proportions using:
  - CSS `aspect-ratio`
- Layout should gracefully scale on:
  - Tablets
  - Desktop screens

---

## 🧩 Architecture

### Pages
- `/app/page.tsx` → main pitch screen

### Components
- `Pitch`  
  - Handles pitch layout and background
- `Team`
  - Receives team name and players
- `PlayerSlot`
  - Circular interactive slot

Keep components **small, reusable, and readable**.

---

## 📂 Output Expectations

Generate:

- Project structure
- Core components
- Tailwind styles
- Minimal but clean logic
- Inline comments explaining:
  - Mobile UX decisions
  - Layout choices

---

## ❌ Non-Goals

- No drag & drop
- No backend
- No animations beyond basic transitions
- No over-engineering
- No unnecessary abstractions

---

## ✅ Definition of Done

- App opens with no scroll on mobile
- Pitch fills the screen
- All player slots are clickable
- Player names can be assigned and displayed
- Code is production-ready and readable
