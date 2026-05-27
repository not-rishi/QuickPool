import { API_BASE_URL } from "@/constants/api-endpoint";

export { API_BASE_URL };

export const API_ENDPOINTS = {
  auth: {
    sendOtp: `${API_BASE_URL}/api/auth/send-otp`,
    verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },

  users: {
    me: `${API_BASE_URL}/api/users/me`,
    history: `${API_BASE_URL}/api/users/me/history`,
  },

  routes: {
    base: `${API_BASE_URL}/api/routes`,

    details: (routeId: string | number) =>
      `${API_BASE_URL}/api/routes/${routeId}`,
    join: (routeId: string | number) =>
      `${API_BASE_URL}/api/routes/${routeId}/join`,
    leave: (routeId: string | number) =>
      `${API_BASE_URL}/api/routes/${routeId}/leave`,
    queue: (routeId: string | number) =>
      `${API_BASE_URL}/api/routes/${routeId}/queue`,
  },

  groups: {
    current: `${API_BASE_URL}/api/groups/current`,

    details: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}`,
    leave: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}/leave`,
    swap: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}/swap`,
    report: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}/report`,
    reportStatus: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}/report-status`,
    panic: (groupId: string | number) =>
      `${API_BASE_URL}/api/groups/${groupId}/panic`,
  },

  admin: {
    users: `${API_BASE_URL}/api/admin/users`,
    routes: `${API_BASE_URL}/api/admin/routes`,
    panicReports: `${API_BASE_URL}/api/admin/panic-reports`,
    updateReputation: (userId: string | number) =>
      `${API_BASE_URL}/api/admin/users/${userId}/reputation`,
  },
};
