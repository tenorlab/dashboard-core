// @tenorlab/dashboard-core
// file: src/dashboard-settings/dashboard-settings-utils.ts
import type { IDashboardSettingEntry } from '../interfaces'

// for these we increment by defaultStep, anythnig else we increment by 1
const _largerStepUnits = ['rem', 'pc', 'cm', 'in', 'em', 'vh', 'vw', '%']

const _getStep = (suffix: string, defaultStep: number): number => {
  return _largerStepUnits.includes(suffix) ? defaultStep : 1
}

/**
 * @name dashboardSettingsUtils
 * @description Contains utils for the dashboard custom settings
 */
export const dashboardSettingsUtils = {
  /**
   * @name incrementOrDecrementValue
   * @description Increments or decrement a value based on the direction parameter
   * @param item: an instance of IDashboardSettingEntry
   * @param direction: -1 (for decrement) or 1 (for increment)
   * @returns the update item
   */
  incrementOrDecrementValue: (item: IDashboardSettingEntry, direction: -1 | 1): IDashboardSettingEntry => {
    // Extract the numeric part (e.g., '1.0' from '1.0rem')
    // We use a regex to find the number part.
    const numMatchArray = item.value.match(/([\d.]+)/)
    const prevNumValue = numMatchArray ? parseFloat(numMatchArray[1]) : 0

    // Extract the unit/suffix part (e.g., 'rem' from '1.0rem')
    // We use a regex to find the non-numeric part.
    const suffixMatch = item.value.match(/([^\d.]+)/)
    const suffix = suffixMatch ? suffixMatch[1] : item.defaultUnit // if no suffix, use defaultUnit

    // Determine the step value (0.1 for Up, -0.1 for Down)
    const step = _getStep(suffix, item.step) * direction

    // Calculate the new numeric value
    const newNumValue = Math.max(prevNumValue + step, item.minValue)

    // Combine the new number and the suffix
    const newValue = `${newNumValue.toFixed(1)}${suffix}`

    return {
      ...item,
      value: newValue,
    }
  },
}
