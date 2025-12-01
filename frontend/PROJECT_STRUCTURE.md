# QRPark Frontend - Project Structure

## 📁 Folder Organization

```
frontend/src/
├── components/
│   ├── features/          # Feature-based components
│   │   ├── admin/         # Admin-related features
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminScanner.tsx
│   │   │   └── index.ts
│   │   └── driver/        # Driver-related features
│   │       ├── DriverLanding.tsx
│   │       ├── DriverTicket.tsx
│   │       └── index.ts
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (50+ components)
│   └── figma/             # Figma-specific components
│       └── ImageWithFallback.tsx
├── hooks/                 # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useTransactions.ts
│   ├── useDuration.ts
│   └── index.ts
├── lib/                   # Utility functions
│   └── utils.ts           # cn() helper for className merging
├── types/                 # TypeScript type definitions
│   └── index.ts
├── constants/             # App constants
│   └── index.ts           # TARIF, ROUTES
├── styles/                # Global styles
│   └── globals.css
├── assets/                # Static assets
│   └── react.svg
├── App.tsx                # Main app component with routing
├── main.tsx               # App entry point
└── index.css              # Tailwind CSS imports
```

## 🎯 Architecture Principles

### 1. **Feature-Based Organization**

Components are organized by feature (admin, driver) rather than by type. This makes it easier to:

- Find related components
- Understand feature boundaries
- Scale the application
- Maintain code

### 2. **Separation of Concerns**

- **Components**: UI rendering logic
- **Hooks**: Reusable stateful logic
- **Types**: TypeScript definitions
- **Constants**: Configuration values
- **Lib**: Pure utility functions

### 3. **Path Aliases**

Using `@/` prefix for clean imports:

```typescript
// ❌ Bad
import { Button } from "../../../components/ui/button";

// ✅ Good
import { Button } from "@/components/ui/button";
```

### 4. **Index Files**

Each feature folder exports its components through `index.ts`:

```typescript
// components/features/driver/index.ts
export { DriverLanding } from "./DriverLanding";
export { DriverTicket } from "./DriverTicket";
```

## 🔧 Key Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **QRCode.react** - QR code generation

## 📦 Custom Hooks

### `useLocalStorage`

Persistent state management with localStorage

```typescript
const [value, setValue] = useLocalStorage("key", initialValue);
```

### `useTransactions`

Manages parking transactions with auto-refresh

```typescript
const { transactions, addTransaction, updateTransaction } = useTransactions();
```

### `useDuration`

Real-time duration calculation

```typescript
const duration = useDuration(startTime); // "02:30:45"
```

## 🎨 UI Components

All UI components from shadcn/ui are in `components/ui/`:

- Fully typed with TypeScript
- Accessible (ARIA compliant)
- Customizable with Tailwind
- Consistent design system

## 🚀 Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Component Composition**: Build complex UIs from simple components
3. **Custom Hooks**: Extract reusable logic
4. **Consistent Naming**: PascalCase for components, camelCase for functions
5. **Single Responsibility**: Each component does one thing well
6. **DRY Principle**: Don't repeat yourself - use hooks and utilities

## 🔄 Data Flow

```
localStorage ←→ useTransactions hook ←→ Components
                      ↓
                  Real-time updates (1s interval)
```

## 📝 Type Definitions

All types are centralized in `types/index.ts`:

- `Transaction` - Parking transaction data
- `View` - App view/route types
- `VehicleType` - Motor or Mobil
- `NavigationProps` - Navigation function props

## 🎯 Future Improvements

- [ ] Replace localStorage with Supabase
- [ ] Add React Router for proper routing
- [ ] Implement state management (Zustand/Redux)
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement error boundaries
- [ ] Add loading states
- [ ] Optimize bundle size
