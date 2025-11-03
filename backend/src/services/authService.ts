import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import { env } from "../config/env";
import { ensureAthlete } from "./athleteService";
import { Role } from "../generated/prisma/client";

const JWT_SECRET = env.JWT_SECRET ?? "dev-secret";
const TOKEN_EXPIRY = "12h";
const SALT_ROUNDS = 10;

export interface RegisterInput {
  email: string;
  password: string;
  role: Role;
  athleteId?: string;
  athleteDisplayName?: string;
  teams?: string[];
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: Role;
    athleteId?: string | null;
    teams?: string[];
  };
}

const getCoachTeams = async (coachId: string): Promise<string[]> => {
  const teams = await prisma.coachTeam.findMany({
    where: { coachId },
    select: { teamId: true },
  });
  return teams.map((team) => team.teamId);
};

const upsertCoachTeams = async (coachId: string, teams: string[] = []) => {
  await prisma.coachTeam.deleteMany({ where: { coachId } });
  if (teams.length) {
    await prisma.coachTeam.createMany({
      data: teams.map((teamId) => ({ coachId, teamId })),
    });
  }
};

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } });

  if (existing) {
    throw new Error("An account already exists with this email.");
  }

  let athleteId = input.athleteId;

  if (input.role === "ATHLETE" || input.role === "PARENT") {
    const id = input.athleteId ?? randomUUID();
    await ensureAthlete(id, input.athleteDisplayName ?? id);
    athleteId = id;
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      athleteId,
    },
  });

  if (input.role === "COACH") {
    await upsertCoachTeams(user.id, input.teams ?? []);
  }

  const teams = input.role === "COACH" ? await getCoachTeams(user.id) : [];
  const token = issueToken(user.id, user.role, user.email, user.athleteId, teams);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      athleteId: user.athleteId,
      teams,
    },
  };
};

export const loginUser = async (email: string, password: string): Promise<AuthResult> => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    throw new Error("Invalid email or password.");
  }

  const teams = user.role === "COACH" ? await getCoachTeams(user.id) : [];
  const token = issueToken(user.id, user.role, user.email, user.athleteId, teams);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      athleteId: user.athleteId,
      teams,
    },
  };
};

export const issueToken = (
  userId: string,
  role: Role,
  email: string,
  athleteId?: string | null,
  teams?: string[],
) =>
  jwt.sign(
    {
      sub: userId,
      role,
      email,
      athleteId,
      teams,
    },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
    },
  );

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as {
    sub: string;
    role: Role;
    email: string;
    athleteId?: string | null;
    teams?: string[];
    exp: number;
    iat: number;
  };
};
