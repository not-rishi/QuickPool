import type { Group } from "@/types/group";
import type { TravelRoute } from "@/types/route";

export interface RideHistory {
  _id: string;
  routeId: TravelRoute | string;
  groupId?: Group | string;
  rideDate?: string;
  groupSize?: number;
  createdAt?: string;
}
