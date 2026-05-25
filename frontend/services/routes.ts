import { apiRequest } from '@/services/api';
import type { TravelRoute } from '@/types/route';

export async function fetchRoutes(token: string): Promise<TravelRoute[]> {
  return apiRequest('/api/routes', { token });
}
