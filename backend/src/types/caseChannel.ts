import { Prisma } from "../generated/prisma/client";

export interface CaseEventRecord {
  id: string;
  athleteId: string;
  team?: string | null;
  eventType: string;
  title: string;
  summary?: string | null;
  trustGrade?: string | null;
  role: string;
  actorId?: string | null;
  actorName?: string | null;
  pinned: boolean;
  nextAction?: string | null;
  attachments?: Prisma.JsonValue;
  metadata?: Prisma.JsonValue;
  mentions?: string[];
  consentFlag?: string | null;
  visibility?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CaseEventInput {
  eventType: string;
  title: string;
  summary?: string;
  trustGrade?: "A" | "B" | "C" | string;
  role?: string;
  pinned?: boolean;
  nextAction?: string;
  attachments?: Prisma.JsonValue;
  metadata?: Prisma.JsonValue;
  mentions?: string[];
  consentFlag?: string;
  visibility?: string;
}

export interface CaseChannelFilters {
  eventType?: string;
  role?: string;
  limit?: number;
}

export interface CaseChannelResponse {
  events: CaseEventRecord[];
  pinnedNextAction: CaseEventRecord | null;
  availableTypes: string[];
  availableRoles: string[];
}
