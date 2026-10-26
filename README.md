# iRate web

iRate is a fintech wallet. This monorepo holds its two web apps — the **customer wallet** and the
**admin console** — and the packages they share. Customers get a wallet with a 10-digit account
number, send and receive money, and complete KYC; admins manage users, review KYC, and credit
wallets. The iRate API is a separate service; the apps reach it through `IRATE_API_BASE_URL`.

Tokens never reach the browser: both web apps use a Backend-for-Frontend (BFF) that keeps the
session in httpOnly cookies and calls the API server-side.

| App           | Path         | Port | Purpose                                        |
| ------------- | ------------ | ---- | ---------------------------------------------- |
| Wallet        | `apps/user`  | 3000 | Balance, send money, activity, KYC, settings   |
| Admin console | `apps/admin` | 9000 | Users, KYC review, wallet credits (ADMIN only) |

## Tech stack

- **Next.js 16** (App Router, `proxy.ts`) · **React 19** · **TypeScript** (strict)
- **npm workspaces + Turborepo**
- **shadcn/ui** (Radix) · **Tailwind CSS v4** · light & dark themes via `next-themes`
- **TanStack Query** for server state · **react-hook-form + Zod** for forms
- **Recharts** · **Motion** · **Geist** font
- **Vitest + Testing Library** · **Storybook**

## Repository layout

```text
apps/
  user/                 Wallet (Next.js)
  admin/                Admin console (Next.js)
packages/
  contracts/            @irate/contracts  — Zod schemas + types for every request/response, money helpers
  api-client/           @irate/api-client — typed fetch client, React Query hooks, provider
  bff/                  @irate/bff        — Next route handlers (auth, proxy) and the route guard
  ui/                   @irate/ui         — shadcn/ui components, iRate compositions, theme, charts
  tsconfig/             @irate/tsconfig   — shared TypeScript configs
```

Both Next apps follow the same shape:

```text
src/
  app/                  routes; (auth) and signed-in route groups, api/ route handlers
  components/           app-level layout (shell, table helpers)
  features/<feature>/   screens' building blocks, one folder per domain (kebab-case files)
  proxy.ts              route guard (createAuthProxy)
```

Internal packages are consumed as TypeScript source (`transpilePackages`), so there is no build
step between a package change and the apps.

## Getting started

Requirements: Node 18.18+ and a running iRate API (by default at `http://localhost:8000/api/v1`).

```bash
npm install
cp apps/user/.env.example  apps/user/.env.local
cp apps/admin/.env.example apps/admin/.env.local
npm run dev:user                # http://localhost:3000
npm run dev:admin               # http://localhost:9000
```

Point `IRATE_API_BASE_URL` in each `.env.local` at your API. Any backend that honours the contract in
`@irate/contracts` works (for example the Go service in `../irate-core-go`). With its demo seed, sign
in as `ada@irate.dev` / `Password123!` (customer) or `admin@irate.dev` / `Admin123!` (admin).

## How it fits together

### Requests

```text
browser ──► same-origin Next route ──► iRate API
            /api/auth/*   login, register, logout, session  (sets/clears httpOnly cookies)
            /api/v1/*     proxy: adds the Bearer token, refreshes once on 401
```

The browser client (`@irate/api-client`) only ever calls these same-origin routes, so the CSP can
stay at `connect-src 'self'`. The route handlers are one-liners in each app that delegate to
`@irate/bff`.

### Sessions

- Login stores the access token and the API's refresh token as httpOnly cookies on the app's own
  domain. The admin app sets `allowedRoles: ["ADMIN"]`, so it never issues a session to customers.
- `src/proxy.ts` guards pages. It renews an expired access token with the refresh token, so a
  session lasts as long as the refresh token (7 days), not the 15-minute access token. A signed-in
  account with the wrong role is sent to `/login?error=forbidden`.
- If a session can't be refreshed, any API call returns 401 and the app redirects to
  `/login?session=expired&from=…`, then returns there after sign-in. `from` is checked with
  `safeRedirectPath`, so it can't point off-site.
- Browsers share cookies across ports, so locally the admin app uses its own cookie names (set in
  `apps/admin/.env.example`).

### Data and errors

- `@irate/contracts` is the single source of truth for shapes. Hooks in `@irate/api-client/react`
  validate responses against it (a mismatch logs a warning in development rather than crashing).
- Lookups where "not found" is a valid answer (name enquiry, KYC status) resolve to `null`.
- Failed **queries** show a toast globally. Failed **mutations** are handled by the form that ran
  them, so each error appears once, in context.
- Money is integer **minor units**, sent as strings. Format with `formatMoney` (exact `BigInt` math);
  forms take major units validated by `AmountMajorInput` and convert with `majorToMinor`.

## UI and theming

The design system is `@irate/ui`; see [packages/ui/README.md](packages/ui/README.md) for adding
shadcn components. Highlights:

- `components/ui/*` are shadcn/ui components; `components/*` are iRate compositions — `AppShell`
  (sidebar layout for both apps), `AuthLayout`, `PageHeader`, `StatCard`, `Money`,
  `KycStatusBadge`, `EmptyState`, `ErrorState`, `ThemeToggle`.
- All colours are CSS variables in `packages/ui/src/styles/globals.css`, defined once for light and
  once for dark. Components use semantic utilities (`bg-card`, `text-muted-foreground`), never raw
  colours, so both themes stay in sync.
- The theme toggle offers light, dark, and system. The sidebar remembers its collapsed state in the
  `sidebar_state` cookie.

## Scripts

Run from the repository root; Turborepo fans out to the workspaces.

| Command                                   | What it does                          |
| ----------------------------------------- | ------------------------------------- |
| `npm run dev:user` / `dev:admin`          | Run one app in development            |
| `npm run build`                           | Production build of everything        |
| `npm run typecheck`                       | `tsc` in every workspace              |
| `npm run test`                            | Vitest in every package               |
| `npm run lint`                            | ESLint in the Next apps               |
| `npm run format`                          | Prettier (incl. Tailwind class order) |
| `npm run storybook --workspace=@irate/ui` | Component workshop on port 6006       |

## Environment

The web apps read only server-side variables (see each app's `.env.example`). Never prefix them
with `NEXT_PUBLIC_`: that would ship the API address and cookie names to the browser and defeat the
BFF.

| Variable                       | Required | Default                                                      |
| ------------------------------ | -------- | ------------------------------------------------------------ |
| `IRATE_API_BASE_URL`           | yes      | `http://localhost:8000/api/v1` in development                |
| `IRATE_ACCESS_COOKIE`          | no       | `irate_at`                                                   |
| `IRATE_REFRESH_COOKIE`         | no       | `irate_rt`                                                   |
| `IRATE_BACKEND_REFRESH_COOKIE` | no       | `refreshToken` (the cookie the API reads on `/auth/refresh`) |
| `IRATE_ACCESS_MAX_AGE`         | no       | `900` seconds                                                |
| `IRATE_REFRESH_MAX_AGE`        | no       | `604800` seconds                                             |

## License

Private — all rights reserved.
