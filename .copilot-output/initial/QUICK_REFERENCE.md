# @tenorlab/dashboard-core - Quick Reference Guide

## What is @tenorlab/dashboard-core?

A **framework-agnostic** TypeScript library providing foundational types, interfaces, and utilities for building customizable dashboard systems. It's designed to be consumed by framework-specific packages (React, Vue, Svelte, etc.) but can also be used standalone in vanilla JavaScript/TypeScript projects.

**Key Characteristics:**
- ✅ **Zero dependencies** - Pure TypeScript, no external libraries
- ✅ **Framework-agnostic** - Works with React, Vue, Svelte, or vanilla JS
- ✅ **Type-safe** - Comprehensive TypeScript interfaces
- ✅ **Extensible** - Plugin architecture for widgets
- ✅ **Themeable** - CSS variable-based customization
- ✅ **Persistent** - Built-in localStorage support
- ✅ **Reversible** - Undo/redo history support

---

## Core Concepts

### 1. Dashboard Configuration (`IDashboardConfig`)
The complete state of a dashboard, immutable and JSON-serializable.

```typescript
interface IDashboardConfig {
  widgets: Record<TDashboardWidgetKey, IDashboardWidget>;
  settings: IDashboardSettingEntry[];
  zoomScale: number;
  gridConfig: IGridConfig;
  undoHistory: TUndoHistoryEntry[];
}
```

### 2. Widget System
Widgets are the building blocks of dashboards. They're registered in a catalog and lazily loaded.

```typescript
// Widget registration
type TDashboardWidgetCatalogBase = Record<string, IDynamicWidgetCatalogEntryBase>;

// Widget instance
interface IDashboardWidget {
  key: TDashboardWidgetKey;
  componentKey: string;
  gridPosition: { x: number; y: number; width: number; height: number };
  props: IDashboardWidgetPropsBase;
}
```

### 3. Settings & Theming
Seven CSS properties that control dashboard appearance, all customizable.

```typescript
interface IDashboardSettingEntry {
  propertyName: string; // 'grid-gap', 'widget-width', etc.
  value: number | string;
  unit: string; // 'rem', 'px', '%', etc.
}
```

### 4. State Mutations
All operations on dashboard state are immutable - they return new config instances.

```typescript
// Example mutations (from store-utils)
function addWidget(...): TAddWidgetResponse {
  return {
    success: boolean;
    config: IDashboardConfig; // new instance
    error?: string;
  }
}
```

### 5. Storage Persistence
Dashboard configurations can be saved and loaded from storage.

```typescript
interface IDashboardStorageService {
  getSavedDashboards(): Promise<IDashboardConfig[]>;
  saveDashboards(configs: IDashboardConfig[]): Promise<void>;
}
```

---

## Module Structure

| Module | Purpose | Key Exports |
|--------|---------|------------|
| **interfaces/** | Type definitions | `IDashboardConfig`, `IDashboardWidget`, `TDashboardWidgetCatalogBase` |
| **dashboard-settings/** | Theme management | `cssSettingsCatalog`, `incrementOrDecrementValue()` |
| **storage-service/** | Persistence layer | `IDashboardStorageService` |
| **utils/** | Business logic | `blankDashboardConfig()`, `addWidget()`, `getCssVariableValue()` |
| **styles/** | CSS variables | CSS variable root definitions |

---

## Key Functions & Constants

### Core Utilities
```typescript
// src/utils/core-utils.ts
blankDashboardConfig(): IDashboardConfig;
parseContainerTitle(title: string): { name: string; index?: number };
ensureZoomScaleIsWithinRange(scale: number): number;

// Constants
const DashboardMinZoomScale = 0.7;
const DashboardMaxZoomScale = 1.0;
const DashboardZoomStep = 0.05;
```

### Store Utilities (State Mutations)
```typescript
// src/utils/store-utils.ts
getNextContainerName(config: IDashboardConfig): string;
addWidget(config, widgetKey, componentKey, position): TAddWidgetResponse;
removeWidget(config, widgetKey): TRemoveWidgetResponse;
moveWidget(config, widgetKey, newPosition): TMoveWidgetResponse;
```

### CSS Utilities
```typescript
// src/utils/css-vars-utils.ts
getCssVariableValue(varName: string): string;
setCssVariableValue(varName: string, value: string): void;
restoreCssVarsFromSettings(settings: IDashboardSettingEntry[]): void;

// src/utils/color-utils.ts
resolveColorFromClass(className: string): string;

// src/utils/use-distinct-css-classes.ts
useDistinctCssClasses(classes: string[]): string[];
```

### Settings Utilities
```typescript
// src/dashboard-settings/dashboard-settings-utils.ts
incrementOrDecrementValue(
  value: number | string,
  unit: string,
  increment: number
): string;

// cssSettingsCatalog
const cssSettingsCatalog: IDashboardSettingEntry[] = [
  { propertyName: 'grid-gap', value: 1, unit: 'rem' },
  { propertyName: 'widget-width', value: 15, unit: 'rem' },
  { propertyName: 'border-radius', value: 0.25, unit: 'rem' },
  { propertyName: 'container-padding', value: 1, unit: 'rem' },
  { propertyName: 'font-size-base', value: 0.875, unit: 'rem' },
  { propertyName: 'font-size-heading', value: 1.125, unit: 'rem' },
  { propertyName: 'font-size-small', value: 0.75, unit: 'rem' }
];
```

---

## Common Patterns

### Pattern 1: Creating a Blank Dashboard
```typescript
import { blankDashboardConfig } from '@tenorlab/dashboard-core';

const newDashboard = blankDashboardConfig();
// Returns IDashboardConfig with empty widgets, default settings, etc.
```

### Pattern 2: Adding a Widget
```typescript
import { addWidget } from '@tenorlab/dashboard-core';

const result = addWidget(
  currentConfig,
  'widget-1',           // widget key (unique ID)
  'chart-widget',       // component key (type)
  { x: 0, y: 0, width: 4, height: 4 }  // grid position
);

if (result.success) {
  // Use result.config as new dashboard state
  setDashboard(result.config);
} else {
  console.error(result.error);
}
```

### Pattern 3: Applying Theme Changes
```typescript
import { setCssVariableValue } from '@tenorlab/dashboard-core';

// User increases grid gap
setCssVariableValue('--dashboard-grid-gap', '1.5rem');
```

### Pattern 4: Persisting Dashboard
```typescript
import { useDashboardStorageService } from '@tenorlab/dashboard-core';

const storage = useDashboardStorageService();

// Save
await storage.saveDashboards([dashboardConfig]);

// Load
const saved = await storage.getSavedDashboards();
```

### Pattern 5: Extending for Framework Integration
```typescript
// In React adapter
import { IDashboardWidgetPropsBase } from '@tenorlab/dashboard-core';

interface IDashboardWidgetPropsReact extends IDashboardWidgetPropsBase {
  onClick?: React.MouseEventHandler;
  onDragStart?: React.DragEventHandler;
}

function WidgetComponent(props: IDashboardWidgetPropsReact) {
  // Component logic
}
```

---

## Widget Catalog Structure

Widgets are registered in a catalog for lazy loading and discovery:

```typescript
const widgetCatalog: TDashboardWidgetCatalogBase = {
  'text-widget': {
    metaInfo: {
      name: 'Text Widget',
      description: 'Display text content',
      category: 'Widget',
      dependencies: []
    },
    factory: () => import('./TextWidget').then(m => m.TextWidget),
    defaultSize: 'default'
  },
  'chart-line': {
    metaInfo: {
      name: 'Line Chart',
      description: 'Display line chart',
      category: 'Chart',
      dependencies: []
    },
    factory: () => import('./LineChart').then(m => m.LineChart),
    defaultSize: 'large'
  },
  // ... more widgets
};
```

**Lifecycle:**
1. Widget defined in catalog with metadata and factory function
2. When needed, factory function is called (async)
3. Component is loaded and instantiated with props from `IDashboardWidget`
4. Component receives `IDashboardWidgetPropsBase` with widget metadata

---

## Theming System

Dashboard appearance is controlled via CSS variables, which are updated programmatically:

```typescript
// CSS variables (in styles-dashboard.css)
:root {
  --dashboard-grid-gap: 1rem;
  --dashboard-widget-width: 15rem;
  --dashboard-border-radius: 0.25rem;
  --dashboard-container-padding: 1rem;
  --dashboard-font-size-base: 0.875rem;
  --dashboard-font-size-heading: 1.125rem;
  --dashboard-font-size-small: 0.75rem;
}

// Update programmatically
import { incrementOrDecrementValue } from '@tenorlab/dashboard-core';

const newValue = incrementOrDecrementValue('1rem', 'rem', 0.25);
// Returns '1.25rem'

setCssVariableValue('--dashboard-grid-gap', newValue);
```

---

## Data Flow Summary

```
User Action (click, drag, etc.)
    ↓
Mutation Function (addWidget, removeWidget, etc.)
    ↓
New IDashboardConfig Instance
    ↓
CSS Variables Applied (if settings changed)
    ↓
Framework (React/Vue) Re-renders Components
    ↓
localStorage Updated (if persistence enabled)
```

---

## Export List

The library exports everything via a single entry point:

```typescript
// Main export
export * from './interfaces';
export * from './dashboard-settings';
export * from './storage-service';
export * from './utils';

// Commonly used exports:
// Types
export type { IDashboardConfig, IDashboardWidget, IGridConfig };
export type { TDashboardWidgetKey, TDashboardWidgetCatalogBase };
export type { TAddWidgetResponse, TRemoveWidgetResponse, TMoveWidgetResponse };
export type { IDashboardSettingEntry, IDashboardStorageService };
export type { TWidgetCategory, TWidgetSize, TWidgetDirection };

// Functions
export { blankDashboardConfig, parseContainerTitle, ensureZoomScaleIsWithinRange };
export { getNextContainerName, addWidget, removeWidget, moveWidget };
export { getCssVariableValue, setCssVariableValue, restoreCssVarsFromSettings };
export { resolveColorFromClass };
export { useDistinctCssClasses };
export { useDashboardStorageService };
export { incrementOrDecrementValue, cssSettingsCatalog };
```

---

## Build & Distribution

| Output | Location | Usage |
|--------|----------|-------|
| **ESM** | `dist/dashboard-core.es.js` | Modern bundlers (Vite, Webpack, etc.) |
| **UMD** | `dist/dashboard-core.umd.js` | Browsers, Node.js, CDN |
| **Types** | `dist/index.d.ts` | TypeScript development |
| **Styles** | `dist/dashboard-core.css` | Import for CSS variables |

---

## Integration Checklist

**For Framework Implementations (React, Vue, etc.):**

- [ ] Import core types: `import { IDashboardConfig, IDashboardWidget, ... }`
- [ ] Create framework-specific prop interfaces extending `IDashboardWidgetPropsBase`
- [ ] Wrap core mutation utilities with framework state management (useState, ref, etc.)
- [ ] Create framework component wrappers for dashboard and widgets
- [ ] Implement `IDashboardStorageService` with framework-specific persistence
- [ ] Re-export all @tenorlab/dashboard-core exports for end users
- [ ] Test mutation functions and CSS variable application
- [ ] Document widget registration and creation for end users

**For End Users:**

- [ ] Install framework-specific package: `@tenorlab/react-dashboard` or `@tenorlab/vue-dashboard`
- [ ] Import types and utilities from framework package
- [ ] Create widget catalog with lazy-loaded components
- [ ] Render dashboard with configuration
- [ ] Handle widget mutations (add, remove, move)
- [ ] Implement dashboard persistence (optional)
- [ ] Customize theme via settings catalog (optional)

---

## Limitations & Constraints

1. **Grid-based Layout Only**: Widgets must be positioned on a grid system
2. **Immutable Updates**: All state mutations return new instances (no in-place updates)
3. **localStorage Persistence**: Default implementation uses localStorage (no backend support)
4. **No Real-time Sync**: Multiple tabs won't automatically sync (must implement custom listener)
5. **CSS Variables Required**: Theming relies on CSS custom properties (no fallback)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Widget not appearing | Check widget is in catalog with valid factory and component exported |
| CSS variables not applying | Ensure `restoreCssVarsFromSettings()` called after settings change |
| Undo/redo not working | Verify mutation function updates `undoHistory` in returned config |
| localStorage quota exceeded | Implement compression or cleanup of old dashboard configs |
| Type errors when extending | Ensure generic parameters properly specified (e.g., `<TExtraProps>`) |

---

## Performance Considerations

1. **Lazy Loading**: Widgets loaded on-demand via factory functions
2. **Immutable Updates**: Enables React.memo and Vue computed optimization
3. **CSS Variables**: Applied directly to DOM, no component re-renders needed
4. **Minimal Bundle**: No dependencies, ~20KB minified (core only)
5. **localStorage**: Suitable for small to medium dashboards (<50 widgets)

---

## Getting Help

- **Package Repository**: https://github.com/tenorlab/dashboard-core
- **Issue Tracker**: https://github.com/tenorlab/dashboard-core/issues
- **React Integration**: @tenorlab/react-dashboard
- **Vue Integration**: @tenorlab/vue-dashboard

---

## Version Information

- **Current Version**: 1.6.2
- **License**: MIT
- **TypeScript**: ~5.9.3
- **Build Tool**: Vite 7.2.4
- **Test Framework**: Vitest 4.0.16

