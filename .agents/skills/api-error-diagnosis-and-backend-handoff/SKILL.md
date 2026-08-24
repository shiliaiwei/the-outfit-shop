---
name: api-error-diagnosis-and-backend-handoff
description: >
  Mandatory protocol for diagnosing and resolving API endpoint errors, network failures, and data schema mismatches.
  For every API error or missing feature, the agent MUST:
  1. Clearly attribute the issue to Backend, Frontend, or Both.
  2. Explain what needs to be fixed on both sides.
  3. Provide a complete, structured, ready-to-copy prompt text for the backend AI agent/engineer to implement the backend fix.
  Trigger on: "api error", "error code", "status 400", "status 404", "status 422", "status 500", "backend", "frontend", "fix api", "backend prompt", "endpoint", "api flow".
---

# API Error Diagnosis & Backend AI Handoff Protocol

This skill enforces a deterministic workflow for handling all API endpoint errors, schema divergences, and data-flow blockers across the **OUTFIT Luxury E-Commerce & Admin MIS Suite**.

---

## 1. Core Rule & Mandatory Response Flow

Whenever an API error occurs, or whenever a user asks about API endpoints, data synchronization, or CRUD failures:

You **MUST ALWAYS** structure your response following this 3-step format:

```markdown
### 🔍 Issue Breakdown: [Backend | Frontend | Both]
- **Root Cause**: Explanation of why the error occurred.
- **Affected Endpoint**: `METHOD /api/v1/...`
- **Error Code / Status**: HTTP 4xx / 5xx / Network / Schema Mismatch

---

### 🖥️ Frontend Fix Plan
- Explanation of what is updated in the Next.js frontend (UI state, optimistic updates, Zod schema, payload transformation).

---

### 📋 Complete Prompt for Backend Agent / Engineer
(A ready-to-copy, comprehensive markdown block containing all migrations, models, requests, controllers, and JSON envelope standards)
```

---

## 2. HTTP Status Code Diagnostic Matrix

| HTTP Code | Primary Culprit | What Frontend Must Do | What Backend Prompt Must Specify |
| :--- | :--- | :--- | :--- |
| **400 Bad Request** | Both | Check payload format & field types | Detailed validation errors in JSON response |
| **401 Unauthorized** | Both / Auth | Refresh token, redirect to login | Bearer token verification, Sanctum / JWT middleware |
| **403 Forbidden** | Backend / Auth | Show permission toast & disable action | Role & permission gates (`admin`, `staff`, `cashier`) |
| **404 Not Found** | Backend | Graceful empty fallback state | Add missing route & Controller method in `api.php` |
| **405 Method Not Allowed** | Backend / Route | Verify HTTP verb (GET/POST/PATCH/DELETE) | Register missing HTTP verb in `routes/api.php` |
| **409 Conflict** | Both | Show collision toast (e.g. duplicate SKU) | Unique constraint handling & descriptive error key |
| **422 Unprocessable** | Both / Validation | Match form fields with backend validation | Return `{ "errors": { "field": ["message"] } }` |
| **429 Too Many Requests** | Backend / Rate Limit| Exponential backoff & retry | Throttle configuration & RateLimiter headers |
| **500 Server Error** | Backend | Catch error, log trace, optimistic fallback | Database exception handling, null check, server logs |
| **502 / 503 / 504** | Backend / DevOps | Connection retry & offline banner | Service health check, database connection pool |
| **CORS Blocked** | Backend | Proxy via Next.js `/api/...` | Configure `cors.php` with frontend origins & headers |

---

## 3. Mandatory Structure for the Backend AI Prompt

Every generated backend prompt **MUST** be complete and self-contained so that a backend AI agent can execute it with zero ambiguity:

1. **Title & Objective**: Clear summary of the endpoint or fix.
2. **Database Migration**: Complete Laravel Blueprint code (`Schema::table` or `Schema::create`) with column types, lengths, defaults, and foreign keys.
3. **Eloquent Model**: Updated `$fillable`, `$casts`, and relationships.
4. **FormRequest / Validation**: Exact validation rules for store/update.
5. **Controller & Service**: Controller methods (`index`, `show`, `store`, `update`, `destroy`) with database transactions and error handling.
6. **API Resource & Response Envelope**: Exact `{ "data": ... }` response structure matching frontend Zod schemas.
7. **CORS & Route Registration**: Exact line to append to `routes/api.php`.

---

## 4. Mandatory Pre-Push Checkpoint
Always ensure:
1. `cd outfit-shop && npx tsc --noEmit` exits with **0 errors**.
2. Frontend components never hard-crash if the backend endpoint is offline or returning 500. Always provide graceful fallback state.
