import { Role } from "../generated/prisma/client";
export interface RegisterInput {
    email: string;
    password: string;
    role: Role;
    athleteId?: string;
    athleteDisplayName?: string;
}
export interface AuthResult {
    token: string;
    user: {
        id: string;
        email: string;
        role: Role;
        athleteId?: string | null;
    };
}
export declare const registerUser: (input: RegisterInput) => Promise<AuthResult>;
export declare const loginUser: (email: string, password: string) => Promise<AuthResult>;
export declare const issueToken: (userId: string, role: Role, email: string, athleteId?: string | null) => string;
export declare const verifyToken: (token: string) => {
    sub: string;
    role: Role;
    email: string;
    athleteId?: string | null;
    exp: number;
    iat: number;
};
//# sourceMappingURL=authService.d.ts.map