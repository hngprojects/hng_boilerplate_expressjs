export const validateCategoryParams = (query: any): { isValid: boolean, error?: any } => {
    const { limit, offset, parent_id } = query;
  
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
      return {
        isValid: false,
        error: {
          status_code: 400,
          error: {
            code: 'INVALID_QUERY_PARAMETER',
            message: 'The provided query parameter is invalid.',
            details: {
              invalid_parameter: 'limit',
              reason: 'Must be a positive integer',
            },
          },
        },
      };
    }
  
    if (offset && (!Number.isInteger(Number(offset)) || Number(offset) < 0)) {
      return {
        isValid: false,
        error: {
          status_code: 400,
          error: {
            code: 'INVALID_QUERY_PARAMETER',
            message: 'The provided query parameter is invalid.',
            details: {
              invalid_parameter: 'offset',
              reason: 'Must be a non-negative integer',
            },
          },
        },
      };
    }
  
    if (parent_id && !Number.isInteger(Number(parent_id))) {
      return {
        isValid: false,
        error: {
          status_code: 400,
          error: {
            code: 'INVALID_QUERY_PARAMETER',
            message: 'The provided query parameter is invalid.',
            details: {
              invalid_parameter: 'parent_id',
              reason: 'Must be an integer',
            },
          },
        },
      };
    }
  
    return { isValid: true };
  };
  