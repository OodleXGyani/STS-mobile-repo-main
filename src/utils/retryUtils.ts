/**
 * Utility functions for handling API retries due to backend issues
 */

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier?: number;
}

export interface RetryableError {
  isRetryable: (error: any) => boolean;
  name: string;
}

/**
 * Common retryable error patterns for backend issues
 */
export const RETRYABLE_ERRORS: Record<string, RetryableError> = {
  NULL_REFERENCE_EXCEPTION: {
    name: 'NullReferenceException',
    isRetryable: (error: any) => 
      error?.data?.ExceptionType === 'System.NullReferenceException' ||
      error?.message?.includes('NullReferenceException') ||
      error?.data?.Message?.includes('An error has occurred') ||
      error?.data?.ExceptionMessage?.includes('Object reference not set to an instance of an object')
  },
  TIMEOUT: {
    name: 'Timeout',
    isRetryable: (error: any) => 
      error?.code === 'TIMEOUT' ||
      error?.message?.includes('timeout') ||
      error?.status === 408
  },
  NETWORK_ERROR: {
    name: 'NetworkError',
    isRetryable: (error: any) => 
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('Network Error') ||
      !error?.status
  }
};

/**
 * Generic retry function for API calls
 * @param apiCall - The API function to retry
 * @param config - Retry configuration
 * @param retryableErrors - Array of error patterns to retry on
 * @param context - Context for logging (e.g., 'Weekly Summary Report')
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  config: RetryConfig = { maxRetries: 2, delayMs: 500 },
  retryableErrors: RetryableError[] = [RETRYABLE_ERRORS.NULL_REFERENCE_EXCEPTION],
  context: string = 'API Call'
): Promise<T> {
  let lastError: any;
  let delay = config.delayMs;
  
  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`${context} - Attempt ${attempt}/${config.maxRetries}`);
      const result = await apiCall();
      console.log(`${context} - Success on attempt ${attempt}`);
      return result;
    } catch (error: any) {
      lastError = error;
      console.warn(`${context} - Attempt ${attempt} failed:`, {
        error: error?.data || error?.message,
        status: error?.status,
        attempt
      });
      
      // Check if any of the retryable error patterns match
      const shouldRetry = retryableErrors.some(errorPattern => 
        errorPattern.isRetryable(error)
      );
      
      if (shouldRetry && attempt < config.maxRetries) {
        const matchedError = retryableErrors.find(errorPattern => 
          errorPattern.isRetryable(error)
        );
        console.log(`${context} - ${matchedError?.name} detected, retrying in ${delay}ms...`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Apply backoff multiplier if configured
        if (config.backoffMultiplier) {
          delay *= config.backoffMultiplier;
        }
        
        continue;
      }
      
      // If it's not retryable or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  // If we get here, all retries failed
  console.error(`${context} - All ${config.maxRetries} attempts failed`, lastError);
  throw lastError;
}

/**
 * Specific retry function for Weekly Summary Report
 * This is a specialized function for the known backend bug
 */
export async function retryWeeklySummaryReport<T>(
  apiCall: () => Promise<T>,
  payload: any
): Promise<T> {
  return retryApiCall(
    apiCall,
    { maxRetries: 2, delayMs: 500 },
    [RETRYABLE_ERRORS.NULL_REFERENCE_EXCEPTION],
    'Weekly Summary Report'
  );
}

