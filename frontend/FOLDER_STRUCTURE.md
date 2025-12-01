# 📁 Folder Structure

## Complete Directory Tree

```
frontend/
├── .vscode/                    # VS Code workspace settings
│   ├── settings.json          # Editor configuration
│   └── extensions.json        # Recommended extensions
│
├── public/                     # Static assets
│   └── vite.svg               # Favicon
│
├── src/                        # Source code
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   │   ├── ImageWithFallback.tsx
│   │   │   └── index.ts      # Barrel export
│   │   │
│   │   ├── features/         # Feature modules
│   │   │   ├── admin/       # Admin feature
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── AdminScanner.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── driver/      # Driver feature
│   │   │       ├── DriverLanding.tsx
│   │   │       ├── DriverTicket.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── layout/          # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (50+ components)
│   │   │
│   │   └── index.ts         # Main barrel export
│   │
│   ├── constants/           # App constants
│   │   └── index.ts        # TARIF, ROUTES
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useDuration.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTransactions.ts
│   │   └── index.ts
│   │
│   ├── lib/                # Third-party configs
│   │   └── utils.ts       # cn() helper
│   │
│   ├── services/           # Business logic
│   │   ├── storage.service.ts
│   │   ├── transaction.service.ts
│   │   └── index.ts
│   │
│   ├── styles/             # Global styles
│   │   └── globals.css    # Theme variables
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts       # Transaction, View, etc.
│   │
│   ├── utils/              # Utility functions
│   │   ├── format.ts      # formatCurrency, formatDate
│   │   ├── validation.ts  # isValidPlateNumber
│   │   └── index.ts
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind imports
│
├── .gitignore              # Git ignore rules
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tsconfig.app.json       # App TS config
├── tsconfig.node.json      # Node TS config
├── vite.config.ts          # Vite configuration
├── README.md               # Project documentation
├── ARCHITECTURE.md         # Architecture guide
└── FOLDER_STRUCTURE.md     # This file
```

## 📂 Folder Purposes

### `/components`

React components organized by type and feature.

**Subfolders**:

- `common/`: Reusable across features (ImageWithFallback)
- `features/`: Feature-specific components (admin, driver)
- `layout/`: Page layouts and wrappers (AppLayout)
- `ui/`: shadcn/ui component library

### `/constants`

Application-wide constants and configuration.

**Files**:

- `index.ts`: TARIF (pricing), ROUTES (navigation)

### `/hooks`

Custom React hooks for reusable stateful logic.

**Files**:

- `useDuration.ts`: Calculate parking duration
- `useLocalStorage.ts`: Sync state with localStorage
- `useTransactions.ts`: Manage transactions with real-time updates

### `/lib`

Third-party library configurations and utilities.

**Files**:

- `utils.ts`: Tailwind cn() helper for class merging

### `/services`

Business logic layer - no React dependencies.

**Files**:

- `storage.service.ts`: localStorage abstraction
- `transaction.service.ts`: Transaction CRUD operations

### `/styles`

Global CSS and theme configuration.

**Files**:

- `globals.css`: CSS variables, theme tokens

### `/types`

TypeScript type definitions.

**Files**:

- `index.ts`: Transaction, View, VehicleType, etc.

### `/utils`

Pure utility functions - no side effects.

**Files**:

- `format.ts`: Currency, date, time formatting
- `validation.ts`: Input validation helpers

## 🎯 Import Patterns

### Barrel Exports (index.ts)

Each major folder has an `index.ts` for clean imports:

```typescript
// ✅ Clean import
import { TransactionService } from "@/services";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";

// ❌ Avoid deep imports
import { TransactionService } from "@/services/transaction.service";
```

### Path Aliases

Use `@/` for absolute imports:

```typescript
// ✅ Good
import { Transaction } from "@/types";

// ❌ Avoid relative paths for shared code
import { Transaction } from "../../../types";
```

## 📝 File Naming

- **Components**: PascalCase.tsx (`DriverLanding.tsx`)
- **Hooks**: camelCase.ts (`useTransactions.ts`)
- **Services**: camelCase.service.ts (`transaction.service.ts`)
- **Utils**: camelCase.ts (`format.ts`)
- **Types**: camelCase.ts (`index.ts`)
- **Barrel exports**: `index.ts`

## 🚀 Adding New Features

### 1. Create Feature Folder

```
src/components/features/payment/
├── PaymentForm.tsx
├── PaymentHistory.tsx
└── index.ts
```

### 2. Add Service (if needed)

```
src/services/payment.service.ts
```

### 3. Add Types

```typescript
// src/types/index.ts
export interface Payment {
  id: string;
  amount: number;
  // ...
}
```

### 4. Add Constants

```typescript
// src/constants/index.ts
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
} as const;
```

## 🧹 Cleanup Guidelines

### Remove Unused UI Components

The project includes 50+ shadcn/ui components. Remove unused ones:

```bash
# Check component usage
grep -r "from '@/components/ui/accordion'" src/

# If not used, delete
rm src/components/ui/accordion.tsx
```

### Consolidate Similar Files

- Merge duplicate CSS files
- Combine related utilities
- Group related types

## 📦 Component Organization

### Feature-Based Structure

```
features/
├── admin/           # Admin domain
│   ├── AdminDashboard.tsx
│   ├── AdminScanner.tsx
│   └── index.ts
│
└── driver/          # Driver domain
    ├── DriverLanding.tsx
    ├── DriverTicket.tsx
    └── index.ts
```

### Benefits:

- Easy to find related code
- Clear feature boundaries
- Scalable architecture
- Simple to delete features

## 🔍 Quick Reference

| Need               | Location                          |
| ------------------ | --------------------------------- |
| Add component      | `/components/features/{feature}/` |
| Add business logic | `/services/{name}.service.ts`     |
| Add utility        | `/utils/{name}.ts`                |
| Add type           | `/types/index.ts`                 |
| Add constant       | `/constants/index.ts`             |
| Add hook           | `/hooks/use{Name}.ts`             |
| Add UI component   | `/components/ui/{name}.tsx`       |
| Add layout         | `/components/layout/{Name}.tsx`   |

## 📚 Related Documentation

- [README.md](./README.md) - Getting started
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture principles
