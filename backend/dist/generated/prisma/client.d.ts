import * as runtime from "@prisma/client/runtime/library";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model Athlete
 *
 */
export type Athlete = Prisma.AthleteModel;
/**
 * Model AthleteContact
 *
 */
export type AthleteContact = Prisma.AthleteContactModel;
/**
 * Model MovementAssessment
 *
 */
export type MovementAssessment = Prisma.MovementAssessmentModel;
/**
 * Model MovementFrame
 *
 */
export type MovementFrame = Prisma.MovementFrameModel;
/**
 * Model RiskSnapshot
 *
 */
export type RiskSnapshot = Prisma.RiskSnapshotModel;
/**
 * Model RehabAssessment
 *
 */
export type RehabAssessment = Prisma.RehabAssessmentModel;
/**
 * Model RehabVideo
 *
 */
export type RehabVideo = Prisma.RehabVideoModel;
/**
 * Model Intervention
 *
 */
export type Intervention = Prisma.InterventionModel;
/**
 * Model AudienceRewrite
 *
 */
export type AudienceRewrite = Prisma.AudienceRewriteModel;
//# sourceMappingURL=client.d.ts.map