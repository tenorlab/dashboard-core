// @tenorlab/dashboard-core
// file: src/utils/css-vars-utils.ts
import type { IDashboardSettingEntry } from '../interfaces'

/**
 * @name cssVarsUtils
 * @description Provides helpers method like getCssVariableValue, setCssVariableValue etc
 */
export const cssVarsUtils = {
  /**
   * @name getCssVariableValue
   * @description Return the value of a CSS custom property from the current HTML document
   * @param cssPropertyName
   * @returns
   */
  getCssVariableValue: (cssPropertyName: string): string | null => {
    const rootElement: HTMLElement = document.documentElement
    const styles = getComputedStyle(rootElement)
    return styles.getPropertyValue(cssPropertyName).trim() || null
  },
  /**
   * @name setCssVariableValue
   * @description Sets the value of a CSS custom property on the current HTML document
   * @param cssPropertyName
   * @param value
   */
  setCssVariableValue: (cssPropertyName: string, value: string): void => {
    const rootElement: HTMLElement = document.documentElement
    rootElement.style.setProperty(cssPropertyName, value)
  },
  /**
   * @name restoreCssVarsFromSettings
   * @description
   * Sets the values of many CSS custom properties on the current HTML document
   * from the list of dashboard settings provided
   * @param settings, an array of IDashboardSettingEntry
   */
  restoreCssVarsFromSettings: (settings: IDashboardSettingEntry[]): void => {
    const rootElement: HTMLElement = document.documentElement
    settings.forEach((item) => {
      rootElement.style.setProperty(item.cssProperty, item.value)
    })
  },
}
