# Aarambha CRM Admin Portal

Admin management portal built with **Vite + React 18 + TypeScript + React Router 6**.

---

## Folder Structure & Purpose

| Directory | Purpose |
|---|---|
| `src/api/` | HTTP request client functions for each domain (`tours.api.ts`, `fleet.api.ts`, `finance.api.ts`, `audit.api.ts`, etc.). |
| `src/components/common/` | Generic atomic UI components (`Badge.tsx`, `Modal.tsx`, `KPICard.tsx`, `Loader.tsx`). |
| `src/components/layout/` | Shell layout components (`Sidebar.tsx`, `Topbar.tsx`). |
| `src/context/` | Global React context (`AuthContext.tsx` handling active vertical scope and API status). |
| `src/hooks/` | Custom hooks (`useAuth.ts`). |
| `src/pages/` | Route page components (`Dashboard/`, `Bookings/`, `Tours/`, `Fleet/`, `Inquiries/`, `Finance/`, `CMS/`, `Audit/`, `Settings/`, `Staff/`). |
| `src/routes/` | React Router 6 route definitions (`AppRoutes.tsx`) and authentication guard (`ProtectedRoute.tsx`). |
| `src/templates/` | Shell template wrapper (`DashboardLayout.tsx`). |
| `src/themes/` | Design system tokens and color constants (`tokens.ts`). |
| `src/utils/` | Utility formatters (`formatCurrency.ts`, `formatDate.ts`, `statusColor.ts`). |

---

## Development Setup

```bash
cd frontend/crm
npm install
npm run dev      # Start Vite dev server on http://localhost:5173
npm run build    # Type-check and build production bundle
```
