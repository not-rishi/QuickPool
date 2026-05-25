// @/config/api.ts
export const API_BASE_URL = "http://192.168.29.117:5000";

export const API_ENDPOINTS = {
  // Auth
  auth: {
    sendOtp: `${API_BASE_URL}/api/auth/send-otp`,
    verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },

  // User Management
  // (Use users.me for both GET info and PUT updates)
  users: {
    me: `${API_BASE_URL}/api/users/me`,
    history: `${API_BASE_URL}/api/users/me/history`,
  },

  // Route & User-Route Management
  routes: {
    // Used for GET (all) and POST (create)
    base: `${API_BASE_URL}/api/routes`, 
    
    // Dynamic endpoints expecting an ID
    details: (routeId: string | number) => `${API_BASE_URL}/api/routes/${routeId}`,
    join: (routeId: string | number) => `${API_BASE_URL}/api/routes/${routeId}/join`,
    leave: (routeId: string | number) => `${API_BASE_URL}/api/routes/${routeId}/leave`, // Corrected from duplicate 'join'
    queue: (routeId: string | number) => `${API_BASE_URL}/api/routes/${routeId}/queue`,
  },

  // Group, No-Show & Emergency Management
  groups: {
    current: `${API_BASE_URL}/api/groups/current`,
    
    // Dynamic endpoints expecting an ID
    details: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}`,
    leave: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}/leave`,
    swap: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}/swap`,
    report: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}/report`,
    reportStatus: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}/report-status`,
    panic: (groupId: string | number) => `${API_BASE_URL}/api/groups/${groupId}/panic`,
  },

  // Admin Endpoints
  admin: {
    users: `${API_BASE_URL}/api/admin/users`,
    routes: `${API_BASE_URL}/api/admin/routes`,
    panicReports: `${API_BASE_URL}/api/admin/panic-reports`,
    updateReputation: (userId: string | number) => `${API_BASE_URL}/api/admin/users/${userId}/reputation`,
  },
};