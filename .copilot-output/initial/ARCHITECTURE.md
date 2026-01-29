# @tenorlab/dashboard-core - Architecture Overview

## Project Summary

**@tenorlab/dashboard-core** is a framework-agnostic, zero-dependency TypeScript library that serves as the foundational engine for the Tenorlab dashboard ecosystem. It provides:

- **Unified Interfaces**: Core types and contracts for dashboard systems
- **Widget Management**: System for registering, creating, and manipulating dashboard widgets
- **State Management**: Configuration management, undo/redo history, and dashboard mutations
- **CSS Customization**: Programmable theme system using CSS variables
- **Storage Persistence**: localStorage-based dashboard state persistence
- **Utility Functions**: Helper functions for common dashboard operations

**Primary Purpose**: Enable consistent behavior across React, Vue, Svelte, and other framework implementations through shared type definitions and logic.

**Ecosystem Role**: Foundation layer used by `@tenorlab/react-dashboard` and `@tenorlab/vue-dashboard`, which provide framework-specific component wrappers.

---

## Core Architecture Components

### 1. **Interfaces Layer** (`src/interfaces/`)

Defines the complete type system for the dashboard ecosystem.

#### **Core Types (`core.base.ts`)**
- **`TDashboardWidgetKey`**: Unique identifier for widget instances (string)
- **`IDashboardWidgetPropsBase<TExtraProps>`**: Standard props interface for all widgets with extensibility
- **`IDynamicWidgetCatalogEntryBase<TFrameworkElementType, TFrameworkComponentType>`**: Registry entry for widgets with lazy-loading support
- **`TWidgetMetaInfoBase`**: Widget metadata (name, description, categories, dependencies)
- **`TWidgetFactoryBase`**: Async factory function for lazy-loading widget components
- **`TDashboardWidgetCatalogBase`**: Map of available widgets (`Record<string, IDynamicWidgetCatalogEntryBase>`)

#### **Enums & Categories**
- **`TWidgetCategory`**: `'Widget' | 'Chart' | 'Container'` - Widget classification system
- **`TWidgetSize`**: `'default' | 'large' | 'xlarge'` - Predefined widget sizing
- **`TWidgetDirection`**: `'row' | 'column'` - Layout direction for containers

#### **Dashboard Configuration (`core.interfaces.ts`)**
- **`IDashboardConfig`**: Complete dashboard state including:
  - `widgets`: Collection of widget instances
  - `settings`: Theme customization (spacing, sizing, typography)
  - `zoomScale`: Current zoom level (0.7 - 1.0)
  - `gridConfig`: Grid layout parameters (columns, row height)
  - `undoHistory`: Undo/redo stack

#### **State Mutations**
- **`TAddWidgetResponse`**: Result of adding widget with updated dashboard config
- **`TRemoveWidgetResponse`**: Result of removing widget with updated config
- **`TMoveWidgetResponse`**: Result of repositioning widget with updated config
- **`TUndoHistoryEntry`**: Snapshot of dashboard state for undo/redo
- **`TDashboardUndoStatus`**: Tracks undo/redo history availability

#### **Settings & Persistence**
- **`IDashboardSettingEntry`**: CSS customization entry with `propertyName`, `value`, and `unit`
- **`IDashboardStorageService`**: Interface for persistence with `getSavedDashboards()` and `saveDashboards()` methods

---

### 2. **Dashboard Settings** (`src/dashboard-settings/`)

Provides a catalog of themeable CSS properties and utilities for managing dashboard customization.

#### **Settings Catalog (`cssSettingsCatalog`)**
Seven core settings that control dashboard appearance:

| Setting | CSS Property | Default | Unit | Purpose |
|---------|-------------|---------|------|---------|
| `grid-gap` | `--dashboard-grid-gap` | `1rem` | rem | Spacing between grid cells |
| `widget-width` | `--dashboard-widget-width` | `15rem` | rem | Base widget width |
| `border-radius` | `--dashboard-border-radius` | `0.25rem` | rem | Rounded corners |
| `container-padding` | `--dashboard-container-padding` | `1rem` | rem | Padding inside containers |
| `font-size-base` | `--dashboard-font-size-base` | `0.875rem` | rem | Base font size |
| `font-size-heading` | `--dashboard-font-size-heading` | `1.125rem` | rem | Heading font size |
| `font-size-small` | `--dashboard-font-size-small` | `0.75rem` | rem | Small text size |

#### **Key Functions**
- **`incrementOrDecrementValue()`**: Adjust setting values with unit-aware logic (handles rem, px, %, etc.)
- **`restoreCssVarsFromSettings()`**: Apply settings to DOM CSS variables

---

### 3. **Storage Service** (`src/storage-service/`)

Provides localStorage-based persistence for dashboard configurations.

#### **`IDashboardStorageService`**
- **`getSavedDashboards()`**: Retrieve all saved dashboard configurations
- **`saveDashboards(config)`**: Persist dashboard state to storage

#### **Default Implementation**
- Uses browser `localStorage` API
- Stores as JSON-serialized `IDashboardConfig` objects
- Namespace-aware to prevent conflicts

---

### 4. **Utilities** (`src/utils/`)

Collection of framework-agnostic helper functions organized by concern.

#### **Core Utilities (`core-utils.ts`)**
- **`blankDashboardConfig()`**: Factory for default `IDashboardConfig` state
- **`parseContainerTitle()`**: Extract container metadata from title strings
- **`ensureZoomScaleIsWithinRange()`**: Clamp zoom level to valid range
- **Zoom Constants**:
  - `DashboardMinZoomScale: 0.7`
  - `DashboardMaxZoomScale: 1.0`
  - `DashboardZoomStep: 0.05`

#### **Store Utilities (`store-utils.ts`)**
- **`getNextContainerName()`**: Generate unique container names (e.g., "Container 1", "Container 2")
- **Widget/Container Management**: Functions for adding, removing, and moving widgets within dashboard
- **Immutable Updates**: All mutations return new dashboard config instances

#### **CSS Variables Utilities (`css-vars-utils.ts`)**
- **`getCssVariableValue(varName)`**: Read CSS custom property from DOM
- **`setCssVariableValue(varName, value)`**: Write CSS custom property to DOM
- **`restoreCssVarsFromSettings(settings)`**: Apply all settings from `IDashboardSettingEntry[]` to DOM

#### **Color Utilities (`color-utils.ts`)**
- **`resolveColorFromClass(className)`**: Resolve CSS class to computed color value
- Used for theme color extraction and runtime color resolution

#### **CSS Classes Utilities (`use-distinct-css-classes.ts`)**
- **`useDistinctCssClasses()`**: Deduplication and management of CSS class names
- Prevents CSS class conflicts and redundancies

---

## Data Flow Architecture

### Configuration-Driven Design
All dashboard behavior is driven by immutable `IDashboardConfig` objects:

```
IDashboardConfig
├── widgets: Record<TDashboardWidgetKey, IDashboardWidget>
├── settings: IDashboardSettingEntry[]  (theme customization)
├── zoomScale: number  (0.7-1.0)
├── gridConfig: IGridConfig  (columns, row height)
└── undoHistory: TUndoHistoryEntry[]  (state snapshots)
```

### Widget Lifecycle
1. **Registration**: Widgets defined in `TDashboardWidgetCatalogBase` with metadata and lazy-loaded factory
2. **Instantiation**: Created via factory function during render
3. **Placement**: Positioned on grid based on `gridConfig`
4. **Styling**: Styled using CSS variables from settings catalog
5. **State Mutations**: Add/remove/move operations return new config instances

### State Management Flow
```
User Action (click, drag, etc.)
    ↓
Mutation Function (addWidget, removeWidget, moveWidget)
    ↓
New IDashboardConfig Instance
    ↓
History Stack Update (optional undo support)
    ↓
CSS Variable Application (if settings changed)
    ↓
localStorage Persistence (via IDashboardStorageService)
```

---

## Module Dependencies

```
src/
├── index.ts
│   └── Re-exports all modules
│
├── interfaces/
│   ├── core.base.ts (widget system)
│   ├── core.interfaces.ts (dashboard config)
│   └── storage-service.interfaces.ts (persistence)
│
├── dashboard-settings/
│   ├── dashboard-settings.ts (placeholder)
│   └── dashboard-settings-utils.ts
│       ├── Depends on: core.interfaces (IDashboardSettingEntry)
│       └── Exports: cssSettingsCatalog, incrementOrDecrementValue()
│
├── storage-service/
│   └── use-dashboard-storage-service.ts
│       ├── Depends on: core.interfaces (IDashboardConfig, IDashboardStorageService)
│       └── Exports: localStorage-based implementation
│
├── utils/
│   ├── core-utils.ts
│   │   ├── Depends on: core.interfaces (IDashboardConfig)
│   │   └── Exports: zoom constants, defaults, validators
│   │
│   ├── store-utils.ts
│   │   ├── Depends on: core-utils, core.interfaces
│   │   └── Exports: state mutation helpers
│   │
│   ├── css-vars-utils.ts
│   │   ├── Depends on: dashboard-settings (cssSettingsCatalog)
│   │   └── Exports: DOM CSS manipulation
│   │
│   ├── color-utils.ts
│   │   └── Exports: color resolution
│   │
│   ├── use-distinct-css-classes.ts
│   │   └── Exports: CSS class utilities
│   │
│   └── index.ts (re-exports all utils)
│
└── styles/
    └── styles-dashboard.css (CSS variables root definitions)
```

**Dependency Direction**: Lower-level modules (interfaces) have no dependencies; higher-level modules (utils) depend only on lower-level modules.

---

## Design Patterns & Principles

### 1. **Framework-Agnostic Architecture**
- All core logic written in vanilla TypeScript
- No framework-specific dependencies (React, Vue, etc.)
- Enables code sharing across multiple framework implementations

### 2. **Plugin/Registry Pattern**
- Widgets registered in `TDashboardWidgetCatalogBase`
- Lazy-loading via `TWidgetFactoryBase` async factories
- New widgets added without modifying core code

### 3. **Immutable State Management**
- All mutations return new `IDashboardConfig` instances
- Original config never modified in place
- Enables undo/redo history naturally

### 4. **CSS-in-JS with CSS Variables**
- Theme values stored in `IDashboardSettingEntry[]`
- Applied to DOM as CSS custom properties
- Supports runtime theme switching without component reload

### 5. **Type-Driven Development**
- Extensive use of TypeScript generics (`<TExtraProps>`, `<TFrameworkElementType>`)
- Allows framework implementations to extend types without modification
- Prevents "type drift" between framework implementations

### 6. **Separation of Concerns**
- **Interfaces**: Data contracts only
- **Settings**: Theme management only
- **Storage**: Persistence only
- **Utils**: Business logic only
- Each module has single responsibility

---

## Extension Points for Framework Implementations

React and Vue implementations extend the core through:

1. **Custom Widget Props**: Extend `IDashboardWidgetPropsBase` with framework-specific handlers
2. **Component Wrapping**: Wrap core types with framework-specific components
3. **State Management Integration**: Connect `IDashboardConfig` to React hooks or Vue reactivity
4. **Event Binding**: Connect UI events to core mutation functions

Example:
```typescript
// Core type (generic)
interface IDashboardWidgetPropsBase<TExtraProps> { ... }

// React implementation (specific)
interface IDashboardWidgetPropsReact extends IDashboardWidgetPropsBase<{
  onClick?: React.MouseEventHandler;
  onDragStart?: React.DragEventHandler;
}> { ... }
```

---

## Key Constants & Configuration

| Constant | Value | Purpose |
|----------|-------|---------|
| `DashboardMinZoomScale` | 0.7 | Minimum zoom level |
| `DashboardMaxZoomScale` | 1.0 | Maximum zoom level |
| `DashboardZoomStep` | 0.05 | Zoom increment/decrement |
| `DEFAULT_GRID_COLUMNS` | 12 | Default grid columns |
| `DEFAULT_GRID_ROW_HEIGHT` | 60 | Default row height in px |

---

## Export Structure

The library exports a single public API via `src/index.ts`:

```typescript
// Interfaces
export * from './interfaces';

// Dashboard Settings
export * from './dashboard-settings';

// Storage Service
export * from './storage-service';

// Utilities
export * from './utils';
```

**Build Outputs**:
- **ESM**: `dist/dashboard-core.es.js` (for modern bundlers)
- **UMD**: `dist/dashboard-core.umd.js` (for browsers/Node.js)
- **Types**: `dist/index.d.ts` (TypeScript definitions)
- **Styles**: `dist/dashboard-core.css` (CSS variables)

---

## Summary

@tenorlab/dashboard-core is a **lightweight, type-safe foundation** for building customizable dashboards. It provides:

✅ **Zero dependencies** - Pure TypeScript  
✅ **Framework-agnostic** - Works with any framework  
✅ **Type-safe** - Extensive TypeScript interfaces  
✅ **Composable** - Plugin architecture for widgets  
✅ **Themeable** - CSS variable-based customization  
✅ **Persistent** - Built-in localStorage support  
✅ **Undoable** - History tracking for state changes  

The core library is consumed by framework-specific packages (React, Vue) which wrap its types and utilities with framework components and state management integration.
