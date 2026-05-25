import type { UserGender } from "@/types/user";

export type GroupStatus = "FORMED" | "STARTED" | "COMPLETED";

export interface GroupMember {
  _id: string;
  name?: string;
  usn?: string;
  email?: string;
  phone?: string;
  gender?: UserGender;
  reputationScore?: number;
}

export interface Group {
  _id: string;
  routeId: string;
  slotId?: string;
  members: GroupMember[];
  rideTime?: string;
  status?: GroupStatus;
  createdAt?: string;
}

export interface NoShowReport {
  _id: string;
  reporterId: GroupMember;
  reportedUserId: GroupMember;
  groupId: string;
  reason?: string;
  createdAt?: string;
}
