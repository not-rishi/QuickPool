export type RouteBatchSize = 3 | 4 | 6;
export type RouteType = "QUICK_ROUTE" | "USER_ROUTE";

export interface RouteTimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
}

export interface RouteCreator {
  _id: string;
  name: string;
  usn: string;
}

export interface TravelRoute {
  _id: string;
  start: string;
  destination: string;
  description?: string;
  batchSize: RouteBatchSize;
  routeType: RouteType;
  active: boolean;
  timeSlots?: RouteTimeSlot[];
  createdBy?: RouteCreator | null;
  expiresAt?: string;
  createdAt?: string;
}
