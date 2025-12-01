# Frontend Architecture Guide

## 🏛️ Architecture Overview

This project follows a **feature-based architecture** with clear separation of concerns.

```
src/
├── components/       # UI Components
├── services/        # Business Logic Layer
├── hooks/           # React Hooks
├── utils/           # Pure Functions
├── types/           # TypeScript Definitions
├── constants/       # Configuration
├── lib/             # Third-party Setup
└── styles/          # Global Styles
```

## 📦 Layer Responsibilities

### 1. Components Layer (`/components`)

**Purpose**: Presentational and container components

#### Structure:

- **common/**: Reusable components (ImageWithFallback, etc.)
- **features/**: Feature-specific components
  - `admin/`: Admin dashboard, scanner
  - `driver/`: Driver landing, ticket view
- **layout/**: Page layouts (AppLayout)
- **ui/**: shadcn/ui component library

**Rules**:

- Components should be pure and focused
- Use TypeScript for props
- Export via barrel files (index.ts)
- Keep business logic in services

### 2. Services Layer (`/services`)

**Purpose**: Business logic and data management

#### Current Services:

- **StorageService**: localStorage abstraction
- **TransactionService**: Parking transaction operations

**Rules**:

- Services are classes with static methods
- Handle all data transformations
- No React dependencies
- Return typed data

**Example**:

```typescript
// Good
const transaction = TransactionService.create(plate, type);

// Bad - don't put business logic in components
const transaction = {
  id: Date.now().toString(),
  // ... manual creation
};
```

### 3. Hooks Layer (`/hooks`)

**Purpose**: Reusable stateful logic

#### Current Hooks:

- **useLocalStorage**: Synced state with localStorage
- **useTransactions**: Real-time transaction management
- **useDuration**: Time duration calculations

**Rules**:

- Hooks can use services
- Must start with "use"
- Export via barrel file
- Document parameters

### 4. Utils Layer (`/utils`)

**Purpose**: Pure utility functions

#### Current Utils:

- **format.ts**: Currency, date, time formatting
- **validation.ts**: Input validation

**Rules**:

- Pure functions only (no side effects)
- No React dependencies
- Well-typed inputs/outputs
- Unit testable

### 5. Types Layer (`/types`)

**Purpose**: TypeScript type definitions

**Rules**:

- Use `type` for unions and primitives
- Use `interface` for objects
- Export all types
- Co-locate feature-specific types

### 6. Constants Layer (`/constants`)

**Purpose**: App-wide configuration

**Rules**:

- Use UPPER_CASE for constants
- Group related constants
- Type all constants
- No magic numbers in code

## 🔄 Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Hook (State Management)
    ↓
Service (Business Logic)
    ↓
Storage/API
```

## 🎯 Best Practices

### Component Design

```typescript
// ✅ Good: Small, focused component
export function ParkingCard({ transaction }: Props) {
  return <Card>...</Card>;
}

// ❌ Bad: Too many responsibilities
export function Dashboard() {
  // Fetching, state, rendering, business logic all in one
}
```

### Service Usage

```typescript
// ✅ Good: Use services for business logic
const handleCheckout = (id: string) => {
  const transaction = TransactionService.complete(id);
  if (transaction) {
    navigate("ticket", transaction.id);
  }
};

// ❌ Bad: Business logic in component
const handleCheckout = (id: string) => {
  const transactions = JSON.parse(localStorage.getItem("..."));
  const transaction = transactions.find((t) => t.id === id);
  transaction.waktu_keluar = Date.now();
  // ... more logic
};
```

### Type Safety

```typescript
// ✅ Good: Explicit types
interface Props {
  onNavigate: (view: View, id?: string) => void;
}

// ❌ Bad: Any types
interface Props {
  onNavigate: any;
}
```

## 📝 Naming Conventions

- **Components**: PascalCase (`DriverLanding.tsx`)
- **Hooks**: camelCase with "use" prefix (`useTransactions.ts`)
- **Services**: PascalCase with "Service" suffix (`TransactionService.ts`)
- **Utils**: camelCase (`formatCurrency`)
- **Types**: PascalCase (`Transaction`, `VehicleType`)
- **Constants**: UPPER_SNAKE_CASE (`TARIF`, `ROUTES`)

## 🔌 Import Order

```typescript
// 1. External dependencies
import { useState } from "react";
import { Button } from "@radix-ui/react-button";

// 2. Internal absolute imports (using @/)
import { TransactionService } from "@/services";
import { formatCurrency } from "@/utils";
import type { Transaction } from "@/types";

// 3. Relative imports
import { Header } from "./Header";
```

## 🧪 Testing Strategy

### Unit Tests

- Utils functions
- Service methods
- Custom hooks

### Integration Tests

- Feature components
- User flows

### E2E Tests

- Critical paths
- Admin workflows

## 🚀 Performance Considerations

1. **Code Splitting**: Use React.lazy() for routes
2. **Memoization**: Use React.memo() for expensive components
3. **Virtual Lists**: For large transaction lists
4. **Debouncing**: For search/filter inputs
5. **Service Workers**: For offline support

## 📚 Further Reading

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
