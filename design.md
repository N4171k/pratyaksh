# TracePriv UI Design Document

## Overview

This document outlines the complete UI/UX design for TracePriv, utilizing React Bits Pro components to create a modern, privacy-focused, and visually stunning experience. The design emphasizes trust, security, and clarity while maintaining a cutting-edge aesthetic.

---

## Design Philosophy

### Core Principles

1. **Privacy-First Aesthetic**
   - Dark, secure color palette
   - Subtle, trustworthy animations
   - Clear data flow visualization

2. **Visual Hierarchy**
   - Critical information stands out
   - Progressive disclosure
   - Scannable layouts

3. **Emotional Impact**
   - "Wow" moments during key interactions
   - Satisfying micro-animations
   - Empowerment over fear

4. **Performance**
   - Smooth 60fps animations
   - Optimized for low-end devices
   - Reduced motion support

---

## Color System

### Primary Palette

```css
/* Brand Colors */
--color-primary: #3B82F6;        /* Trust Blue */
--color-primary-dark: #1E40AF;
--color-primary-light: #60A5FA;

/* Security Colors */
--color-danger: #EF4444;         /* High Risk Red */
--color-warning: #F59E0B;        /* Medium Risk Orange */
--color-success: #10B981;        /* Low Risk Green */

/* Neutral Colors */
--color-dark: #0F172A;           /* Background Dark */
--color-dark-lighter: #1E293B;
--color-gray: #64748B;
--color-light: #F1F5F9;

/* Accent Colors */
--color-electric: #06B6D4;       /* Electric Blue */
--color-purple: #8B5CF6;         /* AI Purple */
--color-breach: #DC2626;         /* Breach Alert */
```

### Gradients

```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);

/* Glass Effect */
--gradient-glass: linear-gradient(135deg, 
  rgba(255, 255, 255, 0.1) 0%, 
  rgba(255, 255, 255, 0.05) 100%);

/* Danger Gradient */
--gradient-danger: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);

/* Success Gradient */
--gradient-success: linear-gradient(135deg, #10B981 0%, #059669 100%);
```

---

## Typography

### Font System

```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace (for data) */
font-family-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

---

## Component Library

### From React Bits

**Text Components:**
- `Shuffle` - Animated text reveal (tagline, headings)
- `Shiny Text` - Premium feel for CTAs
- `Gradient Text` - Hero headings
- `Scrambled Text` - Data processing indicators
- `Glitch Text` - Alert states, breach warnings
- `Count Up` - Statistical displays

**Interactive Elements:**
- `Electric Border` - CTA buttons, cards
- `Metallic Paint` - Premium service cards
- `Glare Hover` - Interactive cards
- `Click Spark` - Button feedback
- `Sticker Peel` - Delete action confirmation

**Layout Components:**
- `Magic Bento` - Feature grid layout
- `Fluid Glass` - Dashboard cards
- `Spotlight Card` - Service cards
- `Stack` - Service list organization
- `Reflective Card` - Premium feature showcase

**Navigation:**
- `Dock` - Bottom navigation (mobile)
- `Pill Nav` - Main navigation
- `Bubble Menu` - Quick actions menu

**Backgrounds:**
- `Dot Grid` - Subtle background pattern
- `Aurora` - Hero section background
- `Beams` - Scan animation background
- `Grid Distortion` - Loading states
- `Letter Glitch` - Matrix-style data processing

**Effects:**
- `Ghost Cursor` - Premium feel
- `Magnet` - Interactive elements
- `Laser Flow` - Connection lines (risk map)
- `Pixel Trail` - Mouse trail on key pages
- `Star Border` - Premium features

---

## Page Designs

---

## 1. Landing Page

### Hero Section

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                     │
│  [Logo]                     [Login] [Get Started]  │
│                                                     │
│             ┌─────────────────────┐                │
│             │   HERO HEADLINE     │  <- Gradient Text
│             │   (Shuffle Effect)  │                │
│             └─────────────────────┘                │
│                                                     │
│        Tagline with Shiny Text effect              │
│                                                     │
│     [Connect Your Gmail - Electric Border CTA]     │
│                                                     │
│        Trust indicators: 🔒 No data stored         │
│                         ✓ Read-only access          │
│                                                     │
│     ┌─────────────────────────────────────┐       │
│     │   Animated Preview of Risk Map       │       │
│     │   (Aurora Background + Dot Grid)     │       │
│     └─────────────────────────────────────┘       │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Background: `Aurora` + `Dot Grid`
- Headline: `Gradient Text` + `Shuffle` animation on load
- Tagline: `Shiny Text`
- CTA Button: `Electric Border` with `Click Spark` feedback
- Preview: `Spotlight Card` with embedded risk map preview
- Cursor: `Ghost Cursor` for premium feel

**Interactions:**
- Scroll triggers `Scroll Reveal` for features
- Hover on CTA: `Glare Hover` effect
- Mouse trail: `Pixel Trail` on hero section only

---

### Features Section

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                     │
│     "How TracePriv Works" (Gradient Text)          │
│                                                     │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │ Step 1 │  │ Step 2 │  │ Step 3 │  │ Step 4 │ │
│  │        │  │        │  │        │  │        │ │
│  │ Connect│  │  Scan  │  │Analyze │  │ Delete │ │
│  │        │  │        │  │        │  │        │ │
│  └────────┘  └────────┘  └────────┘  └────────┘ │
│   Fluid Glass Cards with Metallic Paint on hover  │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Layout: `Magic Bento` grid
- Cards: `Fluid Glass` with `Metallic Paint` hover
- Icons: Animated with `Magnet` effect
- Numbers: `Count Up` on scroll
- Reveal: `Scroll Reveal` stagger

**Interactions:**
- Cards tilt on hover (`Tilted Card` effect)
- Icons pulse with `Magnet` attraction
- Progressive reveal as user scrolls

---

### Social Proof Section

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                     │
│     "Your Data Is Worth..." (Gradient Text)        │
│                                                     │
│         ┌─────────────────────────┐               │
│         │    ₹11,800 / year       │  <- Count Up  │
│         │                          │               │
│         │  Average value of data   │               │
│         │  exposed across 84 accts │               │
│         └─────────────────────────┘               │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │  Real-time breach counter (Scrambled Text) │   │
│  │  "1,234,567 accounts breached this week"   │   │
│  └────────────────────────────────────────────┘   │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Value display: `Count Up` with `Shiny Text`
- Stats container: `Spotlight Card`
- Breach counter: `Scrambled Text` constantly updating
- Background: `Beams` radiating from center

---

### Trust Indicators

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ 🔒 Zero  │  │ ⚡ Session│  │ ✓ GDPR   │        │
│  │Knowledge │  │   Only   │  │Compliant │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│   Electric Border cards                            │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Cards: `Electric Border` with `Glass Surface`
- Icons: Animated on scroll
- Text: `Blur Text` on initial load, sharp on scroll into view

---

### Final CTA

**Layout:**
```
┌────────────────────────────────────────────────────┐
│                                                     │
│     "Take Control. Start Now." (Glitch Text)       │
│                                                     │
│  [Get Started - Free] <- Electric Border + Sparkle │
│                                                     │
│      No credit card • No data stored               │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Headline: `Glitch Text` with subtle effect
- Button: `Electric Border` + `Click Spark`
- Background: `Aurora` gradient

---

## 2. OAuth Consent Screen

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│                   [TracePriv Logo]                  │
│                                                     │
│     ┌─────────────────────────────────────┐       │
│     │                                      │       │
│     │    "Grant Gmail Access"              │       │
│     │                                      │       │
│     │  We need read-only access to:       │       │
│     │                                      │       │
│     │  ✓ Email headers (From, Subject)    │       │
│     │  ✓ Dates only                       │       │
│     │  ✗ No email content                 │       │
│     │  ✗ No email body access             │       │
│     │                                      │       │
│     │  🔒 All data deleted after session  │       │
│     │                                      │       │
│     │  [Continue with Google]              │       │
│     │  [Learn More About Permissions]      │       │
│     │                                      │       │
│     └─────────────────────────────────────┘       │
│           Reflective Card with Glass Surface       │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Container: `Reflective Card` with `Glass Surface`
- Checkmarks: Animated with `Magnet` effect
- Privacy icon: Pulsing `Star Border`
- Background: Subtle `Dot Grid`
- CTA: `Electric Border` button

**Animations:**
- Checklist items appear with `Scroll Reveal` stagger
- Privacy icon pulses gently
- Button has `Glare Hover` effect

---

## 3. Scanning Progress Screen

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│        "Scanning Your Digital Footprint"           │
│              (Shuffle animation)                    │
│                                                     │
│     ┌─────────────────────────────────────┐       │
│     │                                      │       │
│     │   ┌──────────────────────────┐     │       │
│     │   │ ████████████░░░░░░░░░░░ │     │       │
│     │   │      Progress: 67%       │     │       │
│     │   └──────────────────────────┘     │       │
│     │                                      │       │
│     │   Emails scanned: 3,421 / 5,000     │       │
│     │                  (Count Up)          │       │
│     │                                      │       │
│     │   Services found: 47                 │       │
│     │                  (Count Up)          │       │
│     │                                      │       │
│     │  ┌─────────────────────────────┐   │       │
│     │  │  Background: Letter Glitch   │   │       │
│     │  │  Matrix-style data flow      │   │       │
│     │  └─────────────────────────────┘   │       │
│     │                                      │       │
│     └─────────────────────────────────────┘       │
│                                                     │
│     Status: "Analyzing spotify.com..."             │
│             (Scrambled Text animation)             │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Background: `Letter Glitch` (Matrix effect)
- Headline: `Shuffle` changing between states
- Progress numbers: `Count Up` animation
- Status text: `Scrambled Text` constantly updating
- Container: `Glass Surface` with blur
- Progress bar: Custom with `Laser Flow` effect

**Animations:**
- `Letter Glitch` background constantly animating
- Domain names `Scrambled Text` as they're discovered
- Progress bar fills with `Laser Flow` animation
- Numbers increment with `Count Up`
- `Beams` radiating from progress bar

**Loading States:**
```
States:
1. "Connecting to Gmail..." (0-10%)
2. "Fetching email metadata..." (10-30%)
3. "Analyzing signup patterns..." (30-70%)
4. "Categorizing services..." (70-90%)
5. "Checking breach database..." (90-95%)
6. "Finalizing report..." (95-100%)
```

---

## 4. Dashboard (Risk Map View)

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard    [Search]  [Filters]  [Settings] [Logout] │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    Summary Cards                          │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐         │ │
│  │  │ Total  │  │ High   │  │Breached│  │ Value  │         │ │
│  │  │  127   │  │  Risk  │  │   23   │  │₹11,800 │         │ │
│  │  │Accounts│  │   18   │  │Services│  │/ year  │         │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘         │ │
│  │   Count Up    Danger     Breach      Shiny Text          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │                     RISK MAP                              │ │
│  │                                                            │ │
│  │       ┌─────────────────────────────┐                    │ │
│  │       │         [User]              │                    │ │
│  │       │           ●                 │                    │ │
│  │       │      ╱    │    ╲            │                    │ │
│  │       │    ●      ●      ●          │  Inner: High Risk  │ │
│  │       │   ╱ ╲    ╱ ╲    ╱ ╲        │  (Red)             │ │
│  │       │  ●   ●  ●   ●  ●   ●       │  Middle: Medium    │ │
│  │       │                             │  (Orange)          │ │
│  │       │  ●  ●  ●  ●  ●  ●  ●  ●   │  Outer: Low        │ │
│  │       │                             │  (Green)           │ │
│  │       └─────────────────────────────┘                    │ │
│  │                                                            │ │
│  │  Interactive D3.js visualization                          │ │
│  │  - Laser Flow connections                                 │ │
│  │  - Spotlight Card on hover                                │ │
│  │  - Breach indicators (pulsing Star Border)                │ │
│  │                                                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Filters: All | High Risk | Breached | Finance | E-commerce]  │
│           Pill Nav component                                    │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

**Components Used:**

**Summary Cards:**
- Layout: `Magic Bento` grid
- Cards: `Fluid Glass` with `Metallic Paint` hover
- Numbers: `Count Up` animation
- High risk card: Red `Electric Border`
- Breach card: Pulsing `Star Border`
- Value card: `Shiny Text` for amount

**Risk Map:**
- Background: `Dot Grid` subtle pattern
- Connections: `Laser Flow` lines from center
- Service nodes: Custom circles with:
  - `Spotlight Card` on hover
  - `Star Border` for breached services
  - `Electric Border` for high risk
  - `Magnet` effect on hover
- User center: `Metallic Paint` effect
- Zoom controls: `Glass Icons`

**Navigation:**
- Top bar: `Pill Nav` with `Glass Surface`
- Filter pills: `Bubble Menu` style
- Search: `Electric Border` input with `Magnet` icon

**Interactions:**
- Hover service node → `Spotlight Card` appears with details
- Click service → Expand to detail view
- Drag to pan
- Scroll to zoom
- Breached services pulse with `Star Border`
- `Ghost Cursor` on entire dashboard

---

## 5. Service Detail Card (Modal)

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  [X Close]                                          │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │  [Logo]  Spotify                              │ │
│  │          Entertainment                         │ │
│  │          ⚠️ Medium Risk                       │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  Risk Score: 4.2 / 10                         │ │
│  │  ████████░░ 42%                               │ │
│  │                                                │ │
│  │  Data Collected:                              │ │
│  │  • Email address                              │ │
│  │  • Listening history                          │ │
│  │  • Playlists                                  │ │
│  │  • Payment info                               │ │
│  │                                                │ │
│  │  Breach Status: ✓ No known breaches          │ │
│  │                                                │ │
│  │  Account Created: March 15, 2019              │ │
│  │                                                │ │
│  │  Privacy Email: privacy@spotify.com           │ │
│  │  (AI Discovered) ✨                           │ │
│  │                                                │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  [View Privacy Policy] [Delete Account Data] │ │
│  │   Glass button      Electric Border CTA       │ │
│  │                                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Container: `Reflective Card` with `Glass Surface`
- Logo: Circular with `Metallic Paint` border
- Risk bar: `Laser Flow` filling animation
- Breach badge: `Electric Border` if breached
- AI badge: `Shiny Text` with sparkle icon
- Delete button: `Electric Border` + `Click Spark`
- Close: `Ghost Cursor` follows on hover

**Animations:**
- Card enters with `Pixel Transition`
- Risk bar fills with `Laser Flow`
- Data items appear with `Scroll Reveal` stagger
- Hover delete button: `Glare Hover` effect

---

## 6. Service List View (Alternative to Map)

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  View: [Map] [List] [Grid]  Sort: [Risk ▼]        │
│        Pill Nav                                     │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │  ☐  [Logo] PayPal                    🔴 HIGH │ │
│  │      Finance • Breached 2023          Risk 9.2│ │
│  │      [View] [Delete]                          │ │
│  ├──────────────────────────────────────────────┤ │
│  │  ☐  [Logo] LinkedIn              🟠 MEDIUM   │ │
│  │      Professional • No breaches      Risk 5.1│ │
│  │      [View] [Delete]                          │ │
│  ├──────────────────────────────────────────────┤ │
│  │  ☐  [Logo] Spotify                🟢 LOW     │ │
│  │      Entertainment • No breaches     Risk 4.2│ │
│  │      [View] [Delete]                          │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
│  ☐ Select All (23 services selected)              │
│  [🔥 Kill Switch] ← Electric Border, pulsing       │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- List container: `Stack` with smooth animations
- Service cards: `Spotlight Card` with `Glare Hover`
- Checkboxes: Custom with `Magnet` effect
- Risk badges: `Electric Border` (color-coded)
- Breach indicators: Pulsing `Star Border`
- Kill Switch: Large `Electric Border` button with:
  - `Shiny Text` for label
  - `Click Spark` on press
  - Danger gradient background
- Row hover: Subtle `Metallic Paint` effect

**Interactions:**
- Hover row → `Spotlight` follows cursor
- Check box → `Click Spark` animation
- Select multiple → Kill Switch pulses
- Sort → `Shuffle` animation on reorder

---

## 7. Kill Switch Confirmation Modal

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│          ⚠️  WARNING  ⚠️                           │
│          (Glitch Text animation)                    │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │                                                │ │
│  │  You're about to request deletion from:       │ │
│  │                                                │ │
│  │       ┌────────────────┐                      │ │
│  │       │      47        │  (Count Up)          │ │
│  │       │    Services    │                      │ │
│  │       └────────────────┘                      │ │
│  │                                                │ │
│  │  This will:                                   │ │
│  │  ✓ Generate 47 GDPR deletion requests        │ │
│  │  ✓ Copy all emails to your clipboard         │ │
│  │  ✓ Open your email client for review         │ │
│  │                                                │ │
│  │  ⚠️ This action cannot be undone              │ │
│  │                                                │ │
│  │  Estimated data value being protected:       │ │
│  │         ₹11,800 / year (Shiny Text)          │ │
│  │                                                │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  [Cancel]            [🔥 Proceed with Kill    │ │
│  │   Glass button        Switch] ← Electric      │ │
│  │                       Border, Red gradient    │ │
│  │                                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Modal: `Reflective Card` with dark overlay
- Background: `Grid Distortion` effect
- Warning icon: `Glitch Text` with subtle animation
- Number display: `Count Up` with `Metallic Paint` border
- Checklist: Items appear with `Scroll Reveal`
- Value: `Shiny Text` with gradient
- Proceed button: 
  - `Electric Border` with red gradient
  - `Click Spark` on hover
  - `Glare Hover` effect
- Cancel: `Glass Surface` button
- Background overlay: `Dark Veil` with blur

**Animations:**
- Modal enters with `Pixel Transition`
- Warning text has subtle `Glitch Text` effect
- Count animates with `Count Up`
- Checklist items stagger in
- Button pulses gently
- Background has `Grid Distortion`

---

## 8. Processing Kill Switch

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│     "Processing Deletion Requests..."              │
│           (Shuffle animation)                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │                                                │ │
│  │   Background: Letter Glitch effect            │ │
│  │                                                │ │
│  │   ┌────────────────────────────────┐         │ │
│  │   │  Generating emails: 23 / 47    │         │ │
│  │   │  ████████████░░░░░░░░░░░░░░   │         │ │
│  │   │          49% Complete           │         │ │
│  │   └────────────────────────────────┘         │ │
│  │                                                │ │
│  │   Current: privacy@paypal.com                 │ │
│  │           (Scrambled Text)                    │ │
│  │                                                │ │
│  │   ✓ Spotify                                   │ │
│  │   ✓ Netflix                                   │ │
│  │   ✓ Amazon                                    │ │
│  │   ⟳ PayPal  ← Current (Laser Flow)          │ │
│  │   ○ LinkedIn                                  │ │
│  │   ○ Twitter                                   │ │
│  │                                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Background: `Letter Glitch` (Matrix style)
- Progress: `Count Up` for numbers
- Progress bar: `Laser Flow` animation
- Current email: `Scrambled Text` constantly changing
- Service list: 
  - Completed: `Shiny Text` with checkmark
  - Current: `Laser Flow` border, pulsing
  - Pending: Faded with `Blur Text`
- Overall container: `Glass Surface` with blur

**Animations:**
- Services "disappear" from risk map in background
- `Letter Glitch` intensifies
- Progress bar `Laser Flow` animation
- Email addresses `Scrambled Text`
- Completed items fade out with `Gradual Blur`

---

## 9. Success Screen

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│              ✨ Success! ✨                        │
│           (Shiny Text + sparkles)                   │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │                                                │ │
│  │  You've taken back control of your data!      │ │
│  │                                                │ │
│  │         ┌────────────────┐                    │ │
│  │         │      47        │                    │ │
│  │         │  Deletion      │  (Count Up)        │ │
│  │         │   Requests     │                    │ │
│  │         │   Generated    │                    │ │
│  │         └────────────────┘                    │ │
│  │                                                │ │
│  │  Data Value Protected: ₹11,800 / year        │ │
│  │                        (Shiny Text)           │ │
│  │                                                │ │
│  │  ┌────────────────────────────────────────┐  │ │
│  │  │ All emails have been copied to your    │  │ │
│  │  │ clipboard and opened in your email     │  │ │
│  │  │ client.                                │  │ │
│  │  │                                        │  │ │
│  │  │ Next Steps:                            │  │ │
│  │  │ 1. Review the deletion emails          │  │ │
│  │  │ 2. Send them manually                  │  │ │
│  │  │ 3. Track responses (30-day deadline)   │  │ │
│  │  └────────────────────────────────────────┘  │ │
│  │                                                │ │
│  │  [Download Summary PDF] [Back to Dashboard]  │ │
│  │   Electric Border        Glass button         │ │
│  │                                                │ │
│  │  [Share Your Privacy Win] ← Social sharing   │ │
│  │                                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Background: `Aurora` with celebration colors
- Success icon: Animated with `Click Spark` bursts
- Headline: `Shiny Text` with sparkle particles
- Stats box: `Metallic Paint` border
- Number: `Count Up` animation
- Value: `Gradient Text` with success gradient
- Info box: `Fluid Glass` with subtle `Beams`
- Buttons:
  - Primary: `Electric Border` with success color
  - Secondary: `Glass Surface`
  - Share: `Shiny Text` with social icons
- Confetti: `Pixel Blast` effect

**Animations:**
- Enter with `Pixel Transition`
- `Click Spark` bursts from success icon
- `Count Up` for statistics
- Celebration `Pixel Blast` in background
- `Aurora` gradient animates
- Social icons have `Magnet` effect

---

## 10. Settings / Profile

### Layout

```
┌────────────────────────────────────────────────────┐
│                                                     │
│  Settings                                           │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │  Privacy Settings                             │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  Session Data                                 │ │
│  │  ○ Delete now  ● Delete after 15 min         │ │
│  │                                                │ │
│  │  AI Features                                  │ │
│  │  ● Enable AI categorization                   │ │
│  │  ● Enable AI email generation                 │ │
│  │                                                │ │
│  │  Visual Preferences                           │ │
│  │  ● Reduce animations (accessibility)          │ │
│  │  ○ Dark mode  ● Auto                          │ │
│  │                                                │ │
│  ├──────────────────────────────────────────────┤ │
│  │  Account                                      │ │
│  ├──────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  Connected Email: user@gmail.com              │ │
│  │  [Revoke Access] ← Danger button              │ │
│  │                                                │ │
│  │  [Download My Data] [Delete All Session Data]│ │
│  │   Electric Border   Glass Surface             │ │
│  │                                                │ │
│  └──────────────────────────────────────────────┘ │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Components Used:**
- Container: `Fluid Glass` with `Glass Surface`
- Sections: `Stack` with separators
- Toggle switches: Custom with `Magnet` effect
- Radio buttons: `Electric Border` when selected
- Danger button: Red `Electric Border` + `Glitch Text` on hover
- Save button: `Electric Border` with success color
- Background: Subtle `Dot Grid`

---

## Mobile Designs

### Mobile Navigation

```
┌──────────────────────┐
│                      │
│   ☰  TracePriv  🔔   │
│                      │
├──────────────────────┤
│                      │
│   Dashboard Content  │
│   (scrollable)       │
│                      │
│                      │
│                      │
│                      │
│                      │
├──────────────────────┤
│                      │
│  [🏠] [📊] [⚙️] [👤] │
│   Dock component     │
│                      │
└──────────────────────┘
```

**Components Used:**
- Bottom nav: `Dock` with floating icons
- Top bar: `Pill Nav` with glassmorphism
- Burger menu: `Bubble Menu` expansion
- Icons: `Glass Icons` with `Magnet` effect

### Mobile Risk Map

```
┌──────────────────────┐
│                      │
│   Summary Stats      │
│  ┌──┐ ┌──┐ ┌──┐    │
│  │##│ │##│ │##│    │
│  └──┘ └──┘ └──┘    │
│  Horizontal scroll   │
│                      │
├──────────────────────┤
│                      │
│    Risk Map          │
│    (touch enabled)   │
│                      │
│   Pinch to zoom      │
│   Tap for details    │
│                      │
├──────────────────────┤
│                      │
│  [View List]         │
│  [Kill Switch]       │
│                      │
└──────────────────────┘
```

**Components Used:**
- Stats: Horizontal `Carousel` with `Spotlight Card`
- Map: Touch-enabled with `Magnet` for tap targets
- Buttons: Full-width `Electric Border`

---

## Animation Timing & Easing

### Standard Timing

```javascript
const TIMINGS = {
  instant: '100ms',
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
  slowest: '1000ms'
};

const EASINGS = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};
```

### Animation Sequences

**Page Load:**
1. Background (`Aurora`) fades in (0ms)
2. Logo and nav appear (200ms)
3. Headline `Shuffle` animation (400ms)
4. Tagline `Shiny Text` appears (600ms)
5. CTA button fades in with `Electric Border` (800ms)
6. Preview card rises up (1000ms)

**Dashboard Load:**
1. Summary cards count up (0ms, staggered 100ms each)
2. Risk map nodes appear (500ms, radial from center)
3. Connections draw with `Laser Flow` (700ms)
4. Filters slide in (900ms)

**Kill Switch Activation:**
1. Modal appears with `Pixel Transition` (0ms)
2. Warning `Glitch Text` animates (200ms)
3. Count animates (400ms)
4. Checklist items stagger (600ms, 100ms apart)
5. Buttons appear (1000ms)

---

## Accessibility Features

### Motion Preferences

```javascript
// Respect prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Fallbacks:**
- `Shuffle` → Instant text
- `Letter Glitch` → Static background
- `Laser Flow` → Solid lines
- `Pixel Transition` → Fade
- All `Count Up` → Instant numbers

### Keyboard Navigation

- All interactive elements focusable
- Focus indicators: `Electric Border` effect
- Tab order logical
- Escape closes modals
- Arrow keys navigate map

### Screen Reader Support

- ARIA labels on all icons
- Live regions for dynamic content
- Semantic HTML
- Alt text for all images
- Status announcements

### Color Contrast

- All text meets WCAG AA standards
- High risk: 7:1 contrast ratio
- Medium risk: 5:1 contrast ratio
- Low risk: 4.5:1 contrast ratio

---

## Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-xs: 0px;      /* Phones */
--breakpoint-sm: 640px;    /* Large phones */
--breakpoint-md: 768px;    /* Tablets */
--breakpoint-lg: 1024px;   /* Laptops */
--breakpoint-xl: 1280px;   /* Desktops */
--breakpoint-2xl: 1536px;  /* Large desktops */
```

### Adaptive Layouts

**Mobile (< 768px):**
- Single column layout
- Bottom `Dock` navigation
- Stacked summary cards
- Simplified risk map
- Full-screen modals

**Tablet (768px - 1024px):**
- Two column layouts where appropriate
- Side navigation option
- Grid summary cards (2 columns)
- Full risk map with touch controls

**Desktop (> 1024px):**
- Multi-column layouts
- Persistent side navigation
- Grid summary cards (4 columns)
- Full-featured risk map
- Hover effects enabled

---

## Performance Optimizations

### Lazy Loading

```javascript
// Heavy components loaded on demand
const RiskMap = dynamic(() => import('@/components/RiskMap'), {
  loading: () => <LetterGlitch />,
  ssr: false
});
```

### Animation Performance

- Use `transform` and `opacity` only (GPU accelerated)
- `will-change` for animations
- RequestAnimationFrame for custom animations
- Debounce resize events
- Throttle scroll events

### Component Optimization

- Memoize expensive calculations
- Virtual scrolling for long lists
- Intersection Observer for lazy effects
- Preload critical fonts
- Optimize images (WebP, lazy load)

---

## Component Props Reference

### Key React Bits Components

**Shuffle Text:**
```jsx
<Shuffle
  text="Bringing your shadow data into the light"
  shuffleDirection="right"
  duration={0.35}
  ease="power3.out"
  triggerOnce={true}
/>
```

**Electric Border:**
```jsx
<ElectricBorder
  className="cta-button"
  borderWidth={2}
  borderColor="var(--color-primary)"
  glowIntensity={0.5}
>
  Connect Your Gmail
</ElectricBorder>
```

**Count Up:**
```jsx
<CountUp
  end={127}
  duration={2}
  separator=","
  suffix=" accounts"
/>
```

**Letter Glitch:**
```jsx
<LetterGlitch
  glitchSpeed={50}
  glitchColors={['#2b4539', '#61dca3', '#61b3dc']}
  centerVignette={false}
  outerVignette={true}
/>
```

**Spotlight Card:**
```jsx
<SpotlightCard
  spotlight={{
    size: 200,
    intensity: 0.5,
    color: 'rgba(59, 130, 246, 0.3)'
  }}
>
  {/* Card content */}
</SpotlightCard>
```

---

## Design Tokens

### Spacing Scale

```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.5);
```

---

## Implementation Checklist

### Phase 1: Core Pages
- [ ] Landing page with `Aurora` background
- [ ] Hero with `Gradient Text` + `Shuffle`
- [ ] CTA with `Electric Border`
- [ ] OAuth consent screen
- [ ] Scanning screen with `Letter Glitch`

### Phase 2: Dashboard
- [ ] Summary cards with `Count Up`
- [ ] Risk map with D3.js + `Laser Flow`
- [ ] Service cards with `Spotlight Card`
- [ ] Filters with `Pill Nav`

### Phase 3: Interactions
- [ ] Service detail modal with `Reflective Card`
- [ ] List view with `Stack`
- [ ] Kill Switch modal with `Glitch Text`
- [ ] Processing screen with `Scrambled Text`
- [ ] Success screen with `Pixel Blast`

### Phase 4: Polish
- [ ] Mobile `Dock` navigation
- [ ] Settings with `Fluid Glass`
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Reduced motion fallbacks

---

## Demo Preparation

### Pre-Load Assets

```javascript
// Preload critical animations
const preloadAnimations = [
  'Aurora',
  'LetterGlitch',
  'ElectricBorder',
  'Shuffle'
];

// Warm up GPU
const warmupGPU = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  // ... trigger GPU
};
```

### Demo Script Checkpoints

1. **Landing (5s)**
   - `Aurora` background visible
   - `Shuffle` text animates on load
   - `Electric Border` CTA glows

2. **OAuth (3s)**
   - `Reflective Card` appears
   - Privacy checklist animates
   - Click through quickly

3. **Scanning (15s)**
   - `Letter Glitch` background impresses
   - `Count Up` numbers increment
   - `Scrambled Text` shows activity

4. **Dashboard (20s)**
   - Summary cards `Count Up`
   - Risk map reveals with `Laser Flow`
   - Hover services show `Spotlight Card`
   - Breach indicators pulse with `Star Border`

5. **Kill Switch (15s)**
   - Select services
   - Modal appears with `Pixel Transition`
   - `Glitch Text` warning
   - Click confirm
   - Processing with `Letter Glitch`
   - Success with `Pixel Blast`

**Total Demo Time: ~1 minute**

---

## Future Enhancements

### V2 Features

1. **3D Risk Map**
   - Three.js integration
   - `Orb` component for nodes
   - `Hyperspeed` for connections

2. **Advanced Animations**
   - `Liquid Chrome` for premium features
   - `Prismatic Burst` for celebrations
   - `Galaxy` background for pro tier

3. **Interactive Tutorials**
   - `Flowing Menu` for onboarding
   - `Staggered Menu` for help
   - `Bubble Menu` for quick actions

4. **Enhanced Backgrounds**
   - `Liquid Ether` for loading
   - `Silk` for premium sections
   - `Light Rays` for success states

---

## Documentation

**Design Files:**
- Figma: [Link to Figma]
- Component Library: [Storybook URL]
- Animation Specs: [Motion Handbook]

**Resources:**
- React Bits: https://react-bits.dev
- Color Palette: [Palette Tool]
- Icon Set: [Icon Library]

---

**Version:** 1.0.0  
**Last Updated:** January 30, 2026  
**Status:** Ready for Development

---

## Quick Start for Developers

### Install React Bits Components

```bash
# Install required components
npx shadcn@latest add @react-bits/Shuffle
npx shadcn@latest add @react-bits/ElectricBorder
npx shadcn@latest add @react-bits/LetterGlitch
npx shadcn@latest add @react-bits/CountUp
npx shadcn@latest add @react-bits/SpotlightCard
# ... etc
```

### Import and Use

```tsx
import Shuffle from '@/components/ui/Shuffle';
import ElectricBorder from '@/components/ui/ElectricBorder';

export default function Hero() {
  return (
    <div className="hero">
      <Shuffle text="Bringing your shadow data into the light" />
      <ElectricBorder>
        <button>Connect Your Gmail</button>
      </ElectricBorder>
    </div>
  );
}
```

---

**Ready to build the most visually stunning privacy tool ever created! 🚀**