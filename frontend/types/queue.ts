import type { GroupMember } from "@/types/group";

export interface QueueEntry {
  _id: string;
  routeId: string;
  slotId?: string;
  userId: GroupMember | string;
  femaleOnly?: boolean;
  joinedAt?: string;
}
