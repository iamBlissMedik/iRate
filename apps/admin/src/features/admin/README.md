# Admin Feature Module

## Overview

The Admin feature module provides comprehensive administrative functionality for the iRate fintech application, including user management, KYC verification, wallet operations, and dashboard analytics.

## Architecture

This module follows a **feature-based architecture** pattern optimized for fintech applications:

```
features/admin/
├── adapters/          # Data transformation layer
│   ├── admin.adapter.ts
│   ├── users.adapter.ts
│   ├── kyc.adapter.ts
│   └── wallets.adapter.ts
├── components/        # UI components (to be added)
├── constants/         # Configuration and constants
│   └── admin.constants.ts
├── hooks/             # React Query hooks
│   ├── useAdminMe.ts
│   ├── useUsers.ts
│   ├── useKyc.ts
│   └── useWallets.ts
├── services/          # API layer
│   └── api/
│       ├── admin/     # Admin profile APIs
│       ├── users/     # User management APIs
│       ├── kyc/       # KYC verification APIs
│       └── wallets/   # Wallet operations APIs
├── types/             # TypeScript types
│   ├── admin.types.ts
│   ├── users.types.ts
│   ├── kyc.types.ts
│   └── wallets.types.ts
└── index.ts           # Barrel exports
```

## Design Principles

### 1. **Separation of Concerns**

- **Services Layer**: API communication logic
- **Hooks Layer**: React Query integration and state management
- **Adapters Layer**: Data transformation between API and UI
- **Components Layer**: Pure presentational components
- **Types Layer**: Type safety across all layers

### 2. **Fintech Best Practices**

- **Security**: All operations require authentication and admin role
- **Audit Trail**: All actions are logged and traceable
- **Data Integrity**: Proper validation at every layer
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Optimized caching and query invalidation strategies

### 3. **Scalability**

- Feature-based organization makes it easy to add new admin capabilities
- Shared utilities and types prevent code duplication
- Centralized query key management for consistent cache behavior

## Usage Examples

### Fetching Admin Profile

```typescript
import { useAdminMe } from '@/features/admin';

function AdminProfile() {
  const { data, isLoading, error } = useAdminMe();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <div>{data.email}</div>;
}
```

### Managing Users

```typescript
import { useUsers, useUsersStats } from '@/features/admin';

function UserManagement() {
  const { data: users } = useUsers({ page: 1, limit: 20 });
  const { data: stats } = useUsersStats();

  return (
    <div>
      <h2>Total Users: {stats?.data.totalUsers}</h2>
      <UserList users={users?.data.users} />
    </div>
  );
}
```

### Reviewing KYC

```typescript
import { useReviewKyc } from '@/features/admin';

function KycReview({ kycId }: { kycId: string }) {
  const { mutate: reviewKyc, isPending } = useReviewKyc();

  const handleApprove = () => {
    reviewKyc({
      kycId,
      data: { status: 'APPROVED', reviewNote: 'Documents verified' }
    });
  };

  return <button onClick={handleApprove} disabled={isPending}>Approve</button>;
}
```

### Crediting Wallet

```typescript
import { useCreditWallet } from '@/features/admin';

function WalletCredit({ walletId }: { walletId: string }) {
  const { mutate: creditWallet, isPending } = useCreditWallet();

  const handleCredit = (amount: number) => {
    creditWallet({
      walletId,
      data: { amount, description: 'Admin credit' }
    });
  };

  return <CreditForm onSubmit={handleCredit} loading={isPending} />;
}
```

## Data Flow

```
UI Component
    ↓
Custom Hook (useUsers, useKyc, etc.)
    ↓
React Query (caching, refetching)
    ↓
API Service (getAllUsers, reviewKyc, etc.)
    ↓
Axios Client (authentication, error handling)
    ↓
Backend API
    ↓
[Response flows back up]
    ↓
Adapter (transforms data for UI)
    ↓
UI Component (renders data)
```

## Query Key Structure

The module uses a hierarchical query key structure for optimal cache management:

```typescript
admin.all(); // ['admin']
admin.me(); // ['admin', 'me']
admin.dashboard.overview(); // ['admin', 'dashboard', 'overview']
admin.users.list({ role: "USER" }); // ['admin', 'users', 'list', { role: 'USER' }]
admin.kyc.list({ status: "PENDING" }); // ['admin', 'kyc', 'list', { status: 'PENDING' }]
admin.wallets.balance(); // ['admin', 'wallets', 'balance']
```

## Type Safety

All API responses and requests are fully typed:

```typescript
// Request types
interface IKycReviewRequest {
  status: "APPROVED" | "REJECTED";
  reviewNote?: string;
}

// Response types
interface IKycReviewResponse {
  success: boolean;
  message: string;
  data: IKycDocument;
}

// Display types (from adapters)
interface KycDisplayData {
  id: string;
  userId: string;
  userEmail: string;
  status: string;
  statusBadge: "success" | "warning" | "error";
  canReview: boolean;
}
```

## Error Handling

Errors are handled at multiple levels:

1. **API Level**: Axios interceptors catch network errors
2. **Hook Level**: Try-catch blocks with specific error handling
3. **UI Level**: Toast notifications for user feedback
4. **Global Level**: Query client default error handler

## Performance Optimization

- **Stale Time**: Data is considered fresh for appropriate durations (1-5 minutes)
- **Cache Invalidation**: Mutations automatically invalidate related queries
- **Pagination**: Large lists support pagination to reduce payload size
- **Selective Refetching**: Queries only refetch when explicitly needed

## Future Enhancements

- [ ] Add audit log viewing capability
- [ ] Implement bulk operations (bulk user actions, bulk KYC review)
- [ ] Add export functionality (CSV/Excel)
- [ ] Implement real-time updates using websockets
- [ ] Add advanced filtering and search
- [ ] Create dashboard widgets and charts
- [ ] Add role-based permission granularity

## Related Modules

- **Auth Module**: Authentication and authorization
- **Dashboard Module**: Analytics and overview
- **User Module**: User profile management
- **Wallet Module**: Wallet operations
- **Transaction Module**: Transaction management
