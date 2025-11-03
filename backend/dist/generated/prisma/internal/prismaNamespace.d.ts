import * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
 * Metrics
 */
export type Metrics = runtime.Metrics;
export type Metric<T> = runtime.Metric<T>;
export type MetricHistogram = runtime.MetricHistogram;
export type MetricHistogramBucket = runtime.MetricHistogramBucket;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 6.18.0
 * Query Engine version: 34b5a692b7bd79939a9a2c3ef97d816e749cda2f
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
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
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
/**
 * SelectSubset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
 * Additionally, it validates, if both select and include are present. If the case, it errors.
 */
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "athlete" | "athleteContact" | "movementAssessment" | "movementFrame" | "riskSnapshot" | "rehabAssessment" | "rehabVideo" | "intervention" | "audienceRewrite";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        Athlete: {
            payload: Prisma.$AthletePayload<ExtArgs>;
            fields: Prisma.AthleteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AthleteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AthleteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                findFirst: {
                    args: Prisma.AthleteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AthleteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                findMany: {
                    args: Prisma.AthleteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>[];
                };
                create: {
                    args: Prisma.AthleteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                createMany: {
                    args: Prisma.AthleteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AthleteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>[];
                };
                delete: {
                    args: Prisma.AthleteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                update: {
                    args: Prisma.AthleteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                deleteMany: {
                    args: Prisma.AthleteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AthleteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AthleteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>[];
                };
                upsert: {
                    args: Prisma.AthleteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthletePayload>;
                };
                aggregate: {
                    args: Prisma.AthleteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAthlete>;
                };
                groupBy: {
                    args: Prisma.AthleteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AthleteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AthleteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AthleteCountAggregateOutputType> | number;
                };
            };
        };
        AthleteContact: {
            payload: Prisma.$AthleteContactPayload<ExtArgs>;
            fields: Prisma.AthleteContactFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AthleteContactFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AthleteContactFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                findFirst: {
                    args: Prisma.AthleteContactFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AthleteContactFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                findMany: {
                    args: Prisma.AthleteContactFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>[];
                };
                create: {
                    args: Prisma.AthleteContactCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                createMany: {
                    args: Prisma.AthleteContactCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AthleteContactCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>[];
                };
                delete: {
                    args: Prisma.AthleteContactDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                update: {
                    args: Prisma.AthleteContactUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                deleteMany: {
                    args: Prisma.AthleteContactDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AthleteContactUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AthleteContactUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>[];
                };
                upsert: {
                    args: Prisma.AthleteContactUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AthleteContactPayload>;
                };
                aggregate: {
                    args: Prisma.AthleteContactAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAthleteContact>;
                };
                groupBy: {
                    args: Prisma.AthleteContactGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AthleteContactGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AthleteContactCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AthleteContactCountAggregateOutputType> | number;
                };
            };
        };
        MovementAssessment: {
            payload: Prisma.$MovementAssessmentPayload<ExtArgs>;
            fields: Prisma.MovementAssessmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MovementAssessmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MovementAssessmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                findFirst: {
                    args: Prisma.MovementAssessmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MovementAssessmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                findMany: {
                    args: Prisma.MovementAssessmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>[];
                };
                create: {
                    args: Prisma.MovementAssessmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                createMany: {
                    args: Prisma.MovementAssessmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MovementAssessmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>[];
                };
                delete: {
                    args: Prisma.MovementAssessmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                update: {
                    args: Prisma.MovementAssessmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                deleteMany: {
                    args: Prisma.MovementAssessmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MovementAssessmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MovementAssessmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>[];
                };
                upsert: {
                    args: Prisma.MovementAssessmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementAssessmentPayload>;
                };
                aggregate: {
                    args: Prisma.MovementAssessmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMovementAssessment>;
                };
                groupBy: {
                    args: Prisma.MovementAssessmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MovementAssessmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MovementAssessmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MovementAssessmentCountAggregateOutputType> | number;
                };
            };
        };
        MovementFrame: {
            payload: Prisma.$MovementFramePayload<ExtArgs>;
            fields: Prisma.MovementFrameFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MovementFrameFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MovementFrameFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                findFirst: {
                    args: Prisma.MovementFrameFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MovementFrameFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                findMany: {
                    args: Prisma.MovementFrameFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>[];
                };
                create: {
                    args: Prisma.MovementFrameCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                createMany: {
                    args: Prisma.MovementFrameCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MovementFrameCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>[];
                };
                delete: {
                    args: Prisma.MovementFrameDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                update: {
                    args: Prisma.MovementFrameUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                deleteMany: {
                    args: Prisma.MovementFrameDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MovementFrameUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MovementFrameUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>[];
                };
                upsert: {
                    args: Prisma.MovementFrameUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MovementFramePayload>;
                };
                aggregate: {
                    args: Prisma.MovementFrameAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMovementFrame>;
                };
                groupBy: {
                    args: Prisma.MovementFrameGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MovementFrameGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MovementFrameCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MovementFrameCountAggregateOutputType> | number;
                };
            };
        };
        RiskSnapshot: {
            payload: Prisma.$RiskSnapshotPayload<ExtArgs>;
            fields: Prisma.RiskSnapshotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RiskSnapshotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RiskSnapshotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                findFirst: {
                    args: Prisma.RiskSnapshotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RiskSnapshotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                findMany: {
                    args: Prisma.RiskSnapshotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>[];
                };
                create: {
                    args: Prisma.RiskSnapshotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                createMany: {
                    args: Prisma.RiskSnapshotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RiskSnapshotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>[];
                };
                delete: {
                    args: Prisma.RiskSnapshotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                update: {
                    args: Prisma.RiskSnapshotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                deleteMany: {
                    args: Prisma.RiskSnapshotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RiskSnapshotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RiskSnapshotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>[];
                };
                upsert: {
                    args: Prisma.RiskSnapshotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RiskSnapshotPayload>;
                };
                aggregate: {
                    args: Prisma.RiskSnapshotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRiskSnapshot>;
                };
                groupBy: {
                    args: Prisma.RiskSnapshotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RiskSnapshotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RiskSnapshotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RiskSnapshotCountAggregateOutputType> | number;
                };
            };
        };
        RehabAssessment: {
            payload: Prisma.$RehabAssessmentPayload<ExtArgs>;
            fields: Prisma.RehabAssessmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RehabAssessmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RehabAssessmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                findFirst: {
                    args: Prisma.RehabAssessmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RehabAssessmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                findMany: {
                    args: Prisma.RehabAssessmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>[];
                };
                create: {
                    args: Prisma.RehabAssessmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                createMany: {
                    args: Prisma.RehabAssessmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RehabAssessmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>[];
                };
                delete: {
                    args: Prisma.RehabAssessmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                update: {
                    args: Prisma.RehabAssessmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                deleteMany: {
                    args: Prisma.RehabAssessmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RehabAssessmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RehabAssessmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>[];
                };
                upsert: {
                    args: Prisma.RehabAssessmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabAssessmentPayload>;
                };
                aggregate: {
                    args: Prisma.RehabAssessmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRehabAssessment>;
                };
                groupBy: {
                    args: Prisma.RehabAssessmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RehabAssessmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RehabAssessmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RehabAssessmentCountAggregateOutputType> | number;
                };
            };
        };
        RehabVideo: {
            payload: Prisma.$RehabVideoPayload<ExtArgs>;
            fields: Prisma.RehabVideoFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RehabVideoFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RehabVideoFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                findFirst: {
                    args: Prisma.RehabVideoFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RehabVideoFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                findMany: {
                    args: Prisma.RehabVideoFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>[];
                };
                create: {
                    args: Prisma.RehabVideoCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                createMany: {
                    args: Prisma.RehabVideoCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RehabVideoCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>[];
                };
                delete: {
                    args: Prisma.RehabVideoDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                update: {
                    args: Prisma.RehabVideoUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                deleteMany: {
                    args: Prisma.RehabVideoDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RehabVideoUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RehabVideoUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>[];
                };
                upsert: {
                    args: Prisma.RehabVideoUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RehabVideoPayload>;
                };
                aggregate: {
                    args: Prisma.RehabVideoAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRehabVideo>;
                };
                groupBy: {
                    args: Prisma.RehabVideoGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RehabVideoGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RehabVideoCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RehabVideoCountAggregateOutputType> | number;
                };
            };
        };
        Intervention: {
            payload: Prisma.$InterventionPayload<ExtArgs>;
            fields: Prisma.InterventionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InterventionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InterventionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                findFirst: {
                    args: Prisma.InterventionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InterventionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                findMany: {
                    args: Prisma.InterventionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>[];
                };
                create: {
                    args: Prisma.InterventionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                createMany: {
                    args: Prisma.InterventionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InterventionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>[];
                };
                delete: {
                    args: Prisma.InterventionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                update: {
                    args: Prisma.InterventionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                deleteMany: {
                    args: Prisma.InterventionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InterventionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InterventionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>[];
                };
                upsert: {
                    args: Prisma.InterventionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InterventionPayload>;
                };
                aggregate: {
                    args: Prisma.InterventionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIntervention>;
                };
                groupBy: {
                    args: Prisma.InterventionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InterventionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InterventionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InterventionCountAggregateOutputType> | number;
                };
            };
        };
        AudienceRewrite: {
            payload: Prisma.$AudienceRewritePayload<ExtArgs>;
            fields: Prisma.AudienceRewriteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AudienceRewriteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AudienceRewriteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                findFirst: {
                    args: Prisma.AudienceRewriteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AudienceRewriteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                findMany: {
                    args: Prisma.AudienceRewriteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>[];
                };
                create: {
                    args: Prisma.AudienceRewriteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                createMany: {
                    args: Prisma.AudienceRewriteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AudienceRewriteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>[];
                };
                delete: {
                    args: Prisma.AudienceRewriteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                update: {
                    args: Prisma.AudienceRewriteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                deleteMany: {
                    args: Prisma.AudienceRewriteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AudienceRewriteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AudienceRewriteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>[];
                };
                upsert: {
                    args: Prisma.AudienceRewriteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AudienceRewritePayload>;
                };
                aggregate: {
                    args: Prisma.AudienceRewriteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAudienceRewrite>;
                };
                groupBy: {
                    args: Prisma.AudienceRewriteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AudienceRewriteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AudienceRewriteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AudienceRewriteCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
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
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'Role'
 */
export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export type Datasource = {
    url?: string;
};
export type Datasources = {
    db?: Datasource;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: GlobalOmitConfig;
}
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    athlete?: Prisma.AthleteOmit;
    athleteContact?: Prisma.AthleteContactOmit;
    movementAssessment?: Prisma.MovementAssessmentOmit;
    movementFrame?: Prisma.MovementFrameOmit;
    riskSnapshot?: Prisma.RiskSnapshotOmit;
    rehabAssessment?: Prisma.RehabAssessmentOmit;
    rehabVideo?: Prisma.RehabVideoOmit;
    intervention?: Prisma.InterventionOmit;
    audienceRewrite?: Prisma.AudienceRewriteOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map