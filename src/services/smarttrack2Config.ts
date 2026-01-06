/**
 * Centralized configuration for smarttrack2 API base path
 * Handles environment-specific URL construction
 * 
 * This prevents hardcoded URLs and enables easy environment switching
 */

import { getApiBaseUrl } from './constants';

/**
 * Gets the smarttrack2 API base URL based on current environment
 * @returns Full URL for smarttrack2 API (e.g., https://test.smarttrack-sts.com/smarttrack2)
 */
export function getSmarttrack2BaseUrl(): string {
  const apiBase = getApiBaseUrl(); // Gets https://test.smarttrack-sts.com/api
  // Remove /api suffix and append /smarttrack2
  return apiBase.replace(/\/api\/?$/, '') + '/smarttrack2';
}

/**
 * Builds a complete smarttrack2 API URL
 * @param path - The API path (e.g., /user/GetAccessibleReports, /report-requests)
 * @returns Full URL to the endpoint
 */
export function buildSmarttrack2Url(path: string): string {
  const base = getSmarttrack2BaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
