# 🔄 Migration Guide

## Changes Made

This guide documents the architectural improvements made to the codebase.

## ✅ What Changed

### 1. New Folder Structure

#### Added:

```
src/
├── components/
│   ├── common/              # NEW: Shared components
│   │   └── ImageWithFallback.tsx (moved from figma/)
│   └── layout/              # NEW: Layout components
│       └── AppLayout.tsx
├── services/                # NEW: Business logic layer
│   ├── storage.service.ts
│   └── transaction.service.ts
└── utils/                   # NEW: Utility functions
    ├── format.ts
    └── validation.ts
```

#### Removed:

```
src/
├── components/figma/        # DELETED: Moved to common/
└── App.css                  # DELETED: Unused styles
```

### 2. Service Layer

**Before**:

```typescript
// Business logic scattered in components
const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
```

**After**:

```typescript
// Centralized in services
import { TransactionService } from "@/services";
const transactions = TransactionService.getAll();
```

### 3. Updated Hooks

#### `useLocalStorage`

Now uses `StorageService` for consistency:

```typescript
// Before
const item = window.localStorage.getItem(key);

// After
return StorageService.get<T>(key, initialValue);
```

#### `useTransactions`

Now uses `TransactionService`:

```typescript
// Before
const data = JSON.parse(localStorage.getItem("transactions") || "[]");

// After
const data = TransactionService.getAll();
```

### 4. Layout Component

**Before**:

```typescript
// App.tsx
return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    {/* content */}
  </div>
);
```

**After**:

```typescript
// App.tsx
import { AppLayout } from "@/components/layout";

return <AppLayout>{/* content */}</AppLayout>;
```

### 5. Utility Functions

**New utilities added**:

- `formatCurrency()` - Format numbers as IDR
- `formatDate()` - Format timestamps
- `formatTime()` - Format time only
- `isValidPlateNumber()` - Validate plate format
- `normalizePlateNumber()` - Normalize plate input

## 📝 How to Use New Structure

### Importing Services

```typescript
// ✅ Good
import { TransactionService, StorageService } from "@/services";

// Create transaction
const transaction = TransactionService.create(plate, type);

// Complete transaction
const completed = TransactionService.complete(id);

// Get all transactions
const all = TransactionService.getAll();
```

### Using Utilities

```typescript
// ✅ Good
import { formatCurrency, formatDate, isValidPlateNumber } from "@/utils";

// Format currency
const price = formatCurrency(5000); // "Rp 5.000"

// Format date
const date = formatDate(Date.now()); // "23/11/2024, 14:30"

// Validate plate
const isValid = isValidPlateNumber("B 1234 CD"); // true
```

### Using Layout

```typescript
// ✅ Good
import { AppLayout } from "@/components/layout";

export function MyPage() {
  return (
    <AppLayout>
      <h1>My Content</h1>
    </AppLayout>
  );
}
```

### Using Common Components

```typescript
// ✅ Good
import { ImageWithFallback } from "@/components/common";

export function MyComponent() {
  return <ImageWithFallback src="/image.jpg" alt="Description" />;
}
```

## 🔧 Breaking Changes

### None!

All changes are **backward compatible**. Existing code continues to work.

## 🎯 Recommended Updates

While not required, consider updating your code to use the new patterns:

### 1. Replace Direct localStorage Access

**Before**:

```typescript
const data = JSON.parse(localStorage.getItem("key") || "[]");
localStorage.setItem("key", JSON.stringify(data));
```

**After**:

```typescript
import { StorageService } from "@/services";

const data = StorageService.get("key", []);
StorageService.set("key", data);
```

### 2. Use Transaction Service

**Before**:

```typescript
const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
const newTransaction = {
  id: Date.now().toString(),
  // ... manual creation
};
transactions.push(newTransaction);
localStorage.setItem("transactions", JSON.stringify(transactions));
```

**After**:

```typescript
import { TransactionService } from "@/services";

const transaction = TransactionService.create(plate, type);
```

### 3. Use Format Utilities

**Before**:

```typescript
const formatted = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
}).format(amount);
```

**After**:

```typescript
import { formatCurrency } from "@/utils";

const formatted = formatCurrency(amount);
```

## 📚 New Documentation

Three new documentation files added:

1. **README.md** - Project overview and getting started
2. **ARCHITECTURE.md** - Detailed architecture guide
3. **FOLDER_STRUCTURE.md** - Complete folder structure reference
4. **MIGRATION_GUIDE.md** - This file

## 🚀 Next Steps

### Immediate (Optional)

1. Update components to use new services
2. Replace direct localStorage calls
3. Use format utilities

### Future Improvements

1. Add unit tests for services
2. Add integration tests for features
3. Remove unused UI components
4. Add API service layer (when backend ready)
5. Add error boundary components
6. Add loading states
7. Add toast notifications

## ❓ FAQ

### Q: Do I need to update my existing code?

**A:** No, all changes are backward compatible. Updates are optional but recommended.

### Q: Where should I put new business logic?

**A:** In `/services` folder. Create a new service file if needed.

### Q: Where should I put new utility functions?

**A:** In `/utils` folder. Add to existing files or create new ones.

### Q: Can I still use localStorage directly?

**A:** Yes, but using `StorageService` is recommended for consistency.

### Q: What if I need a new feature?

**A:** Follow the pattern:

1. Create folder in `/components/features/{feature}`
2. Add service in `/services/{feature}.service.ts`
3. Add types in `/types/index.ts`
4. Add constants in `/constants/index.ts`

## 📞 Support

For questions or issues with the new structure:

1. Check [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Check [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)
3. Review code examples in this guide
