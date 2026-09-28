# <p align="center">🚩 आरंभ (Aarambha) Tours & Travels</p>
<p align="center">
  <strong>Enterprise-Grade Monorepo for Luxury Pilgrimage Tours, Bus Rentals & Fleet Management</strong>
</p>

<p align="center">
  <a href="https://github.com/Jeeerryyy/Aarambha-Tours-and-Travels"><img src="https://img.shields.io/badge/Production-Live-success?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Status" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2.3-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-CSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas%20Ready-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <img src="https://img.shields.io/badge/Test%20Suite-28%2F28%20Passed-brightgreen?style=for-the-badge&logo=jest" alt="Test Status" />
</p>

---

## 📑 Executive Summary

**आरंभ (Aarambha) Tours & Travels** is a high-performance digital travel and fleet management ecosystem tailored for luxury spiritual tours, outstation journeys, commercial bus rentals, and premium self-drive/chauffeur fleet hire across Maharashtra and pan-India. 

Built with an enterprise monorepo architecture, the platform integrates:
1. **Public Booking Experience (`frontend/website`)**: Apple UI-inspired Next.js 14 web portal with dynamic fare calculation, multi-step booking drawers, instant UPI QR verification, and digital PDF tax invoice generation.
2. **Operations & CRM Portal (`frontend/crm`)**: High-throughput Vite + React administrative suite featuring role-based access control (RBAC), live fleet dispatching, financial reporting, dynamic pricing rules, and real-time audit trails.
3. **Core REST API Engine (`backend`)**: Strict TypeScript Express backend hardened with sliding-window rate limiting, OWASP Top 10 defenses, Zod schema validation, and automatic in-memory failover.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Clients["Digital Client Layer"]
        W["Customer Web App (Next.js 14 App Router :3000)"]
        C["Admin CRM Portal (Vite + React 18 + Tailwind :5173)"]
    end

    subgraph Gateway["Security & Gateway Layer"]
        N["CORS & Helmet Policy Engine"]
        RL["Sliding-Window Rate Limiter"]
        CSRF["CSRF Double-Submit Protection"]
        XSS["Recursive HTML/Script Sanitizer"]
    end

    subgraph API["Backend API Layer (:8000)"]
        AUTH["Multi-Tier RBAC Auth & Session Manager"]
        FARE["Dynamic Fare & Matrix Calculation Engine"]
        BOOK["Booking & Payment State Machine"]
        INV["GST PDF Tax Invoice Generator"]
        AUDIT["Security & Compliance Audit Logger"]
    end

    subgraph Database["Persistence & Schema Layer"]
        MDB[("MongoDB / In-Memory Store")]
        PRISMA[("Prisma Schema Registry")]
    end

    W -->|REST / API v1| N
    C -->|REST / API v1| N
    N --> RL
    RL --> CSRF
    CSRF --> XSS
    XSS --> AUTH
    AUTH --> FARE
    AUTH --> BOOK
    AUTH --> INV
    AUTH --> AUDIT
    FARE --> MDB
    BOOK --> MDB
    INV --> MDB
    AUDIT --> MDB
    MDB <--> PRISMA
```

---

## ✨ Core Capabilities & Features

### 1. 🌐 Customer-Facing Portal (`/frontend/website`)
- **Apple UI Design Philosophy**: Implements SF Pro typography, refined glassmorphism (`backdrop-filter: blur(20px)`), 8pt harmonic layout grid, and natural spring physics.
- **Dynamic Fare Engine**: Accurate computation for local city trips (8h/80km packages, extra km/hr rules), outstation multi-day trips (minimum daily km thresholds, driver allowances), and bus hire.
- **Instant UPI & QR Verification**: Deep links to UPI apps (PhonePe, Google Pay, Paytm, BHIM) with transaction reference tracking and admin verification flow.
- **Client-Side PDF Invoices**: Generates GST-compliant tax invoices with embedded QR codes, dynamic company watermarks, itemized fare breakdown, and one-click download.
- **Generative Engine Optimization (GEO)**: Structured JSON-LD metadata for AI search visibility (`llms.txt`, `ai.txt`, XML sitemaps, OpenGraph & Twitter Cards).

### 2. 📊 Enterprise CRM Admin Portal (`/frontend/crm`)
- **Multi-Role RBAC**: 
  - `Superadmin`: Full configuration, staff creation, financial exports, pricing overrides.
  - `Operations Head`: Dispatch approvals, fleet assignments, booking modifications.
  - `Booking Viewer`: Read-only operational oversight.
- **Real-Time Fleet Management**: Vehicle availability status, maintenance logs, seating configurations (Urbania, Fortuner, Ertiga, Swift, Luxury Buses).
- **Inquiry & Lead Pipeline**: Visual status funnels from inbound inquiry → quotation → deposit → confirmed → dispatched → completed.
- **Security Audit Logs**: Tamper-evident logging of administrative actions, logins, status mutations, and payment overrides with 90-day automatic retention.

### 3. 🛡️ Hardened Backend API (`/backend`)
- **Zero-Trust Security**: 12-round bcrypt password hashing, 5-strike account lockout (15-min cooldown), and instantaneous session termination using `tokenVersion`.
- **Zod Data Sanitization**: Strict input contract enforcement with automated sanitization of all incoming JSON payloads.
- **Fault-Tolerant Persistence**: Dual-mode engine supporting native MongoDB Atlas connections with automatic fallback to high-speed in-memory database during local testing or CI runs.

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Git**: `v2.40+`

### 2. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Jeeerryyy/Aarambha-Tours-and-Travels.git
cd Aarambha-Tours-and-Travels

# Install root, backend, website, and CRM dependencies
npm run install:all
```

### 3. Environment Configuration
Create the corresponding `.env` files using the provided enterprise templates:

```bash
# Backend Environment
cp backend/.env.example backend/.env

# Customer Website Environment
cp frontend/website/.env.example frontend/website/.env.local

# CRM Portal Environment
cp frontend/crm/.env.example frontend/crm/.env
```

### 4. Start All Services Concurrently
```bash
npm run dev
```

| Service | Port | Endpoint URL | Status Healthcheck |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `8000` | [http://localhost:8000](http://localhost:8000) | `GET /api/health` |
| **Customer Website** | `3000` | [http://localhost:3000](http://localhost:3000) | HTTP `200 OK` |
| **CRM Admin Portal** | `5173` | [http://localhost:5173](http://localhost:5173) | HTTP `200 OK` |

---

## 🔐 Default Access Credentials

The database initializes with seed accounts for instant evaluation:

| Role | Email Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@aarambhatravels.in` | `Admin@123` | Full Read, Write, Delete & Configuration |
| **Operations Head** | `admin2@aarambhatravels.in` | `Admin@123` | Operational & Booking Management |
| **Booking Viewer** | `viewer1@aarambhatravels.in` | `Viewer@123` | Read-Only Inspection |

---

## 📡 API Reference Overview

The backend exposes a structured API under `/api` and `/api/v1`:

```
POST   /api/v1/auth/login             # Admin authentication & JWT issue
POST   /api/v1/auth/logout            # Session purge & token invalidate
GET    /api/v1/auth/me                # Active session user inspection

GET    /api/fleet                     # Public fleet catalog & specs
POST   /api/fleet/book                # New car/bus rental reservation
GET    /api/fleet/bookings            # CRM list fleet reservations (Auth)
PATCH  /api/fleet/bookings/:id/status # Update booking lifecycle status

GET    /api/tours                     # Spiritual & holiday packages
POST   /api/tours/book                # Package reservation submission
GET    /api/tours/bookings            # CRM list tour bookings (Auth)

POST   /api/inquiries                 # Submit customer custom quote inquiry
GET    /api/inquiries                 # CRM inquiry review pipeline

GET    /api/settings                  # Fetch agency public configuration
PUT    /api/settings                  # Update payment QR, contact & pricing rules
```

---

## 🧪 Testing & Quality Assurance

The codebase includes an end-to-end integration and security test suite:

```bash
# Run comprehensive integration test suite
cd backend
npm test
```

### Verified Test Matrix:
- `[PASS]` 12-round bcrypt password hash generation and verification
- `[PASS]` Authentication JWT issuance, validation, and rejection on tampering
- `[PASS]` Double-submit CSRF cookie token enforcement
- `[PASS]` XSS & HTML injection payload stripping
- `[PASS]` Strict Zod schema boundary validation on invalid inputs
- `[PASS]` Dynamic distance-matrix fare calculation accuracy
- `[PASS]` 5-strike brute-force account lockout protection

---

## 🚀 Production Deployment

### Docker Containerization
```bash
# Build and orchestrate all containers
docker-compose up -d --build

# Inspect container status
docker-compose ps
```

### Cloud Platform Deployment Guides:
- **Frontend (Website & CRM)**: Optimized for single-click deployment on [Vercel](https://vercel.com) with root directory set to `frontend/website` or `frontend/crm`.
- **Backend API**: Production-ready for [Render](https://render.com), [Railway](https://railway.app), or AWS Elastic Beanstalk using `render.yaml` or Docker container.

---

## 📄 License & Legal Notice

Copyright © 2026 **आरंभ (Aarambha) Tours & Travels**. All rights reserved.  
Unauthorized duplication, distribution, or reverse engineering of this software platform is strictly prohibited.
