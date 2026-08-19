# Aarambha Customer Website

Customer booking web application built with **Next.js 14 App Router + React 18 + Tailwind CSS**.

---

## Folder Structure & Purpose

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router route hierarchy (`car-rentals/`, `tours-travels/`, `page.tsx`, `layout.tsx`). |
| `src/components/layout/` | Navigation and layout components (`Navbar.tsx`, `Footer.tsx`). |
| `src/components/booking/` | Booking flow components (`BookingSteps.tsx`, `Invoice.tsx`, `RentalAgreement.tsx`). |
| `src/components/shared/` | Shared domain modal components (`TourTerms.tsx`). |
| `src/services/` | API HTTP request client services (`api-client.ts`, `tours.service.ts`, `fleet.service.ts`). |
| `src/context/` | Customer booking state context (`BookingContext.tsx`). |
| `src/hooks/` | Custom hooks (`useBooking.ts`). |
| `src/constants/` | Application route constants (`routes.ts`). |
| `src/types/` | Customer website TypeScript interfaces (`index.ts`). |
| `src/utils/` | Formatting helpers (`formatCurrency.ts`). |

---

## Development Setup

```bash
cd frontend/website
npm install
npm run dev      # Start Next.js dev server on http://localhost:3000
npm run build    # Build Next.js production bundle
```
