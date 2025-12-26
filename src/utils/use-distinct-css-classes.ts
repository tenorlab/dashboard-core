/**
 * @name getDistinctCssClasses
 * @description Ensures a distinct list off css classes, avoiding duplicates
 * @param defaultClasses
 * @param additionalClasses
 * @returns the distinct list as a string
 */
export const getDistinctCssClasses = (
  defaultClasses: string,
  ...additionalClasses: string[]
): string => {
  // distinct css classes
  const result = [
    ...new Set(
      [defaultClasses || '', ...additionalClasses]
        .join(' ')
        .trim()
        .replace(/\n+/gi, ' ')
        .replace(/\s+/gi, ' ')
        .split(' '),
    ),
  ]
    .join(' ')
    .trim()
  return result
}
