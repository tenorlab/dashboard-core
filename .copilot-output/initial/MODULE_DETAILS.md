# @tenorlab/dashboard-core - Module Details Reference

Comprehensive reference for all modules, their purposes, exports, and usage patterns.

---

## 1. INTERFACES MODULE (`src/interfaces/`)

### Purpose
Defines the complete type system and contracts for the dashboard ecosystem.

---

### File: `core.base.ts`
**Purpose**: Widget system type definitions

#### Key Types

**`TDashboardWidgetKey`**
```typescript
type TDashboardWidgetKey = string;
```
- Unique identifier for widget instances
- Should be globally unique within a dashboard
- Example: `'widget-1'`, `'my-chart-2'`

**`IDashboardWidgetPropsBase<TExtraProps>`**
```typescript
interface IDashboardWidgetPropsBase<TExtraProps = {}> {
  widgetKey: TDashboardWidgetKey;
  metaInfo: TWidgetMetaInfoBase;
  // Framework-specific props can extend this
  [key: string]: unknown;
}
```
- Base props interface for all widget components
- Extensible via generic `TExtraProps` parameter
- Passed to every widget component

**`TWidgetMetaInfoBase`**
```typescript
interface TWidgetMetaInfoBase {
  name: string;              // 'Line Chart', 'KPI Widget'
  description: string;       // Human-readable description
  category: TWidgetCategory; // 'Widget' | 'Chart' | 'Container'
  dependencies?: string[];   // Dependencies on other widgets
  thumbnail?: string;        // Preview image URL (optional)
  version?: string;          // Widget version (optional)
  author?: string;           // Widget author (optional)
}
```
- Metadata about a widget type
- Used for UI (widget picker, catalog)
- Immutable and shared across instances

**`TWidgetFactoryBase`**
```typescript
type TWidgetFactoryBase = () => Promise<unknown>;
```
- Async function that returns a widget component
- Enables lazy-loading: `() => import('./Widget').then(m => m.Widget)`
- Called when widget needs to be rendered

**`IDynamicWidgetCatalogEntryBase<TFrameworkElementType, TFrameworkComponentType>`**
```typescript
interface IDynamicWidgetCatalogEntryBase<T = unknown, C = unknown> {
  metaInfo: TWidgetMetaInfoBase;
  factory: TWidgetFactoryBase;
  defaultSize?: TWidgetSize;
  // Framework-specific properties can be added
}
```
- Single entry in widget catalog
- Contains metadata, factory, and default sizing
- Generic parameters allow framework extension

**`TDashboardWidgetCatalogBase`**
```typescript
type TDashboardWidgetCatalogBase = Record<
  string,
  IDynamicWidgetCatalogEntryBase
>;
```
- Map of all available widgets
- Key = component key (e.g., `'chart-line'`)
- Value = widget catalog entry with metadata and factory

#### Enums & Categories

**`TWidgetCategory`**
```typescript
type TWidgetCategory = 'Widget' | 'Chart' | 'Container';
```
- Categorizes widgets for organization in UI
- `'Widget'`: Generic component (text, form, etc.)
- `'Chart'`: Data visualization (bar, line, scatter, etc.)
- `'Container'`: Layout container (grid, tabs, etc.)

**`TWidgetSize`**
```typescript
type TWidgetSize = 'default' | 'large' | 'xlarge';
```
- Predefined widget sizing
- Used to determine default grid dimensions
- Can be overridden per instance

**`TWidgetDirection`**
```typescript
type TWidgetDirection = 'row' | 'column';
```
- Layout direction for container widgets
- `'row'`: Horizontal layout
- `'column'`: Vertical layout

---

### File: `core.interfaces.ts`
**Purpose**: Dashboard configuration and state management types

#### Key Types

**`IDashboardWidget`**
```typescript
interface IDashboardWidget {
  key: TDashboardWidgetKey;
  componentKey: string;              // Reference to catalog entry
  gridPosition: {
    x: number;      // Column position
    y: number;      // Row position
    width: number;  // Width in grid units
    height: number; // Height in grid units
  };
  props: IDashboardWidgetPropsBase;  // Widget-specific props
  metadata?: {                        // Optional widget metadata
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
  };
}
```
- Single widget instance in a dashboard
- Contains position, type reference, and props
- Immutable - updates create new instances

**`IGridConfig`**
```typescript
interface IGridConfig {
  columns: number;      // Number of grid columns (e.g., 12)
  rowHeight: number;    // Height of each row in pixels
  gap?: number;         // Gap between grid items (pixels)
  verticalGap?: number; // Vertical gap (overrides gap if set)
}
```
- Configuration for grid layout system
- Defines grid dimensions and spacing
- Applied to all widgets in dashboard

**`IDashboardConfig`**
```typescript
interface IDashboardConfig {
  widgets: Record<TDashboardWidgetKey, IDashboardWidget>;
  settings: IDashboardSettingEntry[];
  zoomScale: number;            // 0.7 (min) to 1.0 (max)
  gridConfig: IGridConfig;
  undoHistory: TUndoHistoryEntry[];
  metadata?: {
    name?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  };
}
```
- Complete dashboard state
- Immutable and JSON-serializable
- Contains all information needed to render dashboard

#### State Mutations

**`TAddWidgetResponse`**
```typescript
interface TAddWidgetResponse {
  success: boolean;
  config?: IDashboardConfig;
  error?: string;
}
```
- Response from adding widget
- Contains new config if successful
- Contains error message if failed

**`TRemoveWidgetResponse`**
```typescript
interface TRemoveWidgetResponse {
  success: boolean;
  config?: IDashboardConfig;
  error?: string;
}
```
- Response from removing widget
- Contains new config if successful

**`TMoveWidgetResponse`**
```typescript
interface TMoveWidgetResponse {
  success: boolean;
  config?: IDashboardConfig;
  error?: string;
}
```
- Response from moving/repositioning widget
- Contains new config if successful

#### History & Undo

**`TUndoHistoryEntry`**
```typescript
interface TUndoHistoryEntry {
  config: IDashboardConfig;
  timestamp: number;
  description?: string; // Optional action description
}
```
- Snapshot of dashboard state at a point in time
- Used for undo/redo functionality
- Timestamp for history ordering

**`TDashboardUndoStatus`**
```typescript
interface TDashboardUndoStatus {
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
}
```
- Status of undo/redo availability
- Used to enable/disable UI buttons

---

### File: `storage-service.interfaces.ts`
**Purpose**: Persistence and settings interfaces

#### Key Types

**`IDashboardSettingEntry`**
```typescript
interface IDashboardSettingEntry {
  propertyName: string; // e.g., 'grid-gap', 'widget-width'
  value: number | string;
  unit: string;         // e.g., 'rem', 'px', '%'
  label?: string;       // Human-readable label
  min?: number;         // Minimum value (for validation)
  max?: number;         // Maximum value (for validation)
}
```
- Single CSS customization setting
- Typically stored in `IDashboardConfig.settings`
- Used to configure theme dynamically

**`IDashboardStorageService`**
```typescript
interface IDashboardStorageService {
  getSavedDashboards(): Promise<IDashboardConfig[]>;
  saveDashboards(configs: IDashboardConfig[]): Promise<void>;
}
```
- Interface for dashboard persistence
- Must be implemented for storage support
- Async/Promise-based for compatibility

---

## 2. DASHBOARD SETTINGS MODULE (`src/dashboard-settings/`)

### Purpose
Provides themeable CSS property catalog and utilities for managing customization.

---

### File: `dashboard-settings.ts`
**Purpose**: Placeholder module (can be expanded for future settings features)

---

### File: `dashboard-settings-utils.ts`
**Purpose**: Settings management utilities

#### Key Exports

**`cssSettingsCatalog`**
```typescript
const cssSettingsCatalog: IDashboardSettingEntry[] = [
  {
    propertyName: 'grid-gap',
    value: 1,
    unit: 'rem',
    label: 'Grid Gap',
    min: 0.25,
    max: 3
  },
  {
    propertyName: 'widget-width',
    value: 15,
    unit: 'rem',
    label: 'Widget Width',
    min: 10,
    max: 30
  },
  {
    propertyName: 'border-radius',
    value: 0.25,
    unit: 'rem',
    label: 'Border Radius',
    min: 0,
    max: 1
  },
  {
    propertyName: 'container-padding',
    value: 1,
    unit: 'rem',
    label: 'Container Padding',
    min: 0.25,
    max: 3
  },
  {
    propertyName: 'font-size-base',
    value: 0.875,
    unit: 'rem',
    label: 'Base Font Size',
    min: 0.75,
    max: 1.25
  },
  {
    propertyName: 'font-size-heading',
    value: 1.125,
    unit: 'rem',
    label: 'Heading Font Size',
    min: 1,
    max: 1.5
  },
  {
    propertyName: 'font-size-small',
    value: 0.75,
    unit: 'rem',
    label: 'Small Font Size',
    min: 0.625,
    max: 0.875
  }
];
```
- Array of all themeable settings
- Each entry specifies property name, default value, unit, and constraints
- Used to populate theme customization UI

**`incrementOrDecrementValue(value, unit, increment)`**
```typescript
function incrementOrDecrementValue(
  value: number | string,
  unit: string,
  increment: number
): string;
```
- Adjusts a setting value by increment
- Handles unit awareness (rem, px, %, etc.)
- Returns formatted string
- Example: `incrementOrDecrementValue('1rem', 'rem', 0.25)` → `'1.25rem'`

**Usage Example**:
```typescript
import { cssSettingsCatalog, incrementOrDecrementValue } from '@tenorlab/dashboard-core';

// Get current grid gap setting
const gridGapSetting = cssSettingsCatalog.find(s => s.propertyName === 'grid-gap');

// Increase by 0.25rem
const newValue = incrementOrDecrementValue(
  gridGapSetting.value,
  gridGapSetting.unit,
  0.25
);
// newValue = '1.25rem'
```

---

## 3. STORAGE SERVICE MODULE (`src/storage-service/`)

### Purpose
Provides localStorage-based dashboard persistence.

---

### File: `use-dashboard-storage-service.ts`
**Purpose**: Default implementation of `IDashboardStorageService` using browser localStorage

#### Key Exports

**`useDashboardStorageService()`**
```typescript
function useDashboardStorageService(): IDashboardStorageService;
```
- Factory function that returns storage service instance
- Uses browser `localStorage` API
- Returns object implementing `IDashboardStorageService`

**Methods**:

**`getSavedDashboards(): Promise<IDashboardConfig[]>`**
```typescript
const dashboards = await storage.getSavedDashboards();
// Returns array of previously saved dashboard configs
```

**`saveDashboards(configs: IDashboardConfig[]): Promise<void>`**
```typescript
await storage.saveDashboards([dashboardConfig]);
// Persists dashboard configs to localStorage
```

**Usage Example**:
```typescript
import { useDashboardStorageService } from '@tenorlab/dashboard-core';

const storage = useDashboardStorageService();

// Save dashboard
await storage.saveDashboards([myDashboard]);

// Load dashboards
const saved = await storage.getSavedDashboards();
setDashboards(saved);
```

**Implementation Details**:
- Uses `localStorage.setItem()` and `localStorage.getItem()`
- Serializes configs to JSON
- Namespace-aware to prevent conflicts with other apps
- Handles parsing errors gracefully

---

## 4. UTILITIES MODULE (`src/utils/`)

### Purpose
Provides framework-agnostic helper functions for common dashboard operations.

---

### File: `core-utils.ts`
**Purpose**: Core dashboard functionality - defaults, zoom, validation

#### Key Exports

**Constants**:
```typescript
const DashboardMinZoomScale = 0.7;      // Minimum zoom level
const DashboardMaxZoomScale = 1.0;      // Maximum zoom level
const DashboardZoomStep = 0.05;         // Zoom increment/decrement
const DEFAULT_GRID_COLUMNS = 12;        // Default grid columns
const DEFAULT_GRID_ROW_HEIGHT = 60;     // Default row height (pixels)
```

**Functions**:

**`blankDashboardConfig(): IDashboardConfig`**
```typescript
const emptyDashboard = blankDashboardConfig();
// Returns:
// {
//   widgets: {},
//   settings: [...defaultSettings...],
//   zoomScale: 1.0,
//   gridConfig: { columns: 12, rowHeight: 60 },
//   undoHistory: []
// }
```
- Factory for creating blank dashboard configuration
- Used as starting point for new dashboards
- Provides sensible defaults for all properties

**`parseContainerTitle(title: string): { name: string; index?: number }`**
```typescript
const result = parseContainerTitle('Container 1');
// Returns: { name: 'Container', index: 1 }
```
- Extracts container metadata from title string
- Used for container naming conventions
- Helps with auto-generating container names

**`ensureZoomScaleIsWithinRange(scale: number): number`**
```typescript
const validZoom = ensureZoomScaleIsWithinRange(1.5);
// Returns: 1.0 (clamped to max)

const validZoom2 = ensureZoomScaleIsWithinRange(0.5);
// Returns: 0.7 (clamped to min)
```
- Validates zoom scale is within valid range
- Clamps to `[DashboardMinZoomScale, DashboardMaxZoomScale]`
- Called before applying zoom changes

---

### File: `store-utils.ts`
**Purpose**: State mutations - adding, removing, moving widgets

#### Key Exports

**`getNextContainerName(config: IDashboardConfig): string`**
```typescript
const name = getNextContainerName(currentConfig);
// Returns: 'Container 1' or 'Container 2' etc.
```
- Generates unique container name
- Uses existing containers to determine next number
- Used when creating new container widgets

**`addWidget(config, widgetKey, componentKey, gridPosition, props?): TAddWidgetResponse`**
```typescript
const result = addWidget(
  currentConfig,
  'widget-123',           // Unique widget ID
  'chart-line',           // Widget type (catalog key)
  { x: 0, y: 0, width: 4, height: 4 },  // Position on grid
  { /* optional props */ }
);

if (result.success) {
  setConfig(result.config);
} else {
  console.error(result.error);
}
```
- Adds new widget to dashboard
- Returns new config if successful
- Validates widget key is unique
- Updates undo history

**`removeWidget(config, widgetKey): TRemoveWidgetResponse`**
```typescript
const result = removeWidget(currentConfig, 'widget-123');

if (result.success) {
  setConfig(result.config);
}
```
- Removes widget from dashboard
- Returns new config if successful
- Updates undo history

**`moveWidget(config, widgetKey, newPosition): TMoveWidgetResponse`**
```typescript
const result = moveWidget(
  currentConfig,
  'widget-123',
  { x: 2, y: 1, width: 4, height: 4 }
);

if (result.success) {
  setConfig(result.config);
}
```
- Repositions widget on grid
- Returns new config if successful
- Updates undo history
- Validates grid position is valid

**Implementation Pattern**:
All mutations follow immutable pattern:
1. Validate input
2. Create copy of config
3. Modify copy
4. Update undo history
5. Return response with new config

---

### File: `css-vars-utils.ts`
**Purpose**: CSS variable management for theming

#### Key Exports

**`getCssVariableValue(varName: string): string`**
```typescript
const gap = getCssVariableValue('--dashboard-grid-gap');
// Returns: '1rem' (computed value from DOM)
```
- Reads CSS custom property value from DOM
- Uses `getComputedStyle()`
- Returns empty string if variable not found

**`setCssVariableValue(varName: string, value: string): void`**
```typescript
setCssVariableValue('--dashboard-grid-gap', '1.5rem');
// Updates DOM CSS variable immediately
```
- Writes CSS custom property to DOM
- Uses `document.documentElement.style`
- Changes apply to all elements using that variable

**`restoreCssVarsFromSettings(settings: IDashboardSettingEntry[]): void`**
```typescript
restoreCssVarsFromSettings(dashboardConfig.settings);
// Applies all settings to DOM CSS variables
```
- Batch applies all settings to DOM
- Called when loading dashboard or updating settings
- Maps property names to CSS variable names

**Usage Example**:
```typescript
import { 
  setCssVariableValue, 
  restoreCssVarsFromSettings,
  getCssVariableValue 
} from '@tenorlab/dashboard-core';

// Single variable change
setCssVariableValue('--dashboard-grid-gap', '1.5rem');

// Multiple variables from settings
restoreCssVarsFromSettings(dashboardConfig.settings);

// Read current value
const currentGap = getCssVariableValue('--dashboard-grid-gap');
```

---

### File: `color-utils.ts`
**Purpose**: CSS color utilities

#### Key Exports

**`resolveColorFromClass(className: string): string`**
```typescript
const color = resolveColorFromClass('text-primary');
// Returns: computed RGB or hex color value from CSS
```
- Resolves CSS class to actual color value
- Creates temporary element with class
- Returns computed color value
- Used for theme color extraction

**Usage Example**:
```typescript
import { resolveColorFromClass } from '@tenorlab/dashboard-core';

const primaryColor = resolveColorFromClass('text-primary');
const secondaryColor = resolveColorFromClass('text-secondary');
```

---

### File: `use-distinct-css-classes.ts`
**Purpose**: CSS class utilities

#### Key Exports

**`useDistinctCssClasses(classes: string[]): string`**
```typescript
const result = useDistinctCssClasses([
  'flex', 'flex', 'gap-2', 'flex'
]);
// Returns: 'flex gap-2' (deduplicated and trimmed)
```
- Deduplicates and normalizes CSS class names
- Removes duplicates while preserving order
- Returns space-separated class string

**Usage Example**:
```typescript
import { useDistinctCssClasses } from '@tenorlab/dashboard-core';

const className = useDistinctCssClasses([
  baseClasses,
  conditionalClass,
  ...extraClasses
]);
```

---

## 5. STYLES MODULE (`src/styles/`)

### Purpose
Provides CSS variable definitions used by dashboard system

---

### File: `styles-dashboard.css`
**Purpose**: Root CSS variable definitions

#### CSS Variables Defined

```css
:root {
  --dashboard-grid-gap: 1rem;
  --dashboard-widget-width: 15rem;
  --dashboard-border-radius: 0.25rem;
  --dashboard-container-padding: 1rem;
  --dashboard-font-size-base: 0.875rem;
  --dashboard-font-size-heading: 1.125rem;
  --dashboard-font-size-small: 0.75rem;
}
```

**Usage in Components**:
```css
.dashboard-grid {
  display: grid;
  gap: var(--dashboard-grid-gap);
  grid-template-columns: repeat(
    auto-fit,
    minmax(var(--dashboard-widget-width), 1fr)
  );
}

.dashboard-widget {
  border-radius: var(--dashboard-border-radius);
  padding: var(--dashboard-container-padding);
  font-size: var(--dashboard-font-size-base);
}
```

---

## Module Dependency Map

```
index.ts (public export)
├── interfaces/ (no dependencies)
│   ├── core.base.ts
│   ├── core.interfaces.ts
│   └── storage-service.interfaces.ts
│
├── dashboard-settings/ (depends on: interfaces)
│   ├── dashboard-settings.ts
│   └── dashboard-settings-utils.ts
│
├── storage-service/ (depends on: interfaces)
│   └── use-dashboard-storage-service.ts
│
├── utils/ (depends on: interfaces, dashboard-settings)
│   ├── core-utils.ts
│   ├── store-utils.ts
│   ├── css-vars-utils.ts
│   ├── color-utils.ts
│   ├── use-distinct-css-classes.ts
│   └── index.ts (re-exports)
│
└── styles/ (no dependencies)
    └── styles-dashboard.css
```

---

## Type System Hierarchy

```
┌─────────────────────────────────────────┐
│      Base Widget Types (core.base.ts)   │
├─────────────────────────────────────────┤
│ TDashboardWidgetKey                     │
│ IDashboardWidgetPropsBase<TExtraProps>  │
│ TWidgetMetaInfoBase                     │
│ TWidgetFactoryBase                      │
│ IDynamicWidgetCatalogEntryBase          │
│ TDashboardWidgetCatalogBase             │
│ TWidgetCategory (enum)                  │
│ TWidgetSize (enum)                      │
│ TWidgetDirection (enum)                 │
└─────────────────────────────────────────┘
                ▲
                │ Used by
┌───────────────┴──────────────────────────┐
│   Dashboard Configuration (core.int.)    │
├──────────────────────────────────────────┤
│ IDashboardWidget                         │
│ IGridConfig                              │
│ IDashboardConfig                         │
│ TAddWidgetResponse                       │
│ TRemoveWidgetResponse                    │
│ TMoveWidgetResponse                      │
│ TUndoHistoryEntry                        │
│ TDashboardUndoStatus                     │
└──────────────────────────────────────────┘
                ▲
                │ Uses
┌───────────────┴──────────────────────────┐
│  Settings & Storage (storage-service.*)  │
├──────────────────────────────────────────┤
│ IDashboardSettingEntry                   │
│ IDashboardStorageService                 │
└──────────────────────────────────────────┘
```

---

## Export Summary

| Category | Exports | Module |
|----------|---------|--------|
| **Widget Types** | TDashboardWidgetKey, IDashboardWidgetPropsBase, TWidgetMetaInfoBase, etc. | interfaces/core.base |
| **Config Types** | IDashboardConfig, IDashboardWidget, IGridConfig | interfaces/core.interfaces |
| **Mutation Types** | TAddWidgetResponse, TRemoveWidgetResponse, TMoveWidgetResponse | interfaces/core.interfaces |
| **Settings Types** | IDashboardSettingEntry | interfaces/storage-service |
| **Storage Interface** | IDashboardStorageService | interfaces/storage-service |
| **Settings** | cssSettingsCatalog | dashboard-settings/ |
| **Settings Utils** | incrementOrDecrementValue() | dashboard-settings/ |
| **Storage Service** | useDashboardStorageService() | storage-service/ |
| **Core Utils** | blankDashboardConfig(), constants | utils/core-utils |
| **Store Utils** | addWidget(), removeWidget(), moveWidget() | utils/store-utils |
| **CSS Utils** | getCssVariableValue(), setCssVariableValue() | utils/css-vars-utils |
| **Color Utils** | resolveColorFromClass() | utils/color-utils |
| **Class Utils** | useDistinctCssClasses() | utils/use-distinct-css-classes |

