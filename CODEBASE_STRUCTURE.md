# Aarambha Tours & Travels Monorepo — Industry-Standard Architecture

> Complete structural documentation mapping all four application codebases within the monorepo.

---

## Executive Architecture Overview

```
Aarambha Tours and Travels/
├── backend/                  # Monolithic backend root containing two microservices
│   ├── app/                  # Python FastAPI service (PostgreSQL + SQLAlchemy async)
│   └── src/                  # Node.js Express service (MongoDB + Mongoose ODM)
├── frontend/                 # Monolithic frontend root
│   ├── crm/                  # Vite + React 18 + TypeScript admin portal (React Router 6)
│   └── website/              # Next.js 14 App Router customer booking platform (src/app layout)
├── scripts/                  # Database migration and initialization SQL scripts
├── CODEBASE_STRUCTURE.md     # Root codebase structure documentation (This file)
└── .gitignore                # Monorepo git ignore rules
```

---

## 1. Backend Node.js Service (`backend/src/`)

**Architecture Pattern**: Controller → Service → Validator Layered Architecture (Mongoose ODM + Express TypeScript)

```
backend/src/
├── @types/
│   └── express.d.ts          # Express Request interface augmentation for authenticated user
├── config/
│   ├── db.ts                 # MongoDB connection manager (mongoose + MongoMemoryServer fallback)
│   └── env.ts                # Environment variable schema validation using Zod
├── controllers/              # HTTP Request/Response handling layer (no database logic)
│   ├── audit.controller.ts   # Analytics and audit log retrieval endpoints
│   ├── auth.controller.ts    # Admin authentication and session endpoints
│   ├── cms.controller.ts     # Content management and blog post endpoints
│   ├── finance.controller.ts # Promo code creation and validation endpoints
│   ├── fleet.controller.ts   # Vehicle categories, vehicles, rental bookings endpoints
│   ├── payment.controller.ts # Razorpay order creation and webhook verification endpoints
│   ├── settings.controller.ts# System settings CRUD endpoints
│   └── tours.controller.ts   # Destinations, tour packages, tour bookings endpoints
├── helpers/                  # Reusable utility helpers
│   ├── pagination.helper.ts  # Mongoose skip/limit pagination calculator
│   └── response.helper.ts    # Standardized API response envelopes
├── middlewares/              # Express middlewares
│   ├── auth.middleware.ts    # JWT token verification, password hashing, audit recorder
│   ├── error.middleware.ts   # Centralized Express error handler
│   └── validate.middleware.ts# Generic Zod request schema validation middleware
├── models/                   # Mongoose ODM Schemas & Data Models
│   ├── fleet.model.ts        # FleetCategory, Vehicle, FleetInquiry, FleetBooking, FleetCustomer, FleetPayment
│   ├── index.ts              # Model barrel export file
│   ├── shared.model.ts       # AdminUser, AuditLog, Setting, PromoCode, CMSContent, BlogPost
│   └── tours.model.ts        # TourDestination, TourPackage, TourInquiry, TourBooking, TourCustomer
├── routes/                   # Express Router definitions (kebab-case)
│   ├── audit.routes.ts       # Router for /api/analytics
│   ├── auth.routes.ts        # Router for /api/auth
│   ├── cms.routes.ts         # Router for /api/cms
│   ├── finance.routes.ts     # Router for /api/finance
│   ├── fleet.routes.ts       # Router for /api/fleet
│   ├── index.ts              # Master barrel route loader
│   ├── payment.routes.ts     # Router for /api/payments
│   ├── settings.routes.ts    # Router for /api/settings
│   └── tours.routes.ts       # Router for /api/tours
├── services/                 # Core Business & Mongoose Persistence Layer
│   ├── audit.service.ts      # Mongoose queries for audit logs
│   ├── auth.service.ts       # Mongoose queries for admin auth & audit
│   ├── cms.service.ts        # Mongoose queries for CMS content & blogs
│   ├── finance.service.ts    # Mongoose queries for promo codes
│   ├── fleet.service.ts      # Mongoose queries & business logic for vehicle rentals
│   ├── payment.service.ts    # Razorpay SDK integration & payment verification logic
│   ├── settings.service.ts   # Mongoose queries for system settings
│   └── tours.service.ts      # Mongoose queries & business logic for tour packages
├── utils/
│   └── seed.ts               # Database seed runner for initial admin & sample data
└── server.ts                 # Express application initialization and HTTP server launcher
```

---

## 2. Backend Python Service (`backend/app/`)

**Architecture Pattern**: Modular Feature-based Architecture with Async SQLAlchemy Service Layer (FastAPI)

```
backend/app/
├── core/                     # Application config and security core
│   ├── config.py             # pydantic-settings configuration
│   └── security.py           # JWT generation, verification, and bcrypt hashing
├── db/                       # Database session and base configuration
│   ├── init_db.py            # Initial database schema setup
│   └── session.py            # Async SQLAlchemy engine and sessionmaker
├── modules/                  # Feature domain modules
│   ├── finance/              # Finance & Promo Codes vertical
│   │   ├── router.py         # FastAPI APIRouter endpoints
│   │   └── service.py        # Async SQLAlchemy queries for promo codes
│   ├── fleet/                # Self-Drive Rental Fleet vertical
│   │   ├── models.py         # SQLAlchemy models (Vehicle, FleetBooking, etc.)
│   │   ├── router.py         # FastAPI APIRouter endpoints
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   └── service.py        # Async SQLAlchemy queries & vehicle rental business logic
│   ├── notifications/        # Email/SMS notification service
│   │   └── service.py        # Transactional notification dispatcher
│   ├── shared/               # Shared cross-domain schemas, models, and auth
│   │   ├── audit_router.py   # Audit log endpoints
│   │   ├── auth_router.py    # Authentication endpoints & audit recorder
│   │   ├── cms_router.py     # CMS endpoints
│   │   ├── models.py         # Shared SQLAlchemy models (AdminUser, AuditLog, PromoCode)
│   │   ├── schemas.py        # Shared Pydantic schemas (AdminUserOut, PromoCodeOut, etc.)
│   │   └── settings_router.py# Settings endpoints
│   └── tours/                # Tours & Travels vertical
│       ├── models.py         # SQLAlchemy models (TourPackage, TourBooking, etc.)
│       ├── router.py         # FastAPI APIRouter endpoints
│       ├── schemas.py        # Pydantic request/response schemas
│       └── service.py        # Async SQLAlchemy queries & tour booking business logic
├── utils/                    # Common python utilities
│   ├── __init__.py           # Package marker
│   └── pagination.py         # Generic async SQLAlchemy pagination helper
└── main.py                   # FastAPI application initialization & middleware registration
```

---

## 3. Frontend CRM Portal (`frontend/crm/`)

**Architecture Pattern**: Domain-Driven Feature & Page Component Architecture (Vite + React 18 + React Router 6)

```
frontend/crm/src/
├── @types/
│   └── index.ts              # Shared TypeScript interfaces (Booking, TourPackage, Vehicle, etc.)
├── api/                      # Domain API HTTP request client functions
│   ├── audit.api.ts          # Audit logs API requests
│   ├── client.ts             # Base fetch wrapper with error handling & health check
│   ├── cms.api.ts            # CMS content & blog API requests
│   ├── finance.api.ts        # Promo code API requests
│   ├── fleet.api.ts          # Vehicle & rental booking API requests
│   ├── settings.api.ts       # System settings API requests
│   └── tours.api.ts          # Tour package & tour booking API requests
├── components/               # UI Component Library
│   ├── common/               # Generic atomic UI components
│   │   ├── Badge.tsx         # Reusable status badge component
│   │   ├── KPICard.tsx       # Stat / KPI summary card
│   │   ├── Loader.tsx        # Loading spinner
│   │   └── Modal.tsx         # Reusable modal overlay dialog
│   └── layout/               # Application shell components
│       ├── Sidebar.tsx       # Sidebar navigation with active vertical scope toggle
│       └── Topbar.tsx        # Top header with page title and API status indicator
├── context/
│   └── AuthContext.tsx       # Auth & vertical scope React context provider
├── hooks/
│   └── useAuth.ts            # Custom hook consuming AuthContext
├── pages/                    # Route-level Page Components
│   ├── Audit/
│   │   └── AuditView.tsx     # System audit trail logs page
│   ├── Bookings/
│   │   └── BookingsView.tsx  # Master bookings table & lifecycle action modal
│   ├── CMS/
│   │   └── CMSView.tsx       # Blog post & CMS content management page
│   ├── Dashboard/
│   │   └── Dashboard.tsx     # KPI summary & quick action dashboard
│   ├── Finance/
│   │   └── FinanceDashboard.tsx # Promo code management page
│   ├── Fleet/
│   │   └── FleetList.tsx     # Vehicle inventory CRUD page
│   ├── Inquiries/
│   │   └── InquiriesView.tsx # Lead funnel & customer inquiry table
│   ├── Settings/
│   │   └── Settings.tsx      # System settings configuration page
│   ├── Staff/
│   │   └── StaffView.tsx     # Staff & role management page
│   └── Tours/
│       └── ToursList.tsx     # Tour package CRUD page
├── routes/                   # Routing configuration
│   ├── AppRoutes.tsx         # React Router 6 route table definitions
│   └── ProtectedRoute.tsx    # Authentication route guard wrapper
├── templates/
│   └── DashboardLayout.tsx   # Shell layout combining Sidebar, Topbar, and Outlet
├── themes/
│   └── tokens.ts             # Tailwind palette color constants
├── utils/                    # Formatting & utility functions
│   ├── formatCurrency.ts     # INR currency formatter (₹)
│   ├── formatDate.ts         # Date and DateTime formatters
│   └── statusColor.ts        # Booking status to badge color mapping
├── App.tsx                   # Root entrypoint (<BrowserRouter> -> <AuthProvider> -> <AppRoutes>)
└── main.tsx                  # React DOM root render launcher
```

---

## 4. Frontend Customer Website (`frontend/website/`)

**Architecture Pattern**: Next.js 14 App Router with Layered `src/` Directory Architecture

```
frontend/website/src/
├── app/                      # Next.js App Router Page Directory
│   ├── car-rentals/          # Self-Drive Rental vertical pages
│   │   ├── [id]/
│   │   │   └── page.tsx      # Vehicle rental detail & Razorpay deposit booking page
│   │   └── page.tsx          # Vehicle fleet catalog page
│   ├── tours-travels/        # Tours & Travels vertical pages
│   │   ├── [slug]/
│   │   │   └── page.tsx      # Tour package detail & Razorpay deposit booking page
│   │   └── page.tsx          # Tour packages catalog page
│   ├── globals.css           # Global Tailwind CSS styles and animations
│   ├── layout.tsx            # Root layout wrapper with metadata
│   └── page.tsx              # Main customer landing page
├── components/               # Categorized Reusable UI Components
│   ├── booking/              # Booking workflow components
│   │   ├── BookingSteps.tsx  # Step indicator bar for booking flow
│   │   ├── Invoice.tsx       # Printable booking deposit invoice modal component
│   │   └── RentalAgreement.tsx # Self-drive rental agreement document component
│   ├── layout/               # Global website layout components
│   │   ├── Footer.tsx        # Customer site footer
│   │   └── Navbar.tsx        # Global navigation bar with vertical links
│   └── shared/               # Shared domain components
│       └── TourTerms.tsx     # Tour package terms and conditions modal component
├── constants/
│   └── routes.ts             # Route path constants
├── context/
│   └── BookingContext.tsx    # Customer booking state context provider
├── hooks/
│   └── useBooking.ts         # Hook consuming BookingContext
├── services/                 # API Client & Domain Services
│   ├── api-client.ts         # Base fetch wrapper with API URL configuration
│   ├── fleet.service.ts      # Vehicle catalog & inquiry API calls
│   └── tours.service.ts      # Tour package & inquiry API calls
├── types/
│   └── index.ts              # Customer website TypeScript interfaces
└── utils/
    └── formatCurrency.ts     # INR currency formatter
```
