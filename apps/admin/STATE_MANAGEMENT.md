/\*\*

- State Management Documentation
-
- Guide for when to use Redux vs Context API vs React Query in iRate
  \*/

# State Management in iRate

## Overview

The iRate application uses a multi-layered state management approach optimized for fintech applications:

1. **Redux** - Global application state
2. **Context API** - Feature-scoped configuration
3. **React Query** - Server state and caching
4. **Local State** - Component-specific state

## Decision Matrix

### Use Redux When:

✅ **State needs to be accessed across many unrelated components**

- Auth state (user, tokens, permissions)
- UI preferences (sidebar, theme toggle)
- Shopping cart / transaction draft (if needed)

✅ **State changes need to be tracked for debugging**

- Financial transactions benefit from Redux DevTools
- Time-travel debugging for audit purposes

✅ **Complex state updates with multiple reducers**

- Coordinated updates across features

**Examples in iRate:**

```typescript
// Auth state
const { user, isAuthenticated } = useAppSelector((state) => state.auth);

// UI state
const { sidebarHovered } = useAppSelector((state) => state.ui);
```

### Use Context API When:

✅ **State is scoped to a feature or section**

- Admin panel preferences (table size, filters)
- Form wizard state
- Feature flags for a section

✅ **Configuration that doesn't need Redux DevTools**

- Theme preferences (light/dark/system)
- Locale settings
- Layout preferences

✅ **Avoiding prop drilling in a component tree**

- Form context for nested form components
- Modal/Dialog state

**Examples in iRate:**

```typescript
// Admin preferences (scoped to admin area)
const { config, updateConfig } = useAdminContext();

// Theme (presentational, doesn't need Redux)
const { theme, setTheme } = useTheme();
```

### Use React Query When:

✅ **Data comes from an API**

- User lists, KYC documents, transactions
- Dashboard statistics
- Wallet balances

✅ **Need automatic caching and refetching**

- Admin dashboard data
- User profiles
- Transaction history

✅ **Need loading/error states and retries**

- All API calls

**Examples in iRate:**

```typescript
// Server state with automatic caching
const { data, isLoading } = useUsers({ page: 1 });
const { mutate } = useReviewKyc();
```

### Use Local State (useState) When:

✅ **State is only needed in one component**

- Form input values (with react-hook-form)
- Modal open/close
- Accordion expand/collapse

✅ **Temporary UI state**

- Hover states
- Focus states
- Animation states

**Examples in iRate:**

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedTab, setSelectedTab] = useState("overview");
```

## Current Implementation

### Redux Store Structure

```typescript
store = {
  auth: {
    user: AuthUser | null,
    isAuthenticated: boolean,
    accessToken: string | null,
  },
  ui: {
    sidebarHovered: boolean,
    sidebarMobileOpen: boolean,
  },
  // Future additions:
  // wallet: { ... },
  // transaction: { ... },
};
```

### Context Providers

1. **AdminContext** - Admin panel configuration
   - Table preferences
   - Filter settings
   - View modes

2. **ThemeContext** - Theme management
   - Light/dark/system
   - Resolved theme

### React Query Keys

```typescript
queryKeys = {
  admin: {
    all: () => ["admin"],
    me: () => ["admin", "me"],
    dashboard: { ... },
    users: { ... },
    kyc: { ... },
    wallets: { ... },
  },
  // Other features...
}
```

## Optimization Best Practices

### 1. Use Memoization Hooks

```typescript
// Memoize expensive calculations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Memoize callbacks to prevent child re-renders
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 2. Use React.memo for Components

```typescript
// Prevent re-renders when props haven't changed
const DashboardStats = memo(({ data }) => {
  return <div>{/* ... */}</div>;
});
```

### 3. Use Selectors Efficiently

```typescript
// ❌ Bad - creates new object on every render
const data = useAppSelector((state) => ({
  user: state.auth.user,
  isAuth: state.auth.isAuthenticated,
}));

// ✅ Good - select individually
const user = useAppSelector((state) => state.auth.user);
const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
```

### 4. Debounce/Throttle Heavy Operations

```typescript
// Debounce search input
const debouncedSearch = useDebounce(searchTerm, 500);

// Throttle scroll handler
const handleScroll = useThrottle(() => {
  // expensive operation
}, 200);
```

## Migration Guide

### Moving from Context to Redux

If you need to move state from Context to Redux:

1. Create a slice:

```typescript
// features/wallet/store/wallet.slice.ts
export const walletSlice = createSlice({
  name: 'wallet',
  initialState: { ... },
  reducers: { ... },
});
```

2. Add to store:

```typescript
// core/store/store.ts
import walletReducer from "@/features/wallet/store/wallet.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    wallet: walletReducer, // Add here
  },
});
```

3. Replace Context usage:

```typescript
// Before
const { balance } = useWalletContext();

// After
const balance = useAppSelector((state) => state.wallet.balance);
```

### Moving from Redux to Context

If state is too localized for Redux:

1. Create Context:

```typescript
const FeatureContext = createContext<ContextValue | undefined>(undefined);

export const FeatureProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  const value = useMemo(() => ({
    state,
    updateState: setState,
  }), [state]);

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
};
```

2. Wrap feature with provider
3. Replace Redux usage with `useContext`

## Performance Monitoring

Use React DevTools Profiler to identify:

- Unnecessary re-renders
- Slow components
- Components that should be memoized

## Testing

```typescript
// Redux
import { store } from '@/core/store/store';
import { Provider } from 'react-redux';

const wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

// Context
const wrapper = ({ children }) => (
  <AdminProvider>{children}</AdminProvider>
);

// Test
const { result } = renderHook(() => useAuth(), { wrapper });
```

## Related Files

- [Redux Store](../core/store/store.ts)
- [Admin Context](../features/admin/contexts/AdminContext.tsx)
- [Theme Context](../core/contexts/ThemeContext.tsx)
- [Optimization Hooks](../shared/hooks/useOptimization.ts)
- [Query Client](../core/query/query-client.ts)

---

**Last Updated**: March 25, 2026
