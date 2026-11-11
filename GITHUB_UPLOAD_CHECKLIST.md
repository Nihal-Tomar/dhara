# GITHUB_UPLOAD_CHECKLIST.md
## DHARA — GitHub Upload Readiness Checklist
**Prepared:** November 11, 2026
**Remote:** `https://github.com/Nihal-Tomar/bhu-mitra.git`
**Current branch:** `main`

---

## ⚠️ Before You Push — Mandatory Items

Work through every ✗ item in Section 1 before running any `git push`.

---

## 1. Upload Readiness Status

| Check | Status | Action Required |
|---|---|---|
| `.gitignore` covers `node_modules/` | ✗ FAIL | File currently only contains `node_modules` — rewrite required (see Section 4) |
| `.gitignore` covers `.next/` | ✗ FAIL | Missing from root `.gitignore` |
| `.gitignore` covers `dist/` | ✗ FAIL | Missing from root `.gitignore` |
| `.gitignore` covers `.env` secrets | ✗ FAIL | Missing from root `.gitignore` |
| `.gitignore` covers `apps/api/data/db/` | ✗ FAIL | Missing — this directory IS currently tracked and must be untracked |
| `apps/api/data/db/` untracked from git index | ✗ FAIL | Run `git rm -r --cached apps/api/data/db/` before committing |
| New DHARA components staged | ✗ PENDING | 10 untracked files need `git add` |
| All modified source files staged | ✗ PENDING | 31 modified files need `git add` |
| `.env` files absent from tracked files | ✓ PASS | Only `.env.example` is tracked |
| No real secrets in git history | ✓ PASS | Confirmed — no `.env`, `.env.production`, etc. ever committed |
| `.env.example` has only placeholder values | ✓ PASS | Confirmed |
| Lockfile (`pnpm-lock.yaml`) present | ✓ PASS | Present and up to date |
| Database migrations present | ✓ PASS | `prisma/migrations/20260307000000_init/` present |
| Dockerfiles present | ✓ PASS | All three services have Dockerfiles |
| README.md updated for DHARA | ✓ PASS | Modified locally with full DHARA content |

---

## 2. Files to Commit (Stage These)

### 2a. Modified tracked files (all should be staged)

These are your local working improvements and are newer than what's on GitHub:

```
.env.example                                      (documentation update)
.gitignore                                        (after rewriting — see Section 4)
README.md                                         (DHARA rebranding)
apps/api/package.json                             (dependency updates)
apps/api/prisma/schema.prisma                     (schema evolution)
apps/api/src/main.ts                              (DHARA branding, Swagger update)
apps/intelligence/main.py                         (DHARA branding)
apps/web/next.config.ts                           (config updates)
apps/web/package.json                             (dependency updates)
apps/web/src/app/(auth)/login/page.tsx            (DHARA login UI)
apps/web/src/app/globals.css                      (DHARA design tokens)
apps/web/src/app/layout.tsx                       (DHARA layout, DharaAiAssistant)
apps/web/src/app/page.tsx                         (DHARA home page)
apps/web/src/components/ai/BhuMitraAiAssistant.tsx (DHARA branding updates)
apps/web/src/components/common/GovernmentHeader.tsx (updates)
apps/web/src/components/common/InstitutionalFooter.tsx (updates)
apps/web/src/components/home/FinalCTA.tsx         (updates)
apps/web/src/components/home/HeroSection.tsx      (updates)
apps/web/src/components/home/HomeHeader.tsx       (updates)
apps/web/src/components/home/SchemesSection.tsx   (updates)
apps/web/src/lib/authContext.tsx                  (DHARA persona presets)
infra/docker-compose.yml                          (DHARA rename, service updates)
package.json                                      (workspace description update)
packages/config/package.json                      (config package update)
packages/config/tsconfig/library.json             (updated config)
packages/config/tsconfig/nestjs.json              (updated config)
packages/config/tsconfig/nextjs.json              (updated config)
packages/types/package.json                       (updated)
packages/types/src/index.ts                       (updated DTO interfaces)
packages/types/tsconfig.json                      (updated)
pnpm-lock.yaml                                    (lockfile update)
```

Also stage the packages/ui and packages/config updates (all those `D` items in the status were modified-then-recovered files):
```
packages/ui/**                                    (all ui source files — updated)
```

### 2b. New untracked files (must be staged — at risk of loss)

```
apps/web/src/components/ai/DharaAiAssistant.tsx
apps/web/src/components/common/DharaFooter.tsx
apps/web/src/components/common/DharaHeader.tsx
apps/web/src/components/home/DharaCapabilitiesSection.tsx
apps/web/src/components/home/DharaCommandPreview.tsx
apps/web/src/components/home/DharaHeroSection.tsx
apps/web/src/components/home/DharaIntelligenceSection.tsx
apps/web/src/components/home/DharaLifecycleSection.tsx
packages/config/eslint/nestjs.mjs
packages/config/eslint/nextjs.mjs
```

### 2c. New documentation files (created by this audit)

```
PRE_DEPLOYMENT_AUDIT.md
DEPLOYMENT_GUIDE.md
GITHUB_UPLOAD_CHECKLIST.md
```

---

## 3. Files That Must NOT Be Uploaded

| File/Directory | Reason |
|---|---|
| `apps/api/data/db/` | Embedded PostgreSQL data directory — binary DB files, includes `postmaster.pid` (process state from a running instance). Currently tracked — must be untracked. |
| `.env` | Real environment secrets (if present) |
| `.env.local` | Real environment secrets (if present) |
| `.env.production` | Real environment secrets (if present) |
| `.env.development.local` | Real environment secrets (if present) |
| `apps/web/.next/` | Next.js build output — rebuild on deploy |
| `apps/api/dist/` | NestJS compiled output — rebuild on deploy |
| `packages/types/dist/` | TypeScript compiled output — regenerate with `tsc` |
| `**/node_modules/` | npm dependencies — reinstall on deploy |
| `**/*.tsbuildinfo` | TypeScript incremental build cache |
| `apps/web/next-env.d.ts` | Auto-generated Next.js type declaration |
| `.turbo/` | Turborepo pipeline cache |
| `**/.DS_Store` | macOS finder metadata |
| `**/Thumbs.db` | Windows thumbnail cache |
| `**/*.log` | Application logs |
| `**/*.pid` | Process ID files |
| `~/.bhumitra/pgdata/` | Embedded PG data in user's home dir (not in repo but flag for awareness) |

---

## 4. Required `.gitignore` Update

The current root `.gitignore` contains only `node_modules`. It must be replaced with the following comprehensive version before committing:

```gitignore
# ─── Dependencies ───────────────────────────────────────────────────────────
node_modules/
.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# ─── Build Output ────────────────────────────────────────────────────────────
dist/
build/
out/
.next/
*.tsbuildinfo
next-env.d.ts
packages/types/dist/

# ─── Turborepo Cache ─────────────────────────────────────────────────────────
.turbo/

# ─── Secrets & Environment Variables ────────────────────────────────────────
.env
.env.*
!.env.example
*.pem
*.key
*.pfx
*.p12
*.crt
*.cert
id_rsa
id_ed25519

# ─── Local Database Data ─────────────────────────────────────────────────────
apps/api/data/db/
*.pid
*.log

# ─── Testing & Coverage ──────────────────────────────────────────────────────
coverage/
.nyc_output/

# ─── OS & Editor Artifacts ───────────────────────────────────────────────────
.DS_Store
Thumbs.db
desktop.ini
*.swp
*.swo
.idea/
.vscode/settings.json
*.code-workspace

# ─── Python ──────────────────────────────────────────────────────────────────
__pycache__/
*.py[cod]
*.pyo
.venv/
venv/
*.egg-info/
.pytest_cache/

# ─── Vercel ──────────────────────────────────────────────────────────────────
.vercel

# ─── Temporary Audit Files (generated by audit tooling) ──────────────────────
__audit_*.txt
.audit/
AUDIT_REPORT.md
```

**After updating `.gitignore`, untrack the embedded PG data directory:**
```powershell
git rm -r --cached apps/api/data/db/
```

---

## 5. Secret History Assessment

| Check | Result |
|---|---|
| `.env` file ever committed | NOT FOUND — clean |
| `.env.production` ever committed | NOT FOUND — clean |
| `.env.local` ever committed | NOT FOUND — clean |
| Private keys (`.pem`, `.key`) ever committed | NOT FOUND — clean |
| `apps/api/data/db/` committed (bug) | YES — these 3 files are in git: `PG_VERSION`, `postgresql.conf`, `postmaster.pid` |

**Verdict:** No actual secret credentials have been committed to git history. No git history rewrite (e.g., `git filter-repo`) is required. The only action needed is to untrack and `.gitignore` the `apps/api/data/db/` directory.

---

## 6. Sensitive Files Requiring Review Before Push

These files contain hardcoded development credentials in source code (not in `.env` files). They will be uploaded to GitHub. This is acceptable for a demo/hackathon project but should be remediated before production deployment:

| File | Hardcoded Value | Risk Level |
|---|---|---|
| `apps/api/src/common/data-store/data-store.service.ts` | Backdoor password plaintext `"Bhumitra@2026"` | HIGH |
| `apps/api/src/common/embedded-pg/embedded-pg.service.ts` | `bhumitra_secure_dev` DB password | MEDIUM |
| `apps/api/src/common/prisma/prisma.service.ts` | `bhumitra_secure_dev` DB password in fallback URL | MEDIUM |
| `apps/api/src/modules/auth/auth.service.ts` | JWT secret fallback literal | HIGH |
| `apps/api/src/common/guards/jwt-auth.guard.ts` | JWT secret fallback literal | HIGH |
| `apps/api/bootstrap.js` | DB credentials | MEDIUM |
| `apps/api/init_db.js` | DB credentials | MEDIUM |
| `apps/api/validate_e2e.ts` | DB credentials + demo password | MEDIUM |
| `apps/web/src/app/(auth)/login/page.tsx` | Demo password pre-filled in UI state | LOW |

For a **hackathon/demo repository**, uploading these is acceptable and the repository README clearly identifies this as a prototype. For any real government deployment, these must be removed before the code is used in production infrastructure.

---

## 7. Safe Git Commands to Review and Push

Run these commands in order. Review each `git diff --staged` output before committing.

```powershell
# ─── Step 1: Rewrite the root .gitignore ─────────────────────────────────────
# (Do this first so git knows what to exclude before staging)
# Apply the new .gitignore content from Section 4 above, then:
git add .gitignore

# ─── Step 2: Untrack the embedded PG data directory ──────────────────────────
git rm -r --cached apps/api/data/db/

# ─── Step 3: Stage all new DHARA components (untracked files at risk) ─────────
git add apps/web/src/components/ai/DharaAiAssistant.tsx
git add apps/web/src/components/common/DharaFooter.tsx
git add apps/web/src/components/common/DharaHeader.tsx
git add apps/web/src/components/home/DharaCapabilitiesSection.tsx
git add apps/web/src/components/home/DharaCommandPreview.tsx
git add apps/web/src/components/home/DharaHeroSection.tsx
git add apps/web/src/components/home/DharaIntelligenceSection.tsx
git add apps/web/src/components/home/DharaLifecycleSection.tsx
git add packages/config/eslint/nestjs.mjs
git add packages/config/eslint/nextjs.mjs

# ─── Step 4: Stage the audit documentation ───────────────────────────────────
git add PRE_DEPLOYMENT_AUDIT.md DEPLOYMENT_GUIDE.md GITHUB_UPLOAD_CHECKLIST.md

# ─── Step 5: Stage all modified source files ─────────────────────────────────
git add README.md .env.example
git add apps/api/package.json apps/api/prisma/schema.prisma apps/api/src/main.ts
git add apps/intelligence/main.py
git add apps/web/next.config.ts apps/web/package.json
git add apps/web/src/app/(auth)/login/page.tsx
git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx apps/web/src/app/page.tsx
git add apps/web/src/components/ai/BhuMitraAiAssistant.tsx
git add apps/web/src/components/common/GovernmentHeader.tsx apps/web/src/components/common/InstitutionalFooter.tsx
git add apps/web/src/components/home/FinalCTA.tsx apps/web/src/components/home/HeroSection.tsx
git add apps/web/src/components/home/HomeHeader.tsx apps/web/src/components/home/SchemesSection.tsx
git add apps/web/src/lib/authContext.tsx
git add infra/docker-compose.yml
git add package.json pnpm-lock.yaml
git add packages/config/package.json packages/config/tsconfig/
git add packages/types/package.json packages/types/src/index.ts packages/types/tsconfig.json
git add packages/ui/

# ─── Step 6: Review what will be committed ────────────────────────────────────
git diff --staged --stat

# ─── Step 7: Verify no secrets or generated files are staged ─────────────────
git diff --staged --name-only | Select-String "\.env$|data/db|dist/|\.next/"

# ─── Step 8: Commit ──────────────────────────────────────────────────────────
git commit -m "feat: DHARA rebrand, design system update, production audit & deployment docs

- Rebrand from Bhu-Mitra to DHARA (Digital Hub for Acquisition,
  Rehabilitation & Administration)
- Add 8 new DHARA-branded React components (home page redesign)
- Update packages/ui, packages/types, packages/config
- Update Prisma schema, NestJS main.ts, intelligence main.py
- Update .gitignore with comprehensive exclusions
- Untrack embedded PostgreSQL data directory
- Add PRE_DEPLOYMENT_AUDIT.md, DEPLOYMENT_GUIDE.md, GITHUB_UPLOAD_CHECKLIST.md
- Update README.md with DHARA architecture and roadmap
"

# ─── Step 9: Push to origin/main ─────────────────────────────────────────────
# DO NOT run this until you have reviewed the commit and are satisfied:
# git push origin main
```

---

## 8. Post-Push Verification

After pushing, verify on GitHub that:
1. `apps/api/data/db/` is NOT present in the repository tree
2. `packages/ui/src/` files are present and updated
3. All 8 new DHARA components appear in `apps/web/src/components/`
4. The `.gitignore` file shows the full comprehensive exclusion list
5. No `.env` files (other than `.env.example`) appear anywhere
6. `PRE_DEPLOYMENT_AUDIT.md`, `DEPLOYMENT_GUIDE.md`, `GITHUB_UPLOAD_CHECKLIST.md` are present

Navigate to: `https://github.com/Nihal-Tomar/bhu-mitra/tree/main` to confirm.
