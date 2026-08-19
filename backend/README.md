# Aarambha Monorepo — Backend Services

This directory contains the two backend services powering Aarambha Tours & Travels:

1. **Node.js Express TypeScript Service (`backend/src/`)**: MongoDB persistence using Mongoose ODM.
2. **Python FastAPI Service (`backend/app/`)**: PostgreSQL persistence using async SQLAlchemy.

---

## Folder Structure & Purpose

### 1. Node.js Express Service (`backend/src/`)

| Folder / File | Purpose |
|---|---|
| `controllers/` | HTTP request/response handlers. Extracts input, invokes service, formats response. |
| `services/` | Core business logic and Mongoose ODM database queries (`.find()`, `.create()`, `.save()`). |
| `validators/` | Input validation schemas using Zod. |
| `routes/` | Kebab-case route definitions with `routes/index.ts` barrel loader. |
| `middlewares/` | Express middlewares (`auth.middleware.ts`, `error.middleware.ts`, `validate.middleware.ts`). |
| `models/` | Mongoose schemas (`shared.model.ts`, `tours.model.ts`, `fleet.model.ts`). |
| `config/` | Database (`db.ts`) and environment validation (`env.ts`). |
| `helpers/` | Reusable utilities (`response.helper.ts`, `pagination.helper.ts`). |
| `server.ts` | Main Express server entrypoint. |

### 2. Python FastAPI Service (`backend/app/`)

| Folder / File | Purpose |
|---|---|
| `modules/tours/` | Tour package catalog, inquiries, and booking service (`service.py`) + router (`router.py`). |
| `modules/fleet/` | Self-drive rental vehicle catalog, inquiries, booking lifecycle service + router. |
| `modules/finance/` | Promo code creation and validation service + router. |
| `modules/shared/` | Shared authentication, audit logs, CMS, and system settings routers. |
| `core/` | pydantic-settings config and JWT security helpers. |
| `db/` | Async SQLAlchemy engine and session initializer. |
| `utils/` | Common Python helpers (`pagination.py`). |
| `main.py` | FastAPI application root. |

---

## Development Setup

### Node.js Backend
```bash
cd backend
npm install
npm run dev      # Runs via ts-node-dev
npm run build    # Compiles TypeScript to dist/
```

### Python Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
