import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RehabAssessment
 *
 */
export type RehabAssessmentModel = runtime.Types.Result.DefaultSelection<Prisma.$RehabAssessmentPayload>;
export type AggregateRehabAssessment = {
    _count: RehabAssessmentCountAggregateOutputType | null;
    _avg: RehabAssessmentAvgAggregateOutputType | null;
    _sum: RehabAssessmentSumAggregateOutputType | null;
    _min: RehabAssessmentMinAggregateOutputType | null;
    _max: RehabAssessmentMaxAggregateOutputType | null;
};
export type RehabAssessmentAvgAggregateOutputType = {
    limbSymmetryScore: number | null;
};
export type RehabAssessmentSumAggregateOutputType = {
    limbSymmetryScore: number | null;
};
export type RehabAssessmentMinAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    surgicalSide: string | null;
    sessionDate: Date | null;
    limbSymmetryScore: number | null;
    cleared: boolean | null;
    concerns: string | null;
    recommendedExercises: string | null;
    athleteSummary: string | null;
    parentSummary: string | null;
    clinicianNotes: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RehabAssessmentMaxAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    surgicalSide: string | null;
    sessionDate: Date | null;
    limbSymmetryScore: number | null;
    cleared: boolean | null;
    concerns: string | null;
    recommendedExercises: string | null;
    athleteSummary: string | null;
    parentSummary: string | null;
    clinicianNotes: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type RehabAssessmentCountAggregateOutputType = {
    id: number;
    athleteId: number;
    surgicalSide: number;
    sessionDate: number;
    limbSymmetryScore: number;
    cleared: number;
    concerns: number;
    recommendedExercises: number;
    athleteSummary: number;
    parentSummary: number;
    clinicianNotes: number;
    rawModelOutput: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type RehabAssessmentAvgAggregateInputType = {
    limbSymmetryScore?: true;
};
export type RehabAssessmentSumAggregateInputType = {
    limbSymmetryScore?: true;
};
export type RehabAssessmentMinAggregateInputType = {
    id?: true;
    athleteId?: true;
    surgicalSide?: true;
    sessionDate?: true;
    limbSymmetryScore?: true;
    cleared?: true;
    concerns?: true;
    recommendedExercises?: true;
    athleteSummary?: true;
    parentSummary?: true;
    clinicianNotes?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RehabAssessmentMaxAggregateInputType = {
    id?: true;
    athleteId?: true;
    surgicalSide?: true;
    sessionDate?: true;
    limbSymmetryScore?: true;
    cleared?: true;
    concerns?: true;
    recommendedExercises?: true;
    athleteSummary?: true;
    parentSummary?: true;
    clinicianNotes?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type RehabAssessmentCountAggregateInputType = {
    id?: true;
    athleteId?: true;
    surgicalSide?: true;
    sessionDate?: true;
    limbSymmetryScore?: true;
    cleared?: true;
    concerns?: true;
    recommendedExercises?: true;
    athleteSummary?: true;
    parentSummary?: true;
    clinicianNotes?: true;
    rawModelOutput?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type RehabAssessmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RehabAssessment to aggregate.
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabAssessments to fetch.
     */
    orderBy?: Prisma.RehabAssessmentOrderByWithRelationInput | Prisma.RehabAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RehabAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RehabAssessments
    **/
    _count?: true | RehabAssessmentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: RehabAssessmentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: RehabAssessmentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RehabAssessmentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RehabAssessmentMaxAggregateInputType;
};
export type GetRehabAssessmentAggregateType<T extends RehabAssessmentAggregateArgs> = {
    [P in keyof T & keyof AggregateRehabAssessment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRehabAssessment[P]> : Prisma.GetScalarType<T[P], AggregateRehabAssessment[P]>;
};
export type RehabAssessmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RehabAssessmentWhereInput;
    orderBy?: Prisma.RehabAssessmentOrderByWithAggregationInput | Prisma.RehabAssessmentOrderByWithAggregationInput[];
    by: Prisma.RehabAssessmentScalarFieldEnum[] | Prisma.RehabAssessmentScalarFieldEnum;
    having?: Prisma.RehabAssessmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RehabAssessmentCountAggregateInputType | true;
    _avg?: RehabAssessmentAvgAggregateInputType;
    _sum?: RehabAssessmentSumAggregateInputType;
    _min?: RehabAssessmentMinAggregateInputType;
    _max?: RehabAssessmentMaxAggregateInputType;
};
export type RehabAssessmentGroupByOutputType = {
    id: string;
    athleteId: string;
    surgicalSide: string;
    sessionDate: Date | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: RehabAssessmentCountAggregateOutputType | null;
    _avg: RehabAssessmentAvgAggregateOutputType | null;
    _sum: RehabAssessmentSumAggregateOutputType | null;
    _min: RehabAssessmentMinAggregateOutputType | null;
    _max: RehabAssessmentMaxAggregateOutputType | null;
};
type GetRehabAssessmentGroupByPayload<T extends RehabAssessmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RehabAssessmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RehabAssessmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RehabAssessmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RehabAssessmentGroupByOutputType[P]>;
}>>;
export type RehabAssessmentWhereInput = {
    AND?: Prisma.RehabAssessmentWhereInput | Prisma.RehabAssessmentWhereInput[];
    OR?: Prisma.RehabAssessmentWhereInput[];
    NOT?: Prisma.RehabAssessmentWhereInput | Prisma.RehabAssessmentWhereInput[];
    id?: Prisma.StringFilter<"RehabAssessment"> | string;
    athleteId?: Prisma.StringFilter<"RehabAssessment"> | string;
    surgicalSide?: Prisma.StringFilter<"RehabAssessment"> | string;
    sessionDate?: Prisma.DateTimeNullableFilter<"RehabAssessment"> | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFilter<"RehabAssessment"> | number;
    cleared?: Prisma.BoolFilter<"RehabAssessment"> | boolean;
    concerns?: Prisma.StringFilter<"RehabAssessment"> | string;
    recommendedExercises?: Prisma.StringFilter<"RehabAssessment"> | string;
    athleteSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    parentSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    clinicianNotes?: Prisma.StringFilter<"RehabAssessment"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RehabAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
    videos?: Prisma.RehabVideoListRelationFilter;
};
export type RehabAssessmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    surgicalSide?: Prisma.SortOrder;
    sessionDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    limbSymmetryScore?: Prisma.SortOrder;
    cleared?: Prisma.SortOrder;
    concerns?: Prisma.SortOrder;
    recommendedExercises?: Prisma.SortOrder;
    athleteSummary?: Prisma.SortOrder;
    parentSummary?: Prisma.SortOrder;
    clinicianNotes?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    athlete?: Prisma.AthleteOrderByWithRelationInput;
    videos?: Prisma.RehabVideoOrderByRelationAggregateInput;
};
export type RehabAssessmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RehabAssessmentWhereInput | Prisma.RehabAssessmentWhereInput[];
    OR?: Prisma.RehabAssessmentWhereInput[];
    NOT?: Prisma.RehabAssessmentWhereInput | Prisma.RehabAssessmentWhereInput[];
    athleteId?: Prisma.StringFilter<"RehabAssessment"> | string;
    surgicalSide?: Prisma.StringFilter<"RehabAssessment"> | string;
    sessionDate?: Prisma.DateTimeNullableFilter<"RehabAssessment"> | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFilter<"RehabAssessment"> | number;
    cleared?: Prisma.BoolFilter<"RehabAssessment"> | boolean;
    concerns?: Prisma.StringFilter<"RehabAssessment"> | string;
    recommendedExercises?: Prisma.StringFilter<"RehabAssessment"> | string;
    athleteSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    parentSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    clinicianNotes?: Prisma.StringFilter<"RehabAssessment"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RehabAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
    videos?: Prisma.RehabVideoListRelationFilter;
}, "id">;
export type RehabAssessmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    surgicalSide?: Prisma.SortOrder;
    sessionDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    limbSymmetryScore?: Prisma.SortOrder;
    cleared?: Prisma.SortOrder;
    concerns?: Prisma.SortOrder;
    recommendedExercises?: Prisma.SortOrder;
    athleteSummary?: Prisma.SortOrder;
    parentSummary?: Prisma.SortOrder;
    clinicianNotes?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RehabAssessmentCountOrderByAggregateInput;
    _avg?: Prisma.RehabAssessmentAvgOrderByAggregateInput;
    _max?: Prisma.RehabAssessmentMaxOrderByAggregateInput;
    _min?: Prisma.RehabAssessmentMinOrderByAggregateInput;
    _sum?: Prisma.RehabAssessmentSumOrderByAggregateInput;
};
export type RehabAssessmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.RehabAssessmentScalarWhereWithAggregatesInput | Prisma.RehabAssessmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.RehabAssessmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RehabAssessmentScalarWhereWithAggregatesInput | Prisma.RehabAssessmentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    athleteId?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    surgicalSide?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    sessionDate?: Prisma.DateTimeNullableWithAggregatesFilter<"RehabAssessment"> | Date | string | null;
    limbSymmetryScore?: Prisma.FloatWithAggregatesFilter<"RehabAssessment"> | number;
    cleared?: Prisma.BoolWithAggregatesFilter<"RehabAssessment"> | boolean;
    concerns?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    recommendedExercises?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    athleteSummary?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    parentSummary?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    clinicianNotes?: Prisma.StringWithAggregatesFilter<"RehabAssessment"> | string;
    rawModelOutput?: Prisma.StringNullableWithAggregatesFilter<"RehabAssessment"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RehabAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RehabAssessment"> | Date | string;
};
export type RehabAssessmentCreateInput = {
    id?: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutRehabAssessmentsInput;
    videos?: Prisma.RehabVideoCreateNestedManyWithoutRehabInput;
};
export type RehabAssessmentUncheckedCreateInput = {
    id?: string;
    athleteId: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    videos?: Prisma.RehabVideoUncheckedCreateNestedManyWithoutRehabInput;
};
export type RehabAssessmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutRehabAssessmentsNestedInput;
    videos?: Prisma.RehabVideoUpdateManyWithoutRehabNestedInput;
};
export type RehabAssessmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    videos?: Prisma.RehabVideoUncheckedUpdateManyWithoutRehabNestedInput;
};
export type RehabAssessmentCreateManyInput = {
    id?: string;
    athleteId: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RehabAssessmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabAssessmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabAssessmentListRelationFilter = {
    every?: Prisma.RehabAssessmentWhereInput;
    some?: Prisma.RehabAssessmentWhereInput;
    none?: Prisma.RehabAssessmentWhereInput;
};
export type RehabAssessmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RehabAssessmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    surgicalSide?: Prisma.SortOrder;
    sessionDate?: Prisma.SortOrder;
    limbSymmetryScore?: Prisma.SortOrder;
    cleared?: Prisma.SortOrder;
    concerns?: Prisma.SortOrder;
    recommendedExercises?: Prisma.SortOrder;
    athleteSummary?: Prisma.SortOrder;
    parentSummary?: Prisma.SortOrder;
    clinicianNotes?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RehabAssessmentAvgOrderByAggregateInput = {
    limbSymmetryScore?: Prisma.SortOrder;
};
export type RehabAssessmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    surgicalSide?: Prisma.SortOrder;
    sessionDate?: Prisma.SortOrder;
    limbSymmetryScore?: Prisma.SortOrder;
    cleared?: Prisma.SortOrder;
    concerns?: Prisma.SortOrder;
    recommendedExercises?: Prisma.SortOrder;
    athleteSummary?: Prisma.SortOrder;
    parentSummary?: Prisma.SortOrder;
    clinicianNotes?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RehabAssessmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    surgicalSide?: Prisma.SortOrder;
    sessionDate?: Prisma.SortOrder;
    limbSymmetryScore?: Prisma.SortOrder;
    cleared?: Prisma.SortOrder;
    concerns?: Prisma.SortOrder;
    recommendedExercises?: Prisma.SortOrder;
    athleteSummary?: Prisma.SortOrder;
    parentSummary?: Prisma.SortOrder;
    clinicianNotes?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RehabAssessmentSumOrderByAggregateInput = {
    limbSymmetryScore?: Prisma.SortOrder;
};
export type RehabAssessmentScalarRelationFilter = {
    is?: Prisma.RehabAssessmentWhereInput;
    isNot?: Prisma.RehabAssessmentWhereInput;
};
export type RehabAssessmentCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.RehabAssessmentCreateWithoutAthleteInput[] | Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput | Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.RehabAssessmentCreateManyAthleteInputEnvelope;
    connect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
};
export type RehabAssessmentUncheckedCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.RehabAssessmentCreateWithoutAthleteInput[] | Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput | Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.RehabAssessmentCreateManyAthleteInputEnvelope;
    connect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
};
export type RehabAssessmentUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.RehabAssessmentCreateWithoutAthleteInput[] | Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput | Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.RehabAssessmentUpsertWithWhereUniqueWithoutAthleteInput | Prisma.RehabAssessmentUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.RehabAssessmentCreateManyAthleteInputEnvelope;
    set?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    disconnect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    delete?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    connect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    update?: Prisma.RehabAssessmentUpdateWithWhereUniqueWithoutAthleteInput | Prisma.RehabAssessmentUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.RehabAssessmentUpdateManyWithWhereWithoutAthleteInput | Prisma.RehabAssessmentUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.RehabAssessmentScalarWhereInput | Prisma.RehabAssessmentScalarWhereInput[];
};
export type RehabAssessmentUncheckedUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput> | Prisma.RehabAssessmentCreateWithoutAthleteInput[] | Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput | Prisma.RehabAssessmentCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.RehabAssessmentUpsertWithWhereUniqueWithoutAthleteInput | Prisma.RehabAssessmentUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.RehabAssessmentCreateManyAthleteInputEnvelope;
    set?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    disconnect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    delete?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    connect?: Prisma.RehabAssessmentWhereUniqueInput | Prisma.RehabAssessmentWhereUniqueInput[];
    update?: Prisma.RehabAssessmentUpdateWithWhereUniqueWithoutAthleteInput | Prisma.RehabAssessmentUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.RehabAssessmentUpdateManyWithWhereWithoutAthleteInput | Prisma.RehabAssessmentUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.RehabAssessmentScalarWhereInput | Prisma.RehabAssessmentScalarWhereInput[];
};
export type RehabAssessmentCreateNestedOneWithoutVideosInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutVideosInput, Prisma.RehabAssessmentUncheckedCreateWithoutVideosInput>;
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutVideosInput;
    connect?: Prisma.RehabAssessmentWhereUniqueInput;
};
export type RehabAssessmentUpdateOneRequiredWithoutVideosNestedInput = {
    create?: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutVideosInput, Prisma.RehabAssessmentUncheckedCreateWithoutVideosInput>;
    connectOrCreate?: Prisma.RehabAssessmentCreateOrConnectWithoutVideosInput;
    upsert?: Prisma.RehabAssessmentUpsertWithoutVideosInput;
    connect?: Prisma.RehabAssessmentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RehabAssessmentUpdateToOneWithWhereWithoutVideosInput, Prisma.RehabAssessmentUpdateWithoutVideosInput>, Prisma.RehabAssessmentUncheckedUpdateWithoutVideosInput>;
};
export type RehabAssessmentCreateWithoutAthleteInput = {
    id?: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    videos?: Prisma.RehabVideoCreateNestedManyWithoutRehabInput;
};
export type RehabAssessmentUncheckedCreateWithoutAthleteInput = {
    id?: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    videos?: Prisma.RehabVideoUncheckedCreateNestedManyWithoutRehabInput;
};
export type RehabAssessmentCreateOrConnectWithoutAthleteInput = {
    where: Prisma.RehabAssessmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput>;
};
export type RehabAssessmentCreateManyAthleteInputEnvelope = {
    data: Prisma.RehabAssessmentCreateManyAthleteInput | Prisma.RehabAssessmentCreateManyAthleteInput[];
};
export type RehabAssessmentUpsertWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.RehabAssessmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.RehabAssessmentUpdateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedUpdateWithoutAthleteInput>;
    create: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedCreateWithoutAthleteInput>;
};
export type RehabAssessmentUpdateWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.RehabAssessmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateWithoutAthleteInput, Prisma.RehabAssessmentUncheckedUpdateWithoutAthleteInput>;
};
export type RehabAssessmentUpdateManyWithWhereWithoutAthleteInput = {
    where: Prisma.RehabAssessmentScalarWhereInput;
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateManyMutationInput, Prisma.RehabAssessmentUncheckedUpdateManyWithoutAthleteInput>;
};
export type RehabAssessmentScalarWhereInput = {
    AND?: Prisma.RehabAssessmentScalarWhereInput | Prisma.RehabAssessmentScalarWhereInput[];
    OR?: Prisma.RehabAssessmentScalarWhereInput[];
    NOT?: Prisma.RehabAssessmentScalarWhereInput | Prisma.RehabAssessmentScalarWhereInput[];
    id?: Prisma.StringFilter<"RehabAssessment"> | string;
    athleteId?: Prisma.StringFilter<"RehabAssessment"> | string;
    surgicalSide?: Prisma.StringFilter<"RehabAssessment"> | string;
    sessionDate?: Prisma.DateTimeNullableFilter<"RehabAssessment"> | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFilter<"RehabAssessment"> | number;
    cleared?: Prisma.BoolFilter<"RehabAssessment"> | boolean;
    concerns?: Prisma.StringFilter<"RehabAssessment"> | string;
    recommendedExercises?: Prisma.StringFilter<"RehabAssessment"> | string;
    athleteSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    parentSummary?: Prisma.StringFilter<"RehabAssessment"> | string;
    clinicianNotes?: Prisma.StringFilter<"RehabAssessment"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"RehabAssessment"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"RehabAssessment"> | Date | string;
};
export type RehabAssessmentCreateWithoutVideosInput = {
    id?: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutRehabAssessmentsInput;
};
export type RehabAssessmentUncheckedCreateWithoutVideosInput = {
    id?: string;
    athleteId: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RehabAssessmentCreateOrConnectWithoutVideosInput = {
    where: Prisma.RehabAssessmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutVideosInput, Prisma.RehabAssessmentUncheckedCreateWithoutVideosInput>;
};
export type RehabAssessmentUpsertWithoutVideosInput = {
    update: Prisma.XOR<Prisma.RehabAssessmentUpdateWithoutVideosInput, Prisma.RehabAssessmentUncheckedUpdateWithoutVideosInput>;
    create: Prisma.XOR<Prisma.RehabAssessmentCreateWithoutVideosInput, Prisma.RehabAssessmentUncheckedCreateWithoutVideosInput>;
    where?: Prisma.RehabAssessmentWhereInput;
};
export type RehabAssessmentUpdateToOneWithWhereWithoutVideosInput = {
    where?: Prisma.RehabAssessmentWhereInput;
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateWithoutVideosInput, Prisma.RehabAssessmentUncheckedUpdateWithoutVideosInput>;
};
export type RehabAssessmentUpdateWithoutVideosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutRehabAssessmentsNestedInput;
};
export type RehabAssessmentUncheckedUpdateWithoutVideosInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabAssessmentCreateManyAthleteInput = {
    id?: string;
    surgicalSide: string;
    sessionDate?: Date | string | null;
    limbSymmetryScore: number;
    cleared: boolean;
    concerns: string;
    recommendedExercises: string;
    athleteSummary: string;
    parentSummary: string;
    clinicianNotes: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type RehabAssessmentUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    videos?: Prisma.RehabVideoUpdateManyWithoutRehabNestedInput;
};
export type RehabAssessmentUncheckedUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    videos?: Prisma.RehabVideoUncheckedUpdateManyWithoutRehabNestedInput;
};
export type RehabAssessmentUncheckedUpdateManyWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    surgicalSide?: Prisma.StringFieldUpdateOperationsInput | string;
    sessionDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    limbSymmetryScore?: Prisma.FloatFieldUpdateOperationsInput | number;
    cleared?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    concerns?: Prisma.StringFieldUpdateOperationsInput | string;
    recommendedExercises?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    parentSummary?: Prisma.StringFieldUpdateOperationsInput | string;
    clinicianNotes?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
/**
 * Count Type RehabAssessmentCountOutputType
 */
export type RehabAssessmentCountOutputType = {
    videos: number;
};
export type RehabAssessmentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    videos?: boolean | RehabAssessmentCountOutputTypeCountVideosArgs;
};
/**
 * RehabAssessmentCountOutputType without action
 */
export type RehabAssessmentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabAssessmentCountOutputType
     */
    select?: Prisma.RehabAssessmentCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * RehabAssessmentCountOutputType without action
 */
export type RehabAssessmentCountOutputTypeCountVideosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RehabVideoWhereInput;
};
export type RehabAssessmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    surgicalSide?: boolean;
    sessionDate?: boolean;
    limbSymmetryScore?: boolean;
    cleared?: boolean;
    concerns?: boolean;
    recommendedExercises?: boolean;
    athleteSummary?: boolean;
    parentSummary?: boolean;
    clinicianNotes?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
    videos?: boolean | Prisma.RehabAssessment$videosArgs<ExtArgs>;
    _count?: boolean | Prisma.RehabAssessmentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabAssessment"]>;
export type RehabAssessmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    surgicalSide?: boolean;
    sessionDate?: boolean;
    limbSymmetryScore?: boolean;
    cleared?: boolean;
    concerns?: boolean;
    recommendedExercises?: boolean;
    athleteSummary?: boolean;
    parentSummary?: boolean;
    clinicianNotes?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabAssessment"]>;
export type RehabAssessmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    surgicalSide?: boolean;
    sessionDate?: boolean;
    limbSymmetryScore?: boolean;
    cleared?: boolean;
    concerns?: boolean;
    recommendedExercises?: boolean;
    athleteSummary?: boolean;
    parentSummary?: boolean;
    clinicianNotes?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabAssessment"]>;
export type RehabAssessmentSelectScalar = {
    id?: boolean;
    athleteId?: boolean;
    surgicalSide?: boolean;
    sessionDate?: boolean;
    limbSymmetryScore?: boolean;
    cleared?: boolean;
    concerns?: boolean;
    recommendedExercises?: boolean;
    athleteSummary?: boolean;
    parentSummary?: boolean;
    clinicianNotes?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type RehabAssessmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "athleteId" | "surgicalSide" | "sessionDate" | "limbSymmetryScore" | "cleared" | "concerns" | "recommendedExercises" | "athleteSummary" | "parentSummary" | "clinicianNotes" | "rawModelOutput" | "createdAt" | "updatedAt", ExtArgs["result"]["rehabAssessment"]>;
export type RehabAssessmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
    videos?: boolean | Prisma.RehabAssessment$videosArgs<ExtArgs>;
    _count?: boolean | Prisma.RehabAssessmentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RehabAssessmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type RehabAssessmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type $RehabAssessmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RehabAssessment";
    objects: {
        athlete: Prisma.$AthletePayload<ExtArgs>;
        videos: Prisma.$RehabVideoPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        athleteId: string;
        surgicalSide: string;
        sessionDate: Date | null;
        limbSymmetryScore: number;
        cleared: boolean;
        concerns: string;
        recommendedExercises: string;
        athleteSummary: string;
        parentSummary: string;
        clinicianNotes: string;
        rawModelOutput: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["rehabAssessment"]>;
    composites: {};
};
export type RehabAssessmentGetPayload<S extends boolean | null | undefined | RehabAssessmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload, S>;
export type RehabAssessmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RehabAssessmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RehabAssessmentCountAggregateInputType | true;
};
export interface RehabAssessmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RehabAssessment'];
        meta: {
            name: 'RehabAssessment';
        };
    };
    /**
     * Find zero or one RehabAssessment that matches the filter.
     * @param {RehabAssessmentFindUniqueArgs} args - Arguments to find a RehabAssessment
     * @example
     * // Get one RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RehabAssessmentFindUniqueArgs>(args: Prisma.SelectSubset<T, RehabAssessmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RehabAssessment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RehabAssessmentFindUniqueOrThrowArgs} args - Arguments to find a RehabAssessment
     * @example
     * // Get one RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RehabAssessmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RehabAssessmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RehabAssessment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentFindFirstArgs} args - Arguments to find a RehabAssessment
     * @example
     * // Get one RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RehabAssessmentFindFirstArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RehabAssessment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentFindFirstOrThrowArgs} args - Arguments to find a RehabAssessment
     * @example
     * // Get one RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RehabAssessmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RehabAssessments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RehabAssessments
     * const rehabAssessments = await prisma.rehabAssessment.findMany()
     *
     * // Get first 10 RehabAssessments
     * const rehabAssessments = await prisma.rehabAssessment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const rehabAssessmentWithIdOnly = await prisma.rehabAssessment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RehabAssessmentFindManyArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RehabAssessment.
     * @param {RehabAssessmentCreateArgs} args - Arguments to create a RehabAssessment.
     * @example
     * // Create one RehabAssessment
     * const RehabAssessment = await prisma.rehabAssessment.create({
     *   data: {
     *     // ... data to create a RehabAssessment
     *   }
     * })
     *
     */
    create<T extends RehabAssessmentCreateArgs>(args: Prisma.SelectSubset<T, RehabAssessmentCreateArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RehabAssessments.
     * @param {RehabAssessmentCreateManyArgs} args - Arguments to create many RehabAssessments.
     * @example
     * // Create many RehabAssessments
     * const rehabAssessment = await prisma.rehabAssessment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RehabAssessmentCreateManyArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RehabAssessments and returns the data saved in the database.
     * @param {RehabAssessmentCreateManyAndReturnArgs} args - Arguments to create many RehabAssessments.
     * @example
     * // Create many RehabAssessments
     * const rehabAssessment = await prisma.rehabAssessment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RehabAssessments and only return the `id`
     * const rehabAssessmentWithIdOnly = await prisma.rehabAssessment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RehabAssessmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RehabAssessment.
     * @param {RehabAssessmentDeleteArgs} args - Arguments to delete one RehabAssessment.
     * @example
     * // Delete one RehabAssessment
     * const RehabAssessment = await prisma.rehabAssessment.delete({
     *   where: {
     *     // ... filter to delete one RehabAssessment
     *   }
     * })
     *
     */
    delete<T extends RehabAssessmentDeleteArgs>(args: Prisma.SelectSubset<T, RehabAssessmentDeleteArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RehabAssessment.
     * @param {RehabAssessmentUpdateArgs} args - Arguments to update one RehabAssessment.
     * @example
     * // Update one RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RehabAssessmentUpdateArgs>(args: Prisma.SelectSubset<T, RehabAssessmentUpdateArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RehabAssessments.
     * @param {RehabAssessmentDeleteManyArgs} args - Arguments to filter RehabAssessments to delete.
     * @example
     * // Delete a few RehabAssessments
     * const { count } = await prisma.rehabAssessment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RehabAssessmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, RehabAssessmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RehabAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RehabAssessments
     * const rehabAssessment = await prisma.rehabAssessment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RehabAssessmentUpdateManyArgs>(args: Prisma.SelectSubset<T, RehabAssessmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RehabAssessments and returns the data updated in the database.
     * @param {RehabAssessmentUpdateManyAndReturnArgs} args - Arguments to update many RehabAssessments.
     * @example
     * // Update many RehabAssessments
     * const rehabAssessment = await prisma.rehabAssessment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RehabAssessments and only return the `id`
     * const rehabAssessmentWithIdOnly = await prisma.rehabAssessment.updateManyAndReturn({
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
    updateManyAndReturn<T extends RehabAssessmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RehabAssessmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RehabAssessment.
     * @param {RehabAssessmentUpsertArgs} args - Arguments to update or create a RehabAssessment.
     * @example
     * // Update or create a RehabAssessment
     * const rehabAssessment = await prisma.rehabAssessment.upsert({
     *   create: {
     *     // ... data to create a RehabAssessment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RehabAssessment we want to update
     *   }
     * })
     */
    upsert<T extends RehabAssessmentUpsertArgs>(args: Prisma.SelectSubset<T, RehabAssessmentUpsertArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RehabAssessments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentCountArgs} args - Arguments to filter RehabAssessments to count.
     * @example
     * // Count the number of RehabAssessments
     * const count = await prisma.rehabAssessment.count({
     *   where: {
     *     // ... the filter for the RehabAssessments we want to count
     *   }
     * })
    **/
    count<T extends RehabAssessmentCountArgs>(args?: Prisma.Subset<T, RehabAssessmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RehabAssessmentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RehabAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RehabAssessmentAggregateArgs>(args: Prisma.Subset<T, RehabAssessmentAggregateArgs>): Prisma.PrismaPromise<GetRehabAssessmentAggregateType<T>>;
    /**
     * Group by RehabAssessment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabAssessmentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RehabAssessmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RehabAssessmentGroupByArgs['orderBy'];
    } : {
        orderBy?: RehabAssessmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RehabAssessmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRehabAssessmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RehabAssessment model
     */
    readonly fields: RehabAssessmentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RehabAssessment.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RehabAssessmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    athlete<T extends Prisma.AthleteDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AthleteDefaultArgs<ExtArgs>>): Prisma.Prisma__AthleteClient<runtime.Types.Result.GetResult<Prisma.$AthletePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    videos<T extends Prisma.RehabAssessment$videosArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RehabAssessment$videosArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the RehabAssessment model
 */
export interface RehabAssessmentFieldRefs {
    readonly id: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly athleteId: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly surgicalSide: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly sessionDate: Prisma.FieldRef<"RehabAssessment", 'DateTime'>;
    readonly limbSymmetryScore: Prisma.FieldRef<"RehabAssessment", 'Float'>;
    readonly cleared: Prisma.FieldRef<"RehabAssessment", 'Boolean'>;
    readonly concerns: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly recommendedExercises: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly athleteSummary: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly parentSummary: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly clinicianNotes: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly rawModelOutput: Prisma.FieldRef<"RehabAssessment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"RehabAssessment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"RehabAssessment", 'DateTime'>;
}
/**
 * RehabAssessment findUnique
 */
export type RehabAssessmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabAssessment to fetch.
     */
    where: Prisma.RehabAssessmentWhereUniqueInput;
};
/**
 * RehabAssessment findUniqueOrThrow
 */
export type RehabAssessmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabAssessment to fetch.
     */
    where: Prisma.RehabAssessmentWhereUniqueInput;
};
/**
 * RehabAssessment findFirst
 */
export type RehabAssessmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabAssessment to fetch.
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabAssessments to fetch.
     */
    orderBy?: Prisma.RehabAssessmentOrderByWithRelationInput | Prisma.RehabAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RehabAssessments.
     */
    cursor?: Prisma.RehabAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RehabAssessments.
     */
    distinct?: Prisma.RehabAssessmentScalarFieldEnum | Prisma.RehabAssessmentScalarFieldEnum[];
};
/**
 * RehabAssessment findFirstOrThrow
 */
export type RehabAssessmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabAssessment to fetch.
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabAssessments to fetch.
     */
    orderBy?: Prisma.RehabAssessmentOrderByWithRelationInput | Prisma.RehabAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RehabAssessments.
     */
    cursor?: Prisma.RehabAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabAssessments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RehabAssessments.
     */
    distinct?: Prisma.RehabAssessmentScalarFieldEnum | Prisma.RehabAssessmentScalarFieldEnum[];
};
/**
 * RehabAssessment findMany
 */
export type RehabAssessmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabAssessments to fetch.
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabAssessments to fetch.
     */
    orderBy?: Prisma.RehabAssessmentOrderByWithRelationInput | Prisma.RehabAssessmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RehabAssessments.
     */
    cursor?: Prisma.RehabAssessmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabAssessments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabAssessments.
     */
    skip?: number;
    distinct?: Prisma.RehabAssessmentScalarFieldEnum | Prisma.RehabAssessmentScalarFieldEnum[];
};
/**
 * RehabAssessment create
 */
export type RehabAssessmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a RehabAssessment.
     */
    data: Prisma.XOR<Prisma.RehabAssessmentCreateInput, Prisma.RehabAssessmentUncheckedCreateInput>;
};
/**
 * RehabAssessment createMany
 */
export type RehabAssessmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RehabAssessments.
     */
    data: Prisma.RehabAssessmentCreateManyInput | Prisma.RehabAssessmentCreateManyInput[];
};
/**
 * RehabAssessment createManyAndReturn
 */
export type RehabAssessmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabAssessment
     */
    select?: Prisma.RehabAssessmentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabAssessment
     */
    omit?: Prisma.RehabAssessmentOmit<ExtArgs> | null;
    /**
     * The data used to create many RehabAssessments.
     */
    data: Prisma.RehabAssessmentCreateManyInput | Prisma.RehabAssessmentCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabAssessmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RehabAssessment update
 */
export type RehabAssessmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a RehabAssessment.
     */
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateInput, Prisma.RehabAssessmentUncheckedUpdateInput>;
    /**
     * Choose, which RehabAssessment to update.
     */
    where: Prisma.RehabAssessmentWhereUniqueInput;
};
/**
 * RehabAssessment updateMany
 */
export type RehabAssessmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RehabAssessments.
     */
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateManyMutationInput, Prisma.RehabAssessmentUncheckedUpdateManyInput>;
    /**
     * Filter which RehabAssessments to update
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * Limit how many RehabAssessments to update.
     */
    limit?: number;
};
/**
 * RehabAssessment updateManyAndReturn
 */
export type RehabAssessmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabAssessment
     */
    select?: Prisma.RehabAssessmentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabAssessment
     */
    omit?: Prisma.RehabAssessmentOmit<ExtArgs> | null;
    /**
     * The data used to update RehabAssessments.
     */
    data: Prisma.XOR<Prisma.RehabAssessmentUpdateManyMutationInput, Prisma.RehabAssessmentUncheckedUpdateManyInput>;
    /**
     * Filter which RehabAssessments to update
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * Limit how many RehabAssessments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabAssessmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RehabAssessment upsert
 */
export type RehabAssessmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the RehabAssessment to update in case it exists.
     */
    where: Prisma.RehabAssessmentWhereUniqueInput;
    /**
     * In case the RehabAssessment found by the `where` argument doesn't exist, create a new RehabAssessment with this data.
     */
    create: Prisma.XOR<Prisma.RehabAssessmentCreateInput, Prisma.RehabAssessmentUncheckedCreateInput>;
    /**
     * In case the RehabAssessment was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RehabAssessmentUpdateInput, Prisma.RehabAssessmentUncheckedUpdateInput>;
};
/**
 * RehabAssessment delete
 */
export type RehabAssessmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which RehabAssessment to delete.
     */
    where: Prisma.RehabAssessmentWhereUniqueInput;
};
/**
 * RehabAssessment deleteMany
 */
export type RehabAssessmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RehabAssessments to delete
     */
    where?: Prisma.RehabAssessmentWhereInput;
    /**
     * Limit how many RehabAssessments to delete.
     */
    limit?: number;
};
/**
 * RehabAssessment.videos
 */
export type RehabAssessment$videosArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabVideo
     */
    select?: Prisma.RehabVideoSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabVideo
     */
    omit?: Prisma.RehabVideoOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabVideoInclude<ExtArgs> | null;
    where?: Prisma.RehabVideoWhereInput;
    orderBy?: Prisma.RehabVideoOrderByWithRelationInput | Prisma.RehabVideoOrderByWithRelationInput[];
    cursor?: Prisma.RehabVideoWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RehabVideoScalarFieldEnum | Prisma.RehabVideoScalarFieldEnum[];
};
/**
 * RehabAssessment without action
 */
export type RehabAssessmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=RehabAssessment.d.ts.map