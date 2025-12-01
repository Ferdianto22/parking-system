# 🚀 Quick Reference

## 📂 Where to Put Things

| What                  | Where                             | Example                |
| --------------------- | --------------------------------- | ---------------------- |
| New feature component | `/components/features/{feature}/` | `PaymentForm.tsx`      |
| Shared component      | `/components/common/`             | `LoadingSpinner.tsx`   |
| Layout component      | `/components/layout/`             | `DashboardLayout.tsx`  |
| UI component          | `/components/ui/`                 | `button.tsx`           |
| Business logic        | `/services/`                      | `payment.service.ts`   |
| Utility function      | `/utils/`                         | `calculateDiscount.ts` |
| Custom hook           | `/hooks/`                         | `usePayment.ts`        |
| Type definition       | `/types/`                         | Add to `index.ts`      |
| Constant              | `/constants/`                     | Add to `index.ts`      |

## 💡 Common Patterns

### Creating a New Feature

```typescript
// 1. Create component
// src/components/features/payment/PaymentForm.tsx
import type { Payment } from "@/types";

export function PaymentForm() {
  // Component code
}

// 2. Export via barrel
// src/components/features/payment/index.ts
export { PaymentForm } from "./PaymentForm";

// 3. Add service (if needed)
// src/services/payment.service.ts
export class PaymentService {
  static process(payment: Payment) {
    // Business logic
  }
}

// 4. Add types
// src/types/index.ts
export interface Payment {
  id: string;
  amount: number;
}
```

### Using Services

```typescript
import { TransactionService } from "@/services";

// Create
const transaction = TransactionService.create(plate, type);

// Read
const all = TransactionService.getAll();
const one = TransactionService.getById(id);

// Update
const completed = TransactionService.complete(id);

// Delete
TransactionService.delete(id);
```

### Using Utils

```typescript
import { formatCurrency, formatDate, isValidPlateNumber } from "@/utils";

const price = formatCurrency(5000); // "Rp 5.000"
const date = formatDate(Date.now()); // "23/11/2024, 14:30"
const valid = isValidPlateNumber("B 1234 CD"); // true
```

### Using Hooks

```typescript
import { useTransactions, useLocalStorage } from "@/hooks";

// Transactions with real-time updates
const { transactions } = useTransactions();

// Synced localStorage
const [value, setValue] = useLocalStorage("key", defaultValue);
```

## 🎯 Import Patterns

```typescript
// ✅ Good: Use path aliases
import { Button } from "@/components/ui/button";
import { TransactionService } from "@/services";
import type { Transaction } from "@/types";

// ❌ Bad: Relative paths for shared code
import { Button } from "../../../components/ui/button";

// ✅ Good: Type-only imports
import type { Transaction } from "@/types";

// ❌ Bad: Regular imports for types
import { Transaction } from "@/types";
```

## 🔧 Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint

# Add shadcn component
npx shadcn@latest add button
```

## 📝 File Naming

| Type      | Convention           | Example              |
| --------- | -------------------- | -------------------- |
| Component | PascalCase.tsx       | `PaymentForm.tsx`    |
| Service   | camelCase.service.ts | `payment.service.ts` |
| Hook      | useCamelCase.ts      | `usePayment.ts`      |
| Util      | camelCase.ts         | `formatCurrency.ts`  |
| Type      | camelCase.ts         | `index.ts`           |
| Constant  | UPPER_SNAKE_CASE     | `PAYMENT_METHODS`    |

## 🎨 Component Template

```typescript
import type { ReactNode } from "react";

interface MyComponentProps {
  title: string;
  children?: ReactNode;
  onAction?: () => void;
}

export function MyComponent({ title, children, onAction }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

## 🔍 Finding Things

```bash
# Find component usage
grep -r "MyComponent" src/

# Find type usage
grep -r "Transaction" src/

# Find service usage
grep -r "TransactionService" src/
```

## 📚 Documentation

| Document                                             | Purpose            |
| ---------------------------------------------------- | ------------------ |
| [README.md](./README.md)                             | Getting started    |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | Architecture guide |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)         | Complete structure |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)           | How to migrate     |
| [CLEANUP_GUIDE.md](./CLEANUP_GUIDE.md)               | Remove unused code |
| [IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md) | What changed       |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)           | This file          |

## 🆘 Troubleshooting

### TypeScript Error: "Cannot find module"

```bash
# Install missing dependency
npm install <package-name>
```

### Import Error: "Module not found"

```typescript
// Check path alias is correct
import { X } from "@/components/..."; // ✅
import { X } from "components/..."; // ❌
```

### Type Error: "Type must be imported using type-only import"

```typescript
// Use type-only import
import type { Transaction } from "@/types"; // ✅
import { Transaction } from "@/types"; // ❌
```

## 💡 Tips

1. **Use barrel exports** - Import from folder, not file
2. **Keep components small** - Single responsibility
3. **Use services for logic** - Keep components clean
4. **Type everything** - No implicit any
5. **Document complex code** - Help future you

## 🎯 Best Practices

- ✅ Use TypeScript strictly
- ✅ Follow folder structure
- ✅ Use path aliases (@/)
- ✅ Type-only imports for types
- ✅ Services for business logic
- ✅ Utils for pure functions
- ✅ Hooks for stateful logic
- ✅ Components for UI only

---

**Need more details?** Check the full documentation files! 📚
