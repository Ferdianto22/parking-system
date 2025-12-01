# Parking Management System - Frontend

Modern parking management system built with React, TypeScript, and Tailwind CSS.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared/reusable components
│   ├── features/       # Feature-specific components
│   │   ├── admin/     # Admin dashboard & scanner
│   │   └── driver/    # Driver landing & ticket
│   ├── layout/        # Layout components
│   └── ui/            # shadcn/ui components
├── constants/         # App constants & config
├── hooks/            # Custom React hooks
├── lib/              # Third-party lib configs
├── services/         # Business logic & API calls
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

```

## 🏗️ Architecture Principles

### Component Organization

- **common/**: Reusable UI components (ImageWithFallback, etc.)
- **features/**: Domain-specific components grouped by feature
- **layout/**: Page layouts and wrappers
- **ui/**: shadcn/ui component library

### Services Layer

- **StorageService**: localStorage abstraction
- **TransactionService**: Business logic for parking transactions

### Utilities

- **format.ts**: Currency, date, time formatting
- **validation.ts**: Input validation helpers
- **lib/utils.ts**: General utilities (cn, etc.)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Radix UI** - Headless components
- **Lucide React** - Icons

## 📝 Code Style

- Use functional components with hooks
- Prefer named exports for components
- Keep components small and focused
- Use TypeScript for type safety
- Follow the established folder structure

## 🔧 Path Aliases

- `@/*` - Maps to `src/*`

Example:

```typescript
import { Button } from "@/components/ui/button";
import { TransactionService } from "@/services";
import { formatCurrency } from "@/utils";
```
