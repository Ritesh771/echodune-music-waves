// Dynamically set API_BASE_URL based on current window location, fallback to localhost
export const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : `${window.location.protocol}//${window.location.hostname}/api`; 