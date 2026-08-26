# 🚀 MASTER PROJECT BLUEPRINT & ARCHITECTURE SPECIFICATION
## Enterprise Tours, Travels & Self-Drive Fleet Rental Platform

> **Version:** 2.0.0 (Production-Grade)  
> **Target Stack:** Next.js 14 (App Router) + React 18 (Vite CRM) + Node.js Express (TypeScript) + MongoDB Atlas / Local JSON Hybrid Store + Razorpay + TailwindCSS  
> **Domain:** Travel, Tourism, Car Rentals, Self-Drive Fleet & Outstation Bus Charters

---

## 📋 TABLE OF CONTENTS
1. [Cloning & Re-branding Quickstart Guide](#1-cloning--re-branding-quickstart-guide)
2. [High-Level Architecture & Tech Stack](#2-high-level-architecture--tech-stack)
3. [Design System & Theme Tokens](#3-design-system--theme-tokens)
4. [Complete Data Models & Schemas (TypeScript + Mongoose)](#4-complete-data-models--schemas-typescript--mongoose)
5. [Zod Validation Schemas & Sanitization](#5-zod-validation-schemas--sanitization)
6. [API Route Directory & Controller Matrix](#6-api-route-directory--controller-matrix)
7. [Core Business Workflows & State Machines](#7-core-business-workflows--state-machines)
   - 7.1 Customer Booking & Inquiry Workflow
   - 7.2 Dual-Rail Payment Engine (Razorpay + Offline UTR)
   - 7.3 Interactive WhatsApp Booking Dispatch Engine
   - 7.4 Security Deposit, Vehicle Handover & Return Workflow
8. [Security & Production Hardening Architecture](#8-security--production-hardening-architecture)
9. [Legal & Compliance Suite](#9-legal--compliance-suite)
10. [Environment Variables & Deployment Guide](#10-environment-variables--deployment-guide)

---

## 1. Cloning & Re-branding Quickstart Guide

To adapt this entire codebase for a new client in under 15 minutes, perform the following global variable substitutions:

### 🔄 Variable Substitution Matrix

| Placeholder Variable | Example / Default | Description |
| :--- | :--- | :--- |
| `{{BRAND_NAME}}` | `Aarambha Travels` | Client English Brand Name |
| `{{BRAND_NAME_NATIVE}}` | `आरंभ` | Native / Vernacular Brand Script |
| `{{TAGLINE}}` | `Your Journey, Your Car, Your Way` | Slogan / Primary Tagline |
| `{{PRIMARY_COLOR}}` | `#5266EB` (Electric Indigo) | Primary Brand Accent Color |
| `{{SECONDARY_COLOR}}` | `#D3592B` (Warm Ochre) | Secondary Brand Color |
| `{{DARK_BG_COLOR}}` | `#171721` (Onyx Slate) | Hero & Admin Dark Canvas |
| `{{LIGHT_BG_COLOR}}` | `#FAFAFC` (Ghost White) | Website Light Body Background |
| `{{CLIENT_EMAIL}}` | `support@aarambhatravels.in` | Customer Support Email |
| `{{SECURITY_EMAIL}}` | `security@aarambhatravels.in`| Vulnerability / Legal Email |
| `{{SUPPORT_PHONE}}` | `+91 98765 43210` | Primary WhatsApp / Call Number |
| `{{OFFICE_LOCATION}}` | `Pune, Maharashtra, India` | Operational Headquarters |
| `{{BASE_DOMAIN}}` | `aarambhatravels.in` | Production Web Domain |
| `{{API_DOMAIN}}` | `api.aarambhatravels.in` | Backend API Domain |
| `{{CRM_DOMAIN}}` | `admin.aarambhatravels.in` | CRM Admin Domain |

---

## 2. High-Level Architecture & Tech Stack

```
                               ┌─────────────────────────────────────────┐
                               │             END CUSTOMER                │
                               └────────────────────┬────────────────────┘
                                                    │
                   ┌────────────────────────────────┴────────────────────────────────┐
                   ▼                                                                 ▼
    ┌─────────────────────────────┐                                   ┌─────────────────────────────┐
    │     CUSTOMER WEBSITE        │                                   │       ADMIN CRM PANEL       │
    │  (Next.js 14 App Router)    │                                   │   (Vite + React 18 + TS)    │
    │  • Public Showcase          │                                   │  • Interactive Bookings     │
    │  • Tours & Self-Drive Fleet │                                   │  • WhatsApp Dispatch Modal  │
    │  • Booking Checkout Modal   │                                   │  • Fleet & Inventory Matrix │
    │  • My Bookings Sync         │                                   │  • Financial Audit & PnL    │
    │  • 10+ Legal Policies Suite │                                   │  • Role-Based Access (RBAC) │
    └──────────────┬──────────────┘                                   └──────────────┬──────────────┘
                   │                                                                 │
                   └────────────────────────────────┬────────────────────────────────┘
                                                    │ REST API + JSON
                                                    ▼
                                   ┌─────────────────────────────────┐
                                   │       EXPRESS BACKEND API       │
                                   │     (Node.js + TypeScript)      │
                                   │  • Rate Limiting & Abuse Shield │
                                   │  • Deep XSS & Script Sanitizer  │
                                   │  • HMAC Payment Verifier        │
                                   │  • IDOR Ownership Enforcer      │
                                   │  • Structured Audit Logger      │
                                   └────────────────┬────────────────┘
                                                    │
                   ┌────────────────────────────────┴────────────────────────────────┐
                   ▼                                                                 ▼
    ┌─────────────────────────────┐                                   ┌─────────────────────────────┐
    │     MONGODB ATLAS (DB)      │                                   │     LOCAL JSON FALLBACK     │
    │  • Collections: Users,      │                                   │  • Auto-bootstrapped in dev │
    │    Admins, Tours, Fleet,    │                                   │  • `localStore.ts` engine   │
    │    Bookings, Inquiries,     │                                   │  • Persistent `local_db.json│
    │    Finance, AuditLogs       │                                   │    zero-config development  │
    └─────────────────────────────┘                                   └─────────────────────────────┘
```

### 🛠️ Technology Choices
- **Frontend (Website):** Next.js 14 App Router, TailwindCSS, Lucide Icons, Framer Motion animations.
- **Frontend (CRM):** React 18 (Vite SPA), TailwindCSS, Chart.js / Recharts, WhatsApp URI protocol builder.
- **Backend API:** Node.js, Express, TypeScript, Zod, Mongoose, bcryptjs, jsonwebtoken, cors.
- **Payment Gateway:** Razorpay Standard Checkout + Webhook HMAC SHA256 Signature Verification + Offline Manual Bank Transfer (NEFT/IMPS/UPI UTR).

---

## 3. Design System & Theme Tokens

### 🎨 Color Palettes
```css
/* Website Theme (Vibrant Light with Dark Accents) */
--primary: #5266EB;        /* Primary Indigo */
--primary-hover: #3E51D4;
--secondary: #D3592B;      /* Warm Terracotta / Ochre */
--bg-light: #FAFAFC;       /* Canvas background */
--surface-white: #FFFFFF;  /* Cards / Modals */
--text-primary: #111111;
--text-muted: #6B7280;

/* Admin CRM Theme (Sleek High-Contrast Dark Canvas) */
--crm-bg: #0F0F17;         /* Deep Onyx Base */
--crm-card: #171725;       /* Elevated Surface */
--crm-border: #242436;     /* Subtle Grid Borders */
--crm-text-bright: #EDEDF3;
--crm-text-dim: #9496B8;
--crm-accent-blue: #5266EB;
--crm-accent-green: #10B981;
--crm-accent-amber: #F59E0B;
--crm-accent-red: #EF4444;
```

### 🔤 Typography Stack
- **Headings & Badges:** `Syne`, `Outfit`, `Plus Jakarta Sans` (Extrabold, Bold)
- **Body & Legal Copy:** `Inter`, `Roboto`, `Outfit` (Regular 400, Medium 500)
- **Vernacular Script:** `Rozha One`, `Amita`, `Gotu`, `Mukta`

---

## 4. Complete Data Models & Schemas (TypeScript + Mongoose)

### 4.1 Shared Models (`shared.model.ts`)

```typescript
// ─── ADMIN USER ─────────────────────────────────────────────────────────────
export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string; // bcrypt 12 rounds
  role: 'superadmin' | 'viewer' | 'finance_admin' | 'fleet_manager';
  isActive: boolean;
  tokenVersion: number; // for instant multi-device session revocation
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── CUSTOMER USER ──────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── AUDIT LOG ──────────────────────────────────────────────────────────────
export interface IAuditLog {
  _id: string;
  actorId?: string;
  actorName: string;
  action: string;             // e.g., 'LOGIN_SUCCESS', 'IDOR_ACCESS_BLOCKED'
  targetType: string;         // e.g., 'booking', 'vehicle', 'user'
  targetId?: string;
  ipAddress: string;
  details?: Record<string, any>;
  createdAt: Date;
}
```

### 4.2 Tours & Travel Models (`tours.model.ts`)

```typescript
// ─── TOUR PACKAGE ───────────────────────────────────────────────────────────
export interface ITourPackage {
  _id: string;
  slug: string;               // Unique URL slug (e.g., 'spiti-valley-7d')
  title: string;
  description: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;          // Total per-person package cost (INR)
  depositPrice: number;       // Booking advance required (INR)
  datesLabel?: string;        // e.g., "Every Friday Departures"
  destinationId?: string;
  images: string[];
  inclusions: string[];
  exclusions?: string[];
  batchDates?: Array<{ date: string; seatsAvailable: number }>;
  itineraries: Array<{
    dayNumber: number;
    title: string;
    description: string;
    meals?: string;
    stayDetails?: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── TOUR BOOKING ───────────────────────────────────────────────────────────
export interface ITourBooking {
  _id: string;
  bookingCode: string;        // Short reference (e.g., 'TR-89241')
  userId?: string;            // Logged-in user ID (for ownership checks)
  packageId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  paxCount: number;
  totalAmount: number;
  depositAmount: number;
  dueAmount: number;          // totalAmount - depositAmount
  paymentType: 'online' | 'offline_utr' | 'cash';
  paymentStatus: 'pending' | 'verified' | 'failed' | 'refunded';
  bookingStatus: 'pending_verification' | 'confirmed' | 'cancelled' | 'completed';
  utrNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  specialRequests?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── TOUR INQUIRY ───────────────────────────────────────────────────────────
export interface ITourInquiry {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageId?: string;
  travelDate?: string;
  paxCount: number;
  notes?: string;
  status: 'new' | 'contacted' | 'converted' | 'dropped';
  createdAt: Date;
}
```

### 4.3 Self-Drive Fleet & Bus Rental Models (`fleet.model.ts` & `bus.model.ts`)

```typescript
// ─── VEHICLE (CAR / BIKE) ───────────────────────────────────────────────────
export interface IVehicle {
  _id: string;
  name: string;               // e.g., 'Mahindra Thar 4x4 Diesel'
  regNumber: string;          // Registration Number (e.g., 'MH 12 AB 1234')
  categoryId: string;
  vehicleType: 'car' | 'bike';
  transmission: 'manual' | 'automatic';
  fuelType: 'petrol' | 'diesel' | 'electric';
  seatingCapacity: number;
  dailyRate: number;          // Per 24-hour rate (INR)
  securityDeposit: number;    // Refundable deposit (INR)
  images: string[];
  specs: Record<string, string | number | boolean>;
  status: 'available' | 'booked' | 'maintenance';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── FLEET BOOKING ──────────────────────────────────────────────────────────
export interface IFleetBooking {
  _id: string;
  bookingCode: string;        // e.g., 'FL-49120'
  userId?: string;            // Customer ownership verification ID
  vehicleId?: string;
  busId?: string;
  serviceType: 'fleet' | 'bus';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDatetime: string;     // ISO timestamp or localized date string
  dropoffDatetime: string;
  licenseNumber?: string;     // Customer Driving License Number
  licensePhotoUrl?: string;   // S3/Cloudinary/Local URL
  totalRentalAmount: number;
  depositAmount: number;
  pickupOdometer?: number;
  returnOdometer?: number;
  vehicleStatus: 'reserved' | 'picked_up' | 'returned' | 'cancelled';
  depositStatus: 'pending' | 'held' | 'refunded' | 'partially_retained';
  refundedDepositAmount?: number;
  damageDeduction?: number;
  damageNotes?: string;
  paymentType: 'online' | 'offline_utr' | 'cash';
  paymentStatus: 'pending' | 'verified' | 'failed' | 'refunded';
  utrNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 5. Zod Validation Schemas & Sanitization

### 5.1 Deep HTML & Script Sanitization Middleware (`validate.middleware.ts`)
Before any request enters Zod validation, the middleware recursively sanitizes all strings:
- Strips `<script>` tags, inline event listeners (`onclick=`, `onerror=`), `<iframe>`, `<object>`, `javascript:` URIs, and `\x00` null-bytes.

### 5.2 Key Zod Schemas (`booking.validator.ts`)

```typescript
import { z } from 'zod';

const phoneRegex = /^[+\d][\d\s\-().]{6,18}$/;
const nameRegex = /^[a-zA-Z\u0900-\u097F\s'.,-]+$/; // English + Devanagari

export const createTourBookingSchema = z.object({
  customerName: z.string().trim().min(2).max(100).regex(nameRegex),
  customerEmail: z.string().trim().email().max(254).toLowerCase(),
  customerPhone: z.string().trim().min(7).max(20).regex(phoneRegex),
  packageId: z.string().trim().max(100).optional(),
  travelDate: z.string().trim().max(50).optional(),
  paxCount: z.number().int().min(1).max(100).optional(),
  utrNumber: z.string().trim().min(6).max(30).regex(/^[a-zA-Z0-9\-_]+$/).optional(),
  depositAmount: z.number().min(0).max(10000000).optional(),
  totalAmount: z.number().min(0).max(10000000).optional(),
  razorpay_order_id: z.string().trim().max(100).optional(),
  razorpay_payment_id: z.string().trim().max(100).optional(),
  razorpay_signature: z.string().trim().max(200).optional(),
  specialRequests: z.string().trim().max(1000).optional(),
});

export const syncStatusSchema = z.object({
  codes: z.array(z.string().trim().min(3).max(50)).max(20).optional(),
  email: z.string().trim().email().max(254).toLowerCase().optional(),
}).refine(data => (data.codes && data.codes.length > 0) || data.email, {
  message: 'Either booking codes array or email is required to sync status',
});
```

---

## 6. API Route Directory & Controller Matrix

### 6.1 Authentication (`/api/auth`)
| Method | Route | Access | Rate Limit | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | 3/hr/IP | Customer registration with auto-verification |
| `POST` | `/api/auth/login` | Public | 5/15m/IP | Customer login (returns 24h JWT) |
| `POST` | `/api/auth/verify-email` | Public | 5/15m/IP | Verify account with 32-byte token |
| `POST` | `/api/auth/forgot-password` | Public | 3/15m/IP | Send password reset token |
| `POST` | `/api/auth/reset-password` | Public | 3/15m/IP | Reset password & invalidate old tokens |
| `GET` | `/api/auth/me` | Authenticated | Standard | Fetch logged-in user profile |

### 6.2 Tours & Travels (`/api/tours`)
| Method | Route | Access | Rate Limit | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tours/packages` | Public | Standard | List all published tour packages |
| `GET` | `/api/tours/packages/:slug`| Public | Standard | Get package details with full itineraries |
| `POST` | `/api/tours/inquiries` | Public | 5/30m/IP | Submit tour inquiry |
| `POST` | `/api/tours/bookings` | Public | 10/hr/IP | Create tour booking (online/UTR) |
| `POST` | `/api/tours/bookings/sync-status` | Public | 20/min/IP | Customer status sync (anti-enumeration) |
| `GET` | `/api/tours/bookings` | Admin | Standard | List all tour bookings (filtered) |
| `PUT` | `/api/tours/bookings/:id/verify` | SuperAdmin | Standard | Verify payment and confirm booking |
| `DELETE`| `/api/tours/bookings/:id` | SuperAdmin | Standard | Delete / Cancel booking record |

### 6.3 Self-Drive Fleet & Bus Rentals (`/api/fleet`)
| Method | Route | Access | Rate Limit | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/fleet/vehicles` | Public | Standard | List available self-drive cars/bikes |
| `GET` | `/api/fleet/vehicles/:id`| Public | Standard | Get vehicle specifications |
| `POST` | `/api/fleet/bookings` | Public | 10/hr/IP | Create self-drive/bus booking |
| `POST` | `/api/fleet/bookings/sync-status` | Public | 20/min/IP | Sync fleet booking status |
| `GET` | `/api/fleet/bookings` | Admin | Standard | List all fleet bookings |
| `PUT` | `/api/fleet/bookings/:id/pickup` | SuperAdmin | Standard | Record vehicle handover & starting KM |
| `PUT` | `/api/fleet/bookings/:id/return` | SuperAdmin | Standard | Record return, inspect, calculate damages |
| `PUT` | `/api/fleet/bookings/:id/refund` | SuperAdmin | Standard | Process security deposit refund |

### 6.4 Payments (`/api/payments`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-order` | Public | Create Razorpay order (INR amount) |
| `POST` | `/api/payments/verify` | Public | Verify Razorpay HMAC-SHA256 signature |

---

## 7. Core Business Workflows & State Machines

### 7.1 Customer Booking & Inquiry Workflow

```
Customer browses Tour / Car -> Clicks "Book Now"
  ├─ Selects Travel Date / Pickup-Dropoff Dates
  ├─ Enters Customer Name, Email, Phone, License (if Car)
  ├─ Selects Payment Method:
  │   ├─ [Rail A: Razorpay Checkout] -> Pays Advance -> Razorpay Order Created -> Payment Success -> Verified
  │   └─ [Rail B: Manual Bank Transfer] -> Displays Company QR / UPI / NEFT -> Enters UTR Number -> Status: Pending
  └─ Receives instant booking code (e.g. TR-92140 / FL-48192)
```

### 7.2 Dual-Rail Payment Engine
1. **Razorpay Pipeline:**
   - Client sends amount to `/api/payments/create-order`.
   - Server creates order via Razorpay SDK with secure receipt ID.
   - Client opens Razorpay Modal. On success, receives `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.
   - Backend performs constant-time HMAC SHA-256 verification using `crypto.timingSafeEqual`.
2. **Offline UTR Pipeline:**
   - Client pays via Bank App / UPI and pastes the 12-digit UTR.
   - Booking marked as `paymentStatus: 'pending'`, `bookingStatus: 'pending_verification'`.
   - Admin CRM displays highlighted "Verify UTR" action button.

### 7.3 Interactive WhatsApp Booking Dispatch Engine (`WhatsAppBookingModal.tsx`)

When an Admin clicks **"WhatsApp / Share Details"** on any booking row:
1. **In-App Modal Opens:** Does NOT redirect directly. Displays customer summary, vehicle/tour thumbnail, dates, and amounts.
2. **Vertical Isolation:** If the booking is `tours`, ONLY Tour templates are visible. If `fleet` or `bus`, ONLY Rental templates appear.
3. **Template Engine:** Dynamically parses 15+ tokens in real-time:
   `{{customer_name}}`, `{{booking_code}}`, `{{service_name}}`, `{{start_date}}`, `{{end_date}}`, `{{total_amount}}`, `{{deposit_amount}}`, `{{due_amount}}`, `{{pickup_location}}`, `{{support_phone}}`.
4. **Editable Preview:** Admin can review and edit every word before sending.
5. **Recipient Routing:** Automatically defaults to the customer's phone number with an option to enter a custom emergency number.
6. **Dispatch:** Clicking **"🟢 Open in WhatsApp & Send"** executes:
   - Mobile: `whatsapp://send?phone=...&text=...` (Native App)
   - Desktop: `https://web.whatsapp.com/send?phone=...&text=...` (Web App)

### 7.4 Security Deposit, Vehicle Handover & Return State Machine

```
[Reserved] 
   │ (Admin clicks "Mark Picked Up" -> Records start KM & inspects license)
   ▼
[Picked Up]
   │ (Customer returns vehicle -> Admin clicks "Mark Returned")
   ▼
[Returned] 
   │ (Inspect damage / fuel levels / late return hours)
   ▼
[Deposit Refund Calculation]
   ├─ If 0 Damage: Deposit Status = 'refunded' (100% returned via original payment)
   └─ If Damage/Deduction: Deposit Status = 'partially_retained', refund balance
```

---

## 8. Security & Production Hardening Architecture

The application implements a **4-Tier Defense-in-Depth Architecture**:

1. **Secure Deployment & Monitoring:**
   - `trust proxy: 1` configured for accurate IP tracking behind Render / Cloudflare / Nginx.
   - `X-Powered-By` header stripped.
   - Helmet-grade security headers on every response (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`).
   - Scanner Bot & Probe blocking (sqlmap, nikto, dirbuster, path-traversal probes blocked with 403).
   - Structured JSON audit logging (`logger.middleware.ts`).
2. **Abuse & Bot Protection (Sliding-Window Rate Limiters):**
   - General API: 120 req/min
   - Login: 5 attempts/15 min/IP + Email
   - Registration: 3 accounts/hr/IP
   - Booking Creation: 10 bookings/hr/IP
   - Inquiries: 5 inquiries/30 min/IP
   - Status Sync: 20 req/min/IP (Anti-enumeration protection)
3. **Secrets Protection:**
   - Production **fail-fast boot check** in `config/env.ts`. Server refuses to start if `SECRET_KEY` is missing or uses weak default strings.
   - Database credentials & API keys excluded from version control via strict `.gitignore`.
4. **Input Validation & IDOR Ownership Enforcing:**
   - Deep HTML sanitizer strips scripts before Zod parsing.
   - Controller & Service layer verifies `req.user._id === resource.userId` before returning booking details. SuperAdmin can view all.

---

## 9. Legal & Compliance Suite

The website includes a complete, production-grade legal suite accessible via the **Legal Hub (`/legal`)**:

1. **Privacy Policy (`/legal/privacy-policy`)** — IT Act 2000, GDPR alignment, DPO contact.
2. **Refund & Cancellation Policy (`/legal/refund-policy`)** — Tiered refund schedules for tours, rentals, bus charters, and deposit timelines.
3. **Cookie Policy (`/legal/cookie-policy`)** — Detailed cookie audit + granular preference toggles.
4. **Disclaimer (`/legal/disclaimer`)** — Weather variances, road hazards, vehicle substitution terms.
5. **Accessibility Statement (`/legal/accessibility`)** — WCAG 2.1 AA roadmap + WhatsApp assisted bookings.
6. **Security Policy (`/legal/security-policy`)** — AES-256, bcrypt, TLS 1.2, 72h breach SLA.
7. **Responsible Disclosure (`/legal/responsible-disclosure`)** — Safe harbor bug reporting framework.
8. **Acceptable Use Policy (`/legal/acceptable-use`)** — Anti-scraping, chargeback fraud penalties.
9. **Community Guidelines (`/legal/community-guidelines`)** — Review integrity, driver respect, no smoking/alcohol rules.
10. **Data Processing Agreement (`/legal/data-processing`)** — B2B Controller/Processor terms.
11. **Cookie Consent Banner (`CookieConsentBanner.tsx`)** — Glassmorphic bottom banner with **Accept All**, **Essential Only**, and **Manage Preferences** drawer (persisted in `localStorage` for 6 months).

---

## 10. Environment Variables & Deployment Guide

### 📄 `.env` Configuration Template

```bash
# ------------------------------------------------------------------------------
# 1. BACKEND (.env)
# ------------------------------------------------------------------------------
PORT=8000
NODE_ENV=production

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aarambha_prod?retryWrites=true&w=majority

# Cryptographically random JWT secret (min 32 chars)
SECRET_KEY=generate_with_crypto_randomBytes_64_hex

# Allowed Frontend Origins (Comma-separated)
CORS_ORIGIN=https://aarambhatravels.in,https://admin.aarambhatravels.in

# Razorpay Live / Test Credentials
RAZORPAY_TOURS_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_TOURS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_FLEET_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_FLEET_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# ------------------------------------------------------------------------------
# 2. WEBSITE (frontend/website/.env.local)
# ------------------------------------------------------------------------------
NEXT_PUBLIC_API_URL=https://api.aarambhatravels.in

# ------------------------------------------------------------------------------
# 3. CRM ADMIN PORTAL (frontend/crm/.env)
# ------------------------------------------------------------------------------
VITE_API_URL=https://api.aarambhatravels.in
```

### 🚀 Production Deployment Commands

1. **Backend (Render / Railway / VPS):**
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

2. **Customer Website (Vercel / AWS Amplify):**
   ```bash
   cd frontend/website
   npm install
   npm run build
   npm start
   ```

3. **CRM Portal (Vercel / Netlify / Cloudflare Pages):**
   ```bash
   cd frontend/crm
   npm install
   npm run build
   # Deploy output folder: dist/
   ```

---

## 🏁 Summary: How to Prompt Any AI Agent Using This File

When starting a new project for another client, simply paste this prompt:

> *"Act as a Principal Full-Stack Engineer. Read the attached `MASTER_PROJECT_BLUEPRINT.md`. I want to build an identical website, CRM admin panel, and Express/MongoDB backend for my client: **[Client Name]** operating in **[City, State]**. Use the Primary Color **[#Hex]**, Secondary Color **[#Hex]**, Support Email **[Email]**, and Support Phone **[Phone]**. Follow all data models, Zod validators, WhatsApp dispatch logic, dual-rail payments, security middlewares, and legal hub pages specified in the blueprint."*
