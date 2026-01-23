// @tenorlab/dashboard-core
// file: src/utils/store-utils.ts
import { ensureContainersSequence } from './core-utils'
import type {
  IDashboardConfig,
  TDashboardWidgetKey,
  TAddWidgetResponse,
  TRemoveWidgetResponse,
  TMoveWidgetResponse,
} from '../interfaces'

type TCoreResponse<T> = Omit<T, 'allUpdatedDashboardConfigs'>

/**
 * @name _getNextContainerName
 * @description Generates the next container name based on existing containers in the dashboard configuration
 * @param dashboardConfig
 * @returns {string} The next container name in the format 'containerX', where X is the next available number
 */
const getNextContainerName = (dashboardConfig: IDashboardConfig): string => {
  // get next container id
  const containersIds = dashboardConfig.widgets
    .filter((x) => x.includes('WidgetContainer'))
    .map((x) => Number(x.split('_')[1].replace('container', '')))
  let nextId = containersIds.length > 0 ? Math.max(...containersIds) + 1 : 1
  return `container${nextId}`
}

/**
 * @name dashboardStoreUtils
 * @description
 * Framework-agnostic helpers for managing dashboard state. These utilities
 * are designed to be consumed by specific store implementations.
 * @see {@link https://www.npmjs.com/package/@tenorlab/react-dashboard | @tenorlab/react-dashboard}
 * @see {@link https://www.npmjs.com/package/@tenorlab/vue-dashboard | @tenorlab/vue-dashboard}
 */
export const dashboardStoreUtils = {
  /**
   * @name getNextContainerName
   * @description Generates the next container name based on existing containers in the dashboard configuration
   * @param dashboardConfig
   * @returns {string} The next container name in the format 'containerX', where X is the next available number
   */
  getNextContainerName,

  /**
   * @name getNextContainerKey
   * @description Generates the next container widget key based on the dashboard configuration and a given container widget key
   * @param dashboardConfig
   * @param containerWidgetKey
   * @returns {TDashboardWidgetKey} The next container widget key
   */
  getNextContainerKey: (
    dashboardConfig: IDashboardConfig,
    containerWidgetKey: TDashboardWidgetKey,
  ): TDashboardWidgetKey => {
    const containerName = getNextContainerName(dashboardConfig)
    const widgetKey: TDashboardWidgetKey = `${containerWidgetKey}_${containerName}` as any
    return widgetKey
  },

  /**
   * @description Adds a widget to the configuration. Supports root-level and nested containers.
   * @param params - Configuration object for adding a widget.
   * @param params.dashboardConfig - The current {@link IDashboardConfig}.
   * @param params.widgetKey - The {@link TDashboardWidgetKey} to add.
   * @param params.parentWidgetKey - Optional parent container key.
   * @param params.noDuplicatedWidgets - If true, prevents adding the same key twice.
   * @returns A {@link TCoreResponse} containing the success status and updated config.
   */
  addWidget: (params: {
    dashboardConfig: IDashboardConfig
    widgetKey: TDashboardWidgetKey
    parentWidgetKey?: TDashboardWidgetKey
    noDuplicatedWidgets?: boolean
  }): TCoreResponse<TAddWidgetResponse> => {
    const { dashboardConfig, widgetKey, parentWidgetKey, noDuplicatedWidgets } = params

    if (parentWidgetKey) {
      // if adding to parent container
      // if noDuplicatedWidgets is true, do not allow to add duplicated widgets:
      if (
        noDuplicatedWidgets &&
        dashboardConfig.childWidgetsConfig.find(
          (x) => x.parentWidgetKey === parentWidgetKey && x.widgetKey === widgetKey,
        )
      ) {
        return {
          success: false,
          message: `DashboardStore: addWidget: Widget already added (${widgetKey})`,
          updatedDashboardConfig: dashboardConfig,
        }
      }
      const newChildWidgetsConfig = [
        ...dashboardConfig.childWidgetsConfig,
        { parentWidgetKey, widgetKey }, // new entry
      ]
      return {
        success: true,
        updatedDashboardConfig: {
          ...dashboardConfig,
          childWidgetsConfig: newChildWidgetsConfig,
        },
      }
    } else {
      // add root level widget
      // if noDuplicatedWidgets is true, do not allow to add duplicated widgets:
      if (noDuplicatedWidgets && dashboardConfig.widgets.includes(widgetKey)) {
        return {
          success: false,
          message: `DashboardStore: addWidget: Widget already added (${widgetKey})`,
          updatedDashboardConfig: dashboardConfig,
        }
      }
      const newWidgets = [...dashboardConfig.widgets, widgetKey]
      return {
        success: true,
        updatedDashboardConfig: {
          ...dashboardConfig,
          widgets: newWidgets,
        },
      }
    }
  },

  /**
   * @name removeWidget
   * @description Removes a widget from the dashboard configuration, either from the root level or from a specified parent container
   * @param dashboardConfig
   * @param widgetKey
   * @param parentWidgetKey
   * @returns {TCoreResponse<TRemoveWidgetResponse>} The response indicating success or failure and the updated dashboard configuration
   */
  removeWidget: (
    dashboardConfig: IDashboardConfig,
    widgetKey: TDashboardWidgetKey,
    parentWidgetKey?: TDashboardWidgetKey,
  ): TCoreResponse<TRemoveWidgetResponse> => {
    const lowerWidgetKey = `${widgetKey || ''}`.trim().toLowerCase()
    const lowerParentWidgetKey = `${parentWidgetKey || ''}`.trim().toLowerCase()

    if (lowerParentWidgetKey.length > 0) {
      // if removing from parent container:
      // save the other containers's widgets:
      const othersChildWidgets = dashboardConfig.childWidgetsConfig.filter(
        (entry) => `${entry.parentWidgetKey}`.trim().toLowerCase() !== lowerParentWidgetKey,
      )
      // remove current widget from the container matching the parentWidhetKey argument
      const updateContainerChildWidgets = dashboardConfig.childWidgetsConfig.filter(
        (entry) =>
          `${entry.parentWidgetKey}`.trim().toLowerCase() === lowerParentWidgetKey &&
          `${entry.widgetKey}`.trim().toLowerCase() !== lowerWidgetKey,
      )
      // update
      const newChildWidgetsConfig = [...othersChildWidgets, ...updateContainerChildWidgets]
      let updatedDashboardConfig = {
        ...dashboardConfig,
        childWidgetsConfig: newChildWidgetsConfig,
      }

      // if removing container, ensure correct container sequence but keep original order
      const isContainer = lowerWidgetKey.includes('container')
      if (isContainer) {
        updatedDashboardConfig = ensureContainersSequence(updatedDashboardConfig)
      }

      return {
        success: true,
        updatedDashboardConfig,
      }
    } else {
      // remove the root level widget
      const allWidgets = dashboardConfig.widgets || []

      const updatedWidgets = allWidgets.filter((key) => `${key}`.trim().toLowerCase() !== lowerWidgetKey)
      // if the widget being removed is a container, remove also all its childWidgets
      const updatedChildWidgets = dashboardConfig.childWidgetsConfig.filter(
        (entry) => `${entry.parentWidgetKey}`.trim().toLowerCase() !== lowerWidgetKey,
      )
      return {
        success: true,
        updatedDashboardConfig: {
          ...dashboardConfig,
          widgets: updatedWidgets,
          childWidgetsConfig: updatedChildWidgets,
        },
      }
    }
  },

  /**
   * @description Moves a widget's position within its current depth (root or container).
   * @param dashboardConfig - The current {@link IDashboardConfig}.
   * @param direction - Use `1` for forward/down and `-1` for backward/up.
   * @param widgetKey - The {@link TDashboardWidgetKey} to move.
   * @param parentWidgetKey - The container key if the widget is nested.
   * @returns A {@link TCoreResponse} with the new array order.
   */
  moveWidget: (
    dashboardConfig: IDashboardConfig,
    direction: -1 | 1,
    widgetKey: TDashboardWidgetKey,
    parentWidgetKey?: TDashboardWidgetKey,
  ): TCoreResponse<TMoveWidgetResponse> => {
    const lowerWidgetKey = `${widgetKey || ''}`.trim().toLowerCase()
    const lowerParentWidgetKey = `${parentWidgetKey || ''}`.trim().toLowerCase()
    if (lowerParentWidgetKey.length > 0) {
      // if moving inside parent container:
      // save the other containers's widgets:
      const othersChildWidgets = dashboardConfig.childWidgetsConfig.filter(
        (entry) => `${entry.parentWidgetKey}`.trim().toLowerCase() !== lowerParentWidgetKey,
      )
      // get this container widgets:
      let containerChildWidgets = dashboardConfig.childWidgetsConfig.filter(
        (entry) => `${entry.parentWidgetKey}`.trim().toLowerCase() === lowerParentWidgetKey,
      )
      const childWidget = containerChildWidgets.find(
        (x) => `${x.widgetKey}`.trim().toLowerCase() === lowerWidgetKey,
      )
      const currentIndex = containerChildWidgets.indexOf(childWidget!)
      let newIndex = currentIndex + direction

      // Ensure the new index is within the array bounds
      // If moving left past the start (index 0), keep it at 0.
      newIndex = Math.max(0, newIndex)
      // If moving right past the end, keep it at the last index (containerChildWidgets.length - 1).
      newIndex = Math.min(containerChildWidgets.length - 1, newIndex)

      // If the new index is the same as the current index, return
      if (newIndex === currentIndex) {
        return {
          success: false,
          message: `DashboardStore: moveWidget: Widget already at min/max position (${widgetKey})`,
          updatedDashboardConfig: dashboardConfig,
        }
      }

      // update position
      const updatedWidgets = [...containerChildWidgets]
      // Remove the element from its current position
      // splice(start, deleteCount) returns an array of the deleted elements
      const [elementToMove] = updatedWidgets.splice(currentIndex, 1)
      // Insert the element into its new position
      // splice(start, deleteCount, item1)
      updatedWidgets.splice(newIndex, 0, elementToMove)

      // return updated config
      return {
        success: true,
        updatedDashboardConfig: {
          ...dashboardConfig,
          childWidgetsConfig: [...othersChildWidgets, ...updatedWidgets],
        },
      }
    } else {
      // move root level widget
      const allWidgets = dashboardConfig.widgets || []
      const allWidgetsLower = allWidgets.map((x) => `${x}`.trim().toLowerCase())
      const currentIndex = allWidgetsLower.indexOf(lowerWidgetKey)
      let newIndex = currentIndex + direction

      // Ensure the new index is within the array bounds
      // If moving left past the start (index 0), keep it at 0.
      newIndex = Math.max(0, newIndex)
      // If moving right past the end, keep it at the last index (allWidgets.length - 1).
      newIndex = Math.min(allWidgets.length - 1, newIndex)

      // If the new index is the same as the current index, return
      if (newIndex === currentIndex) {
        return {
          success: false,
          message: `DashboardStore: moveWidget: Widget already at min/max position (${widgetKey})`,
          updatedDashboardConfig: dashboardConfig,
        }
      }

      // update position
      const updatedWidgets = [...allWidgets]
      // Remove the element from its current position
      // splice(start, deleteCount) returns an array of the deleted elements
      const [elementToMove] = updatedWidgets.splice(currentIndex, 1)
      // Insert the element into its new position
      // splice(start, deleteCount, item1)
      updatedWidgets.splice(newIndex, 0, elementToMove)
      return {
        success: true,
        updatedDashboardConfig: {
          ...dashboardConfig,
          widgets: updatedWidgets,
        },
      }
    }
  },
}
