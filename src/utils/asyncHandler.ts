export const asyncHandler = <T>(fn: (...args: any[]) => Promise<T>) => {
  return async (...args: any[]): Promise<T | void> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw error;
    }
  };
};
