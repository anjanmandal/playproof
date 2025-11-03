import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model MovementAssessment
 *
 */
export type MovementAssessmentModel = runtime.Types.Result.DefaultSelection<Prisma.$MovementAssessmentPayload>;
export type AggregateMovementAssessment = {
    _count: MovementAssessmentCountAggregateOutputType | null;
    _avg: MovementAssessmentAvgAggregateOutputType | null;
    _sum: MovementAssessmentSumAggregateOutputType | null;
    _min: MovementAssessmentMinAggregateOutputType | null;
    _max: MovementAssessmentMaxAggregateOutputType | null;
};
export type MovementAssessmentAvgAggregateOutputType = {
    riskRating: number | null;
};
export type MovementAssessmentSumAggregateOutputType = {
    riskRating: number | null;
};
export type MovementAssessmentMinAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    sessionId: string | null;
    drillType: string | null;
    riskRating: number | null;
    cues: string | null;
    metrics: string | null;
    context: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MovementAssessmentMaxAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    sessionId: string | null;
    drillType: string | null;
    riskRating: number | null;
    cues: string | null;
    metrics: string | null;
    context: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MovementAssessmentCountAggregateOutputType = {
    id: number;
    athleteId: number;
    sessionId: number;
    drillType: number;
    riskRating: number;
    cues: number;
    metrics: number;
    context: number;
    rawModelOutput: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MovementAssessmentAvgAggregateInputType = {
    riskRating?: true;
};
export type MovementAssessmentSumAggregateInputType = {
    riskRating?: true;
};
export type MovementAssessmentMinAggregateInputType = {
    id?: true;
    athleteId?: true;
    sessionId?: true;
    drillType?: true;
    riskRating?: true;
    cues?: true;
    metrics?: true;
    context?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MovementAssessmentMaxAggregateInputType = {
    id?: true;
    athleteId?: true;
    sessionId?: true;
    drillType?: true;
    riskRating?: true;
    cues?: true;
    metrics?: true;
    context?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MovementAssessmentCountAggregateInputType = {
    id?: true;
    athleteId?: true;
    sessionId?: true;
    drillType?: true;
    riskRating?: true;
    cues?: true;
    metrics?: true;
    context?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MovementAssessmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MovementAssessment to aggregate.
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementAssessments to fetch.
     */
    orderBy?: Prisma.MovementAssessmentOrderByWithRelationInput | Prisma.MovementAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MovementAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MovementAssessments
    **/
    _count?: true | MovementAssessmentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MovementAssessmentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MovementAssessmentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MovementAssessmentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MovementAssessmentMaxAggregateInputType;
};
export type GetMovementAssessmentAggregateType<T extends MovementAssessmentAggregateArgs> = {
    [P in keyof T & keyof AggregateMovementAssessment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMovementAssessment[P]> : Prisma.GetScalarType<T[P], AggregateMovementAssessment[P]>;
};
export type MovementAssessmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MovementAssessmentWhereInput;
    orderBy?: Prisma.MovementAssessmentOrderByWithAggregationInput | Prisma.MovementAssessmentOrderByWithAggregationInput[];
    by: Prisma.MovementAssessmentScalarFieldEnum[] | Prisma.MovementAssessmentScalarFieldEnum;
    having?: Prisma.MovementAssessmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MovementAssessmentCountAggregateInputType | true;
    _avg?: MovementAssessmentAvgAggregateInputType;
    _sum?: MovementAssessmentSumAggregateInputType;
    _min?: MovementAssessmentMinAggregateInputType;
    _max?: MovementAssessmentMaxAggregateInputType;
};
export type MovementAssessmentGroupByOutputType = {
    id: string;
    athleteId: string;
    sessionId: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context: string | null;
    rawModelOutput: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: MovementAssessmentCountAggregateOutputType | null;
    _avg: MovementAssessmentAvgAggregateOutputType | null;
    _sum: MovementAssessmentSumAggregateOutputType | null;
    _min: MovementAssessmentMinAggregateOutputType | null;
    _max: MovementAssessmentMaxAggregateOutputType | null;
};
type GetMovementAssessmentGroupByPayload<T extends MovementAssessmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MovementAssessmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MovementAssessmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MovementAssessmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MovementAssessmentGroupByOutputType[P]>;
}>>;
export type MovementAssessmentWhereInput = {
    AND?: Prisma.MovementAssessmentWhereInput | Prisma.MovementAssessmentWhereInput[];
    OR?: Prisma.MovementAssessmentWhereInput[];
    NOT?: Prisma.MovementAssessmentWhereInput | Prisma.MovementAssessmentWhereInput[];
    id?: Prisma.StringFilter<"MovementAssessment"> | string;
    athleteId?: Prisma.StringFilter<"MovementAssessment"> | string;
    sessionId?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    drillType?: Prisma.StringFilter<"MovementAssessment"> | string;
    riskRating?: Prisma.IntFilter<"MovementAssessment"> | number;
    cues?: Prisma.StringFilter<"MovementAssessment"> | string;
    metrics?: Prisma.StringFilter<"MovementAssessment"> | string;
    context?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    rawModelOutput?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
    frames?: Prisma.MovementFrameListRelationFilter;
    recommendations?: Prisma.InterventionListRelationFilter;
};
export type MovementAssessmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    drillType?: Prisma.SortOrder;
    riskRating?: Prisma.SortOrder;
    cues?: Prisma.SortOrder;
    metrics?: Prisma.SortOrder;
    context?: Prisma.SortOrderInput | Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    athlete?: Prisma.AthleteOrderByWithRelationInput;
    frames?: Prisma.MovementFrameOrderByRelationAggregateInput;
    recommendations?: Prisma.InterventionOrderByRelationAggregateInput;
};
export type MovementAssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MovementAssessmentWhereInput | Prisma.MovementAssessmentWhereInput[];
    OR?: Prisma.MovementAssessmentWhereInput[];
    NOT?: Prisma.MovementAssessmentWhereInput | Prisma.MovementAssessmentWhereInput[];
    athleteId?: Prisma.StringFilter<"MovementAssessment"> | string;
    sessionId?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    drillType?: Prisma.StringFilter<"MovementAssessment"> | string;
    riskRating?: Prisma.IntFilter<"MovementAssessment"> | number;
    cues?: Prisma.StringFilter<"MovementAssessment"> | string;
    metrics?: Prisma.StringFilter<"MovementAssessment"> | string;
    context?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    rawModelOutput?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
    frames?: Prisma.MovementFrameListRelationFilter;
    recommendations?: Prisma.InterventionListRelationFilter;
}, "id">;
export type MovementAssessmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrderInput | Prisma.SortOrder;
    drillType?: Prisma.SortOrder;
    riskRating?: Prisma.SortOrder;
    cues?: Prisma.SortOrder;
    metrics?: Prisma.SortOrder;
    context?: Prisma.SortOrderInput | Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MovementAssessmentCountOrderByAggregateInput;
    _avg?: Prisma.MovementAssessmentAvgOrderByAggregateInput;
    _max?: Prisma.MovementAssessmentMaxOrderByAggregateInput;
    _min?: Prisma.MovementAssessmentMinOrderByAggregateInput;
    _sum?: Prisma.MovementAssessmentSumOrderByAggregateInput;
};
export type MovementAssessmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.MovementAssessmentScalarWhereWithAggregatesInput | Prisma.MovementAssessmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.MovementAssessmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MovementAssessmentScalarWhereWithAggregatesInput | Prisma.MovementAssessmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MovementAssessment"> | string;
    athleteId?: Prisma.StringWithAggregatesFilter<"MovementAssessment"> | string;
    sessionId?: Prisma.StringNullableWithAggregatesFilter<"MovementAssessment"> | string | null;
    drillType?: Prisma.StringWithAggregatesFilter<"MovementAssessment"> | string;
    riskRating?: Prisma.IntWithAggregatesFilter<"MovementAssessment"> | number;
    cues?: Prisma.StringWithAggregatesFilter<"MovementAssessment"> | string;
    metrics?: Prisma.StringWithAggregatesFilter<"MovementAssessment"> | string;
    context?: Prisma.StringNullableWithAggregatesFilter<"MovementAssessment"> | string | null;
    rawModelOutput?: Prisma.StringNullableWithAggregatesFilter<"MovementAssessment"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MovementAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MovementAssessment"> | Date | string;
};
export type MovementAssessmentCreateInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutMovementSessionsInput;
    frames?: Prisma.MovementFrameCreateNestedManyWithoutAssessmentInput;
    recommendations?: Prisma.InterventionCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentUncheckedCreateInput = {
    id?: string;
    athleteId: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    frames?: Prisma.MovementFrameUncheckedCreateNestedManyWithoutAssessmentInput;
    recommendations?: Prisma.InterventionUncheckedCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutMovementSessionsNestedInput;
    frames?: Prisma.MovementFrameUpdateManyWithoutAssessmentNestedInput;
    recommendations?: Prisma.InterventionUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frames?: Prisma.MovementFrameUncheckedUpdateManyWithoutAssessmentNestedInput;
    recommendations?: Prisma.InterventionUncheckedUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentCreateManyInput = {
    id?: string;
    athleteId: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MovementAssessmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementAssessmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementAssessmentListRelationFilter = {
    every?: Prisma.MovementAssessmentWhereInput;
    some?: Prisma.MovementAssessmentWhereInput;
    none?: Prisma.MovementAssessmentWhereInput;
};
export type MovementAssessmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MovementAssessmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    drillType?: Prisma.SortOrder;
    riskRating?: Prisma.SortOrder;
    cues?: Prisma.SortOrder;
    metrics?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MovementAssessmentAvgOrderByAggregateInput = {
    riskRating?: Prisma.SortOrder;
};
export type MovementAssessmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    drillType?: Prisma.SortOrder;
    riskRating?: Prisma.SortOrder;
    cues?: Prisma.SortOrder;
    metrics?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MovementAssessmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    sessionId?: Prisma.SortOrder;
    drillType?: Prisma.SortOrder;
    riskRating?: Prisma.SortOrder;
    cues?: Prisma.SortOrder;
    metrics?: Prisma.SortOrder;
    context?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MovementAssessmentSumOrderByAggregateInput = {
    riskRating?: Prisma.SortOrder;
};
export type MovementAssessmentScalarRelationFilter = {
    is?: Prisma.MovementAssessmentWhereInput;
    isNot?: Prisma.MovementAssessmentWhereInput;
};
export type MovementAssessmentCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.MovementAssessmentCreateWithoutAthleteInput[] | Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput | Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.MovementAssessmentCreateManyAthleteInputEnvelope;
    connect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
};
export type MovementAssessmentUncheckedCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.MovementAssessmentCreateWithoutAthleteInput[] | Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput | Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.MovementAssessmentCreateManyAthleteInputEnvelope;
    connect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
};
export type MovementAssessmentUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.MovementAssessmentCreateWithoutAthleteInput[] | Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput | Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.MovementAssessmentUpsertWithWhereUniqueWithoutAthleteInput | Prisma.MovementAssessmentUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.MovementAssessmentCreateManyAthleteInputEnvelope;
    set?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    disconnect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    delete?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    connect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    update?: Prisma.MovementAssessmentUpdateWithWhereUniqueWithoutAthleteInput | Prisma.MovementAssessmentUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.MovementAssessmentUpdateManyWithWhereWithoutAthleteInput | Prisma.MovementAssessmentUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.MovementAssessmentScalarWhereInput | Prisma.MovementAssessmentScalarWhereInput[];
};
export type MovementAssessmentUncheckedUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.MovementAssessmentCreateWithoutAthleteInput[] | Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput | Prisma.MovementAssessmentCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.MovementAssessmentUpsertWithWhereUniqueWithoutAthleteInput | Prisma.MovementAssessmentUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.MovementAssessmentCreateManyAthleteInputEnvelope;
    set?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    disconnect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    delete?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    connect?: Prisma.MovementAssessmentWhereUniqueInput | Prisma.MovementAssessmentWhereUniqueInput[];
    update?: Prisma.MovementAssessmentUpdateWithWhereUniqueWithoutAthleteInput | Prisma.MovementAssessmentUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.MovementAssessmentUpdateManyWithWhereWithoutAthleteInput | Prisma.MovementAssessmentUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.MovementAssessmentScalarWhereInput | Prisma.MovementAssessmentScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type MovementAssessmentCreateNestedOneWithoutFramesInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutFramesInput, Prisma.MovementAssessmentUncheckedCreateWithoutFramesInput>;
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutFramesInput;
    connect?: Prisma.MovementAssessmentWhereUniqueInput;
};
export type MovementAssessmentUpdateOneRequiredWithoutFramesNestedInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutFramesInput, Prisma.MovementAssessmentUncheckedCreateWithoutFramesInput>;
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutFramesInput;
    upsert?: Prisma.MovementAssessmentUpsertWithoutFramesInput;
    connect?: Prisma.MovementAssessmentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MovementAssessmentUpdateToOneWithWhereWithoutFramesInput, Prisma.MovementAssessmentUpdateWithoutFramesInput>, Prisma.MovementAssessmentUncheckedUpdateWithoutFramesInput>;
};
export type MovementAssessmentCreateNestedOneWithoutRecommendationsInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedCreateWithoutRecommendationsInput>;
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutRecommendationsInput;
    connect?: Prisma.MovementAssessmentWhereUniqueInput;
};
export type MovementAssessmentUpdateOneRequiredWithoutRecommendationsNestedInput = {
    create?: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedCreateWithoutRecommendationsInput>;
    connectOrCreate?: Prisma.MovementAssessmentCreateOrConnectWithoutRecommendationsInput;
    upsert?: Prisma.MovementAssessmentUpsertWithoutRecommendationsInput;
    connect?: Prisma.MovementAssessmentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MovementAssessmentUpdateToOneWithWhereWithoutRecommendationsInput, Prisma.MovementAssessmentUpdateWithoutRecommendationsInput>, Prisma.MovementAssessmentUncheckedUpdateWithoutRecommendationsInput>;
};
export type MovementAssessmentCreateWithoutAthleteInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    frames?: Prisma.MovementFrameCreateNestedManyWithoutAssessmentInput;
    recommendations?: Prisma.InterventionCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentUncheckedCreateWithoutAthleteInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    frames?: Prisma.MovementFrameUncheckedCreateNestedManyWithoutAssessmentInput;
    recommendations?: Prisma.InterventionUncheckedCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentCreateOrConnectWithoutAthleteInput = {
    where: Prisma.MovementAssessmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput>;
};
export type MovementAssessmentCreateManyAthleteInputEnvelope = {
    data: Prisma.MovementAssessmentCreateManyAthleteInput | Prisma.MovementAssessmentCreateManyAthleteInput[];
};
export type MovementAssessmentUpsertWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.MovementAssessmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedUpdateWithoutAthleteInput>;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedCreateWithoutAthleteInput>;
};
export type MovementAssessmentUpdateWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.MovementAssessmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutAthleteInput, Prisma.MovementAssessmentUncheckedUpdateWithoutAthleteInput>;
};
export type MovementAssessmentUpdateManyWithWhereWithoutAthleteInput = {
    where: Prisma.MovementAssessmentScalarWhereInput;
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateManyMutationInput, Prisma.MovementAssessmentUncheckedUpdateManyWithoutAthleteInput>;
};
export type MovementAssessmentScalarWhereInput = {
    AND?: Prisma.MovementAssessmentScalarWhereInput | Prisma.MovementAssessmentScalarWhereInput[];
    OR?: Prisma.MovementAssessmentScalarWhereInput[];
    NOT?: Prisma.MovementAssessmentScalarWhereInput | Prisma.MovementAssessmentScalarWhereInput[];
    id?: Prisma.StringFilter<"MovementAssessment"> | string;
    athleteId?: Prisma.StringFilter<"MovementAssessment"> | string;
    sessionId?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    drillType?: Prisma.StringFilter<"MovementAssessment"> | string;
    riskRating?: Prisma.IntFilter<"MovementAssessment"> | number;
    cues?: Prisma.StringFilter<"MovementAssessment"> | string;
    metrics?: Prisma.StringFilter<"MovementAssessment"> | string;
    context?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    rawModelOutput?: Prisma.StringNullableFilter<"MovementAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MovementAssessment"> | Date | string;
};
export type MovementAssessmentCreateWithoutFramesInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutMovementSessionsInput;
    recommendations?: Prisma.InterventionCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentUncheckedCreateWithoutFramesInput = {
    id?: string;
    athleteId: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    recommendations?: Prisma.InterventionUncheckedCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentCreateOrConnectWithoutFramesInput = {
    where: Prisma.MovementAssessmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutFramesInput, Prisma.MovementAssessmentUncheckedCreateWithoutFramesInput>;
};
export type MovementAssessmentUpsertWithoutFramesInput = {
    update: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutFramesInput, Prisma.MovementAssessmentUncheckedUpdateWithoutFramesInput>;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutFramesInput, Prisma.MovementAssessmentUncheckedCreateWithoutFramesInput>;
    where?: Prisma.MovementAssessmentWhereInput;
};
export type MovementAssessmentUpdateToOneWithWhereWithoutFramesInput = {
    where?: Prisma.MovementAssessmentWhereInput;
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutFramesInput, Prisma.MovementAssessmentUncheckedUpdateWithoutFramesInput>;
};
export type MovementAssessmentUpdateWithoutFramesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutMovementSessionsNestedInput;
    recommendations?: Prisma.InterventionUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentUncheckedUpdateWithoutFramesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    recommendations?: Prisma.InterventionUncheckedUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentCreateWithoutRecommendationsInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutMovementSessionsInput;
    frames?: Prisma.MovementFrameCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentUncheckedCreateWithoutRecommendationsInput = {
    id?: string;
    athleteId: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    frames?: Prisma.MovementFrameUncheckedCreateNestedManyWithoutAssessmentInput;
};
export type MovementAssessmentCreateOrConnectWithoutRecommendationsInput = {
    where: Prisma.MovementAssessmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedCreateWithoutRecommendationsInput>;
};
export type MovementAssessmentUpsertWithoutRecommendationsInput = {
    update: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedUpdateWithoutRecommendationsInput>;
    create: Prisma.XOR<Prisma.MovementAssessmentCreateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedCreateWithoutRecommendationsInput>;
    where?: Prisma.MovementAssessmentWhereInput;
};
export type MovementAssessmentUpdateToOneWithWhereWithoutRecommendationsInput = {
    where?: Prisma.MovementAssessmentWhereInput;
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateWithoutRecommendationsInput, Prisma.MovementAssessmentUncheckedUpdateWithoutRecommendationsInput>;
};
export type MovementAssessmentUpdateWithoutRecommendationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutMovementSessionsNestedInput;
    frames?: Prisma.MovementFrameUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentUncheckedUpdateWithoutRecommendationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frames?: Prisma.MovementFrameUncheckedUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentCreateManyAthleteInput = {
    id?: string;
    sessionId?: string | null;
    drillType: string;
    riskRating: number;
    cues: string;
    metrics: string;
    context?: string | null;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MovementAssessmentUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frames?: Prisma.MovementFrameUpdateManyWithoutAssessmentNestedInput;
    recommendations?: Prisma.InterventionUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentUncheckedUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frames?: Prisma.MovementFrameUncheckedUpdateManyWithoutAssessmentNestedInput;
    recommendations?: Prisma.InterventionUncheckedUpdateManyWithoutAssessmentNestedInput;
};
export type MovementAssessmentUncheckedUpdateManyWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    drillType?: Prisma.StringFieldUpdateOperationsInput | string;
    riskRating?: Prisma.IntFieldUpdateOperationsInput | number;
    cues?: Prisma.StringFieldUpdateOperationsInput | string;
    metrics?: Prisma.StringFieldUpdateOperationsInput | string;
    context?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type MovementAssessmentCountOutputType
 */
export type MovementAssessmentCountOutputType = {
    frames: number;
    recommendations: number;
};
export type MovementAssessmentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    frames?: boolean | MovementAssessmentCountOutputTypeCountFramesArgs;
    recommendations?: boolean | MovementAssessmentCountOutputTypeCountRecommendationsArgs;
};
/**
 * MovementAssessmentCountOutputType without action
 */
export type MovementAssessmentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementAssessmentCountOutputType
     */
    select?: Prisma.MovementAssessmentCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * MovementAssessmentCountOutputType without action
 */
export type MovementAssessmentCountOutputTypeCountFramesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MovementFrameWhereInput;
};
/**
 * MovementAssessmentCountOutputType without action
 */
export type MovementAssessmentCountOutputTypeCountRecommendationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InterventionWhereInput;
};
export type MovementAssessmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    sessionId?: boolean;
    drillType?: boolean;
    riskRating?: boolean;
    cues?: boolean;
    metrics?: boolean;
    context?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
    frames?: boolean | Prisma.MovementAssessment$framesArgs<ExtArgs>;
    recommendations?: boolean | Prisma.MovementAssessment$recommendationsArgs<ExtArgs>;
    _count?: boolean | Prisma.MovementAssessmentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementAssessment"]>;
export type MovementAssessmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    sessionId?: boolean;
    drillType?: boolean;
    riskRating?: boolean;
    cues?: boolean;
    metrics?: boolean;
    context?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementAssessment"]>;
export type MovementAssessmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    sessionId?: boolean;
    drillType?: boolean;
    riskRating?: boolean;
    cues?: boolean;
    metrics?: boolean;
    context?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementAssessment"]>;
export type MovementAssessmentSelectScalar = {
    id?: boolean;
    athleteId?: boolean;
    sessionId?: boolean;
    drillType?: boolean;
    riskRating?: boolean;
    cues?: boolean;
    metrics?: boolean;
    context?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MovementAssessmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "athleteId" | "sessionId" | "drillType" | "riskRating" | "cues" | "metrics" | "context" | "rawModelOutput" | "createdAt" | "updatedAt", ExtArgs["result"]["movementAssessment"]>;
export type MovementAssessmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
    frames?: boolean | Prisma.MovementAssessment$framesArgs<ExtArgs>;
    recommendations?: boolean | Prisma.MovementAssessment$recommendationsArgs<ExtArgs>;
    _count?: boolean | Prisma.MovementAssessmentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MovementAssessmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type MovementAssessmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type $MovementAssessmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MovementAssessment";
    objects: {
        athlete: Prisma.$AthletePayload<ExtArgs>;
        frames: Prisma.$MovementFramePayload<ExtArgs>[];
        recommendations: Prisma.$InterventionPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        athleteId: string;
        sessionId: string | null;
        drillType: string;
        riskRating: number;
        cues: string;
        metrics: string;
        context: string | null;
        rawModelOutput: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["movementAssessment"]>;
    composites: {};
};
export type MovementAssessmentGetPayload<S extends boolean | null | undefined | MovementAssessmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload, S>;
export type MovementAssessmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MovementAssessmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MovementAssessmentCountAggregateInputType | true;
};
export interface MovementAssessmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MovementAssessment'];
        meta: {
            name: 'MovementAssessment';
        };
    };
    /**
     * Find zero or one MovementAssessment that matches the filter.
     * @param {MovementAssessmentFindUniqueArgs} args - Arguments to find a MovementAssessment
     * @example
     * // Get one MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovementAssessmentFindUniqueArgs>(args: Prisma.SelectSubset<T, MovementAssessmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MovementAssessment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MovementAssessmentFindUniqueOrThrowArgs} args - Arguments to find a MovementAssessment
     * @example
     * // Get one MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovementAssessmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MovementAssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MovementAssessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentFindFirstArgs} args - Arguments to find a MovementAssessment
     * @example
     * // Get one MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovementAssessmentFindFirstArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MovementAssessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentFindFirstOrThrowArgs} args - Arguments to find a MovementAssessment
     * @example
     * // Get one MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovementAssessmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MovementAssessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MovementAssessments
     * const movementAssessments = await prisma.movementAssessment.findMany()
     *
     * // Get first 10 MovementAssessments
     * const movementAssessments = await prisma.movementAssessment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const movementAssessmentWithIdOnly = await prisma.movementAssessment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MovementAssessmentFindManyArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MovementAssessment.
     * @param {MovementAssessmentCreateArgs} args - Arguments to create a MovementAssessment.
     * @example
     * // Create one MovementAssessment
     * const MovementAssessment = await prisma.movementAssessment.create({
     *   data: {
     *     // ... data to create a MovementAssessment
     *   }
     * })
     *
     */
    create<T extends MovementAssessmentCreateArgs>(args: Prisma.SelectSubset<T, MovementAssessmentCreateArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MovementAssessments.
     * @param {MovementAssessmentCreateManyArgs} args - Arguments to create many MovementAssessments.
     * @example
     * // Create many MovementAssessments
     * const movementAssessment = await prisma.movementAssessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MovementAssessmentCreateManyArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many MovementAssessments and returns the data saved in the database.
     * @param {MovementAssessmentCreateManyAndReturnArgs} args - Arguments to create many MovementAssessments.
     * @example
     * // Create many MovementAssessments
     * const movementAssessment = await prisma.movementAssessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MovementAssessments and only return the `id`
     * const movementAssessmentWithIdOnly = await prisma.movementAssessment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MovementAssessmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a MovementAssessment.
     * @param {MovementAssessmentDeleteArgs} args - Arguments to delete one MovementAssessment.
     * @example
     * // Delete one MovementAssessment
     * const MovementAssessment = await prisma.movementAssessment.delete({
     *   where: {
     *     // ... filter to delete one MovementAssessment
     *   }
     * })
     *
     */
    delete<T extends MovementAssessmentDeleteArgs>(args: Prisma.SelectSubset<T, MovementAssessmentDeleteArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MovementAssessment.
     * @param {MovementAssessmentUpdateArgs} args - Arguments to update one MovementAssessment.
     * @example
     * // Update one MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MovementAssessmentUpdateArgs>(args: Prisma.SelectSubset<T, MovementAssessmentUpdateArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MovementAssessments.
     * @param {MovementAssessmentDeleteManyArgs} args - Arguments to filter MovementAssessments to delete.
     * @example
     * // Delete a few MovementAssessments
     * const { count } = await prisma.movementAssessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MovementAssessmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, MovementAssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MovementAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MovementAssessments
     * const movementAssessment = await prisma.movementAssessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MovementAssessmentUpdateManyArgs>(args: Prisma.SelectSubset<T, MovementAssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MovementAssessments and returns the data updated in the database.
     * @param {MovementAssessmentUpdateManyAndReturnArgs} args - Arguments to update many MovementAssessments.
     * @example
     * // Update many MovementAssessments
     * const movementAssessment = await prisma.movementAssessment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MovementAssessments and only return the `id`
     * const movementAssessmentWithIdOnly = await prisma.movementAssessment.updateManyAndReturn({
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
    updateManyAndReturn<T extends MovementAssessmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MovementAssessmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one MovementAssessment.
     * @param {MovementAssessmentUpsertArgs} args - Arguments to update or create a MovementAssessment.
     * @example
     * // Update or create a MovementAssessment
     * const movementAssessment = await prisma.movementAssessment.upsert({
     *   create: {
     *     // ... data to create a MovementAssessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MovementAssessment we want to update
     *   }
     * })
     */
    upsert<T extends MovementAssessmentUpsertArgs>(args: Prisma.SelectSubset<T, MovementAssessmentUpsertArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MovementAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentCountArgs} args - Arguments to filter MovementAssessments to count.
     * @example
     * // Count the number of MovementAssessments
     * const count = await prisma.movementAssessment.count({
     *   where: {
     *     // ... the filter for the MovementAssessments we want to count
     *   }
     * })
    **/
    count<T extends MovementAssessmentCountArgs>(args?: Prisma.Subset<T, MovementAssessmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MovementAssessmentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MovementAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MovementAssessmentAggregateArgs>(args: Prisma.Subset<T, MovementAssessmentAggregateArgs>): Prisma.PrismaPromise<GetMovementAssessmentAggregateType<T>>;
    /**
     * Group by MovementAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementAssessmentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MovementAssessmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MovementAssessmentGroupByArgs['orderBy'];
    } : {
        orderBy?: MovementAssessmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MovementAssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovementAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MovementAssessment model
     */
    readonly fields: MovementAssessmentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MovementAssessment.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MovementAssessmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    athlete<T extends Prisma.AthleteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AthleteDefaultArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    frames<T extends Prisma.MovementAssessment$framesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MovementAssessment$framesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    recommendations<T extends Prisma.MovementAssessment$recommendationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MovementAssessment$recommendationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InterventionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the MovementAssessment model
 */
export interface MovementAssessmentFieldRefs {
    readonly id: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly athleteId: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly sessionId: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly drillType: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly riskRating: Prisma.FieldRef<"MovementAssessment", 'Int'>;
    readonly cues: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly metrics: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly context: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly rawModelOutput: Prisma.FieldRef<"MovementAssessment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"MovementAssessment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MovementAssessment", 'DateTime'>;
}
/**
 * MovementAssessment findUnique
 */
export type MovementAssessmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementAssessment to fetch.
     */
    where: Prisma.MovementAssessmentWhereUniqueInput;
};
/**
 * MovementAssessment findUniqueOrThrow
 */
export type MovementAssessmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementAssessment to fetch.
     */
    where: Prisma.MovementAssessmentWhereUniqueInput;
};
/**
 * MovementAssessment findFirst
 */
export type MovementAssessmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementAssessment to fetch.
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementAssessments to fetch.
     */
    orderBy?: Prisma.MovementAssessmentOrderByWithRelationInput | Prisma.MovementAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MovementAssessments.
     */
    cursor?: Prisma.MovementAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MovementAssessments.
     */
    distinct?: Prisma.MovementAssessmentScalarFieldEnum | Prisma.MovementAssessmentScalarFieldEnum[];
};
/**
 * MovementAssessment findFirstOrThrow
 */
export type MovementAssessmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementAssessment to fetch.
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementAssessments to fetch.
     */
    orderBy?: Prisma.MovementAssessmentOrderByWithRelationInput | Prisma.MovementAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MovementAssessments.
     */
    cursor?: Prisma.MovementAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MovementAssessments.
     */
    distinct?: Prisma.MovementAssessmentScalarFieldEnum | Prisma.MovementAssessmentScalarFieldEnum[];
};
/**
 * MovementAssessment findMany
 */
export type MovementAssessmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementAssessments to fetch.
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementAssessments to fetch.
     */
    orderBy?: Prisma.MovementAssessmentOrderByWithRelationInput | Prisma.MovementAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MovementAssessments.
     */
    cursor?: Prisma.MovementAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementAssessments.
     */
    skip?: number;
    distinct?: Prisma.MovementAssessmentScalarFieldEnum | Prisma.MovementAssessmentScalarFieldEnum[];
};
/**
 * MovementAssessment create
 */
export type MovementAssessmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MovementAssessment.
     */
    data: Prisma.XOR<Prisma.MovementAssessmentCreateInput, Prisma.MovementAssessmentUncheckedCreateInput>;
};
/**
 * MovementAssessment createMany
 */
export type MovementAssessmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MovementAssessments.
     */
    data: Prisma.MovementAssessmentCreateManyInput | Prisma.MovementAssessmentCreateManyInput[];
};
/**
 * MovementAssessment createManyAndReturn
 */
export type MovementAssessmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementAssessment
     */
    select?: Prisma.MovementAssessmentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementAssessment
     */
    omit?: Prisma.MovementAssessmentOmit<ExtArgs> | null;
    /**
     * The data used to create many MovementAssessments.
     */
    data: Prisma.MovementAssessmentCreateManyInput | Prisma.MovementAssessmentCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementAssessmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * MovementAssessment update
 */
export type MovementAssessmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MovementAssessment.
     */
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateInput, Prisma.MovementAssessmentUncheckedUpdateInput>;
    /**
     * Choose, which MovementAssessment to update.
     */
    where: Prisma.MovementAssessmentWhereUniqueInput;
};
/**
 * MovementAssessment updateMany
 */
export type MovementAssessmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MovementAssessments.
     */
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateManyMutationInput, Prisma.MovementAssessmentUncheckedUpdateManyInput>;
    /**
     * Filter which MovementAssessments to update
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * Limit how many MovementAssessments to update.
     */
    limit?: number;
};
/**
 * MovementAssessment updateManyAndReturn
 */
export type MovementAssessmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementAssessment
     */
    select?: Prisma.MovementAssessmentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementAssessment
     */
    omit?: Prisma.MovementAssessmentOmit<ExtArgs> | null;
    /**
     * The data used to update MovementAssessments.
     */
    data: Prisma.XOR<Prisma.MovementAssessmentUpdateManyMutationInput, Prisma.MovementAssessmentUncheckedUpdateManyInput>;
    /**
     * Filter which MovementAssessments to update
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * Limit how many MovementAssessments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementAssessmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * MovementAssessment upsert
 */
export type MovementAssessmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MovementAssessment to update in case it exists.
     */
    where: Prisma.MovementAssessmentWhereUniqueInput;
    /**
     * In case the MovementAssessment found by the `where` argument doesn't exist, create a new MovementAssessment with this data.
     */
    create: Prisma.XOR<Prisma.MovementAssessmentCreateInput, Prisma.MovementAssessmentUncheckedCreateInput>;
    /**
     * In case the MovementAssessment was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MovementAssessmentUpdateInput, Prisma.MovementAssessmentUncheckedUpdateInput>;
};
/**
 * MovementAssessment delete
 */
export type MovementAssessmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MovementAssessment to delete.
     */
    where: Prisma.MovementAssessmentWhereUniqueInput;
};
/**
 * MovementAssessment deleteMany
 */
export type MovementAssessmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MovementAssessments to delete
     */
    where?: Prisma.MovementAssessmentWhereInput;
    /**
     * Limit how many MovementAssessments to delete.
     */
    limit?: number;
};
/**
 * MovementAssessment.frames
 */
export type MovementAssessment$framesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementFrame
     */
    select?: Prisma.MovementFrameSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementFrame
     */
    omit?: Prisma.MovementFrameOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementFrameInclude<ExtArgs> | null;
    where?: Prisma.MovementFrameWhereInput;
    orderBy?: Prisma.MovementFrameOrderByWithRelationInput | Prisma.MovementFrameOrderByWithRelationInput[];
    cursor?: Prisma.MovementFrameWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MovementFrameScalarFieldEnum | Prisma.MovementFrameScalarFieldEnum[];
};
/**
 * MovementAssessment.recommendations
 */
export type MovementAssessment$recommendationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Intervention
     */
    select?: Prisma.InterventionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Intervention
     */
    omit?: Prisma.InterventionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InterventionInclude<ExtArgs> | null;
    where?: Prisma.InterventionWhereInput;
    orderBy?: Prisma.InterventionOrderByWithRelationInput | Prisma.InterventionOrderByWithRelationInput[];
    cursor?: Prisma.InterventionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InterventionScalarFieldEnum | Prisma.InterventionScalarFieldEnum[];
};
/**
 * MovementAssessment without action
 */
export type MovementAssessmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=MovementAssessment.d.ts.map