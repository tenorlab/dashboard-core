# @tenorlab/dashboard-core - Architecture Diagram

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           @tenorlab/dashboard-core                          │
│                    Framework-Agnostic Dashboard Foundation                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         PUBLIC API (index.ts)                               │
│  Exports: Interfaces + Utils + Settings + Storage Service                   │
└──────────┬──────────────────────────────────────────────────────────────┬───┘
           │                                                               │
           │ Consumed by                                                   │ Consumed by
           ▼                                                               ▼
    ┌──────────────────┐                                          ┌──────────────────┐
    │ @tenorlab/       │                                          │ @tenorlab/       │
    │ react-dashboard  │                                          │ vue-dashboard    │
    └──────────────────┘                                          └──────────────────┘

═════════════════════════════════════════════════════════════════════════════════════

                              CORE MODULES LAYER

┌──────────────────────────────────────────────────────────────────────────────────┐
│                          INTERFACES (src/interfaces/)                            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  core.base.ts (Widget System Types)                                              │
│  ├─ TDashboardWidgetKey                    (widget unique ID)                    │
│  ├─ IDashboardWidgetPropsBase<TExtraProps> (widget props contract)               │
│  ├─ IDynamicWidgetCatalogEntryBase         (widget registry entry)               │
│  ├─ TWidgetMetaInfoBase                    (widget metadata)                     │
│  ├─ TWidgetFactoryBase                     (async factory fn)                    │
│  ├─ TDashboardWidgetCatalogBase            (widget registry)                     │
│  ├─ TWidgetCategory: 'Widget'|'Chart'|'Container'                                │
│  ├─ TWidgetSize: 'default'|'large'|'xlarge'                                      │
│  └─ TWidgetDirection: 'row'|'column'                                             │
│                                                                                  │
│  core.interfaces.ts (Dashboard Configuration)                                    │
│  ├─ IDashboardConfig          (complete dashboard state)                        │
│  ├─ IDashboardWidget          (single widget instance)                          │
│  ├─ IGridConfig               (grid layout parameters)                          │
│  ├─ TAddWidgetResponse         (mutation response)                              │
│  ├─ TRemoveWidgetResponse      (mutation response)                              │
│  ├─ TMoveWidgetResponse        (mutation response)                              │
│  ├─ TUndoHistoryEntry         (state snapshot)                                  │
│  └─ TDashboardUndoStatus      (undo/redo availability)                          │
│                                                                                   │
│  storage-service.interfaces.ts                                                   │
│  ├─ IDashboardStorageService   (persistence contract)                           │
│  └─ IDashboardSettingEntry     (theme customization)                            │
│                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                   DASHBOARD SETTINGS (src/dashboard-settings/)                   │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  cssSettingsCatalog                                                              │
│  ├─ grid-gap                  (spacing between grid cells)                      │
│  ├─ widget-width              (base widget width)                               │
│  ├─ border-radius             (rounded corners)                                 │
│  ├─ container-padding         (padding inside containers)                       │
│  ├─ font-size-base            (base font size)                                  │
│  ├─ font-size-heading         (heading font size)                               │
│  └─ font-size-small           (small text size)                                 │
│                                                                                   │
│  Functions                                                                       │
│  ├─ incrementOrDecrementValue()  (adjust settings with unit awareness)          │
│  └─ restoreCssVarsFromSettings() (apply settings to DOM)                        │
│                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                    STORAGE SERVICE (src/storage-service/)                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  IDashboardStorageService                                                        │
│  ├─ getSavedDashboards()      (retrieve from storage)                           │
│  └─ saveDashboards(config)    (persist to storage)                              │
│                                                                                   │
│  Default Implementation: localStorage-based persistence                         │
│                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                        UTILITIES (src/utils/)                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  core-utils.ts                    │  css-vars-utils.ts                          │
│  ├─ blankDashboardConfig()        │  ├─ getCssVariableValue()                  │
│  ├─ parseContainerTitle()         │  ├─ setCssVariableValue()                  │
│  ├─ ensureZoomScaleIsWithinRange()│  └─ restoreCssVarsFromSettings()           │
│  ├─ DashboardMinZoomScale (0.7)   │                                            │
│  ├─ DashboardMaxZoomScale (1.0)   │  color-utils.ts                            │
│  └─ DashboardZoomStep (0.05)      │  └─ resolveColorFromClass()                │
│                                    │                                            │
│  store-utils.ts                   │  use-distinct-css-classes.ts               │
│  ├─ getNextContainerName()        │  └─ useDistinctCssClasses()                │
│  ├─ addWidget()                   │                                            │
│  ├─ removeWidget()                │                                            │
│  └─ moveWidget()                  │                                            │
│                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│                          STYLES (src/styles/)                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  CSS Variables Root Definitions                                                  │
│  ├─ --dashboard-grid-gap                                                         │
│  ├─ --dashboard-widget-width                                                     │
│  ├─ --dashboard-border-radius                                                    │
│  ├─ --dashboard-container-padding                                                │
│  ├─ --dashboard-font-size-base                                                   │
│  ├─ --dashboard-font-size-heading                                                │
│  └─ --dashboard-font-size-small                                                  │
│                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

═════════════════════════════════════════════════════════════════════════════════════

                              DATA FLOW ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            IDashboardConfig                                      │
│                   (Immutable Configuration Object)                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  widgets: Record<TDashboardWidgetKey, IDashboardWidget>                         │
│  ├─ [widgetId]: {                                                               │
│  │  ├─ key: TDashboardWidgetKey                                                 │
│  │  ├─ gridPosition: { x, y, width, height }                                    │
│  │  ├─ componentKey: string (widget type)                                       │
│  │  └─ props: IDashboardWidgetPropsBase                                         │
│  │                                                                               │
│  settings: IDashboardSettingEntry[]        (theme customization)                │
│  ├─ [{ propertyName, value, unit }, ...]                                        │
│                                                                                  │
│  zoomScale: number                         (0.7 - 1.0)                          │
│                                                                                  │
│  gridConfig: IGridConfig                   (layout parameters)                  │
│  ├─ { columns, rowHeight, ... }                                                │
│                                                                                  │
│  undoHistory: TUndoHistoryEntry[]          (state snapshots)                    │
│  └─ [{ config, timestamp }, ...]                                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      ▲
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
            User Action            Mutation           History
                    │             Functions           Undo/Redo
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ addWidget()  │  │removeWidget()│  │ moveWidget() │
            │ zoomIn/Out() │  │updateSettings   │  │revertToState │
            │...           │  │...              │  │...           │
            └──────────────┘  └──────────────┘  └──────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │  New IDashboardConfig Instance    │
                    │  (via immutable updates)          │
                    └───────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │ Apply CSS    │  │ Update DOM   │  │ Persist to   │
            │ Variables    │  │ via Framework│  │ localStorage │
            │ (core-utils) │  │ (React/Vue)  │  │ (storage-svc)│
            └──────────────┘  └──────────────┘  └──────────────┘

═════════════════════════════════════════════════════════════════════════════════════

                          WIDGET LIFECYCLE ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────────────────┐
│                     TDashboardWidgetCatalogBase                                  │
│              (Widget Registry - defines available widgets)                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  {                                                                               │
│    'widget-1': IDynamicWidgetCatalogEntryBase,                                  │
│    'chart-1': IDynamicWidgetCatalogEntryBase,                                   │
│    'container-1': IDynamicWidgetCatalogEntryBase,                               │
│    ...                                                                            │
│  }                                                                               │
│                                                                                  │
│  Each Entry Contains:                                                            │
│  ├─ metaInfo: TWidgetMetaInfoBase                                               │
│  │  ├─ name: string                                                              │
│  │  ├─ description: string                                                       │
│  │  ├─ category: TWidgetCategory                                                │
│  │  └─ dependencies: string[]                                                    │
│  │                                                                               │
│  ├─ factory: TWidgetFactoryBase (async)                                         │
│  │  └─ () => Promise<TFrameworkComponentType>                                   │
│  │                                                                               │
│  └─ defaultSize: TWidgetSize                                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Lookup on widget instantiation
                                      ▼
                    ┌───────────────────────────────────┐
                    │   Factory Function (async)        │
                    │   (Lazy-loading component)        │
                    └───────────────────────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   Resolved Widget Component       │
                    │   (Framework-specific)            │
                    └───────────────────────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   IDashboardWidgetPropsBase       │
                    │   (Props passed to component)     │
                    ├───────────────────────────────────┤
                    │ - widgetKey: TDashboardWidgetKey │
                    │ - metaInfo: TWidgetMetaInfoBase   │
                    │ - [extra framework props]         │
                    └───────────────────────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │   Rendered on Grid with           │
                    │   Applied CSS Variables &         │
                    │   Grid Position                   │
                    └───────────────────────────────────┘

═════════════════════════════════════════════════════════════════════════════════════

                       DEPENDENCY GRAPH (Top-Down)

                                 index.ts
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
            interfaces/         dashboard-settings/   storage-service/
            (no deps)           (depends on:          (depends on:
                                interfaces)          interfaces)
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    │
                                    ▼
                                 utils/
                        (depends on: interfaces,
                        dashboard-settings)
                                    │
                                    ▼
                                styles/
                            (CSS variables)

═════════════════════════════════════════════════════════════════════════════════════

                          EXTENSION POINTS FOR FRAMEWORKS

┌─────────────────────────────────────────────────────────────────────────────────┐
│                     @tenorlab/react-dashboard                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Extends:                                                                        │
│  ├─ IDashboardWidgetPropsBase → IDashboardWidgetPropsReact                      │
│  ├─ IDashboardStorageService → ReactStorageService                              │
│  └─ Wraps core utilities with React hooks & components                          │
│                                                                                  │
│  Provides:                                                                       │
│  ├─ <Dashboard> component (React wrapper)                                       │
│  ├─ useDashboard() hook (state management)                                      │
│  ├─ DashboardProvider (context provider)                                        │
│  └─ Re-exports all @tenorlab/dashboard-core exports                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                      @tenorlab/vue-dashboard                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Extends:                                                                        │
│  ├─ IDashboardWidgetPropsBase → IDashboardWidgetPropsVue                        │
│  ├─ IDashboardStorageService → VueStorageService                                │
│  └─ Wraps core utilities with Vue composables & components                      │
│                                                                                  │
│  Provides:                                                                       │
│  ├─ <Dashboard> component (Vue wrapper)                                         │
│  ├─ useDashboard() composable (reactivity)                                      │
│  ├─ DashboardProvider (component provider)                                      │
│  └─ Re-exports all @tenorlab/dashboard-core exports                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Module Interaction Diagram

```
┌────────────────┐
│   Application  │
│  (React/Vue)   │
└────────┬───────┘
         │ Uses
         ▼
┌────────────────────────────────────────────────┐
│    Framework-Specific Wrapper Package          │
│  (@tenorlab/react-dashboard or vue-dashboard) │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  Components                              │ │
│  │  - <Dashboard>                           │ │
│  │  - <Widget>                              │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │  Hooks/Composables                       │ │
│  │  - useDashboard()                        │ │
│  │  - useWidget()                           │ │
│  └──────────────────────────────────────────┘ │
└────────┬─────────────────────────────────────┘
         │ Re-exports + Wraps
         ▼
┌────────────────────────────────────────────────┐
│    @tenorlab/dashboard-core (This Library)     │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  Types & Interfaces                      │ │
│  │  - IDashboardConfig                      │ │
│  │  - IDashboardWidget                      │ │
│  │  - TDashboardWidgetCatalogBase           │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │  Utilities (Framework-Agnostic)          │ │
│  │  - store-utils (mutations)               │ │
│  │  - css-vars-utils (theming)              │ │
│  │  - core-utils (defaults, zoom, etc.)     │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │  Settings & Storage                      │ │
│  │  - cssSettingsCatalog (theming)          │ │
│  │  - IDashboardStorageService              │ │
│  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## State Mutation Flow

```
┌──────────────────────────┐
│  Current IDashboardConfig│
│  - widgets: {...}        │
│  - settings: [...]       │
│  - zoomScale: 0.85       │
│  - undoHistory: [...]    │
└──────────┬───────────────┘
           │
           │ User performs action
           │ (e.g., drag widget)
           ▼
┌──────────────────────────────────────┐
│  Mutation Function Called            │
│  e.g., moveWidget(...)               │
│  • Validates input                   │
│  • Computes new positions            │
│  • Creates new config instance       │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  New IDashboardConfig Created        │
│  - widgets: {...updated...}          │
│  - settings: [...]  (unchanged)      │
│  - zoomScale: 0.85  (unchanged)      │
│  - undoHistory: [...updated...]      │
└──────────┬──────────────────────────┘
           │
           ├─── If settings changed
           │    ▼
           │    applyCssVariables()
           │    └─ DOM CSS updated
           │
           ├─── Always
           │    ▼
           │    updateUI() (React/Vue)
           │    └─ Components re-render
           │
           └─── If persistence enabled
                ▼
                storageService.saveDashboards()
                └─ localStorage updated
```
