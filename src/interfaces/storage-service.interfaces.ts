// @tenorlab/dashboard-core
// file: src/interfaces/storage-service.interfaces.ts
import type { TDashboardWidgetCatalogBase } from './core.base'
import type { IDashboardConfig } from './core.interfaces'

/* begin: storage service interfaces */

/**
 * @name TGetSavedDashboards
 * @description Function type to get saved dashboards for a user
 * @remarks Used in IDashboardStorageService
 * @see IDashboardConfig
 * @see TDashboardWidgetCatalogBase
 * @return Promise<IDashboardConfig[]>
 */
export type TGetSavedDashboards = (
  userID: number | string,
  clientAppKey: string,
  widgetCatalog: TDashboardWidgetCatalogBase,
  defaultDashboardConfig: IDashboardConfig,
) => Promise<IDashboardConfig[]>

/**
 * @name TSaveDashboards
 * @description Function type to save dashboards for a user
 * @remarks Used in IDashboardStorageService
 * @see IDashboardConfig
 * @see TDashboardWidgetCatalogBase
 * @return Promise<boolean>
 */
export type TSaveDashboards = (
  userID: number | string,
  clientAppKey: string,
  dashboardConfigs: IDashboardConfig[],
  widgetCatalog: TDashboardWidgetCatalogBase,
) => Promise<boolean>

/**
 * @name IDashboardStorageService
 * @description Interface for the dashboard storage service
 * @remarks Used to define the storage service methods
 * @see TGetSavedDashboards
 * @see TSaveDashboards
 * @see IDashboardConfig
 */
export interface IDashboardStorageService {
  getSavedDashboards: TGetSavedDashboards
  saveDashboards: TSaveDashboards
}

/* end: storage service interfaces */
