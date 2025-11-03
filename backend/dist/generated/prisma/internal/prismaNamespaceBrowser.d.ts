import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly Athlete: "Athlete";
    readonly AthleteContact: "AthleteContact";
    readonly MovementAssessment: "MovementAssessment";
    readonly MovementFrame: "MovementFrame";
    readonly RiskSnapshot: "RiskSnapshot";
    readonly RehabAssessment: "RehabAssessment";
    readonly RehabVideo: "RehabVideo";
    readonly Intervention: "Intervention";
    readonly AudienceRewrite: "AudienceRewrite";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly role: "role";
    readonly athleteId: "athleteId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const AthleteScalarFieldEnum: {
    readonly id: "id";
    readonly displayName: "displayName";
    readonly jerseyNumber: "jerseyNumber";
    readonly sport: "sport";
    readonly position: "position";
    readonly team: "team";
    readonly sex: "sex";
    readonly dateOfBirth: "dateOfBirth";
    readonly heightCm: "heightCm";
    readonly weightKg: "weightKg";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AthleteScalarFieldEnum = (typeof AthleteScalarFieldEnum)[keyof typeof AthleteScalarFieldEnum];
export declare const AthleteContactScalarFieldEnum: {
    readonly id: "id";
    readonly athleteId: "athleteId";
    readonly name: "name";
    readonly relationship: "relationship";
    readonly email: "email";
    readonly phone: "phone";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AthleteContactScalarFieldEnum = (typeof AthleteContactScalarFieldEnum)[keyof typeof AthleteContactScalarFieldEnum];
export declare const MovementAssessmentScalarFieldEnum: {
    readonly id: "id";
    readonly athleteId: "athleteId";
    readonly sessionId: "sessionId";
    readonly drillType: "drillType";
    readonly riskRating: "riskRating";
    readonly cues: "cues";
    readonly metrics: "metrics";
    readonly context: "context";
    readonly rawModelOutput: "rawModelOutput";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MovementAssessmentScalarFieldEnum = (typeof MovementAssessmentScalarFieldEnum)[keyof typeof MovementAssessmentScalarFieldEnum];
export declare const MovementFrameScalarFieldEnum: {
    readonly id: "id";
    readonly assessmentId: "assessmentId";
    readonly snapshotUrl: "snapshotUrl";
    readonly label: "label";
    readonly capturedAt: "capturedAt";
    readonly frameIndex: "frameIndex";
    readonly createdAt: "createdAt";
};
export type MovementFrameScalarFieldEnum = (typeof MovementFrameScalarFieldEnum)[keyof typeof MovementFrameScalarFieldEnum];
export declare const RiskSnapshotScalarFieldEnum: {
    readonly id: "id";
    readonly athleteId: "athleteId";
    readonly exposureMinutes: "exposureMinutes";
    readonly surface: "surface";
    readonly temperatureF: "temperatureF";
    readonly humidityPct: "humidityPct";
    readonly priorLowerExtremityInjury: "priorLowerExtremityInjury";
    readonly sorenessLevel: "sorenessLevel";
    readonly fatigueLevel: "fatigueLevel";
    readonly bodyWeightTrend: "bodyWeightTrend";
    readonly menstrualPhase: "menstrualPhase";
    readonly notes: "notes";
    readonly recordedFor: "recordedFor";
    readonly riskLevel: "riskLevel";
    readonly rationale: "rationale";
    readonly changeToday: "changeToday";
    readonly rawModelOutput: "rawModelOutput";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly recommendationAcknowledged: "recommendationAcknowledged";
};
export type RiskSnapshotScalarFieldEnum = (typeof RiskSnapshotScalarFieldEnum)[keyof typeof RiskSnapshotScalarFieldEnum];
export declare const RehabAssessmentScalarFieldEnum: {
    readonly id: "id";
    readonly athleteId: "athleteId";
    readonly surgicalSide: "surgicalSide";
    readonly sessionDate: "sessionDate";
    readonly limbSymmetryScore: "limbSymmetryScore";
    readonly cleared: "cleared";
    readonly concerns: "concerns";
    readonly recommendedExercises: "recommendedExercises";
    readonly athleteSummary: "athleteSummary";
    readonly parentSummary: "parentSummary";
    readonly clinicianNotes: "clinicianNotes";
    readonly rawModelOutput: "rawModelOutput";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RehabAssessmentScalarFieldEnum = (typeof RehabAssessmentScalarFieldEnum)[keyof typeof RehabAssessmentScalarFieldEnum];
export declare const RehabVideoScalarFieldEnum: {
    readonly id: "id";
    readonly rehabAssessmentId: "rehabAssessmentId";
    readonly url: "url";
    readonly testType: "testType";
    readonly capturedAt: "capturedAt";
    readonly createdAt: "createdAt";
};
export type RehabVideoScalarFieldEnum = (typeof RehabVideoScalarFieldEnum)[keyof typeof RehabVideoScalarFieldEnum];
export declare const InterventionScalarFieldEnum: {
    readonly id: "id";
    readonly assessmentId: "assessmentId";
    readonly focusArea: "focusArea";
    readonly message: "message";
    readonly audience: "audience";
    readonly acknowledged: "acknowledged";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type InterventionScalarFieldEnum = (typeof InterventionScalarFieldEnum)[keyof typeof InterventionScalarFieldEnum];
export declare const AudienceRewriteScalarFieldEnum: {
    readonly id: "id";
    readonly assessmentId: "assessmentId";
    readonly sourceMessage: "sourceMessage";
    readonly audience: "audience";
    readonly tone: "tone";
    readonly rewritten: "rewritten";
    readonly rawModelOutput: "rawModelOutput";
    readonly createdAt: "createdAt";
};
export type AudienceRewriteScalarFieldEnum = (typeof AudienceRewriteScalarFieldEnum)[keyof typeof AudienceRewriteScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map