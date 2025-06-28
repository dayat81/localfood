import { ApolloError } from '@apollo/client';

export interface AppError {
  message: string;
  code: string;
  field?: string;
  type: 'NETWORK' | 'GRAPHQL' | 'VALIDATION' | 'UNKNOWN';
}

export const handleApolloError = (error: ApolloError): AppError => {
  // Network error
  if (error.networkError) {
    return {
      message: 'Network connection failed. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      type: 'NETWORK',
    };
  }

  // GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    const graphQLError = error.graphQLErrors[0];
    
    // Check for common Saleor error codes
    switch (graphQLError.extensions?.code) {
      case 'PERMISSION_DENIED':
        return {
          message: 'You do not have permission to perform this action.',
          code: 'PERMISSION_DENIED',
          type: 'VALIDATION',
        };
      case 'NOT_FOUND':
        return {
          message: 'The requested resource was not found.',
          code: 'NOT_FOUND',
          type: 'VALIDATION',
        };
      case 'REQUIRED':
        return {
          message: 'Required field is missing.',
          code: 'REQUIRED',
          field: graphQLError.extensions?.field as string,
          type: 'VALIDATION',
        };
      case 'INVALID':
        return {
          message: 'Invalid input provided.',
          code: 'INVALID',
          field: graphQLError.extensions?.field as string,
          type: 'VALIDATION',
        };
      case 'UNIQUE':
        return {
          message: 'This value already exists.',
          code: 'UNIQUE',
          field: graphQLError.extensions?.field as string,
          type: 'VALIDATION',
        };
      default:
        return {
          message: graphQLError.message || 'An error occurred.',
          code: 'GRAPHQL_ERROR',
          type: 'GRAPHQL',
        };
    }
  }

  // Fallback for unknown errors
  return {
    message: error.message || 'An unexpected error occurred.',
    code: 'UNKNOWN_ERROR',
    type: 'UNKNOWN',
  };
};

export const formatErrorMessage = (error: AppError): string => {
  if (error.field) {
    return `${error.field}: ${error.message}`;
  }
  return error.message;
};

export const isNetworkError = (error: AppError): boolean => {
  return error.type === 'NETWORK';
};

export const isValidationError = (error: AppError): boolean => {
  return error.type === 'VALIDATION';
};

export const shouldRetry = (error: AppError): boolean => {
  // Retry network errors and some specific GraphQL errors
  return error.type === 'NETWORK' || error.code === 'TIMEOUT';
};

// Helper function to extract error from API response
export const extractApiError = (errorResponse: any): AppError => {
  if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
    const firstError = errorResponse.errors[0];
    return {
      message: firstError.message || 'API error occurred',
      code: firstError.code || 'API_ERROR',
      field: firstError.field,
      type: 'GRAPHQL',
    };
  }

  return {
    message: 'Unknown API error',
    code: 'UNKNOWN_API_ERROR',
    type: 'UNKNOWN',
  };
};