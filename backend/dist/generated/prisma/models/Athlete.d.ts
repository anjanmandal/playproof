import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Athlete
 *
 */
export type AthleteModel = runtime.Types.Result.DefaultSelection<Prisma.$AthletePayload>;
export type AggregateAthlete = {
    _count: AthleteCountAggregateOutputType | null;
    _avg: AthleteAvgAggregateOutputType | null;
    _sum: AthleteSumAggregateOutputType | null;
    _min: AthleteMinAggregateOutputType | null;
    _max: AthleteMaxAggregateOutputType | null;
};
export type AthleteAvgAggregateOutputType = {
    heightCm: number | null;
    weightKg: number | null;
};
export type AthleteSumAggregateOutputType = {
    heightCm: number | null;
    weightKg: number | null;
};
export type AthleteMinAggregateOutputType = {
    id: string | null;
    displayName: string | null;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AthleteMaxAggregateOutputType = {
    id: string | null;
    displayName: string | null;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AthleteCountAggregateOutputType = {
    id: number;
    displayName: number;
    jerseyNumber: number;
    sport: number;
    position: number;
    team: number;
    sex: number;
    dateOfBirth: number;
    heightCm: number;
    weightKg: number;
    notes: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AthleteAvgAggregateInputType = {
    heightCm?: true;
    weightKg?: true;
};
export type AthleteSumAggregateInputType = {
    heightCm?: true;
    weightKg?: true;
};
export type AthleteMinAggregateInputType = {
    id?: true;
    displayName?: true;
    jerseyNumber?: true;
    sport?: true;
    position?: true;
    team?: true;
    sex?: true;
    dateOfBirth?: true;
    heightCm?: true;
    weightKg?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AthleteMaxAggregateInputType = {
    id?: true;
    displayName?: true;
    jerseyNumber?: true;
    sport?: true;
    position?: true;
    team?: true;
    sex?: true;
    dateOfBirth?: true;
    heightCm?: true;
    weightKg?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AthleteCountAggregateInputType = {
    id?: true;
    displayName?: true;
    jerseyNumber?: true;
    sport?: true;
    position?: true;
    team?: true;
    sex?: true;
    dateOfBirth?: true;
    heightCm?: true;
    weightKg?: true;
    notes?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AthleteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Athlete to aggregate.
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Athletes to fetch.
     */
    orderBy?: Prisma.AthleteOrderByWithRelationInput | Prisma.AthleteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.AthleteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Athletes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Athletes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Athletes
    **/
    _count?: true | AthleteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: AthleteAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: AthleteSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: AthleteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: AthleteMaxAggregateInputType;
};
export type GetAthleteAggregateType<T extends AthleteAggregateArgs> = {
    [P in keyof T & keyof AggregateAthlete]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAthlete[P]> : Prisma.GetScalarType<T[P], AggregateAthlete[P]>;
};
export type AthleteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AthleteWhereInput;
    orderBy?: Prisma.AthleteOrderByWithAggregationInput | Prisma.AthleteOrderByWithAggregationInput[];
    by: Prisma.AthleteScalarFieldEnum[] | Prisma.AthleteScalarFieldEnum;
    having?: Prisma.AthleteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AthleteCountAggregateInputType | true;
    _avg?: AthleteAvgAggregateInputType;
    _sum?: AthleteSumAggregateInputType;
    _min?: AthleteMinAggregateInputType;
    _max?: AthleteMaxAggregateInputType;
};
export type AthleteGroupByOutputType = {
    id: string;
    displayName: string;
    jerseyNumber: string | null;
    sport: string | null;
    position: string | null;
    team: string | null;
    sex: string | null;
    dateOfBirth: Date | null;
    heightCm: number | null;
    weightKg: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: AthleteCountAggregateOutputType | null;
    _avg: AthleteAvgAggregateOutputType | null;
    _sum: AthleteSumAggregateOutputType | null;
    _min: AthleteMinAggregateOutputType | null;
    _max: AthleteMaxAggregateOutputType | null;
};
type GetAthleteGroupByPayload<T extends AthleteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AthleteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AthleteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AthleteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AthleteGroupByOutputType[P]>;
}>>;
export type AthleteWhereInput = {
    AND?: Prisma.AthleteWhereInput | Prisma.AthleteWhereInput[];
    OR?: Prisma.AthleteWhereInput[];
    NOT?: Prisma.AthleteWhereInput | Prisma.AthleteWhereInput[];
    id?: Prisma.StringFilter<"Athlete"> | string;
    displayName?: Prisma.StringFilter<"Athlete"> | string;
    jerseyNumber?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    sport?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    position?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    team?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    sex?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    dateOfBirth?: Prisma.DateTimeNullableFilter<"Athlete"> | Date | string | null;
    heightCm?: Prisma.FloatNullableFilter<"Athlete"> | number | null;
    weightKg?: Prisma.FloatNullableFilter<"Athlete"> | number | null;
    notes?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Athlete"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Athlete"> | Date | string;
    movementSessions?: Prisma.MovementAssessmentListRelationFilter;
    riskSnapshots?: Prisma.RiskSnapshotListRelationFilter;
    rehabAssessments?: Prisma.RehabAssessmentListRelationFilter;
    users?: Prisma.UserListRelationFilter;
    contacts?: Prisma.AthleteContactListRelationFilter;
};
export type AthleteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    jerseyNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    sport?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    team?: Prisma.SortOrderInput | Prisma.SortOrder;
    sex?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrderInput | Prisma.SortOrder;
    heightCm?: Prisma.SortOrderInput | Prisma.SortOrder;
    weightKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    movementSessions?: Prisma.MovementAssessmentOrderByRelationAggregateInput;
    riskSnapshots?: Prisma.RiskSnapshotOrderByRelationAggregateInput;
    rehabAssessments?: Prisma.RehabAssessmentOrderByRelationAggregateInput;
    users?: Prisma.UserOrderByRelationAggregateInput;
    contacts?: Prisma.AthleteContactOrderByRelationAggregateInput;
};
export type AthleteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AthleteWhereInput | Prisma.AthleteWhereInput[];
    OR?: Prisma.AthleteWhereInput[];
    NOT?: Prisma.AthleteWhereInput | Prisma.AthleteWhereInput[];
    displayName?: Prisma.StringFilter<"Athlete"> | string;
    jerseyNumber?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    sport?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    position?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    team?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    sex?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    dateOfBirth?: Prisma.DateTimeNullableFilter<"Athlete"> | Date | string | null;
    heightCm?: Prisma.FloatNullableFilter<"Athlete"> | number | null;
    weightKg?: Prisma.FloatNullableFilter<"Athlete"> | number | null;
    notes?: Prisma.StringNullableFilter<"Athlete"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Athlete"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Athlete"> | Date | string;
    movementSessions?: Prisma.MovementAssessmentListRelationFilter;
    riskSnapshots?: Prisma.RiskSnapshotListRelationFilter;
    rehabAssessments?: Prisma.RehabAssessmentListRelationFilter;
    users?: Prisma.UserListRelationFilter;
    contacts?: Prisma.AthleteContactListRelationFilter;
}, "id">;
export type AthleteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    jerseyNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    sport?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    team?: Prisma.SortOrderInput | Prisma.SortOrder;
    sex?: Prisma.SortOrderInput | Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrderInput | Prisma.SortOrder;
    heightCm?: Prisma.SortOrderInput | Prisma.SortOrder;
    weightKg?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AthleteCountOrderByAggregateInput;
    _avg?: Prisma.AthleteAvgOrderByAggregateInput;
    _max?: Prisma.AthleteMaxOrderByAggregateInput;
    _min?: Prisma.AthleteMinOrderByAggregateInput;
    _sum?: Prisma.AthleteSumOrderByAggregateInput;
};
export type AthleteScalarWhereWithAggregatesInput = {
    AND?: Prisma.AthleteScalarWhereWithAggregatesInput | Prisma.AthleteScalarWhereWithAggregatesInput[];
    OR?: Prisma.AthleteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AthleteScalarWhereWithAggregatesInput | Prisma.AthleteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Athlete"> | string;
    displayName?: Prisma.StringWithAggregatesFilter<"Athlete"> | string;
    jerseyNumber?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    sport?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    position?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    team?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    sex?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    dateOfBirth?: Prisma.DateTimeNullableWithAggregatesFilter<"Athlete"> | Date | string | null;
    heightCm?: Prisma.FloatNullableWithAggregatesFilter<"Athlete"> | number | null;
    weightKg?: Prisma.FloatNullableWithAggregatesFilter<"Athlete"> | number | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Athlete"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Athlete"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Athlete"> | Date | string;
};
export type AthleteCreateInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput;
};
export type AthleteCreateManyInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteNullableScalarRelationFilter = {
    is?: Prisma.AthleteWhereInput | null;
    isNot?: Prisma.AthleteWhereInput | null;
};
export type AthleteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    jerseyNumber?: Prisma.SortOrder;
    sport?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    team?: Prisma.SortOrder;
    sex?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    heightCm?: Prisma.SortOrder;
    weightKg?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteAvgOrderByAggregateInput = {
    heightCm?: Prisma.SortOrder;
    weightKg?: Prisma.SortOrder;
};
export type AthleteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    jerseyNumber?: Prisma.SortOrder;
    sport?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    team?: Prisma.SortOrder;
    sex?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    heightCm?: Prisma.SortOrder;
    weightKg?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    jerseyNumber?: Prisma.SortOrder;
    sport?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    team?: Prisma.SortOrder;
    sex?: Prisma.SortOrder;
    dateOfBirth?: Prisma.SortOrder;
    heightCm?: Prisma.SortOrder;
    weightKg?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteSumOrderByAggregateInput = {
    heightCm?: Prisma.SortOrder;
    weightKg?: Prisma.SortOrder;
};
export type AthleteScalarRelationFilter = {
    is?: Prisma.AthleteWhereInput;
    isNot?: Prisma.AthleteWhereInput;
};
export type AthleteCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutUsersInput, Prisma.AthleteUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutUsersInput;
    connect?: Prisma.AthleteWhereUniqueInput;
};
export type AthleteUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutUsersInput, Prisma.AthleteUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.AthleteUpsertWithoutUsersInput;
    disconnect?: Prisma.AthleteWhereInput | boolean;
    delete?: Prisma.AthleteWhereInput | boolean;
    connect?: Prisma.AthleteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AthleteUpdateToOneWithWhereWithoutUsersInput, Prisma.AthleteUpdateWithoutUsersInput>, Prisma.AthleteUncheckedUpdateWithoutUsersInput>;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type AthleteCreateNestedOneWithoutContactsInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutContactsInput, Prisma.AthleteUncheckedCreateWithoutContactsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutContactsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
};
export type AthleteUpdateOneRequiredWithoutContactsNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutContactsInput, Prisma.AthleteUncheckedCreateWithoutContactsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutContactsInput;
    upsert?: Prisma.AthleteUpsertWithoutContactsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AthleteUpdateToOneWithWhereWithoutContactsInput, Prisma.AthleteUpdateWithoutContactsInput>, Prisma.AthleteUncheckedUpdateWithoutContactsInput>;
};
export type AthleteCreateNestedOneWithoutMovementSessionsInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutMovementSessionsInput, Prisma.AthleteUncheckedCreateWithoutMovementSessionsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutMovementSessionsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
};
export type AthleteUpdateOneRequiredWithoutMovementSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutMovementSessionsInput, Prisma.AthleteUncheckedCreateWithoutMovementSessionsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutMovementSessionsInput;
    upsert?: Prisma.AthleteUpsertWithoutMovementSessionsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AthleteUpdateToOneWithWhereWithoutMovementSessionsInput, Prisma.AthleteUpdateWithoutMovementSessionsInput>, Prisma.AthleteUncheckedUpdateWithoutMovementSessionsInput>;
};
export type AthleteCreateNestedOneWithoutRiskSnapshotsInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedCreateWithoutRiskSnapshotsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutRiskSnapshotsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
};
export type AthleteUpdateOneRequiredWithoutRiskSnapshotsNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedCreateWithoutRiskSnapshotsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutRiskSnapshotsInput;
    upsert?: Prisma.AthleteUpsertWithoutRiskSnapshotsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AthleteUpdateToOneWithWhereWithoutRiskSnapshotsInput, Prisma.AthleteUpdateWithoutRiskSnapshotsInput>, Prisma.AthleteUncheckedUpdateWithoutRiskSnapshotsInput>;
};
export type AthleteCreateNestedOneWithoutRehabAssessmentsInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedCreateWithoutRehabAssessmentsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutRehabAssessmentsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
};
export type AthleteUpdateOneRequiredWithoutRehabAssessmentsNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteCreateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedCreateWithoutRehabAssessmentsInput>;
    connectOrCreate?: Prisma.AthleteCreateOrConnectWithoutRehabAssessmentsInput;
    upsert?: Prisma.AthleteUpsertWithoutRehabAssessmentsInput;
    connect?: Prisma.AthleteWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AthleteUpdateToOneWithWhereWithoutRehabAssessmentsInput, Prisma.AthleteUpdateWithoutRehabAssessmentsInput>, Prisma.AthleteUncheckedUpdateWithoutRehabAssessmentsInput>;
};
export type AthleteCreateWithoutUsersInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateWithoutUsersInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteCreateOrConnectWithoutUsersInput = {
    where: Prisma.AthleteWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutUsersInput, Prisma.AthleteUncheckedCreateWithoutUsersInput>;
};
export type AthleteUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.AthleteUpdateWithoutUsersInput, Prisma.AthleteUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutUsersInput, Prisma.AthleteUncheckedCreateWithoutUsersInput>;
    where?: Prisma.AthleteWhereInput;
};
export type AthleteUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.AthleteWhereInput;
    data: Prisma.XOR<Prisma.AthleteUpdateWithoutUsersInput, Prisma.AthleteUncheckedUpdateWithoutUsersInput>;
};
export type AthleteUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput;
};
export type AthleteCreateWithoutContactsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateWithoutContactsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteCreateOrConnectWithoutContactsInput = {
    where: Prisma.AthleteWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutContactsInput, Prisma.AthleteUncheckedCreateWithoutContactsInput>;
};
export type AthleteUpsertWithoutContactsInput = {
    update: Prisma.XOR<Prisma.AthleteUpdateWithoutContactsInput, Prisma.AthleteUncheckedUpdateWithoutContactsInput>;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutContactsInput, Prisma.AthleteUncheckedCreateWithoutContactsInput>;
    where?: Prisma.AthleteWhereInput;
};
export type AthleteUpdateToOneWithWhereWithoutContactsInput = {
    where?: Prisma.AthleteWhereInput;
    data: Prisma.XOR<Prisma.AthleteUpdateWithoutContactsInput, Prisma.AthleteUncheckedUpdateWithoutContactsInput>;
};
export type AthleteUpdateWithoutContactsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateWithoutContactsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutAthleteNestedInput;
};
export type AthleteCreateWithoutMovementSessionsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    riskSnapshots?: Prisma.RiskSnapshotCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateWithoutMovementSessionsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteCreateOrConnectWithoutMovementSessionsInput = {
    where: Prisma.AthleteWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutMovementSessionsInput, Prisma.AthleteUncheckedCreateWithoutMovementSessionsInput>;
};
export type AthleteUpsertWithoutMovementSessionsInput = {
    update: Prisma.XOR<Prisma.AthleteUpdateWithoutMovementSessionsInput, Prisma.AthleteUncheckedUpdateWithoutMovementSessionsInput>;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutMovementSessionsInput, Prisma.AthleteUncheckedCreateWithoutMovementSessionsInput>;
    where?: Prisma.AthleteWhereInput;
};
export type AthleteUpdateToOneWithWhereWithoutMovementSessionsInput = {
    where?: Prisma.AthleteWhereInput;
    data: Prisma.XOR<Prisma.AthleteUpdateWithoutMovementSessionsInput, Prisma.AthleteUncheckedUpdateWithoutMovementSessionsInput>;
};
export type AthleteUpdateWithoutMovementSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    riskSnapshots?: Prisma.RiskSnapshotUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateWithoutMovementSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput;
};
export type AthleteCreateWithoutRiskSnapshotsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateWithoutRiskSnapshotsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteCreateOrConnectWithoutRiskSnapshotsInput = {
    where: Prisma.AthleteWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedCreateWithoutRiskSnapshotsInput>;
};
export type AthleteUpsertWithoutRiskSnapshotsInput = {
    update: Prisma.XOR<Prisma.AthleteUpdateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedUpdateWithoutRiskSnapshotsInput>;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedCreateWithoutRiskSnapshotsInput>;
    where?: Prisma.AthleteWhereInput;
};
export type AthleteUpdateToOneWithWhereWithoutRiskSnapshotsInput = {
    where?: Prisma.AthleteWhereInput;
    data: Prisma.XOR<Prisma.AthleteUpdateWithoutRiskSnapshotsInput, Prisma.AthleteUncheckedUpdateWithoutRiskSnapshotsInput>;
};
export type AthleteUpdateWithoutRiskSnapshotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateWithoutRiskSnapshotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    rehabAssessments?: Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput;
};
export type AthleteCreateWithoutRehabAssessmentsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactCreateNestedManyWithoutAthleteInput;
};
export type AthleteUncheckedCreateWithoutRehabAssessmentsInput = {
    id?: string;
    displayName: string;
    jerseyNumber?: string | null;
    sport?: string | null;
    position?: string | null;
    team?: string | null;
    sex?: string | null;
    dateOfBirth?: Date | string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    notes?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedCreateNestedManyWithoutAthleteInput;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutAthleteInput;
    contacts?: Prisma.AthleteContactUncheckedCreateNestedManyWithoutAthleteInput;
};
export type AthleteCreateOrConnectWithoutRehabAssessmentsInput = {
    where: Prisma.AthleteWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedCreateWithoutRehabAssessmentsInput>;
};
export type AthleteUpsertWithoutRehabAssessmentsInput = {
    update: Prisma.XOR<Prisma.AthleteUpdateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedUpdateWithoutRehabAssessmentsInput>;
    create: Prisma.XOR<Prisma.AthleteCreateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedCreateWithoutRehabAssessmentsInput>;
    where?: Prisma.AthleteWhereInput;
};
export type AthleteUpdateToOneWithWhereWithoutRehabAssessmentsInput = {
    where?: Prisma.AthleteWhereInput;
    data: Prisma.XOR<Prisma.AthleteUpdateWithoutRehabAssessmentsInput, Prisma.AthleteUncheckedUpdateWithoutRehabAssessmentsInput>;
};
export type AthleteUpdateWithoutRehabAssessmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUpdateManyWithoutAthleteNestedInput;
};
export type AthleteUncheckedUpdateWithoutRehabAssessmentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    jerseyNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sport?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    team?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sex?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    dateOfBirth?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    heightCm?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    weightKg?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    movementSessions?: Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput;
    riskSnapshots?: Prisma.RiskSnapshotUncheckedUpdateManyWithoutAthleteNestedInput;
    users?: Prisma.UserUncheckedUpdateManyWithoutAthleteNestedInput;
    contacts?: Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput;
};
/**
 * Count Type AthleteCountOutputType
 */
export type AthleteCountOutputType = {
    movementSessions: number;
    riskSnapshots: number;
    rehabAssessments: number;
    users: number;
    contacts: number;
};
export type AthleteCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    movementSessions?: boolean | AthleteCountOutputTypeCountMovementSessionsArgs;
    riskSnapshots?: boolean | AthleteCountOutputTypeCountRiskSnapshotsArgs;
    rehabAssessments?: boolean | AthleteCountOutputTypeCountRehabAssessmentsArgs;
    users?: boolean | AthleteCountOutputTypeCountUsersArgs;
    contacts?: boolean | AthleteCountOutputTypeCountContactsArgs;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AthleteCountOutputType
     */
    select?: Prisma.AthleteCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeCountMovementSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MovementAssessmentWhereInput;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeCountRiskSnapshotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RiskSnapshotWhereInput;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeCountRehabAssessmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RehabAssessmentWhereInput;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
/**
 * AthleteCountOutputType without action
 */
export type AthleteCountOutputTypeCountContactsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AthleteContactWhereInput;
};
export type AthleteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    displayName?: boolean;
    jerseyNumber?: boolean;
    sport?: boolean;
    position?: boolean;
    team?: boolean;
    sex?: boolean;
    dateOfBirth?: boolean;
    heightCm?: boolean;
    weightKg?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    movementSessions?: boolean | Prisma.Athlete$movementSessionsArgs<ExtArgs>;
    riskSnapshots?: boolean | Prisma.Athlete$riskSnapshotsArgs<ExtArgs>;
    rehabAssessments?: boolean | Prisma.Athlete$rehabAssessmentsArgs<ExtArgs>;
    users?: boolean | Prisma.Athlete$usersArgs<ExtArgs>;
    contacts?: boolean | Prisma.Athlete$contactsArgs<ExtArgs>;
    _count?: boolean | Prisma.AthleteCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["athlete"]>;
export type AthleteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    displayName?: boolean;
    jerseyNumber?: boolean;
    sport?: boolean;
    position?: boolean;
    team?: boolean;
    sex?: boolean;
    dateOfBirth?: boolean;
    heightCm?: boolean;
    weightKg?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["athlete"]>;
export type AthleteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    displayName?: boolean;
    jerseyNumber?: boolean;
    sport?: boolean;
    position?: boolean;
    team?: boolean;
    sex?: boolean;
    dateOfBirth?: boolean;
    heightCm?: boolean;
    weightKg?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["athlete"]>;
export type AthleteSelectScalar = {
    id?: boolean;
    displayName?: boolean;
    jerseyNumber?: boolean;
    sport?: boolean;
    position?: boolean;
    team?: boolean;
    sex?: boolean;
    dateOfBirth?: boolean;
    heightCm?: boolean;
    weightKg?: boolean;
    notes?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AthleteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "displayName" | "jerseyNumber" | "sport" | "position" | "team" | "sex" | "dateOfBirth" | "heightCm" | "weightKg" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["athlete"]>;
export type AthleteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    movementSessions?: boolean | Prisma.Athlete$movementSessionsArgs<ExtArgs>;
    riskSnapshots?: boolean | Prisma.Athlete$riskSnapshotsArgs<ExtArgs>;
    rehabAssessments?: boolean | Prisma.Athlete$rehabAssessmentsArgs<ExtArgs>;
    users?: boolean | Prisma.Athlete$usersArgs<ExtArgs>;
    contacts?: boolean | Prisma.Athlete$contactsArgs<ExtArgs>;
    _count?: boolean | Prisma.AthleteCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AthleteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type AthleteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $AthletePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Athlete";
    objects: {
        movementSessions: Prisma.$MovementAssessmentPayload<ExtArgs>[];
        riskSnapshots: Prisma.$RiskSnapshotPayload<ExtArgs>[];
        rehabAssessments: Prisma.$RehabAssessmentPayload<ExtArgs>[];
        users: Prisma.$UserPayload<ExtArgs>[];
        contacts: Prisma.$AthleteContactPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        displayName: string;
        jerseyNumber: string | null;
        sport: string | null;
        position: string | null;
        team: string | null;
        sex: string | null;
        dateOfBirth: Date | null;
        heightCm: number | null;
        weightKg: number | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["athlete"]>;
    composites: {};
};
export type AthleteGetPayload<S extends boolean | null | undefined | AthleteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AthletePayload, S>;
export type AthleteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AthleteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AthleteCountAggregateInputType | true;
};
export interface AthleteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Athlete'];
        meta: {
            name: 'Athlete';
        };
    };
    /**
     * Find zero or one Athlete that matches the filter.
     * @param {AthleteFindUniqueArgs} args - Arguments to find a Athlete
     * @example
     * // Get one Athlete
     * const athlete = await prisma.athlete.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AthleteFindUniqueArgs>(args: Prisma.SelectSubset<T, AthleteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Athlete that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AthleteFindUniqueOrThrowArgs} args - Arguments to find a Athlete
     * @example
     * // Get one Athlete
     * const athlete = await prisma.athlete.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AthleteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AthleteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Athlete that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteFindFirstArgs} args - Arguments to find a Athlete
     * @example
     * // Get one Athlete
     * const athlete = await prisma.athlete.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AthleteFindFirstArgs>(args?: Prisma.SelectSubset<T, AthleteFindFirstArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Athlete that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteFindFirstOrThrowArgs} args - Arguments to find a Athlete
     * @example
     * // Get one Athlete
     * const athlete = await prisma.athlete.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AthleteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AthleteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Athletes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Athletes
     * const athletes = await prisma.athlete.findMany()
     *
     * // Get first 10 Athletes
     * const athletes = await prisma.athlete.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const athleteWithIdOnly = await prisma.athlete.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AthleteFindManyArgs>(args?: Prisma.SelectSubset<T, AthleteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Athlete.
     * @param {AthleteCreateArgs} args - Arguments to create a Athlete.
     * @example
     * // Create one Athlete
     * const Athlete = await prisma.athlete.create({
     *   data: {
     *     // ... data to create a Athlete
     *   }
     * })
     *
     */
    create<T extends AthleteCreateArgs>(args: Prisma.SelectSubset<T, AthleteCreateArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Athletes.
     * @param {AthleteCreateManyArgs} args - Arguments to create many Athletes.
     * @example
     * // Create many Athletes
     * const athlete = await prisma.athlete.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AthleteCreateManyArgs>(args?: Prisma.SelectSubset<T, AthleteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Athletes and returns the data saved in the database.
     * @param {AthleteCreateManyAndReturnArgs} args - Arguments to create many Athletes.
     * @example
     * // Create many Athletes
     * const athlete = await prisma.athlete.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Athletes and only return the `id`
     * const athleteWithIdOnly = await prisma.athlete.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AthleteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AthleteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Athlete.
     * @param {AthleteDeleteArgs} args - Arguments to delete one Athlete.
     * @example
     * // Delete one Athlete
     * const Athlete = await prisma.athlete.delete({
     *   where: {
     *     // ... filter to delete one Athlete
     *   }
     * })
     *
     */
    delete<T extends AthleteDeleteArgs>(args: Prisma.SelectSubset<T, AthleteDeleteArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Athlete.
     * @param {AthleteUpdateArgs} args - Arguments to update one Athlete.
     * @example
     * // Update one Athlete
     * const athlete = await prisma.athlete.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AthleteUpdateArgs>(args: Prisma.SelectSubset<T, AthleteUpdateArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Athletes.
     * @param {AthleteDeleteManyArgs} args - Arguments to filter Athletes to delete.
     * @example
     * // Delete a few Athletes
     * const { count } = await prisma.athlete.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AthleteDeleteManyArgs>(args?: Prisma.SelectSubset<T, AthleteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Athletes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Athletes
     * const athlete = await prisma.athlete.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AthleteUpdateManyArgs>(args: Prisma.SelectSubset<T, AthleteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Athletes and returns the data updated in the database.
     * @param {AthleteUpdateManyAndReturnArgs} args - Arguments to update many Athletes.
     * @example
     * // Update many Athletes
     * const athlete = await prisma.athlete.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Athletes and only return the `id`
     * const athleteWithIdOnly = await prisma.athlete.updateManyAndReturn({
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
    updateManyAndReturn<T extends AthleteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AthleteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Athlete.
     * @param {AthleteUpsertArgs} args - Arguments to update or create a Athlete.
     * @example
     * // Update or create a Athlete
     * const athlete = await prisma.athlete.upsert({
     *   create: {
     *     // ... data to create a Athlete
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Athlete we want to update
     *   }
     * })
     */
    upsert<T extends AthleteUpsertArgs>(args: Prisma.SelectSubset<T, AthleteUpsertArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Athletes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteCountArgs} args - Arguments to filter Athletes to count.
     * @example
     * // Count the number of Athletes
     * const count = await prisma.athlete.count({
     *   where: {
     *     // ... the filter for the Athletes we want to count
     *   }
     * })
    **/
    count<T extends AthleteCountArgs>(args?: Prisma.Subset<T, AthleteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AthleteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Athlete.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AthleteAggregateArgs>(args: Prisma.Subset<T, AthleteAggregateArgs>): Prisma.PrismaPromise<GetAthleteAggregateType<T>>;
    /**
     * Group by Athlete.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends AthleteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AthleteGroupByArgs['orderBy'];
    } : {
        orderBy?: AthleteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AthleteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAthleteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Athlete model
     */
    readonly fields: AthleteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Athlete.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AthleteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    movementSessions<T extends Prisma.Athlete$movementSessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Athlete$movementSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    riskSnapshots<T extends Prisma.Athlete$riskSnapshotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Athlete$riskSnapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RiskSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    rehabAssessments<T extends Prisma.Athlete$rehabAssessmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Athlete$rehabAssessmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    users<T extends Prisma.Athlete$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Athlete$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    contacts<T extends Prisma.Athlete$contactsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Athlete$contactsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Athlete model
 */
export interface AthleteFieldRefs {
    readonly id: Prisma.FieldRef<"Athlete", 'String'>;
    readonly displayName: Prisma.FieldRef<"Athlete", 'String'>;
    readonly jerseyNumber: Prisma.FieldRef<"Athlete", 'String'>;
    readonly sport: Prisma.FieldRef<"Athlete", 'String'>;
    readonly position: Prisma.FieldRef<"Athlete", 'String'>;
    readonly team: Prisma.FieldRef<"Athlete", 'String'>;
    readonly sex: Prisma.FieldRef<"Athlete", 'String'>;
    readonly dateOfBirth: Prisma.FieldRef<"Athlete", 'DateTime'>;
    readonly heightCm: Prisma.FieldRef<"Athlete", 'Float'>;
    readonly weightKg: Prisma.FieldRef<"Athlete", 'Float'>;
    readonly notes: Prisma.FieldRef<"Athlete", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Athlete", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Athlete", 'DateTime'>;
}
/**
 * Athlete findUnique
 */
export type AthleteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter, which Athlete to fetch.
     */
    where: Prisma.AthleteWhereUniqueInput;
};
/**
 * Athlete findUniqueOrThrow
 */
export type AthleteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter, which Athlete to fetch.
     */
    where: Prisma.AthleteWhereUniqueInput;
};
/**
 * Athlete findFirst
 */
export type AthleteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter, which Athlete to fetch.
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Athletes to fetch.
     */
    orderBy?: Prisma.AthleteOrderByWithRelationInput | Prisma.AthleteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Athletes.
     */
    cursor?: Prisma.AthleteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Athletes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Athletes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Athletes.
     */
    distinct?: Prisma.AthleteScalarFieldEnum | Prisma.AthleteScalarFieldEnum[];
};
/**
 * Athlete findFirstOrThrow
 */
export type AthleteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter, which Athlete to fetch.
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Athletes to fetch.
     */
    orderBy?: Prisma.AthleteOrderByWithRelationInput | Prisma.AthleteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Athletes.
     */
    cursor?: Prisma.AthleteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Athletes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Athletes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Athletes.
     */
    distinct?: Prisma.AthleteScalarFieldEnum | Prisma.AthleteScalarFieldEnum[];
};
/**
 * Athlete findMany
 */
export type AthleteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter, which Athletes to fetch.
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Athletes to fetch.
     */
    orderBy?: Prisma.AthleteOrderByWithRelationInput | Prisma.AthleteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Athletes.
     */
    cursor?: Prisma.AthleteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Athletes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Athletes.
     */
    skip?: number;
    distinct?: Prisma.AthleteScalarFieldEnum | Prisma.AthleteScalarFieldEnum[];
};
/**
 * Athlete create
 */
export type AthleteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * The data needed to create a Athlete.
     */
    data: Prisma.XOR<Prisma.AthleteCreateInput, Prisma.AthleteUncheckedCreateInput>;
};
/**
 * Athlete createMany
 */
export type AthleteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Athletes.
     */
    data: Prisma.AthleteCreateManyInput | Prisma.AthleteCreateManyInput[];
};
/**
 * Athlete createManyAndReturn
 */
export type AthleteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * The data used to create many Athletes.
     */
    data: Prisma.AthleteCreateManyInput | Prisma.AthleteCreateManyInput[];
};
/**
 * Athlete update
 */
export type AthleteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * The data needed to update a Athlete.
     */
    data: Prisma.XOR<Prisma.AthleteUpdateInput, Prisma.AthleteUncheckedUpdateInput>;
    /**
     * Choose, which Athlete to update.
     */
    where: Prisma.AthleteWhereUniqueInput;
};
/**
 * Athlete updateMany
 */
export type AthleteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Athletes.
     */
    data: Prisma.XOR<Prisma.AthleteUpdateManyMutationInput, Prisma.AthleteUncheckedUpdateManyInput>;
    /**
     * Filter which Athletes to update
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * Limit how many Athletes to update.
     */
    limit?: number;
};
/**
 * Athlete updateManyAndReturn
 */
export type AthleteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * The data used to update Athletes.
     */
    data: Prisma.XOR<Prisma.AthleteUpdateManyMutationInput, Prisma.AthleteUncheckedUpdateManyInput>;
    /**
     * Filter which Athletes to update
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * Limit how many Athletes to update.
     */
    limit?: number;
};
/**
 * Athlete upsert
 */
export type AthleteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * The filter to search for the Athlete to update in case it exists.
     */
    where: Prisma.AthleteWhereUniqueInput;
    /**
     * In case the Athlete found by the `where` argument doesn't exist, create a new Athlete with this data.
     */
    create: Prisma.XOR<Prisma.AthleteCreateInput, Prisma.AthleteUncheckedCreateInput>;
    /**
     * In case the Athlete was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.AthleteUpdateInput, Prisma.AthleteUncheckedUpdateInput>;
};
/**
 * Athlete delete
 */
export type AthleteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
    /**
     * Filter which Athlete to delete.
     */
    where: Prisma.AthleteWhereUniqueInput;
};
/**
 * Athlete deleteMany
 */
export type AthleteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Athletes to delete
     */
    where?: Prisma.AthleteWhereInput;
    /**
     * Limit how many Athletes to delete.
     */
    limit?: number;
};
/**
 * Athlete.movementSessions
 */
export type Athlete$movementSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementAssessment
     */
    select?: Prisma.MovementAssessmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementAssessment
     */
    omit?: Prisma.MovementAssessmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementAssessmentInclude<ExtArgs> | null;
    where?: Prisma.MovementAssessmentWhereInput;
    orderBy?: Prisma.MovementAssessmentOrderByWithRelationInput | Prisma.MovementAssessmentOrderByWithRelationInput[];
    cursor?: Prisma.MovementAssessmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MovementAssessmentScalarFieldEnum | Prisma.MovementAssessmentScalarFieldEnum[];
};
/**
 * Athlete.riskSnapshots
 */
export type Athlete$riskSnapshotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.RiskSnapshotWhereInput;
    orderBy?: Prisma.RiskSnapshotOrderByWithRelationInput | Prisma.RiskSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.RiskSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RiskSnapshotScalarFieldEnum | Prisma.RiskSnapshotScalarFieldEnum[];
};
/**
 * Athlete.rehabAssessments
 */
export type Athlete$rehabAssessmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabAssessment
     */
    select?: Prisma.RehabAssessmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabAssessment
     */
    omit?: Prisma.RehabAssessmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabAssessmentInclude<ExtArgs> | null;
    where?: Prisma.RehabAssessmentWhereInput;
    orderBy?: Prisma.RehabAssessmentOrderByWithRelationInput | Prisma.RehabAssessmentOrderByWithRelationInput[];
    cursor?: Prisma.RehabAssessmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RehabAssessmentScalarFieldEnum | Prisma.RehabAssessmentScalarFieldEnum[];
};
/**
 * Athlete.users
 */
export type Athlete$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Athlete.contacts
 */
export type Athlete$contactsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AthleteContact
     */
    select?: Prisma.AthleteContactSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AthleteContact
     */
    omit?: Prisma.AthleteContactOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteContactInclude<ExtArgs> | null;
    where?: Prisma.AthleteContactWhereInput;
    orderBy?: Prisma.AthleteContactOrderByWithRelationInput | Prisma.AthleteContactOrderByWithRelationInput[];
    cursor?: Prisma.AthleteContactWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AthleteContactScalarFieldEnum | Prisma.AthleteContactScalarFieldEnum[];
};
/**
 * Athlete without action
 */
export type AthleteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Athlete
     */
    select?: Prisma.AthleteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Athlete
     */
    omit?: Prisma.AthleteOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Athlete.d.ts.map