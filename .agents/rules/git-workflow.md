# OUTFIT Git Push, Merge & CI/CD Checkpoint Governance Rule

## 🛑 Golden Directive: Pre-Push & Pre-Merge Mandatory Checkpoint

**NEVER PUSH OR MERGE TO ANY BRANCH/REMOTE WITHOUT PASSING THE FULL LOCAL CI/CD CHECKPOINT SUITE FIRST.**

Every push triggers the GitHub Actions **OUTFIT Haute Atelier CI/CD & Deploy Pipeline** (`Typecheck, Audit & Build`) and Vercel Edge Deployment. A single failing type error or unbuilt route breaks production.

---

## 🛡️ Mandatory 3-Step Verification Checkpoint

Before running `git push` or `git merge` anywhere:

### 1. Checkpoint 1: Strict TypeScript Typecheck (`npx tsc --noEmit`)
Must run in `outfit-shop/`:
```bash
cd outfit-shop && npx tsc --noEmit
```
- **Requirement**: **0 errors**. No implicit `any`, no missing interface properties, no untyped handler params, and no missing `@tanstack/react-query` or external declarations.

### 2. Checkpoint 2: Next.js Production Build Audit (`npm run build`)
Must run in `outfit-shop/`:
```bash
cd outfit-shop && npm run build
```
- **Requirement**: **Exit code 0**.
- All static/dynamic routes (46+ routes) must compile, collect page data, and generate without runtime/SSR hydration failures.

### 3. Checkpoint 3: Dependency Integrity Check
- Verify all imported packages in `src/` are explicitly defined in `package.json` (`@tanstack/react-query`, `zod`, `lucide-react`, `recharts`, `clsx`, `tailwind-merge`, `sonner`).

---

## 🚫 Prohibited Actions

1. **NO Unverified Pushes**: Never run `git push` immediately after editing code without executing Checkpoint 1 and Checkpoint 2.
2. **NO Force Pushing**: Do not use `--force` on `main` or production branches.
3. **NO Committing Broken Types**: Do not use `@ts-ignore` or `@ts-nocheck` as workarounds for failing CI pipelines.

---

## 📋 Standard Workflow Summary

```
1. Make Code Changes
2. Checkpoint 1: cd outfit-shop && npx tsc --noEmit (MUST PASS 0 ERRORS)
3. Checkpoint 2: cd outfit-shop && npm run build (MUST PASS 100% ROUTES)
4. Stage & Commit: git add -A && git commit -m "..."
5. User Directive: Confirm explicit push request from user
6. Push: git push origin <branch>
```
