/**
 * Sanitizes various types of input parameters.
 * @param input - The input to be sanitized.
 * @param type - The expected type of the input ('string', 'number', 'boolean', 'array').
 * @returns - The sanitized input if valid, or null if invalid.
 */
const sanitizeInput = (input: any, type: 'string' | 'number' | 'boolean' | 'array'): any => {
  if (type === 'string') {
    if (typeof input === 'string') {
      return input.replace(/['"]/g, ''); // Remove quotes to prevent SQL injection
    }
    return null;
  }

  if (type === 'number') {
    const number = Number(input);
    return !isNaN(number) ? number : null;
  }

  if (type === 'boolean') {
    if (typeof input === 'boolean') return input;
    if (typeof input === 'string') {
      if (input.toLowerCase() === 'true') return true;
      if (input.toLowerCase() === 'false') return false;
    }
    return null;
  }

  if (type === 'array') {
    return Array.isArray(input) ? input.filter((id: any) => typeof id === 'number' && !isNaN(id)) : null;
  }

  return null;
};

export default sanitizeInput;
