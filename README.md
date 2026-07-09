# iRate — Fintech Web Platform

A monorepo with two Next.js apps — a **customer wallet** and an **admin dashboard** — for
the iRate fintech platform. Users get a wallet with a 10-digit account number, can send and
receive money, and track every transaction; admins manage users, review KYC, and credit
wallets. It talks to a role-based backend (Express + Prisma + Redis, in `../irate-backend`).

Tokens never reach the browser (a Backend-for-Frontend auth model), and both apps share one
contract, one API client, and one design system.

---

## Apps

| App           | Path         | Port | Purpose                                            |
| ------------- | ------------ | ---- | -------------------------------------------------- |
| Customer app  | `apps/user`  | 3000 | Wallet, send/receive money, transactions, KYC      |
| Admin console | `apps/admin` | 9000 | Users, KYC review, wallet credits — **ADMIN-only** |

## Features

- 🔐 **Secure auth** — httpOnly-cookie sessions via a Backend-for-Frontend proxy (no tokens
  in the browser), with transparent token refresh and idempotent mutations.
- 💸 **Send money** — account-number lookup (name enquiry) → transfer, with a live recipient
  check and exact minor-unit money math.
- 📊 **Dashboards** — animated stat cards, recharts visualisations, and a real-time activity
  feed.
- 🪪 **KYC** — submit/track on the user side; review (approve/reject) on the admin side.
- 🌗 **Light & dark mode** — one shared theme, togglable everywhere, `prefers-reduced-motion`
  aware.
- 📱 **Responsive** — mobile-first (bottom-nav on mobile, sidebar on desktop).

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **npm workspaces + Turborepo** (cached builds/lint/test)
- **TanStack Query** (server state) · **react-hook-form + Zod** (forms/validation)
- **Tailwind CSS v4** · **Radix UI** · **Recharts** · **Framer Motion**
- **Vitest + Testing Library** · **Storybook**

## Monorepo structure

```
irate-web-apps/
├── apps/
│   ├── user/        # Customer wallet (port 3000)
│   └── admin/       # Admin dashboard (port 9000)
├── packages/
│   ├── contracts/   # @irate/contracts  — Zod schemas + inferred types (the API contract)
│   ├── api-client/  # @irate/api-client — typed client + React Query hooks
│   ├── bff/         # @irate/bff        — secure Next route handlers + middleware
│   ├── ui/          # @irate/ui         — design system: theme, primitives, charts, motion
│   └── tsconfig/    # @irate/tsconfig   — shared TypeScript configs
├── turbo.json
└── package.json
```

## Getting started

**Prerequisites:** Node 18.18+, and the backend running on `:8000` with Postgres + Redis
(see `../irate-backend/README.md`).

```bash
# 1. Install the workspace
npm install

# 2. Configure each app's BFF target (server-only — never NEXT_PUBLIC_)
cp apps/user/.env.example  apps/user/.env.local
cp apps/admin/.env.example apps/admin/.env.local   # IRATE_API_BASE_URL=http://localhost:8000/api/v1

# 3. Run
npm run dev:user     # http://localhost:3000
npm run dev:admin    # http://localhost:9000  (ADMIN account required)
```

Seed credentials (from the backend): admin `admin@irate.dev` / `Admin123!`,
user `ada@irate.dev` / `Password123!`.

## Scripts

Run from the repo root (Turborepo fans out to the workspaces):

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev:user`   | Run the customer app (`:3000`)               |
| `npm run dev:admin`  | Run the admin app (`:9000`)                  |
| `npm run build`      | Production build of both apps                |
| `npm run typecheck`  | Type-check every package + app (cached)      |
| `npm run test`       | Run the Vitest suites                        |
| `npm run lint`       | Lint all workspaces                          |
| `npm run storybook --workspace=@irate/ui` | Component workshop (`:6006`) |

## Environment

Each app reads a **server-only** `IRATE_API_BASE_URL` (the backend origin) used by the BFF.
It must not be prefixed with `NEXT_PUBLIC_` — that would expose the backend to the browser
and defeat the security model. See each app's `.env.example`.

## Testing

```bash
npm run test        # Vitest across packages (money math, API client, BFF, UI)
npm run typecheck   # tsc, cached by Turborepo
```

## License

Private — All Rights Reserved.
