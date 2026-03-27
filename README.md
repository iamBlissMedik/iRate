# iRate - Fintech Platform

A fintech platform built with Next.js featuring admin dashboard and customer-facing web application.

## 📁 Monorepo Structure

```
irate-web/
├── apps/
│   ├── admin/          # Admin Dashboard (currently active)
│   │   ├── src/        # Admin source code
│   │   ├── public/     # Admin static assets
│   │   └── ...config files
│   └── web/            # Customer Web App (coming soon)
│       └── src/
├── package.json        # Root package with workspace scripts
└── tsconfig.json       # Root TypeScript config
```

## 🚀 Getting Started

### Admin Dashboard

```bash
# Development
npm run dev:admin
# or
npm run dev

# Build
npm run build:admin

# Start production
npm run start:admin
```

### Web Application (Coming Soon)

```bash
# Development
npm run dev:web

# Build
npm run build:web

# Start production
npm run start:web
```

## 📦 Applications

### Admin Dashboard (`apps/admin`)

- **Port**: 9000
- **Purpose**: Internal admin dashboard for managing users, KYC, wallets, transactions
- **Tech Stack**: Next.js 14+, Redux Toolkit, React Query, TypeScript
- **Status**: ✅ Active

### Web App (`apps/web`)

- **Port**: 3000
- **Purpose**: Customer-facing web application
- **Status**: 🚧 Coming Soon

## 📚 Documentation

Admin-specific documentation is located in `apps/admin/`:

- `ARCHITECTURE.md` - Architecture patterns and principles
- `STATE_MANAGEMENT.md` - Redux, Context API, React Query usage
- `REFACTORING_COMPLETE.md` - Recent refactoring summary

## 🏗️ Architecture

This is a feature-based modular monolith following fintech best practices:

- **Redux** for global state (auth, UI)
- **Context API** for feature-scoped state (theme, admin config)
- **React Query** for server state (API data, caching)
- **TypeScript** for type safety
- **Feature-based structure** for scalability

## 🔧 Development

Each app has its own:

- `package.json` for app-specific scripts
- `tsconfig.json` extending root config
- `next.config.ts` for Next.js configuration
- Independent build and deployment

## 📄 License

Private - All Rights Reserved
