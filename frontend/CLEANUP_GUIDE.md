# 🧹 Cleanup Guide

## Unused UI Components

The project includes 50+ shadcn/ui components, but many are not used. These components have missing dependencies and can be safely removed.

### ❌ Components with Missing Dependencies

These components require additional npm packages that aren't installed:

```
src/components/ui/
├── accordion.tsx          # Requires: @radix-ui/react-accordion
├── alert-dialog.tsx       # Requires: @radix-ui/react-alert-dialog
├── aspect-ratio.tsx       # Requires: @radix-ui/react-aspect-ratio
├── avatar.tsx             # Requires: @radix-ui/react-avatar
├── calendar.tsx           # Requires: react-day-picker
├── carousel.tsx           # Requires: embla-carousel-react
├── chart.tsx              # Requires: recharts
├── checkbox.tsx           # Requires: @radix-ui/react-checkbox
├── collapsible.tsx        # Requires: @radix-ui/react-collapsible
├── context-menu.tsx       # Requires: @radix-ui/react-context-menu
├── drawer.tsx             # Requires: vaul
├── dropdown-menu.tsx      # Requires: @radix-ui/react-dropdown-menu
├── form.tsx               # Requires: react-hook-form, @radix-ui/react-label
├── hover-card.tsx         # Requires: @radix-ui/react-hover-card
├── input-otp.tsx          # Requires: input-otp
├── label.tsx              # Requires: @radix-ui/react-label
├── menubar.tsx            # Requires: @radix-ui/react-menubar
├── navigation-menu.tsx    # Requires: @radix-ui/react-navigation-menu
├── popover.tsx            # Requires: @radix-ui/react-popover
├── progress.tsx           # Requires: @radix-ui/react-progress
├── radio-group.tsx        # Requires: @radix-ui/react-radio-group
├── resizable.tsx          # Requires: react-resizable-panels
├── scroll-area.tsx        # Requires: @radix-ui/react-scroll-area
├── select.tsx             # Requires: @radix-ui/react-select
├── separator.tsx          # Requires: @radix-ui/react-separator
├── slider.tsx             # Requires: @radix-ui/react-slider
├── sonner.tsx             # Requires: sonner, next-themes
├── switch.tsx             # Requires: @radix-ui/react-switch
├── tabs.tsx               # Requires: @radix-ui/react-tabs
├── toggle-group.tsx       # Requires: @radix-ui/react-toggle-group
├── toggle.tsx             # Requires: @radix-ui/react-toggle
└── tooltip.tsx            # Requires: @radix-ui/react-tooltip
```

### ✅ Components Currently Used

These are the components actually used in the project:

```
src/components/ui/
├── alert.tsx              # Used in AdminScanner
├── badge.tsx              # Used in multiple features
├── button.tsx             # Used everywhere
├── card.tsx               # Used everywhere
├── input.tsx              # Used in forms
├── label.tsx              # Used in forms (simplified version, no Radix dependency)
├── table.tsx              # Used in AdminDashboard
└── use-mobile.ts          # Utility hook
```

## 🗑️ How to Clean Up

### Option 1: Remove Unused Components (Recommended)

```bash
cd frontend/src/components/ui

# Remove unused components
rm accordion.tsx alert-dialog.tsx aspect-ratio.tsx avatar.tsx \
   calendar.tsx carousel.tsx chart.tsx checkbox.tsx collapsible.tsx \
   context-menu.tsx drawer.tsx dropdown-menu.tsx form.tsx \
   hover-card.tsx input-otp.tsx menubar.tsx navigation-menu.tsx \
   popover.tsx progress.tsx radio-group.tsx resizable.tsx \
   scroll-area.tsx select.tsx separator.tsx slider.tsx sonner.tsx \
   switch.tsx tabs.tsx toggle-group.tsx toggle.tsx tooltip.tsx
```

### Option 2: Install Missing Dependencies

If you plan to use these components later:

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog \
  @radix-ui/react-aspect-ratio @radix-ui/react-avatar \
  @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card @radix-ui/react-label \
  @radix-ui/react-menubar @radix-ui/react-navigation-menu \
  @radix-ui/react-popover @radix-ui/react-progress \
  @radix-ui/react-radio-group @radix-ui/react-scroll-area \
  @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slider @radix-ui/react-switch \
  @radix-ui/react-tabs @radix-ui/react-toggle \
  @radix-ui/react-toggle-group @radix-ui/react-tooltip \
  react-day-picker embla-carousel-react recharts vaul \
  input-otp sonner next-themes react-hook-form \
  react-resizable-panels
```

## 📊 Impact Analysis

### Before Cleanup

- **Total UI Components**: 50+
- **Used Components**: ~8
- **Unused Components**: ~42
- **Build Errors**: 40+ (missing dependencies)

### After Cleanup

- **Total UI Components**: ~8
- **Used Components**: ~8
- **Unused Components**: 0
- **Build Errors**: 0

## 🎯 Recommended Action

**Remove unused components** to:

1. Reduce codebase size
2. Eliminate build errors
3. Improve maintainability
4. Speed up builds
5. Reduce confusion

You can always add them back later using shadcn/ui CLI:

```bash
npx shadcn@latest add accordion
npx shadcn@latest add calendar
# etc.
```

## 🔍 How to Check Component Usage

Before removing a component, verify it's not used:

```bash
# Check if component is imported anywhere
grep -r "from '@/components/ui/accordion'" src/

# If no results, safe to delete
```

## 📝 Notes

- The `label.tsx` component might be needed if you install `@radix-ui/react-label`
- The `dialog.tsx` component is used by `command.tsx` (which is used)
- Keep `use-mobile.ts` as it's a utility hook
- The `sidebar.tsx` component is complete but unused

## ✨ After Cleanup

Your `/components/ui` folder will be clean and focused:

```
src/components/ui/
├── alert.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── command.tsx
├── dialog.tsx
├── input.tsx
├── table.tsx
└── use-mobile.ts
```

Much cleaner! 🎉
