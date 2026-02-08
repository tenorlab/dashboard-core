// @tenorlab/dashboard-core
// file: src/interfaces/core.base.ts

/**
 * @name TDashboardWidgetKey
 * @description Type for the unique key identifying a dashboard widget.
 * @remarks
 * This is a simple alias for `string` to allow flexibility in widget keys.
 * Recommended formats: stable short strings (e.g. `myApp.ChartWidget`),
 * namespaced identifiers or UUIDs. Consumers should avoid empty strings.
 */
export type TDashboardWidgetKey = string

/**
 * @name TWidgetCategory
 * @description Type for widget categories used for grouping and UI filters.
 * @remarks
 * Typical usage: categorizing widgets in a palette, grouping by behavior
 * (for instance `Container` widgets may host child widgets).
 */
export type TWidgetCategory = 'Widget' | 'Chart' | 'Container'

/**
 * @name TWidgetMetaInfoBase
 * @description Base metadata for a widget used by catalogs and tooling.
 * @template TFrameworkElementType - Framework-specific element type (e.g. React element, Vue component)
 * @remarks
 * Fields:
 * - `name` (required): Human readable widget name.
 * - `description` (required): Short description shown in tooltips or catalog lists.
 * - `categories` (required): One or more `TWidgetCategory` values used for grouping.
 * - `noDuplicatedWidgets` (optional): When true, dashboard UI should prevent
 *   adding multiple instances of this widget.
 * - `icon` (optional): Framework-specific icon element or component. May be
 *   `undefined` when not provided.
 * - `externalDependencies` (required): Array of package identifiers or CDN
 *   references (e.g. `react@19.2.3`, `https://cdn.example.com/widget.js`). Use
 *   semantic versions or absolute URLs as appropriate.
 *
 * Example:
 * {
 *   name: 'Simple Chart',
 *   description: 'Displays a time series',
 *   categories: ['Chart'],
 *   noDuplicatedWidgets: false,
 *   icon: undefined,
 *   externalDependencies: ['d3@7.0.0']
 * }
 */
export type TWidgetMetaInfoBase<TFrameworkElementType = any> = {
  name: string
  description: string
  categories: TWidgetCategory[]
  noDuplicatedWidgets?: boolean
  icon?: TFrameworkElementType | string | undefined
  externalDependencies: string[]
  tags?: string[]
  noCollapse?: boolean
}

/**
 * @name IDashboardGridPropsBase
 * @description Base interface for dashboard grid props passed to widgets.
 * @remarks
 * - `zoomScale` represents a uniform zoom applied to the dashboard UI. Default
 *   behavior in the runtime clamps this value to a minimum of `0.7` and default
 *   is `1` when not explicitly set.
 * - `responsiveGrid` toggles responsive layout behaviors vs fixed grid sizing.
 */
export interface IDashboardGridPropsBase {
  isEditing: boolean
  zoomScale: number
  responsiveGrid: boolean
}

/**
 * @name TWidgetSize
 * @description Size hint for widgets that can affect layout or styling.
 * @remarks 'default' represents the standard size; 'large' and 'xlarge' are
 * larger variants where the dashboard may allocate more grid cells.
 */
export type TWidgetSize = 'default' | 'large' | 'xlarge'

/**
 * @name TWidgetDirection
 * @description Direction for layout flow inside container widgets.
 * @remarks Only meaningful for container-type widgets that arrange children in
 * either `row` or `column` flow.
 */
export type TWidgetDirection = 'row' | 'column'

export interface IWidgetSavedProps {
  parentWidgetKey?: TDashboardWidgetKey
  widgetKey: TDashboardWidgetKey
  isCollapsed?: boolean
}

/**
 * @name IDashboardWidgetPropsBase
 * @description Props provided to every widget instance rendered by the dashboard.
 * @template TExtraProps - Additional, widget-specific props supplied by the
 * dashboard or integrator via the dynamic loader.
 * @remarks
 * - `index` and `maxIndex` indicate the widget's position and the current
 *   maximum index used for ordering (zero-based indexing is typical).
 * - `widgetKey` is the stable `TDashboardWidgetKey` identifying the widget
 *   type; `parentWidgetKey` is set for nested/child widgets.
 * - Boolean flags like `hideTitle`, `noShadow`, `noBorder`, `noPadding` are
 *   layout/presentation hints; default behavior should be documented by the
 *   concrete widget implementation.
 * - `direction` applies to container widgets only.
 * - `extraProps` is merged into the widget props by the `DynamicWidgetLoader`.
 */
export interface IDashboardWidgetPropsBase<TExtraProps = any> {
  index: number
  maxIndex: number
  widgetKey: TDashboardWidgetKey
  parentWidgetKey?: TDashboardWidgetKey
  isEditing: boolean
  highlight?: boolean
  testId?: string
  title?: string
  size?: TWidgetSize
  borderCssClasses?: string
  backgroundCssClasses?: string
  addCssClasses?: string
  overrideCssClasses?: string
  tags?: string[]
  hideTitle?: boolean
  noShadow?: boolean
  noBorder?: boolean
  noPadding?: boolean
  noCollapse?: boolean
  direction?: TWidgetDirection
  widgetSavedProps?: IWidgetSavedProps
  meta?: TWidgetMetaInfoBase

  extraProps?: TExtraProps
}

/* support plugin architecture: */

/**
 * @name TWidgetFactoryBase
 * @description Async factory used to lazily load a framework component for a widget.
 * @template TFrameworkComponent - Framework-specific component type (e.g., React component)
 * @returns Promise resolving to an object with a `default` export containing the component.
 * @remarks Implementations should throw on unrecoverable load errors so callers
 * can handle fallbacks; returning a stub is also acceptable when documented.
 */
export type TWidgetFactoryBase<TFrameworkComponent = any> = () => Promise<{
  default: TFrameworkComponent
}>

/**
 * @name IDynamicWidgetCatalogEntryBase
 * @description Catalog entry describing how to create or load a widget.
 * @template TFrameworkElementType - Framework-specific element type (icon, element)
 * @template TFrameworkComponentType - Framework-specific component type
 * @remarks
 * - `key` must be unique and stable across versions because it is stored in
 *   saved dashboard configurations.
 * - `title` is the display name for catalogs and selection UIs.
 * - `isContainer` indicates a widget that can host children.
 * - `isRemote` marks entries that are expected to be loaded remotely (CDN,
 *   external script) and may require extra loading/initialization steps.
 * - `meta` contains presentation metadata (see `TWidgetMetaInfoBase`).
 * - `component` is a direct component reference (preferred for static/core widgets).
 * - `loader` is an async factory used for dynamic/plugin widgets. When both
 *   `component` and `loader` are provided, loaders are typically used for
 *   dynamic initialization; concrete loaders/components precedence should be
 *   defined by the integrator.
 */
export interface IDynamicWidgetCatalogEntryBase<TFrameworkElementType = any, TFrameworkComponentType = any> {
  key: TDashboardWidgetKey
  title: string
  isContainer?: boolean
  isRemote?: boolean
  meta?: TWidgetMetaInfoBase<TFrameworkElementType>

  component?: TFrameworkComponentType

  loader?: TWidgetFactoryBase<TFrameworkComponentType>
}

/**
 * @name TDashboardWidgetCatalogBase
 * @description Map of available widgets used by the dashboard at runtime.
 * @template TFrameworkElementType - Framework-specific element type
 * @template TFrameworkComponentType - Framework-specific component type
 * @remarks Keys are `TDashboardWidgetKey` and values are catalog entries. The
 * map is typically treated as a read-only registry; replace the map to update
 * the available widget set rather than mutating entries in-place.
 */
export type TDashboardWidgetCatalogBase<TFrameworkElementType = any, TFrameworkComponentType = any> = Map<
  TDashboardWidgetKey,
  IDynamicWidgetCatalogEntryBase<TFrameworkElementType, TFrameworkComponentType>
>

/**
 * @name TGetDefaultWidgetMetaFromKeyOptions
 * @description Optional overrides when generating default widget metadata.
 * @remarks Fields provided here override the generated metadata's `title`
 * and/or `description`.
 */
export type TGetDefaultWidgetMetaFromKeyOptions = {
  name?: string
  description?: string
}

/**
 * @name TGetDefaultWidgetMetaFromKey
 * @description Function that returns default `TWidgetMetaInfoBase` metadata for a widget key.
 * @remarks Implementations should return a new object (not a shared reference)
 * so callers can safely mutate the result if needed.
 * @see TWidgetMetaInfoBase
 * @see TGetDefaultWidgetMetaFromKeyOptions
 * @returns `TWidgetMetaInfoBase`
 */
export type TGetDefaultWidgetMetaFromKey = (
  widgetKey: TDashboardWidgetKey,
  options?: TGetDefaultWidgetMetaFromKeyOptions,
) => TWidgetMetaInfoBase<any>

/**
 * @name TManifestEntry
 * @description Entry describing a remote widget manifest or resource.
 * @remarks
 * - `url` should point to the resource or manifest (absolute URLs recommended).
 * - `meta` contains widget metadata (see `TWidgetMetaInfoBase`) describing the
 *   remotely loaded widget.
 */
export type TManifestEntry = {
  url: string
  meta: TWidgetMetaInfoBase
}
