import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model MovementFrame
 *
 */
export type MovementFrameModel = runtime.Types.Result.DefaultSelection<Prisma.$MovementFramePayload>;
export type AggregateMovementFrame = {
    _count: MovementFrameCountAggregateOutputType | null;
    _avg: MovementFrameAvgAggregateOutputType | null;
    _sum: MovementFrameSumAggregateOutputType | null;
    _min: MovementFrameMinAggregateOutputType | null;
    _max: MovementFrameMaxAggregateOutputType | null;
};
export type MovementFrameAvgAggregateOutputType = {
    frameIndex: number | null;
};
export type MovementFrameSumAggregateOutputType = {
    frameIndex: number | null;
};
export type MovementFrameMinAggregateOutputType = {
    id: string | null;
    assessmentId: string | null;
    snapshotUrl: string | null;
    label: string | null;
    capturedAt: Date | null;
    frameIndex: number | null;
    createdAt: Date | null;
};
export type MovementFrameMaxAggregateOutputType = {
    id: string | null;
    assessmentId: string | null;
    snapshotUrl: string | null;
    label: string | null;
    capturedAt: Date | null;
    frameIndex: number | null;
    createdAt: Date | null;
};
export type MovementFrameCountAggregateOutputType = {
    id: number;
    assessmentId: number;
    snapshotUrl: number;
    label: number;
    capturedAt: number;
    frameIndex: number;
    createdAt: number;
    _all: number;
};
export type MovementFrameAvgAggregateInputType = {
    frameIndex?: true;
};
export type MovementFrameSumAggregateInputType = {
    frameIndex?: true;
};
export type MovementFrameMinAggregateInputType = {
    id?: true;
    assessmentId?: true;
    snapshotUrl?: true;
    label?: true;
    capturedAt?: true;
    frameIndex?: true;
    createdAt?: true;
};
export type MovementFrameMaxAggregateInputType = {
    id?: true;
    assessmentId?: true;
    snapshotUrl?: true;
    label?: true;
    capturedAt?: true;
    frameIndex?: true;
    createdAt?: true;
};
export type MovementFrameCountAggregateInputType = {
    id?: true;
    assessmentId?: true;
    snapshotUrl?: true;
    label?: true;
    capturedAt?: true;
    frameIndex?: true;
    createdAt?: true;
    _all?: true;
};
export type MovementFrameAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MovementFrame to aggregate.
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementFrames to fetch.
     */
    orderBy?: Prisma.MovementFrameOrderByWithRelationInput | Prisma.MovementFrameOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.MovementFrameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementFrames from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementFrames.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned MovementFrames
    **/
    _count?: true | MovementFrameCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: MovementFrameAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: MovementFrameSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: MovementFrameMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: MovementFrameMaxAggregateInputType;
};
export type GetMovementFrameAggregateType<T extends MovementFrameAggregateArgs> = {
    [P in keyof T & keyof AggregateMovementFrame]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMovementFrame[P]> : Prisma.GetScalarType<T[P], AggregateMovementFrame[P]>;
};
export type MovementFrameGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MovementFrameWhereInput;
    orderBy?: Prisma.MovementFrameOrderByWithAggregationInput | Prisma.MovementFrameOrderByWithAggregationInput[];
    by: Prisma.MovementFrameScalarFieldEnum[] | Prisma.MovementFrameScalarFieldEnum;
    having?: Prisma.MovementFrameScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MovementFrameCountAggregateInputType | true;
    _avg?: MovementFrameAvgAggregateInputType;
    _sum?: MovementFrameSumAggregateInputType;
    _min?: MovementFrameMinAggregateInputType;
    _max?: MovementFrameMaxAggregateInputType;
};
export type MovementFrameGroupByOutputType = {
    id: string;
    assessmentId: string;
    snapshotUrl: string;
    label: string | null;
    capturedAt: Date;
    frameIndex: number;
    createdAt: Date;
    _count: MovementFrameCountAggregateOutputType | null;
    _avg: MovementFrameAvgAggregateOutputType | null;
    _sum: MovementFrameSumAggregateOutputType | null;
    _min: MovementFrameMinAggregateOutputType | null;
    _max: MovementFrameMaxAggregateOutputType | null;
};
type GetMovementFrameGroupByPayload<T extends MovementFrameGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MovementFrameGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MovementFrameGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MovementFrameGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MovementFrameGroupByOutputType[P]>;
}>>;
export type MovementFrameWhereInput = {
    AND?: Prisma.MovementFrameWhereInput | Prisma.MovementFrameWhereInput[];
    OR?: Prisma.MovementFrameWhereInput[];
    NOT?: Prisma.MovementFrameWhereInput | Prisma.MovementFrameWhereInput[];
    id?: Prisma.StringFilter<"MovementFrame"> | string;
    assessmentId?: Prisma.StringFilter<"MovementFrame"> | string;
    snapshotUrl?: Prisma.StringFilter<"MovementFrame"> | string;
    label?: Prisma.StringNullableFilter<"MovementFrame"> | string | null;
    capturedAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
    frameIndex?: Prisma.IntFilter<"MovementFrame"> | number;
    createdAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
    assessment?: Prisma.XOR<Prisma.MovementAssessmentScalarRelationFilter, Prisma.MovementAssessmentWhereInput>;
};
export type MovementFrameOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    snapshotUrl?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    frameIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    assessment?: Prisma.MovementAssessmentOrderByWithRelationInput;
};
export type MovementFrameWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MovementFrameWhereInput | Prisma.MovementFrameWhereInput[];
    OR?: Prisma.MovementFrameWhereInput[];
    NOT?: Prisma.MovementFrameWhereInput | Prisma.MovementFrameWhereInput[];
    assessmentId?: Prisma.StringFilter<"MovementFrame"> | string;
    snapshotUrl?: Prisma.StringFilter<"MovementFrame"> | string;
    label?: Prisma.StringNullableFilter<"MovementFrame"> | string | null;
    capturedAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
    frameIndex?: Prisma.IntFilter<"MovementFrame"> | number;
    createdAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
    assessment?: Prisma.XOR<Prisma.MovementAssessmentScalarRelationFilter, Prisma.MovementAssessmentWhereInput>;
}, "id">;
export type MovementFrameOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    snapshotUrl?: Prisma.SortOrder;
    label?: Prisma.SortOrderInput | Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    frameIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.MovementFrameCountOrderByAggregateInput;
    _avg?: Prisma.MovementFrameAvgOrderByAggregateInput;
    _max?: Prisma.MovementFrameMaxOrderByAggregateInput;
    _min?: Prisma.MovementFrameMinOrderByAggregateInput;
    _sum?: Prisma.MovementFrameSumOrderByAggregateInput;
};
export type MovementFrameScalarWhereWithAggregatesInput = {
    AND?: Prisma.MovementFrameScalarWhereWithAggregatesInput | Prisma.MovementFrameScalarWhereWithAggregatesInput[];
    OR?: Prisma.MovementFrameScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MovementFrameScalarWhereWithAggregatesInput | Prisma.MovementFrameScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MovementFrame"> | string;
    assessmentId?: Prisma.StringWithAggregatesFilter<"MovementFrame"> | string;
    snapshotUrl?: Prisma.StringWithAggregatesFilter<"MovementFrame"> | string;
    label?: Prisma.StringNullableWithAggregatesFilter<"MovementFrame"> | string | null;
    capturedAt?: Prisma.DateTimeWithAggregatesFilter<"MovementFrame"> | Date | string;
    frameIndex?: Prisma.IntWithAggregatesFilter<"MovementFrame"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MovementFrame"> | Date | string;
};
export type MovementFrameCreateInput = {
    id?: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
    assessment: Prisma.MovementAssessmentCreateNestedOneWithoutFramesInput;
};
export type MovementFrameUncheckedCreateInput = {
    id?: string;
    assessmentId: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
};
export type MovementFrameUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    assessment?: Prisma.MovementAssessmentUpdateOneRequiredWithoutFramesNestedInput;
};
export type MovementFrameUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameCreateManyInput = {
    id?: string;
    assessmentId: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
};
export type MovementFrameUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameListRelationFilter = {
    every?: Prisma.MovementFrameWhereInput;
    some?: Prisma.MovementFrameWhereInput;
    none?: Prisma.MovementFrameWhereInput;
};
export type MovementFrameOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MovementFrameCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    snapshotUrl?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    frameIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MovementFrameAvgOrderByAggregateInput = {
    frameIndex?: Prisma.SortOrder;
};
export type MovementFrameMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    snapshotUrl?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    frameIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MovementFrameMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    snapshotUrl?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    frameIndex?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type MovementFrameSumOrderByAggregateInput = {
    frameIndex?: Prisma.SortOrder;
};
export type MovementFrameCreateNestedManyWithoutAssessmentInput = {
    create?: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput> | Prisma.MovementFrameCreateWithoutAssessmentInput[] | Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput[];
    connectOrCreate?: Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput | Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput[];
    createMany?: Prisma.MovementFrameCreateManyAssessmentInputEnvelope;
    connect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
};
export type MovementFrameUncheckedCreateNestedManyWithoutAssessmentInput = {
    create?: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput> | Prisma.MovementFrameCreateWithoutAssessmentInput[] | Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput[];
    connectOrCreate?: Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput | Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput[];
    createMany?: Prisma.MovementFrameCreateManyAssessmentInputEnvelope;
    connect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
};
export type MovementFrameUpdateManyWithoutAssessmentNestedInput = {
    create?: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput> | Prisma.MovementFrameCreateWithoutAssessmentInput[] | Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput[];
    connectOrCreate?: Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput | Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput[];
    upsert?: Prisma.MovementFrameUpsertWithWhereUniqueWithoutAssessmentInput | Prisma.MovementFrameUpsertWithWhereUniqueWithoutAssessmentInput[];
    createMany?: Prisma.MovementFrameCreateManyAssessmentInputEnvelope;
    set?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    disconnect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    delete?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    connect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    update?: Prisma.MovementFrameUpdateWithWhereUniqueWithoutAssessmentInput | Prisma.MovementFrameUpdateWithWhereUniqueWithoutAssessmentInput[];
    updateMany?: Prisma.MovementFrameUpdateManyWithWhereWithoutAssessmentInput | Prisma.MovementFrameUpdateManyWithWhereWithoutAssessmentInput[];
    deleteMany?: Prisma.MovementFrameScalarWhereInput | Prisma.MovementFrameScalarWhereInput[];
};
export type MovementFrameUncheckedUpdateManyWithoutAssessmentNestedInput = {
    create?: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput> | Prisma.MovementFrameCreateWithoutAssessmentInput[] | Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput[];
    connectOrCreate?: Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput | Prisma.MovementFrameCreateOrConnectWithoutAssessmentInput[];
    upsert?: Prisma.MovementFrameUpsertWithWhereUniqueWithoutAssessmentInput | Prisma.MovementFrameUpsertWithWhereUniqueWithoutAssessmentInput[];
    createMany?: Prisma.MovementFrameCreateManyAssessmentInputEnvelope;
    set?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    disconnect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    delete?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    connect?: Prisma.MovementFrameWhereUniqueInput | Prisma.MovementFrameWhereUniqueInput[];
    update?: Prisma.MovementFrameUpdateWithWhereUniqueWithoutAssessmentInput | Prisma.MovementFrameUpdateWithWhereUniqueWithoutAssessmentInput[];
    updateMany?: Prisma.MovementFrameUpdateManyWithWhereWithoutAssessmentInput | Prisma.MovementFrameUpdateManyWithWhereWithoutAssessmentInput[];
    deleteMany?: Prisma.MovementFrameScalarWhereInput | Prisma.MovementFrameScalarWhereInput[];
};
export type MovementFrameCreateWithoutAssessmentInput = {
    id?: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
};
export type MovementFrameUncheckedCreateWithoutAssessmentInput = {
    id?: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
};
export type MovementFrameCreateOrConnectWithoutAssessmentInput = {
    where: Prisma.MovementFrameWhereUniqueInput;
    create: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput>;
};
export type MovementFrameCreateManyAssessmentInputEnvelope = {
    data: Prisma.MovementFrameCreateManyAssessmentInput | Prisma.MovementFrameCreateManyAssessmentInput[];
};
export type MovementFrameUpsertWithWhereUniqueWithoutAssessmentInput = {
    where: Prisma.MovementFrameWhereUniqueInput;
    update: Prisma.XOR<Prisma.MovementFrameUpdateWithoutAssessmentInput, Prisma.MovementFrameUncheckedUpdateWithoutAssessmentInput>;
    create: Prisma.XOR<Prisma.MovementFrameCreateWithoutAssessmentInput, Prisma.MovementFrameUncheckedCreateWithoutAssessmentInput>;
};
export type MovementFrameUpdateWithWhereUniqueWithoutAssessmentInput = {
    where: Prisma.MovementFrameWhereUniqueInput;
    data: Prisma.XOR<Prisma.MovementFrameUpdateWithoutAssessmentInput, Prisma.MovementFrameUncheckedUpdateWithoutAssessmentInput>;
};
export type MovementFrameUpdateManyWithWhereWithoutAssessmentInput = {
    where: Prisma.MovementFrameScalarWhereInput;
    data: Prisma.XOR<Prisma.MovementFrameUpdateManyMutationInput, Prisma.MovementFrameUncheckedUpdateManyWithoutAssessmentInput>;
};
export type MovementFrameScalarWhereInput = {
    AND?: Prisma.MovementFrameScalarWhereInput | Prisma.MovementFrameScalarWhereInput[];
    OR?: Prisma.MovementFrameScalarWhereInput[];
    NOT?: Prisma.MovementFrameScalarWhereInput | Prisma.MovementFrameScalarWhereInput[];
    id?: Prisma.StringFilter<"MovementFrame"> | string;
    assessmentId?: Prisma.StringFilter<"MovementFrame"> | string;
    snapshotUrl?: Prisma.StringFilter<"MovementFrame"> | string;
    label?: Prisma.StringNullableFilter<"MovementFrame"> | string | null;
    capturedAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
    frameIndex?: Prisma.IntFilter<"MovementFrame"> | number;
    createdAt?: Prisma.DateTimeFilter<"MovementFrame"> | Date | string;
};
export type MovementFrameCreateManyAssessmentInput = {
    id?: string;
    snapshotUrl: string;
    label?: string | null;
    capturedAt: Date | string;
    frameIndex: number;
    createdAt?: Date | string;
};
export type MovementFrameUpdateWithoutAssessmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameUncheckedUpdateWithoutAssessmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameUncheckedUpdateManyWithoutAssessmentInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    snapshotUrl?: Prisma.StringFieldUpdateOperationsInput | string;
    label?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    frameIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MovementFrameSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    snapshotUrl?: boolean;
    label?: boolean;
    capturedAt?: boolean;
    frameIndex?: boolean;
    createdAt?: boolean;
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementFrame"]>;
export type MovementFrameSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    snapshotUrl?: boolean;
    label?: boolean;
    capturedAt?: boolean;
    frameIndex?: boolean;
    createdAt?: boolean;
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementFrame"]>;
export type MovementFrameSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    snapshotUrl?: boolean;
    label?: boolean;
    capturedAt?: boolean;
    frameIndex?: boolean;
    createdAt?: boolean;
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["movementFrame"]>;
export type MovementFrameSelectScalar = {
    id?: boolean;
    assessmentId?: boolean;
    snapshotUrl?: boolean;
    label?: boolean;
    capturedAt?: boolean;
    frameIndex?: boolean;
    createdAt?: boolean;
};
export type MovementFrameOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "assessmentId" | "snapshotUrl" | "label" | "capturedAt" | "frameIndex" | "createdAt", ExtArgs["result"]["movementFrame"]>;
export type MovementFrameInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
};
export type MovementFrameIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
};
export type MovementFrameIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assessment?: boolean | Prisma.MovementAssessmentDefaultArgs<ExtArgs>;
};
export type $MovementFramePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MovementFrame";
    objects: {
        assessment: Prisma.$MovementAssessmentPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        assessmentId: string;
        snapshotUrl: string;
        label: string | null;
        capturedAt: Date;
        frameIndex: number;
        createdAt: Date;
    }, ExtArgs["result"]["movementFrame"]>;
    composites: {};
};
export type MovementFrameGetPayload<S extends boolean | null | undefined | MovementFrameDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MovementFramePayload, S>;
export type MovementFrameCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MovementFrameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MovementFrameCountAggregateInputType | true;
};
export interface MovementFrameDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MovementFrame'];
        meta: {
            name: 'MovementFrame';
        };
    };
    /**
     * Find zero or one MovementFrame that matches the filter.
     * @param {MovementFrameFindUniqueArgs} args - Arguments to find a MovementFrame
     * @example
     * // Get one MovementFrame
     * const movementFrame = await prisma.movementFrame.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MovementFrameFindUniqueArgs>(args: Prisma.SelectSubset<T, MovementFrameFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one MovementFrame that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MovementFrameFindUniqueOrThrowArgs} args - Arguments to find a MovementFrame
     * @example
     * // Get one MovementFrame
     * const movementFrame = await prisma.movementFrame.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MovementFrameFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MovementFrameFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MovementFrame that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameFindFirstArgs} args - Arguments to find a MovementFrame
     * @example
     * // Get one MovementFrame
     * const movementFrame = await prisma.movementFrame.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MovementFrameFindFirstArgs>(args?: Prisma.SelectSubset<T, MovementFrameFindFirstArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first MovementFrame that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameFindFirstOrThrowArgs} args - Arguments to find a MovementFrame
     * @example
     * // Get one MovementFrame
     * const movementFrame = await prisma.movementFrame.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MovementFrameFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MovementFrameFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more MovementFrames that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MovementFrames
     * const movementFrames = await prisma.movementFrame.findMany()
     *
     * // Get first 10 MovementFrames
     * const movementFrames = await prisma.movementFrame.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const movementFrameWithIdOnly = await prisma.movementFrame.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MovementFrameFindManyArgs>(args?: Prisma.SelectSubset<T, MovementFrameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a MovementFrame.
     * @param {MovementFrameCreateArgs} args - Arguments to create a MovementFrame.
     * @example
     * // Create one MovementFrame
     * const MovementFrame = await prisma.movementFrame.create({
     *   data: {
     *     // ... data to create a MovementFrame
     *   }
     * })
     *
     */
    create<T extends MovementFrameCreateArgs>(args: Prisma.SelectSubset<T, MovementFrameCreateArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many MovementFrames.
     * @param {MovementFrameCreateManyArgs} args - Arguments to create many MovementFrames.
     * @example
     * // Create many MovementFrames
     * const movementFrame = await prisma.movementFrame.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MovementFrameCreateManyArgs>(args?: Prisma.SelectSubset<T, MovementFrameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many MovementFrames and returns the data saved in the database.
     * @param {MovementFrameCreateManyAndReturnArgs} args - Arguments to create many MovementFrames.
     * @example
     * // Create many MovementFrames
     * const movementFrame = await prisma.movementFrame.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many MovementFrames and only return the `id`
     * const movementFrameWithIdOnly = await prisma.movementFrame.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MovementFrameCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MovementFrameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a MovementFrame.
     * @param {MovementFrameDeleteArgs} args - Arguments to delete one MovementFrame.
     * @example
     * // Delete one MovementFrame
     * const MovementFrame = await prisma.movementFrame.delete({
     *   where: {
     *     // ... filter to delete one MovementFrame
     *   }
     * })
     *
     */
    delete<T extends MovementFrameDeleteArgs>(args: Prisma.SelectSubset<T, MovementFrameDeleteArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one MovementFrame.
     * @param {MovementFrameUpdateArgs} args - Arguments to update one MovementFrame.
     * @example
     * // Update one MovementFrame
     * const movementFrame = await prisma.movementFrame.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MovementFrameUpdateArgs>(args: Prisma.SelectSubset<T, MovementFrameUpdateArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more MovementFrames.
     * @param {MovementFrameDeleteManyArgs} args - Arguments to filter MovementFrames to delete.
     * @example
     * // Delete a few MovementFrames
     * const { count } = await prisma.movementFrame.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MovementFrameDeleteManyArgs>(args?: Prisma.SelectSubset<T, MovementFrameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MovementFrames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MovementFrames
     * const movementFrame = await prisma.movementFrame.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MovementFrameUpdateManyArgs>(args: Prisma.SelectSubset<T, MovementFrameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more MovementFrames and returns the data updated in the database.
     * @param {MovementFrameUpdateManyAndReturnArgs} args - Arguments to update many MovementFrames.
     * @example
     * // Update many MovementFrames
     * const movementFrame = await prisma.movementFrame.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more MovementFrames and only return the `id`
     * const movementFrameWithIdOnly = await prisma.movementFrame.updateManyAndReturn({
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
    updateManyAndReturn<T extends MovementFrameUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MovementFrameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one MovementFrame.
     * @param {MovementFrameUpsertArgs} args - Arguments to update or create a MovementFrame.
     * @example
     * // Update or create a MovementFrame
     * const movementFrame = await prisma.movementFrame.upsert({
     *   create: {
     *     // ... data to create a MovementFrame
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MovementFrame we want to update
     *   }
     * })
     */
    upsert<T extends MovementFrameUpsertArgs>(args: Prisma.SelectSubset<T, MovementFrameUpsertArgs<ExtArgs>>): Prisma.Prisma__MovementFrameClient<runtime.Types.Result.GetResult<Prisma.$MovementFramePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of MovementFrames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameCountArgs} args - Arguments to filter MovementFrames to count.
     * @example
     * // Count the number of MovementFrames
     * const count = await prisma.movementFrame.count({
     *   where: {
     *     // ... the filter for the MovementFrames we want to count
     *   }
     * })
    **/
    count<T extends MovementFrameCountArgs>(args?: Prisma.Subset<T, MovementFrameCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MovementFrameCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a MovementFrame.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MovementFrameAggregateArgs>(args: Prisma.Subset<T, MovementFrameAggregateArgs>): Prisma.PrismaPromise<GetMovementFrameAggregateType<T>>;
    /**
     * Group by MovementFrame.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MovementFrameGroupByArgs} args - Group by arguments.
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
    groupBy<T extends MovementFrameGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MovementFrameGroupByArgs['orderBy'];
    } : {
        orderBy?: MovementFrameGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MovementFrameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMovementFrameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the MovementFrame model
     */
    readonly fields: MovementFrameFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for MovementFrame.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__MovementFrameClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    assessment<T extends Prisma.MovementAssessmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MovementAssessmentDefaultArgs<ExtArgs>>): Prisma.Prisma__MovementAssessmentClient<runtime.Types.Result.GetResult<Prisma.$MovementAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the MovementFrame model
 */
export interface MovementFrameFieldRefs {
    readonly id: Prisma.FieldRef<"MovementFrame", 'String'>;
    readonly assessmentId: Prisma.FieldRef<"MovementFrame", 'String'>;
    readonly snapshotUrl: Prisma.FieldRef<"MovementFrame", 'String'>;
    readonly label: Prisma.FieldRef<"MovementFrame", 'String'>;
    readonly capturedAt: Prisma.FieldRef<"MovementFrame", 'DateTime'>;
    readonly frameIndex: Prisma.FieldRef<"MovementFrame", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"MovementFrame", 'DateTime'>;
}
/**
 * MovementFrame findUnique
 */
export type MovementFrameFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementFrame to fetch.
     */
    where: Prisma.MovementFrameWhereUniqueInput;
};
/**
 * MovementFrame findUniqueOrThrow
 */
export type MovementFrameFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementFrame to fetch.
     */
    where: Prisma.MovementFrameWhereUniqueInput;
};
/**
 * MovementFrame findFirst
 */
export type MovementFrameFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementFrame to fetch.
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementFrames to fetch.
     */
    orderBy?: Prisma.MovementFrameOrderByWithRelationInput | Prisma.MovementFrameOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MovementFrames.
     */
    cursor?: Prisma.MovementFrameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementFrames from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementFrames.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MovementFrames.
     */
    distinct?: Prisma.MovementFrameScalarFieldEnum | Prisma.MovementFrameScalarFieldEnum[];
};
/**
 * MovementFrame findFirstOrThrow
 */
export type MovementFrameFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementFrame to fetch.
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementFrames to fetch.
     */
    orderBy?: Prisma.MovementFrameOrderByWithRelationInput | Prisma.MovementFrameOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for MovementFrames.
     */
    cursor?: Prisma.MovementFrameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementFrames from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementFrames.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of MovementFrames.
     */
    distinct?: Prisma.MovementFrameScalarFieldEnum | Prisma.MovementFrameScalarFieldEnum[];
};
/**
 * MovementFrame findMany
 */
export type MovementFrameFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which MovementFrames to fetch.
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of MovementFrames to fetch.
     */
    orderBy?: Prisma.MovementFrameOrderByWithRelationInput | Prisma.MovementFrameOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing MovementFrames.
     */
    cursor?: Prisma.MovementFrameWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` MovementFrames from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` MovementFrames.
     */
    skip?: number;
    distinct?: Prisma.MovementFrameScalarFieldEnum | Prisma.MovementFrameScalarFieldEnum[];
};
/**
 * MovementFrame create
 */
export type MovementFrameCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a MovementFrame.
     */
    data: Prisma.XOR<Prisma.MovementFrameCreateInput, Prisma.MovementFrameUncheckedCreateInput>;
};
/**
 * MovementFrame createMany
 */
export type MovementFrameCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many MovementFrames.
     */
    data: Prisma.MovementFrameCreateManyInput | Prisma.MovementFrameCreateManyInput[];
};
/**
 * MovementFrame createManyAndReturn
 */
export type MovementFrameCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementFrame
     */
    select?: Prisma.MovementFrameSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementFrame
     */
    omit?: Prisma.MovementFrameOmit<ExtArgs> | null;
    /**
     * The data used to create many MovementFrames.
     */
    data: Prisma.MovementFrameCreateManyInput | Prisma.MovementFrameCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementFrameIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * MovementFrame update
 */
export type MovementFrameUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a MovementFrame.
     */
    data: Prisma.XOR<Prisma.MovementFrameUpdateInput, Prisma.MovementFrameUncheckedUpdateInput>;
    /**
     * Choose, which MovementFrame to update.
     */
    where: Prisma.MovementFrameWhereUniqueInput;
};
/**
 * MovementFrame updateMany
 */
export type MovementFrameUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update MovementFrames.
     */
    data: Prisma.XOR<Prisma.MovementFrameUpdateManyMutationInput, Prisma.MovementFrameUncheckedUpdateManyInput>;
    /**
     * Filter which MovementFrames to update
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * Limit how many MovementFrames to update.
     */
    limit?: number;
};
/**
 * MovementFrame updateManyAndReturn
 */
export type MovementFrameUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MovementFrame
     */
    select?: Prisma.MovementFrameSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the MovementFrame
     */
    omit?: Prisma.MovementFrameOmit<ExtArgs> | null;
    /**
     * The data used to update MovementFrames.
     */
    data: Prisma.XOR<Prisma.MovementFrameUpdateManyMutationInput, Prisma.MovementFrameUncheckedUpdateManyInput>;
    /**
     * Filter which MovementFrames to update
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * Limit how many MovementFrames to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.MovementFrameIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * MovementFrame upsert
 */
export type MovementFrameUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the MovementFrame to update in case it exists.
     */
    where: Prisma.MovementFrameWhereUniqueInput;
    /**
     * In case the MovementFrame found by the `where` argument doesn't exist, create a new MovementFrame with this data.
     */
    create: Prisma.XOR<Prisma.MovementFrameCreateInput, Prisma.MovementFrameUncheckedCreateInput>;
    /**
     * In case the MovementFrame was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.MovementFrameUpdateInput, Prisma.MovementFrameUncheckedUpdateInput>;
};
/**
 * MovementFrame delete
 */
export type MovementFrameDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which MovementFrame to delete.
     */
    where: Prisma.MovementFrameWhereUniqueInput;
};
/**
 * MovementFrame deleteMany
 */
export type MovementFrameDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which MovementFrames to delete
     */
    where?: Prisma.MovementFrameWhereInput;
    /**
     * Limit how many MovementFrames to delete.
     */
    limit?: number;
};
/**
 * MovementFrame without action
 */
export type MovementFrameDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=MovementFrame.d.ts.map