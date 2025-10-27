/**
 * Utility functions for data transformation
 */

/**
 * Converts numeric string fields to actual numbers
 * This is especially useful for Sequelize DECIMAL fields that return as strings
 * @param data - The data object to transform
 * @param numericFields - Array of field names that should be converted to numbers
 * @returns The transformed data object
 */
export const convertStringFieldsToNumbers = (data: any, numericFields: string[]): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const transformedData = { ...data };

  numericFields.forEach((field) => {
    if (transformedData[field] !== null && transformedData[field] !== undefined) {
      transformedData[field] = typeof transformedData[field] === 'string' ? parseFloat(transformedData[field]) : transformedData[field];
    }
  });

  return transformedData;
};
