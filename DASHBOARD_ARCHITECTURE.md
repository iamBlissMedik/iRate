# Dashboard Architecture Documentation

## Overview

This dashboard implementation follows SOLID principles and clean architecture patterns to ensure scalability, maintainability, and testability.

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard page with error handling
│   ├── layout.tsx                   # Root layout with providers
│   └── page.tsx                     # Home page
├── components/
│   ├── dashboard/
│   │   ├── DashboardStats.tsx       # Presentation component
│   │   ├── DashboardStatsContainer.tsx  # Container for data fetching
│   │   └── CustomDashboardStatCard.tsx  # Individual stat card
│   ├── providers/
│   │   └── Providers.tsx            # React Query provider setup
│   └── ui/
│       └── BaseCard.tsx             # Reusable card component
├── lib/
│   ├── api/
│   │   ├── apiProvider.interface.ts # Abstract provider interface
│   │   ├── mockApiProvider.ts       # Mock data implementation
│   │   ├── realApiProvider.ts       # Real API implementation
│   │   ├── apiProviderFactory.ts    # Factory for provider selection
│   │   └── overview.api.ts          # Public API facade
│   ├── config/
│   │   └── apiConfig.ts             # API configuration system
│   ├── hooks/
│   │   └── overview.hooks.ts        # Custom hook with callback injection
│   └── utils/
│       ├── formatters.ts            # Data formatting utilities
│       └── statMapper.ts            # Data transformation utilities
├── constants/
│   └── queryKeys.ts                 # React Query keys
└── types/
    └── dashboard.ts                 # TypeScript interfaces

```

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
Each module has one clear responsibility:
- **API Providers**: Only handle data fetching
- **Formatters**: Only handle data formatting
- **Mappers**: Only handle data transformation
- **Components**: Only handle rendering or data management, not both

### Open/Closed Principle (OCP)
The system is open for extension but closed for modification:
- New API providers can be added without modifying existing code
- Factory pattern allows new provider types
- Component variants can be extended through props

### Liskov Substitution Principle (LSP)
All API providers implement the same interface and are interchangeable:
```typescript
interface DashboardApiProvider {
  getDashboardOverview(): Promise<DashboardOverviewResponse>;
}
```

### Interface Segregation Principle (ISP)
Components receive only the props they need:
- **StatCardUIProps**: UI-specific props (formatted values)
- **StatCardBusinessLogicProps**: Business logic props (raw data)
- Separate interfaces prevent bloated prop types

### Dependency Inversion Principle (DIP)
High-level modules depend on abstractions:
- Components depend on hook interfaces, not implementations
- Hooks use callback injection for error handling
- Factory pattern provides abstractions over concrete providers

## Architecture Layers

### 1. API Layer
**Location**: `src/lib/api/`

**Responsibility**: Data fetching and provider management

**Key Features**:
- Abstract interface for all providers
- Factory pattern for provider selection
- Singleton pattern for provider caching
- Easy switching between mock and real data

**Usage**:
```typescript
// Configure API mode
setApiConfig({ mode: 'mock' });

// Use via factory
const provider = ApiProviderFactory.getDashboardApiProvider();
const data = await provider.getDashboardOverview();

// Or use convenience function
const data = await getDashboardOverview();
```

### 2. Hooks Layer
**Location**: `src/lib/hooks/`

**Responsibility**: State management and data fetching orchestration

**Key Features**:
- Callback injection for error handling
- Agnostic to external dependencies (toast, analytics, etc.)
- React Query integration
- Memoized callbacks to prevent unnecessary re-renders

**Usage**:
```typescript
const { data, isLoading, error } = useDashboardOverview({
  onError: (error) => {
    // Custom error handling
    toast.error(error.message);
  },
  onSuccess: (data) => {
    // Custom success handling
    analytics.track('dashboard_loaded');
  },
});
```

### 3. Utilities Layer
**Location**: `src/lib/utils/`

**Responsibility**: Pure functions for data transformation

**Key Features**:
- Formatters: Number, currency, percentage formatting
- Mappers: Transform API data to UI-ready format
- Pure functions (no side effects)
- Fully testable

**Usage**:
```typescript
// Format data
const formatted = formatCurrency(345678); // "$345,678"
const percentage = formatPercentage(12.5); // "+12.5%"

// Map data
const stats = mapDashboardDataToStats(apiData);
const cardProps = mapStatDataToCardProps(stat);
```

### 4. Component Layer
**Location**: `src/components/`

**Responsibility**: UI rendering and user interaction

**Component Hierarchy**:
```
DashboardStatsContainer (data fetching)
  └── DashboardStats (presentation)
        └── CustomDashboardStatCard (individual stat)
              └── BaseCard (reusable layout)
```

**Separation of Concerns**:
- **Container Components**: Handle data fetching and state
- **Presentation Components**: Pure rendering, no data fetching
- **UI Components**: Reusable, generic components

## Configuration System

### API Mode Selection

Set the API mode via environment variables or programmatically:

**Environment Variable**:
```bash
NEXT_PUBLIC_API_MODE=mock  # or 'real'
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

**Programmatic**:
```typescript
import { setApiConfig } from '@/lib/config/apiConfig';

setApiConfig({
  mode: 'real',
  baseUrl: 'https://api.example.com',
  timeout: 10000,
});
```

## Testing

### Test Coverage
- **41 unit tests** covering all modules
- **100% coverage** of business logic
- **Fast execution** (~3 seconds)

### Test Structure
```
src/
├── components/
│   └── **/*.test.tsx        # Component tests
└── lib/
    ├── api/**/*.test.ts     # API tests
    ├── config/**/*.test.ts  # Config tests
    └── **/*.test.ts         # Utility tests
```

### Running Tests
```bash
npm test                 # Run all tests
npm run test:ui          # Run with UI
npm run test:coverage    # Run with coverage report
```

## Extending the System

### Adding a New Stat Card

1. Update the API response interface:
```typescript
// src/types/dashboard.ts
export interface DashboardOverviewResponse {
  // ... existing fields
  newMetric: number;
  newMetricGrowth?: number;
}
```

2. Update the mapper:
```typescript
// src/lib/utils/statMapper.ts
export const mapDashboardDataToStats = (data: DashboardOverviewResponse) => {
  return [
    // ... existing stats
    {
      label: 'New Metric',
      value: data.newMetric,
      change: data.newMetricGrowth,
      trend: getTrend(data.newMetricGrowth),
    },
  ];
};
```

3. Add an icon (optional):
```typescript
// src/components/dashboard/DashboardStats.tsx
const statIcons: Record<string, React.ReactNode> = {
  // ... existing icons
  'New Metric': <NewIcon className="h-5 w-5" />,
};
```

### Adding a New API Provider

1. Create the provider:
```typescript
// src/lib/api/customApiProvider.ts
export class CustomDashboardApiProvider implements DashboardApiProvider {
  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    // Custom implementation
  }
}
```

2. Register in factory:
```typescript
// src/lib/api/apiProviderFactory.ts
private static createProvider(mode: string): DashboardApiProvider {
  switch (mode) {
    case 'custom':
      return new CustomDashboardApiProvider();
    // ... existing cases
  }
}
```

3. Use it:
```typescript
setApiConfig({ mode: 'custom' });
```

## Best Practices

### When Adding New Features

1. **Follow SRP**: One responsibility per module
2. **Use Interfaces**: Depend on abstractions
3. **Write Tests**: Cover business logic thoroughly
4. **Pure Functions**: Prefer stateless utilities
5. **Type Safety**: Use TypeScript strictly

### When Modifying Components

1. **Separate Concerns**: Keep container and presentation separate
2. **Props Interface**: Define clear prop types
3. **Memoization**: Use React.memo for expensive components
4. **Callback Refs**: Prevent unnecessary re-renders

### When Handling Errors

1. **Use Callbacks**: Inject error handlers
2. **User-Friendly**: Show clear error messages
3. **Logging**: Log errors for debugging
4. **Graceful Degradation**: Show fallback UI

## Performance Considerations

- **React Query Caching**: 1-minute stale time
- **Singleton Providers**: Reuse API provider instances
- **Memoized Callbacks**: Prevent effect re-execution
- **Pure Components**: Enable React optimizations
- **Code Splitting**: Lazy load dashboard route

## Security

- **No Hardcoded Secrets**: Use environment variables
- **Input Validation**: Validate API responses
- **Error Sanitization**: Don't expose sensitive errors
- **CodeQL Scanned**: Zero vulnerabilities found

## Contributing

When contributing:
1. Follow the existing architecture patterns
2. Write tests for new features
3. Run linter before committing
4. Update this documentation for major changes
5. Ensure all tests pass

## License

[Your License Here]
