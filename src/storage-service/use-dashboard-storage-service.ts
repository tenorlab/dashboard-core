// @tenorlab/dashboard-core
// file: src/storage-service/use-dashboard-storage-service.ts
import type {
  IDashboardConfig,
  TDashboardWidgetCatalogBase,
  IDashboardStorageService,
  TGetSavedDashboards,
  TSaveDashboards,
} from '../interfaces'

/**
 * @name _getLocalStorageKey
 * @description Helper to get the local storage key for a user and client app
 * @param userID 
 * @param clientAppKey 
 * @returns string
 */
const _getLocalStorageKey = (userID: number | string, clientAppKey: string): string => {
  return `dashboards_${clientAppKey}_${userID}`
}

/**
 * @name _getSavedDashboards
 * @description Implementation of TGetSavedDashboards that retrieves dashboards from localStorage
 * @param userID 
 * @param clientAppKey 
 * @param widgetCatalog 
 * @param defaultDashboardConfig 
 * @returns Promise<IDashboardConfig[]>
 */
const _getSavedDashboards: TGetSavedDashboards = async (
  userID: number | string,
  clientAppKey: string,
  widgetCatalog: TDashboardWidgetCatalogBase,
  defaultDashboardConfig: IDashboardConfig,
): Promise<IDashboardConfig[]> => {
  const rawStorageValue = localStorage.getItem(_getLocalStorageKey(userID, clientAppKey))
  if (rawStorageValue) {
    try {
      const results = JSON.parse(rawStorageValue) as IDashboardConfig[]

      if (results.length < 1) {
        // return default dashboard
        return [defaultDashboardConfig]
      }

      results.forEach((dashboardConfig) => {
        // ensure dashboardId has a value
        if (!dashboardConfig.dashboardId) {
          dashboardConfig.dashboardId = 'default'
        }
        if (!dashboardConfig.dashboardName) {
          dashboardConfig.dashboardName = `Dashboard ${dashboardConfig.dashboardId}`
        }
        dashboardConfig.responsiveGrid = dashboardConfig.responsiveGrid ?? false

        // Add validation of parsedConfig if needed
        if ((dashboardConfig.widgets || []).length < 1) {
          dashboardConfig.widgets = defaultDashboardConfig.widgets
        }
        // css setting entries (make sure we filter deprecated entries that were saved in local storage)
        const savedSettings = (dashboardConfig.cssSettings || []).filter((x) =>
          defaultDashboardConfig.cssSettings.some((defaultSetting) => defaultSetting.key === x.key),
        )

        if (savedSettings.length < 1) {
          dashboardConfig.cssSettings = [...defaultDashboardConfig.cssSettings]
        } else {
          // the settings from local storage might have missing properties that have been added in newer version
          savedSettings.forEach((setting) => {
            setting.value = (setting.value || '').replace(/NaN/g, '')
            // get default setting
            const defaultSetting = defaultDashboardConfig.cssSettings.find(
              (ds) => ds.key === setting.key,
            )
            if (defaultSetting) {
              // ensure all properties exist
              Object.keys(defaultSetting).forEach((propKey) => {
                if (!(propKey in setting)) {
                  // @ts-ignore
                  setting[propKey] = (defaultSetting as any)[propKey]
                }
              })

              // ensure some specific property have the correct defaults and steps:
              setting.step = defaultSetting.step
              setting.minValue = defaultSetting.minValue
              setting.defaultValue = defaultSetting.defaultValue
              setting.defaultUnit = defaultSetting.defaultUnit

              // in case bad data was saved, ensure value is valid number + unit
              if (/\d+/g.test(setting.value) === false) {
                setting.value = defaultSetting ? defaultSetting.value : '1.0rem'
              }
            }
          })
          // add all missing default setting entries
          const missingSettings = defaultDashboardConfig.cssSettings.filter((defaultSetting) => {
            return !savedSettings.some(
              (existingSetting) => existingSetting.key === defaultSetting.key,
            )
          })
          // update dashboard config settings
          dashboardConfig.cssSettings = [...savedSettings, ...missingSettings]
        }
        // also ensure that all widget keys are valid
        dashboardConfig.widgets = dashboardConfig.widgets.filter(
          (key) => key.includes('WidgetContainer') || widgetCatalog.has(key as any),
        )
        dashboardConfig.childWidgetsConfig = dashboardConfig.childWidgetsConfig.filter((entry) =>
          widgetCatalog.has(entry.widgetKey),
        )
        if (!dashboardConfig.zoomScale) {
          dashboardConfig.zoomScale = 1
        } else if (dashboardConfig.zoomScale < 0.7) {
          dashboardConfig.zoomScale = 0.7
        }
      })
      return results
    } catch (error) {
      console.warn('Error parsing saved dashboard config:', error)
    }
  }
  // Fall through to return default config
  return [defaultDashboardConfig]
}

/**
 * @name _saveDashboards
 * @description Implementation of TSaveDashboards that saves dashboards to localStorage
 * @param userID 
 * @param clientAppKey 
 * @param dashboardConfigs 
 * @param widgetCatalog 
 * @returns Promise<boolean>
 */
const _saveDashboards: TSaveDashboards = async (
  userID: number | string,
  clientAppKey: string,
  dashboardConfigs: IDashboardConfig[],
  widgetCatalog: TDashboardWidgetCatalogBase,
) => {
  dashboardConfigs.forEach((dashboardConfig) => {
    // redundant from v1 when supporting only 1 dashboard:
    dashboardConfig.userID = userID
    dashboardConfig.clientAppKey = clientAppKey
    dashboardConfig.responsiveGrid = dashboardConfig.responsiveGrid ?? false

    // For demo purposes, save to localStorage, later will do backend API call etc.
    if (typeof dashboardConfig !== 'object') {
      throw new Error('Invalid dashboard configuration')
    }
    // ensure that all widget keys are valid
    dashboardConfig.widgets = dashboardConfig.widgets.filter(
      (key) => key.includes('WidgetContainer') || widgetCatalog.has(key as any),
    )
    dashboardConfig.childWidgetsConfig = dashboardConfig.childWidgetsConfig.filter((entry) =>
      widgetCatalog.has(entry.widgetKey),
    )
    if (!dashboardConfig.zoomScale) {
      dashboardConfig.zoomScale = 1
    } else if (dashboardConfig.zoomScale < 0.7) {
      dashboardConfig.zoomScale = 0.7
    }
  })

  const rawConfig = JSON.stringify(dashboardConfigs)
  localStorage.setItem(_getLocalStorageKey(userID, clientAppKey), rawConfig)
  return true
}

const _instance: IDashboardStorageService = {
  getSavedDashboards: _getSavedDashboards,
  saveDashboards: _saveDashboards,
}

/**
 * @name useDashboardStorageService
 * @description
 * LocalStorage-backed implementation of `IDashboardStorageService`.
 *
 * Behavior:
 * - Persists an array of `IDashboardConfig` objects under the key
 *   `dashboards_<clientAppKey>_<userID>` in `localStorage`.
 * - `getSavedDashboards` performs lightweight validation and normalization when
 *   reading saved data: fills missing `dashboardId`/`dashboardName`, sanitizes
 *   CSS settings, filters unknown widget keys, and clamps `zoomScale`.
 * - `saveDashboards` filters invalid widget keys, ensures required metadata
 *   (`userID`, `clientAppKey`, `responsiveGrid`, `zoomScale`) and writes the
 *   JSON-serialized dashboards to `localStorage`.
 *
 * Notes / limitations:
 * - Uses synchronous browser `localStorage` with limited quota — not suitable
 *   for very large datasets or high-frequency writes.
 * - Does not provide server-side persistence or multi-user synchronization. To
 *   persist dashboards centrally, implement a custom service that adheres to
 *   `IDashboardStorageService` and replace this implementation.
 *
 * @returns An object implementing `IDashboardStorageService` with
 * `getSavedDashboards` and `saveDashboards` methods.
 */
export const useDashboardStorageService = (): IDashboardStorageService => {
  return _instance as any
}
