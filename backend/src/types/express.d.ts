import type { Role } from "../generated/prisma/client";

export interface AuthUserContext {
  id: string;
  email: string;
  role: Role;
  athleteId?: string | null;
  teams?: string[];
}

declare global {
  namespace Express {
    // Adds authenticated user payload to all Express requests.
    interface AuthUser extends AuthUserContext {}

    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
