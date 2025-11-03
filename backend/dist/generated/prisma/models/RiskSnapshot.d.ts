import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RiskSnapshot
 *
 */
export type RiskSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$RiskSnapshotPayload>;
export type AggregateRiskSnapshot = {
    _count: RiskSnapshotCountAggregateOutputType | null;
    _avg: RiskSnapshotAvgAggregateOutputType | null;
    _sum: RiskSnapshotSumAggregateOutputType | null;
    _min: RiskSnapshotMinAggregateOutputType | null;
    _max: RiskSnapshotMaxAggregateOutputType | null;
};
export type RiskSnapshotAvgAggregateOutputType = {
    exposureMinutes: number | null;
    temperatureF: number | null;
    humidityPct: number | null;
    sorenessLevel: number | null;
    fatigueLevel: number | null;
};
export type RiskSnapshotSumAggregateOutputType = {
    exposureMinutes: number | null;
    temperatureF: number | null;
    humidityPct: number | null;
    sorenessLevel: number | null;
    fatigueLevel: number | null;
};
export type RiskSnapshotMinAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    exposureMinutes: number | null;
    surface: string | null;
    temperatureF: number | null;
    humidityPct: number | null;
    priorLowerExtremityInjury: boolean | null;
    sorenessLevel: number | null;
    fatigueLevel: number | null;
    bodyWeightTrend: string | null;
    menstrualPhase: string | null;
    notes: string | null;
    recordedFor: Date | null;
    riskLevel: string | null;
    rationale: string | null;
    changeToday: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    recommendationAcknowledged: boolean | null;
};
export type RiskSnapshotMaxAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    exposureMinutes: number | null;
    surface: string | null;
    temperatureF: number | null;
    humidityPct: number | null;
    priorLowerExtremityInjury: boolean | null;
    sorenessLevel: number | null;
    fatigueLevel: number | null;
    bodyWeightTrend: string | null;
    menstrualPhase: string | null;
    notes: string | null;
    recordedFor: Date | null;
    riskLevel: string | null;
    rationale: string | null;
    changeToday: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    recommendationAcknowledged: boolean | null;
};
export type RiskSnapshotCountAggregateOutputType = {
    id: number;
    athleteId: number;
    exposureMinutes: number;
    surface: number;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: number;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend: number;
    menstrualPhase: number;
    notes: number;
    recordedFor: number;
    riskLevel: number;
    rationale: number;
    changeToday: number;
    rawModelOutput: number;
    createdAt: number;
    updatedAt: number;
    recommendationAcknowledged: number;
    _all: number;
};
export type RiskSnapshotAvgAggregateInputType = {
    exposureMinutes?: true;
    temperatureF?: true;
    humidityPct?: true;
    sorenessLevel?: true;
    fatigueLevel?: true;
};
export type RiskSnapshotSumAggregateInputType = {
    exposureMinutes?: true;
    temperatureF?: true;
    humidityPct?: true;
    sorenessLevel?: true;
    fatigueLevel?: true;
};
export type RiskSnapshotMinAggregateInputType = {
    id?: true;
    athleteId?: true;
    exposureMinutes?: true;
    surface?: true;
    temperatureF?: true;
    humidityPct?: true;
    priorLowerExtremityInjury?: true;
    sorenessLevel?: true;
    fatigueLevel?: true;
    bodyWeightTrend?: true;
    menstrualPhase?: true;
    notes?: true;
    recordedFor?: true;
    riskLevel?: true;
    rationale?: true;
    changeToday?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
    recommendationAcknowledged?: true;
};
export type RiskSnapshotMaxAggregateInputType = {
    id?: true;
    athleteId?: true;
    exposureMinutes?: true;
    surface?: true;
    temperatureF?: true;
    humidityPct?: true;
    priorLowerExtremityInjury?: true;
    sorenessLevel?: true;
    fatigueLevel?: true;
    bodyWeightTrend?: true;
    menstrualPhase?: true;
    notes?: true;
    recordedFor?: true;
    riskLevel?: true;
    rationale?: true;
    changeToday?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
    recommendationAcknowledged?: true;
};
export type RiskSnapshotCountAggregateInputType = {
    id?: true;
    athleteId?: true;
    exposureMinutes?: true;
    surface?: true;
    temperatureF?: true;
    humidityPct?: true;
    priorLowerExtremityInjury?: true;
    sorenessLevel?: true;
    fatigueLevel?: true;
    bodyWeightTrend?: true;
    menstrualPhase?: true;
    notes?: true;
    recordedFor?: true;
    riskLevel?: true;
    rationale?: true;
    changeToday?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
    recommendationAcknowledged?: true;
    _all?: true;
};
export type RiskSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RiskSnapshot to aggregate.
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RiskSnapshots to fetch.
     */
    orderBy?: Prisma.RiskSnapshotOrderByWithRelationInput | Prisma.RiskSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RiskSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RiskSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RiskSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RiskSnapshots
    **/
    _count?: true | RiskSnapshotCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: RiskSnapshotAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: RiskSnapshotSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RiskSnapshotMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RiskSnapshotMaxAggregateInputType;
};
export type GetRiskSnapshotAggregateType<T extends RiskSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateRiskSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRiskSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateRiskSnapshot[P]>;
};
export type RiskSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RiskSnapshotWhereInput;
    orderBy?: Prisma.RiskSnapshotOrderByWithAggregationInput | Prisma.RiskSnapshotOrderByWithAggregationInput[];
    by: Prisma.RiskSnapshotScalarFieldEnum[] | Prisma.RiskSnapshotScalarFieldEnum;
    having?: Prisma.RiskSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RiskSnapshotCountAggregateInputType | true;
    _avg?: RiskSnapshotAvgAggregateInputType;
    _sum?: RiskSnapshotSumAggregateInputType;
    _min?: RiskSnapshotMinAggregateInputType;
    _max?: RiskSnapshotMaxAggregateInputType;
};
export type RiskSnapshotGroupByOutputType = {
    id: string;
    athleteId: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend: string | null;
    menstrualPhase: string | null;
    notes: string | null;
    recordedFor: Date | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput: string | null;
    createdAt: Date;
    updatedAt: Date;
    recommendationAcknowledged: boolean;
    _count: RiskSnapshotCountAggregateOutputType | null;
    _avg: RiskSnapshotAvgAggregateOutputType | null;
    _sum: RiskSnapshotSumAggregateOutputType | null;
    _min: RiskSnapshotMinAggregateOutputType | null;
    _max: RiskSnapshotMaxAggregateOutputType | null;
};
type GetRiskSnapshotGroupByPayload<T extends RiskSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RiskSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RiskSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RiskSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RiskSnapshotGroupByOutputType[P]>;
}>>;
export type RiskSnapshotWhereInput = {
    AND?: Prisma.RiskSnapshotWhereInput | Prisma.RiskSnapshotWhereInput[];
    OR?: Prisma.RiskSnapshotWhereInput[];
    NOT?: Prisma.RiskSnapshotWhereInput | Prisma.RiskSnapshotWhereInput[];
    id?: Prisma.StringFilter<"RiskSnapshot"> | string;
    athleteId?: Prisma.StringFilter<"RiskSnapshot"> | string;
    exposureMinutes?: Prisma.IntFilter<"RiskSnapshot"> | number;
    surface?: Prisma.StringFilter<"RiskSnapshot"> | string;
    temperatureF?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    humidityPct?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    priorLowerExtremityInjury?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
    sorenessLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    fatigueLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    bodyWeightTrend?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    menstrualPhase?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    notes?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    recordedFor?: Prisma.DateTimeNullableFilter<"RiskSnapshot"> | Date | string | null;
    riskLevel?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rationale?: Prisma.StringFilter<"RiskSnapshot"> | string;
    changeToday?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    recommendationAcknowledged?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
};
export type RiskSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    exposureMinutes?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    priorLowerExtremityInjury?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
    bodyWeightTrend?: Prisma.SortOrderInput | Prisma.SortOrder;
    menstrualPhase?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedFor?: Prisma.SortOrderInput | Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    rationale?: Prisma.SortOrder;
    changeToday?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    recommendationAcknowledged?: Prisma.SortOrder;
    athlete?: Prisma.AthleteOrderByWithRelationInput;
};
export type RiskSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RiskSnapshotWhereInput | Prisma.RiskSnapshotWhereInput[];
    OR?: Prisma.RiskSnapshotWhereInput[];
    NOT?: Prisma.RiskSnapshotWhereInput | Prisma.RiskSnapshotWhereInput[];
    athleteId?: Prisma.StringFilter<"RiskSnapshot"> | string;
    exposureMinutes?: Prisma.IntFilter<"RiskSnapshot"> | number;
    surface?: Prisma.StringFilter<"RiskSnapshot"> | string;
    temperatureF?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    humidityPct?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    priorLowerExtremityInjury?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
    sorenessLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    fatigueLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    bodyWeightTrend?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    menstrualPhase?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    notes?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    recordedFor?: Prisma.DateTimeNullableFilter<"RiskSnapshot"> | Date | string | null;
    riskLevel?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rationale?: Prisma.StringFilter<"RiskSnapshot"> | string;
    changeToday?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    recommendationAcknowledged?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
}, "id">;
export type RiskSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    exposureMinutes?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    priorLowerExtremityInjury?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
    bodyWeightTrend?: Prisma.SortOrderInput | Prisma.SortOrder;
    menstrualPhase?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedFor?: Prisma.SortOrderInput | Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    rationale?: Prisma.SortOrder;
    changeToday?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    recommendationAcknowledged?: Prisma.SortOrder;
    _count?: Prisma.RiskSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.RiskSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.RiskSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.RiskSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.RiskSnapshotSumOrderByAggregateInput;
};
export type RiskSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.RiskSnapshotScalarWhereWithAggregatesInput | Prisma.RiskSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.RiskSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RiskSnapshotScalarWhereWithAggregatesInput | Prisma.RiskSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    athleteId?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    exposureMinutes?: Prisma.IntWithAggregatesFilter<"RiskSnapshot"> | number;
    surface?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    temperatureF?: Prisma.FloatWithAggregatesFilter<"RiskSnapshot"> | number;
    humidityPct?: Prisma.FloatWithAggregatesFilter<"RiskSnapshot"> | number;
    priorLowerExtremityInjury?: Prisma.BoolWithAggregatesFilter<"RiskSnapshot"> | boolean;
    sorenessLevel?: Prisma.IntWithAggregatesFilter<"RiskSnapshot"> | number;
    fatigueLevel?: Prisma.IntWithAggregatesFilter<"RiskSnapshot"> | number;
    bodyWeightTrend?: Prisma.StringNullableWithAggregatesFilter<"RiskSnapshot"> | string | null;
    menstrualPhase?: Prisma.StringNullableWithAggregatesFilter<"RiskSnapshot"> | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"RiskSnapshot"> | string | null;
    recordedFor?: Prisma.DateTimeNullableWithAggregatesFilter<"RiskSnapshot"> | Date | string | null;
    riskLevel?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    rationale?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    changeToday?: Prisma.StringWithAggregatesFilter<"RiskSnapshot"> | string;
    rawModelOutput?: Prisma.StringNullableWithAggregatesFilter<"RiskSnapshot"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RiskSnapshot"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RiskSnapshot"> | Date | string;
    recommendationAcknowledged?: Prisma.BoolWithAggregatesFilter<"RiskSnapshot"> | boolean;
};
export type RiskSnapshotCreateInput = {
    id?: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
    athlete: Prisma.AthleteCreateNestedOneWithoutRiskSnapshotsInput;
};
export type RiskSnapshotUncheckedCreateInput = {
    id?: string;
    athleteId: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutRiskSnapshotsNestedInput;
};
export type RiskSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotCreateManyInput = {
    id?: string;
    athleteId: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotListRelationFilter = {
    every?: Prisma.RiskSnapshotWhereInput;
    some?: Prisma.RiskSnapshotWhereInput;
    none?: Prisma.RiskSnapshotWhereInput;
};
export type RiskSnapshotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RiskSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    exposureMinutes?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    priorLowerExtremityInjury?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
    bodyWeightTrend?: Prisma.SortOrder;
    menstrualPhase?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    recordedFor?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    rationale?: Prisma.SortOrder;
    changeToday?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    recommendationAcknowledged?: Prisma.SortOrder;
};
export type RiskSnapshotAvgOrderByAggregateInput = {
    exposureMinutes?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
};
export type RiskSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    exposureMinutes?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    priorLowerExtremityInjury?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
    bodyWeightTrend?: Prisma.SortOrder;
    menstrualPhase?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    recordedFor?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    rationale?: Prisma.SortOrder;
    changeToday?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    recommendationAcknowledged?: Prisma.SortOrder;
};
export type RiskSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    exposureMinutes?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    priorLowerExtremityInjury?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
    bodyWeightTrend?: Prisma.SortOrder;
    menstrualPhase?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    recordedFor?: Prisma.SortOrder;
    riskLevel?: Prisma.SortOrder;
    rationale?: Prisma.SortOrder;
    changeToday?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    recommendationAcknowledged?: Prisma.SortOrder;
};
export type RiskSnapshotSumOrderByAggregateInput = {
    exposureMinutes?: Prisma.SortOrder;
    temperatureF?: Prisma.SortOrder;
    humidityPct?: Prisma.SortOrder;
    sorenessLevel?: Prisma.SortOrder;
    fatigueLevel?: Prisma.SortOrder;
};
export type RiskSnapshotCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput> | Prisma.RiskSnapshotCreateWithoutAthleteInput[] | Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput | Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.RiskSnapshotCreateManyAthleteInputEnvelope;
    connect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
};
export type RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput> | Prisma.RiskSnapshotCreateWithoutAthleteInput[] | Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput | Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.RiskSnapshotCreateManyAthleteInputEnvelope;
    connect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
};
export type RiskSnapshotUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput> | Prisma.RiskSnapshotCreateWithoutAthleteInput[] | Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput | Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.RiskSnapshotUpsertWithWhereUniqueWithoutAthleteInput | Prisma.RiskSnapshotUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.RiskSnapshotCreateManyAthleteInputEnvelope;
    set?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    disconnect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    delete?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    connect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    update?: Prisma.RiskSnapshotUpdateWithWhereUniqueWithoutAthleteInput | Prisma.RiskSnapshotUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.RiskSnapshotUpdateManyWithWhereWithoutAthleteInput | Prisma.RiskSnapshotUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.RiskSnapshotScalarWhereInput | Prisma.RiskSnapshotScalarWhereInput[];
};
export type RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput> | Prisma.RiskSnapshotCreateWithoutAthleteInput[] | Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput | Prisma.RiskSnapshotCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.RiskSnapshotUpsertWithWhereUniqueWithoutAthleteInput | Prisma.RiskSnapshotUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.RiskSnapshotCreateManyAthleteInputEnvelope;
    set?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    disconnect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    delete?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    connect?: Prisma.RiskSnapshotWhereUniqueInput | Prisma.RiskSnapshotWhereUniqueInput[];
    update?: Prisma.RiskSnapshotUpdateWithWhereUniqueWithoutAthleteInput | Prisma.RiskSnapshotUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.RiskSnapshotUpdateManyWithWhereWithoutAthleteInput | Prisma.RiskSnapshotUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.RiskSnapshotScalarWhereInput | Prisma.RiskSnapshotScalarWhereInput[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type RiskSnapshotCreateWithoutAthleteInput = {
    id?: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotUncheckedCreateWithoutAthleteInput = {
    id?: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotCreateOrConnectWithoutAthleteInput = {
    where: Prisma.RiskSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput>;
};
export type RiskSnapshotCreateManyAthleteInputEnvelope = {
    data: Prisma.RiskSnapshotCreateManyAthleteInput | Prisma.RiskSnapshotCreateManyAthleteInput[];
};
export type RiskSnapshotUpsertWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.RiskSnapshotWhereUniqueInput;
    update: Prisma.XOR<Prisma.RiskSnapshotUpdateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedUpdateWithoutAthleteInput>;
    create: Prisma.XOR<Prisma.RiskSnapshotCreateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedCreateWithoutAthleteInput>;
};
export type RiskSnapshotUpdateWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.RiskSnapshotWhereUniqueInput;
    data: Prisma.XOR<Prisma.RiskSnapshotUpdateWithoutAthleteInput, Prisma.RiskSnapshotUncheckedUpdateWithoutAthleteInput>;
};
export type RiskSnapshotUpdateManyWithWhereWithoutAthleteInput = {
    where: Prisma.RiskSnapshotScalarWhereInput;
    data: Prisma.XOR<Prisma.RiskSnapshotUpdateManyMutationInput, Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteInput>;
};
export type RiskSnapshotScalarWhereInput = {
    AND?: Prisma.RiskSnapshotScalarWhereInput | Prisma.RiskSnapshotScalarWhereInput[];
    OR?: Prisma.RiskSnapshotScalarWhereInput[];
    NOT?: Prisma.RiskSnapshotScalarWhereInput | Prisma.RiskSnapshotScalarWhereInput[];
    id?: Prisma.StringFilter<"RiskSnapshot"> | string;
    athleteId?: Prisma.StringFilter<"RiskSnapshot"> | string;
    exposureMinutes?: Prisma.IntFilter<"RiskSnapshot"> | number;
    surface?: Prisma.StringFilter<"RiskSnapshot"> | string;
    temperatureF?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    humidityPct?: Prisma.FloatFilter<"RiskSnapshot"> | number;
    priorLowerExtremityInjury?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
    sorenessLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    fatigueLevel?: Prisma.IntFilter<"RiskSnapshot"> | number;
    bodyWeightTrend?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    menstrualPhase?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    notes?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    recordedFor?: Prisma.DateTimeNullableFilter<"RiskSnapshot"> | Date | string | null;
    riskLevel?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rationale?: Prisma.StringFilter<"RiskSnapshot"> | string;
    changeToday?: Prisma.StringFilter<"RiskSnapshot"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RiskSnapshot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RiskSnapshot"> | Date | string;
    recommendationAcknowledged?: Prisma.BoolFilter<"RiskSnapshot"> | boolean;
};
export type RiskSnapshotCreateManyAthleteInput = {
    id?: string;
    exposureMinutes: number;
    surface: string;
    temperatureF: number;
    humidityPct: number;
    priorLowerExtremityInjury: boolean;
    sorenessLevel: number;
    fatigueLevel: number;
    bodyWeightTrend?: string | null;
    menstrualPhase?: string | null;
    notes?: string | null;
    recordedFor?: Date | string | null;
    riskLevel: string;
    rationale: string;
    changeToday: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotUncheckedUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotUncheckedUpdateManyWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    exposureMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    temperatureF?: Prisma.FloatFieldUpdateOperationsInput | number;
    humidityPct?: Prisma.FloatFieldUpdateOperationsInput | number;
    priorLowerExtremityInjury?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    sorenessLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    fatigueLevel?: Prisma.IntFieldUpdateOperationsInput | number;
    bodyWeightTrend?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    menstrualPhase?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    recordedFor?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    riskLevel?: Prisma.StringFieldUpdateOperationsInput | string;
    rationale?: Prisma.StringFieldUpdateOperationsInput | string;
    changeToday?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendationAcknowledged?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RiskSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    exposureMinutes?: boolean;
    surface?: boolean;
    temperatureF?: boolean;
    humidityPct?: boolean;
    priorLowerExtremityInjury?: boolean;
    sorenessLevel?: boolean;
    fatigueLevel?: boolean;
    bodyWeightTrend?: boolean;
    menstrualPhase?: boolean;
    notes?: boolean;
    recordedFor?: boolean;
    riskLevel?: boolean;
    rationale?: boolean;
    changeToday?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    recommendationAcknowledged?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["riskSnapshot"]>;
export type RiskSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    exposureMinutes?: boolean;
    surface?: boolean;
    temperatureF?: boolean;
    humidityPct?: boolean;
    priorLowerExtremityInjury?: boolean;
    sorenessLevel?: boolean;
    fatigueLevel?: boolean;
    bodyWeightTrend?: boolean;
    menstrualPhase?: boolean;
    notes?: boolean;
    recordedFor?: boolean;
    riskLevel?: boolean;
    rationale?: boolean;
    changeToday?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    recommendationAcknowledged?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["riskSnapshot"]>;
export type RiskSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    exposureMinutes?: boolean;
    surface?: boolean;
    temperatureF?: boolean;
    humidityPct?: boolean;
    priorLowerExtremityInjury?: boolean;
    sorenessLevel?: boolean;
    fatigueLevel?: boolean;
    bodyWeightTrend?: boolean;
    menstrualPhase?: boolean;
    notes?: boolean;
    recordedFor?: boolean;
    riskLevel?: boolean;
    rationale?: boolean;
    changeToday?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    recommendationAcknowledged?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["riskSnapshot"]>;
export type RiskSnapshotSelectScalar = {
    id?: boolean;
    athleteId?: boolean;
    exposureMinutes?: boolean;
    surface?: boolean;
    temperatureF?: boolean;
    humidityPct?: boolean;
    priorLowerExtremityInjury?: boolean;
    sorenessLevel?: boolean;
    fatigueLevel?: boolean;
    bodyWeightTrend?: boolean;
    menstrualPhase?: boolean;
    notes?: boolean;
    recordedFor?: boolean;
    riskLevel?: boolean;
    rationale?: boolean;
    changeToday?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    recommendationAcknowledged?: boolean;
};
export type RiskSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "athleteId" | "exposureMinutes" | "surface" | "temperatureF" | "humidityPct" | "priorLowerExtremityInjury" | "sorenessLevel" | "fatigueLevel" | "bodyWeightTrend" | "menstrualPhase" | "notes" | "recordedFor" | "riskLevel" | "rationale" | "changeToday" | "rawModelOutput" | "createdAt" | "updatedAt" | "recommendationAcknowledged", ExtArgs["result"]["riskSnapshot"]>;
export type RiskSnapshotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type RiskSnapshotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type RiskSnapshotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type $RiskSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RiskSnapshot";
    objects: {
        athlete: Prisma.$AthletePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        athleteId: string;
        exposureMinutes: number;
        surface: string;
        temperatureF: number;
        humidityPct: number;
        priorLowerExtremityInjury: boolean;
        sorenessLevel: number;
        fatigueLevel: number;
        bodyWeightTrend: string | null;
        menstrualPhase: string | null;
        notes: string | null;
        recordedFor: Date | null;
        riskLevel: string;
        rationale: string;
        changeToday: string;
        rawModelOutput: string | null;
        createdAt: Date;
        updatedAt: Date;
        recommendationAcknowledged: boolean;
    }, ExtArgs["result"]["riskSnapshot"]>;
    composites: {};
};
export type RiskSnapshotGetPayload<S extends boolean | null | undefined | RiskSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload, S>;
export type RiskSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RiskSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RiskSnapshotCountAggregateInputType | true;
};
export interface RiskSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RiskSnapshot'];
        meta: {
            name: 'RiskSnapshot';
        };
    };
    /**
     * Find zero or one RiskSnapshot that matches the filter.
     * @param {RiskSnapshotFindUniqueArgs} args - Arguments to find a RiskSnapshot
     * @example
     * // Get one RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RiskSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, RiskSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RiskSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RiskSnapshotFindUniqueOrThrowArgs} args - Arguments to find a RiskSnapshot
     * @example
     * // Get one RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RiskSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RiskSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RiskSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotFindFirstArgs} args - Arguments to find a RiskSnapshot
     * @example
     * // Get one RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RiskSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RiskSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotFindFirstOrThrowArgs} args - Arguments to find a RiskSnapshot
     * @example
     * // Get one RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RiskSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RiskSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RiskSnapshots
     * const riskSnapshots = await prisma.riskSnapshot.findMany()
     *
     * // Get first 10 RiskSnapshots
     * const riskSnapshots = await prisma.riskSnapshot.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const riskSnapshotWithIdOnly = await prisma.riskSnapshot.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RiskSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RiskSnapshot.
     * @param {RiskSnapshotCreateArgs} args - Arguments to create a RiskSnapshot.
     * @example
     * // Create one RiskSnapshot
     * const RiskSnapshot = await prisma.riskSnapshot.create({
     *   data: {
     *     // ... data to create a RiskSnapshot
     *   }
     * })
     *
     */
    create<T extends RiskSnapshotCreateArgs>(args: Prisma.SelectSubset<T, RiskSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RiskSnapshots.
     * @param {RiskSnapshotCreateManyArgs} args - Arguments to create many RiskSnapshots.
     * @example
     * // Create many RiskSnapshots
     * const riskSnapshot = await prisma.riskSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RiskSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RiskSnapshots and returns the data saved in the database.
     * @param {RiskSnapshotCreateManyAndReturnArgs} args - Arguments to create many RiskSnapshots.
     * @example
     * // Create many RiskSnapshots
     * const riskSnapshot = await prisma.riskSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RiskSnapshots and only return the `id`
     * const riskSnapshotWithIdOnly = await prisma.riskSnapshot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RiskSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RiskSnapshot.
     * @param {RiskSnapshotDeleteArgs} args - Arguments to delete one RiskSnapshot.
     * @example
     * // Delete one RiskSnapshot
     * const RiskSnapshot = await prisma.riskSnapshot.delete({
     *   where: {
     *     // ... filter to delete one RiskSnapshot
     *   }
     * })
     *
     */
    delete<T extends RiskSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, RiskSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RiskSnapshot.
     * @param {RiskSnapshotUpdateArgs} args - Arguments to update one RiskSnapshot.
     * @example
     * // Update one RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RiskSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, RiskSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RiskSnapshots.
     * @param {RiskSnapshotDeleteManyArgs} args - Arguments to filter RiskSnapshots to delete.
     * @example
     * // Delete a few RiskSnapshots
     * const { count } = await prisma.riskSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RiskSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, RiskSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RiskSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RiskSnapshots
     * const riskSnapshot = await prisma.riskSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RiskSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, RiskSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RiskSnapshots and returns the data updated in the database.
     * @param {RiskSnapshotUpdateManyAndReturnArgs} args - Arguments to update many RiskSnapshots.
     * @example
     * // Update many RiskSnapshots
     * const riskSnapshot = await prisma.riskSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RiskSnapshots and only return the `id`
     * const riskSnapshotWithIdOnly = await prisma.riskSnapshot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends RiskSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RiskSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RiskSnapshot.
     * @param {RiskSnapshotUpsertArgs} args - Arguments to update or create a RiskSnapshot.
     * @example
     * // Update or create a RiskSnapshot
     * const riskSnapshot = await prisma.riskSnapshot.upsert({
     *   create: {
     *     // ... data to create a RiskSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RiskSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends RiskSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, RiskSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__RiskSnapshotClient<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RiskSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotCountArgs} args - Arguments to filter RiskSnapshots to count.
     * @example
     * // Count the number of RiskSnapshots
     * const count = await prisma.riskSnapshot.count({
     *   where: {
     *     // ... the filter for the RiskSnapshots we want to count
     *   }
     * })
    **/
    count<T extends RiskSnapshotCountArgs>(args?: Prisma.Subset<T, RiskSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RiskSnapshotCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RiskSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RiskSnapshotAggregateArgs>(args: Prisma.Subset<T, RiskSnapshotAggregateArgs>): Prisma.PrismaPromise<GetRiskSnapshotAggregateType<T>>;
    /**
     * Group by RiskSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RiskSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends RiskSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RiskSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: RiskSnapshotGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RiskSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRiskSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RiskSnapshot model
     */
    readonly fields: RiskSnapshotFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RiskSnapshot.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RiskSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    athlete<T extends Prisma.AthleteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AthleteDefaultArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the RiskSnapshot model
 */
export interface RiskSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly athleteId: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly exposureMinutes: Prisma.FieldRef<"RiskSnapshot", 'Int'>;
    readonly surface: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly temperatureF: Prisma.FieldRef<"RiskSnapshot", 'Float'>;
    readonly humidityPct: Prisma.FieldRef<"RiskSnapshot", 'Float'>;
    readonly priorLowerExtremityInjury: Prisma.FieldRef<"RiskSnapshot", 'Boolean'>;
    readonly sorenessLevel: Prisma.FieldRef<"RiskSnapshot", 'Int'>;
    readonly fatigueLevel: Prisma.FieldRef<"RiskSnapshot", 'Int'>;
    readonly bodyWeightTrend: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly menstrualPhase: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly notes: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly recordedFor: Prisma.FieldRef<"RiskSnapshot", 'DateTime'>;
    readonly riskLevel: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly rationale: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly changeToday: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly rawModelOutput: Prisma.FieldRef<"RiskSnapshot", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RiskSnapshot", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RiskSnapshot", 'DateTime'>;
    readonly recommendationAcknowledged: Prisma.FieldRef<"RiskSnapshot", 'Boolean'>;
}
/**
 * RiskSnapshot findUnique
 */
export type RiskSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which RiskSnapshot to fetch.
     */
    where: Prisma.RiskSnapshotWhereUniqueInput;
};
/**
 * RiskSnapshot findUniqueOrThrow
 */
export type RiskSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which RiskSnapshot to fetch.
     */
    where: Prisma.RiskSnapshotWhereUniqueInput;
};
/**
 * RiskSnapshot findFirst
 */
export type RiskSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which RiskSnapshot to fetch.
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RiskSnapshots to fetch.
     */
    orderBy?: Prisma.RiskSnapshotOrderByWithRelationInput | Prisma.RiskSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RiskSnapshots.
     */
    cursor?: Prisma.RiskSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RiskSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RiskSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RiskSnapshots.
     */
    distinct?: Prisma.RiskSnapshotScalarFieldEnum | Prisma.RiskSnapshotScalarFieldEnum[];
};
/**
 * RiskSnapshot findFirstOrThrow
 */
export type RiskSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which RiskSnapshot to fetch.
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RiskSnapshots to fetch.
     */
    orderBy?: Prisma.RiskSnapshotOrderByWithRelationInput | Prisma.RiskSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RiskSnapshots.
     */
    cursor?: Prisma.RiskSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RiskSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RiskSnapshots.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RiskSnapshots.
     */
    distinct?: Prisma.RiskSnapshotScalarFieldEnum | Prisma.RiskSnapshotScalarFieldEnum[];
};
/**
 * RiskSnapshot findMany
 */
export type RiskSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter, which RiskSnapshots to fetch.
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RiskSnapshots to fetch.
     */
    orderBy?: Prisma.RiskSnapshotOrderByWithRelationInput | Prisma.RiskSnapshotOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RiskSnapshots.
     */
    cursor?: Prisma.RiskSnapshotWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RiskSnapshots from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RiskSnapshots.
     */
    skip?: number;
    distinct?: Prisma.RiskSnapshotScalarFieldEnum | Prisma.RiskSnapshotScalarFieldEnum[];
};
/**
 * RiskSnapshot create
 */
export type RiskSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * The data needed to create a RiskSnapshot.
     */
    data: Prisma.XOR<Prisma.RiskSnapshotCreateInput, Prisma.RiskSnapshotUncheckedCreateInput>;
};
/**
 * RiskSnapshot createMany
 */
export type RiskSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RiskSnapshots.
     */
    data: Prisma.RiskSnapshotCreateManyInput | Prisma.RiskSnapshotCreateManyInput[];
};
/**
 * RiskSnapshot createManyAndReturn
 */
export type RiskSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to create many RiskSnapshots.
     */
    data: Prisma.RiskSnapshotCreateManyInput | Prisma.RiskSnapshotCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RiskSnapshot update
 */
export type RiskSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * The data needed to update a RiskSnapshot.
     */
    data: Prisma.XOR<Prisma.RiskSnapshotUpdateInput, Prisma.RiskSnapshotUncheckedUpdateInput>;
    /**
     * Choose, which RiskSnapshot to update.
     */
    where: Prisma.RiskSnapshotWhereUniqueInput;
};
/**
 * RiskSnapshot updateMany
 */
export type RiskSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RiskSnapshots.
     */
    data: Prisma.XOR<Prisma.RiskSnapshotUpdateManyMutationInput, Prisma.RiskSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which RiskSnapshots to update
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * Limit how many RiskSnapshots to update.
     */
    limit?: number;
};
/**
 * RiskSnapshot updateManyAndReturn
 */
export type RiskSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * The data used to update RiskSnapshots.
     */
    data: Prisma.XOR<Prisma.RiskSnapshotUpdateManyMutationInput, Prisma.RiskSnapshotUncheckedUpdateManyInput>;
    /**
     * Filter which RiskSnapshots to update
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * Limit how many RiskSnapshots to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RiskSnapshot upsert
 */
export type RiskSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * The filter to search for the RiskSnapshot to update in case it exists.
     */
    where: Prisma.RiskSnapshotWhereUniqueInput;
    /**
     * In case the RiskSnapshot found by the `where` argument doesn't exist, create a new RiskSnapshot with this data.
     */
    create: Prisma.XOR<Prisma.RiskSnapshotCreateInput, Prisma.RiskSnapshotUncheckedCreateInput>;
    /**
     * In case the RiskSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RiskSnapshotUpdateInput, Prisma.RiskSnapshotUncheckedUpdateInput>;
};
/**
 * RiskSnapshot delete
 */
export type RiskSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
    /**
     * Filter which RiskSnapshot to delete.
     */
    where: Prisma.RiskSnapshotWhereUniqueInput;
};
/**
 * RiskSnapshot deleteMany
 */
export type RiskSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RiskSnapshots to delete
     */
    where?: Prisma.RiskSnapshotWhereInput;
    /**
     * Limit how many RiskSnapshots to delete.
     */
    limit?: number;
};
/**
 * RiskSnapshot without action
 */
export type RiskSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RiskSnapshot
     */
    select?: Prisma.RiskSnapshotSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RiskSnapshot
     */
    omit?: Prisma.RiskSnapshotOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RiskSnapshotInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=RiskSnapshot.d.ts.map