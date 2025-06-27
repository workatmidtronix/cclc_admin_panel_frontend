// Frontend API Configuration
// This will use the proxy in development and the production URL in production
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://your-backend-app.onrender.com'
  : 'http://localhost:5000'; 