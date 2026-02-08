// @tenorlab/dashboard-core
// file: src/interfaces/core.interfaces.ts
import type { TDashboardWidgetKey, IWidgetSavedProps } from './core.base'

/**
 * @name IChildWidgetConfigEntry
 * @description Interface for a child widget configuration entry
 * @remarks Used in IDashboardConfig
 * @see IDashboardConfig
 */
export interface IChildWidgetConfigEntry {
  parentWidgetKey: TDashboardWidgetKey
  widgetKey: TDashboardWidgetKey
}

/**
 * @name IDashboardSettingEntry
 * @description Interface for a dashboard setting entry
 * @see cssSettingsCatalog in dashboard-settings.ts
 */
export interface IDashboardSettingEntry {
  key: string
  name: string
  description: string
  cssProperty: string
  step: number
  defaultUnit: string
  minValue: number
  defaultValue: string
  value: string
}

/**
 * @name IDashboardConfig
 * @description Interface for the dashboard configuration
 * @remarks Used to store the dashboard state
 * @see IChildWidgetConfigEntry
 * @see IDashboardSettingEntry
 */
export interface IDashboardConfig {
  userID: number | string
  clientAppKey: string
  dashboardId: string
  dashboardName: string
  zoomScale: number
  responsiveGrid: boolean
  widgets: TDashboardWidgetKey[]
  childWidgetsConfig: IChildWidgetConfigEntry[]
  savedProps?: IWidgetSavedProps[]
  cssSettings: IDashboardSettingEntry[]

  // these are for unit tests only
  _version?: number
  _stateDescription?: string
}

/* begin: store */
/**
 * @name TAddWidgetResponse
 * @description Type for the response of the addWidget mutation
 * @property {boolean} success - Indicates if the widget was added successfully
 * @property {string} [message] - Optional message providing additional information
 * @property {IDashboardConfig} updatedDashboardConfig - The updated dashboard configuration after adding the widget
 * @property {IDashboardConfig[]} allUpdatedDashboardConfigs - All updated dashboard configurations
 */
export type TAddWidgetResponse = {
  success: boolean
  message?: string
  updatedDashboardConfig: IDashboardConfig
  allUpdatedDashboardConfigs: IDashboardConfig[]
}
export type TRemoveWidgetResponse = TAddWidgetResponse
export type TMoveWidgetResponse = TAddWidgetResponse
/* end: store */

/* begin: undo history */
/**
 * @name TUndoHistoryEntry
 * @description Type for an undo history entry
 * @remarks Used in dashboard undo/redo functionality
 * @see IDashboardConfig
 */
export type TUndoHistoryEntry = {
  undoIndex: number
  config: IDashboardConfig
}

/**
 * @name TDashboardUndoStatus
 * @description Type for the dashboard undo/redo status
 * @remarks Used in dashboard undo/redo functionality
 */
export type TDashboardUndoStatus = {
  isUndoDisabled: boolean
  isRedoDisabled: boolean

  // these for debugging only (and unit tests)
  _currentIndex?: number
  _historyLength?: number
}

/* end: undo history */
