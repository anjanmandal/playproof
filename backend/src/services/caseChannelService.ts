import { Prisma, CaseEvent as PrismaCaseEvent } from "../generated/prisma/client";
import { prisma } from "../db/prisma";
import {
  CaseChannelFilters,
  CaseChannelResponse,
  CaseEventInput,
  CaseEventRecord,
} from "../types/caseChannel";

const normalizeMentions = (mentions?: string[]) =>
  mentions?.map((mention) => mention.trim()).filter((mention) => mention.length > 0) ?? [];

const extractMentions = (value: Prisma.JsonValue | null): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  const filtered = value.filter((item): item is string => typeof item === "string");
  return filtered.length ? filtered : undefined;
};

const mapToRecord = (event: PrismaCaseEvent): CaseEventRecord => ({
  id: event.id,
  athleteId: event.athleteId,
  team: event.team,
  eventType: event.eventType,
  title: event.title,
  summary: event.summary ?? undefined,
  trustGrade: event.trustGrade ?? undefined,
  role: event.role,
  actorId: event.actorId ?? undefined,
  actorName: event.actorName ?? undefined,
  pinned: event.pinned,
  nextAction: event.nextAction ?? undefined,
  attachments: (event.attachments as Prisma.JsonValue) ?? undefined,
  metadata: (event.metadata as Prisma.JsonValue) ?? undefined,
  mentions: extractMentions(event.mentions),
  consentFlag: event.consentFlag ?? undefined,
  visibility: event.visibility ?? undefined,
  createdAt: event.createdAt.toISOString(),
  updatedAt: event.updatedAt.toISOString(),
});

export const listCaseEvents = async (
  athleteId: string,
  filters: CaseChannelFilters,
): Promise<CaseChannelResponse> => {
  const where: Prisma.CaseEventWhereInput = {
    athleteId,
  };
  if (filters.eventType) where.eventType = filters.eventType;
  if (filters.role) where.role = filters.role;
  const take = Math.min(filters.limit ?? 50, 200);
  const events = await prisma.caseEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
  });
  const mapped = events.map((event) => mapToRecord(event));
  const pinnedNextAction =
    mapped.find((event) => event.pinned && event.nextAction) ??
    mapped.find((event) => event.nextAction) ??
    null;
  const availableTypes = Array.from(new Set(mapped.map((event) => event.eventType))).filter(Boolean);
  const availableRoles = Array.from(new Set(mapped.map((event) => event.role))).filter(Boolean);
  return {
    events: mapped,
    pinnedNextAction,
    availableTypes,
    availableRoles,
  };
};

export const createCaseEvent = async (
  athleteId: string,
  input: CaseEventInput,
  actor: { id: string; email: string; role: string },
  team?: string | null,
): Promise<CaseEventRecord> => {
  const payload: Prisma.CaseEventCreateInput = {
    athlete: { connect: { id: athleteId } },
    team: team ?? null,
    eventType: input.eventType,
    title: input.title,
    summary: input.summary,
    trustGrade: input.trustGrade,
    role: input.role ?? actor.role,
    actorId: actor.id,
    actorName: actor.email,
    pinned: Boolean(input.pinned),
    nextAction: input.nextAction,
    attachments: (input.attachments ?? undefined) as Prisma.InputJsonValue | undefined,
    metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    mentions: normalizeMentions(input.mentions),
    consentFlag: input.consentFlag,
    visibility: input.visibility,
  };
  const created = await prisma.caseEvent.create({ data: payload });
  return mapToRecord(created);
};

const AUTOMATION_ACTOR = {
  id: "case-automation",
  email: "case-channel@system",
  role: "Automation",
};

export const createAutomationCaseEvent = async (
  athleteId: string,
  input: CaseEventInput,
  options?: { team?: string | null; actor?: Partial<{ id: string; email: string; role: string }> },
) => {
  try {
    const actor = {
      ...AUTOMATION_ACTOR,
      ...options?.actor,
    };
    await createCaseEvent(athleteId, input, actor, options?.team);
  } catch (error) {
    console.warn("Failed to log case channel event", error);
  }
};
