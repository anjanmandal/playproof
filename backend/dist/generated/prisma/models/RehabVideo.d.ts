import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model RehabVideo
 *
 */
export type RehabVideoModel = runtime.Types.Result.DefaultSelection<Prisma.$RehabVideoPayload>;
export type AggregateRehabVideo = {
    _count: RehabVideoCountAggregateOutputType | null;
    _min: RehabVideoMinAggregateOutputType | null;
    _max: RehabVideoMaxAggregateOutputType | null;
};
export type RehabVideoMinAggregateOutputType = {
    id: string | null;
    rehabAssessmentId: string | null;
    url: string | null;
    testType: string | null;
    capturedAt: Date | null;
    createdAt: Date | null;
};
export type RehabVideoMaxAggregateOutputType = {
    id: string | null;
    rehabAssessmentId: string | null;
    url: string | null;
    testType: string | null;
    capturedAt: Date | null;
    createdAt: Date | null;
};
export type RehabVideoCountAggregateOutputType = {
    id: number;
    rehabAssessmentId: number;
    url: number;
    testType: number;
    capturedAt: number;
    createdAt: number;
    _all: number;
};
export type RehabVideoMinAggregateInputType = {
    id?: true;
    rehabAssessmentId?: true;
    url?: true;
    testType?: true;
    capturedAt?: true;
    createdAt?: true;
};
export type RehabVideoMaxAggregateInputType = {
    id?: true;
    rehabAssessmentId?: true;
    url?: true;
    testType?: true;
    capturedAt?: true;
    createdAt?: true;
};
export type RehabVideoCountAggregateInputType = {
    id?: true;
    rehabAssessmentId?: true;
    url?: true;
    testType?: true;
    capturedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type RehabVideoAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RehabVideo to aggregate.
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabVideos to fetch.
     */
    orderBy?: Prisma.RehabVideoOrderByWithRelationInput | Prisma.RehabVideoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RehabVideoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabVideos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabVideos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RehabVideos
    **/
    _count?: true | RehabVideoCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RehabVideoMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RehabVideoMaxAggregateInputType;
};
export type GetRehabVideoAggregateType<T extends RehabVideoAggregateArgs> = {
    [P in keyof T & keyof AggregateRehabVideo]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRehabVideo[P]> : Prisma.GetScalarType<T[P], AggregateRehabVideo[P]>;
};
export type RehabVideoGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RehabVideoWhereInput;
    orderBy?: Prisma.RehabVideoOrderByWithAggregationInput | Prisma.RehabVideoOrderByWithAggregationInput[];
    by: Prisma.RehabVideoScalarFieldEnum[] | Prisma.RehabVideoScalarFieldEnum;
    having?: Prisma.RehabVideoScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RehabVideoCountAggregateInputType | true;
    _min?: RehabVideoMinAggregateInputType;
    _max?: RehabVideoMaxAggregateInputType;
};
export type RehabVideoGroupByOutputType = {
    id: string;
    rehabAssessmentId: string;
    url: string;
    testType: string;
    capturedAt: Date;
    createdAt: Date;
    _count: RehabVideoCountAggregateOutputType | null;
    _min: RehabVideoMinAggregateOutputType | null;
    _max: RehabVideoMaxAggregateOutputType | null;
};
type GetRehabVideoGroupByPayload<T extends RehabVideoGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RehabVideoGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RehabVideoGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RehabVideoGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RehabVideoGroupByOutputType[P]>;
}>>;
export type RehabVideoWhereInput = {
    AND?: Prisma.RehabVideoWhereInput | Prisma.RehabVideoWhereInput[];
    OR?: Prisma.RehabVideoWhereInput[];
    NOT?: Prisma.RehabVideoWhereInput | Prisma.RehabVideoWhereInput[];
    id?: Prisma.StringFilter<"RehabVideo"> | string;
    rehabAssessmentId?: Prisma.StringFilter<"RehabVideo"> | string;
    url?: Prisma.StringFilter<"RehabVideo"> | string;
    testType?: Prisma.StringFilter<"RehabVideo"> | string;
    capturedAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
    rehab?: Prisma.XOR<Prisma.RehabAssessmentScalarRelationFilter, Prisma.RehabAssessmentWhereInput>;
};
export type RehabVideoOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rehabAssessmentId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    testType?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    rehab?: Prisma.RehabAssessmentOrderByWithRelationInput;
};
export type RehabVideoWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RehabVideoWhereInput | Prisma.RehabVideoWhereInput[];
    OR?: Prisma.RehabVideoWhereInput[];
    NOT?: Prisma.RehabVideoWhereInput | Prisma.RehabVideoWhereInput[];
    rehabAssessmentId?: Prisma.StringFilter<"RehabVideo"> | string;
    url?: Prisma.StringFilter<"RehabVideo"> | string;
    testType?: Prisma.StringFilter<"RehabVideo"> | string;
    capturedAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
    rehab?: Prisma.XOR<Prisma.RehabAssessmentScalarRelationFilter, Prisma.RehabAssessmentWhereInput>;
}, "id">;
export type RehabVideoOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rehabAssessmentId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    testType?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.RehabVideoCountOrderByAggregateInput;
    _max?: Prisma.RehabVideoMaxOrderByAggregateInput;
    _min?: Prisma.RehabVideoMinOrderByAggregateInput;
};
export type RehabVideoScalarWhereWithAggregatesInput = {
    AND?: Prisma.RehabVideoScalarWhereWithAggregatesInput | Prisma.RehabVideoScalarWhereWithAggregatesInput[];
    OR?: Prisma.RehabVideoScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RehabVideoScalarWhereWithAggregatesInput | Prisma.RehabVideoScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"RehabVideo"> | string;
    rehabAssessmentId?: Prisma.StringWithAggregatesFilter<"RehabVideo"> | string;
    url?: Prisma.StringWithAggregatesFilter<"RehabVideo"> | string;
    testType?: Prisma.StringWithAggregatesFilter<"RehabVideo"> | string;
    capturedAt?: Prisma.DateTimeWithAggregatesFilter<"RehabVideo"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"RehabVideo"> | Date | string;
};
export type RehabVideoCreateInput = {
    id?: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
    rehab: Prisma.RehabAssessmentCreateNestedOneWithoutVideosInput;
};
export type RehabVideoUncheckedCreateInput = {
    id?: string;
    rehabAssessmentId: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
};
export type RehabVideoUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    rehab?: Prisma.RehabAssessmentUpdateOneRequiredWithoutVideosNestedInput;
};
export type RehabVideoUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rehabAssessmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoCreateManyInput = {
    id?: string;
    rehabAssessmentId: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
};
export type RehabVideoUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rehabAssessmentId?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoListRelationFilter = {
    every?: Prisma.RehabVideoWhereInput;
    some?: Prisma.RehabVideoWhereInput;
    none?: Prisma.RehabVideoWhereInput;
};
export type RehabVideoOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RehabVideoCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rehabAssessmentId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    testType?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RehabVideoMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rehabAssessmentId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    testType?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RehabVideoMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rehabAssessmentId?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    testType?: Prisma.SortOrder;
    capturedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type RehabVideoCreateNestedManyWithoutRehabInput = {
    create?: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput> | Prisma.RehabVideoCreateWithoutRehabInput[] | Prisma.RehabVideoUncheckedCreateWithoutRehabInput[];
    connectOrCreate?: Prisma.RehabVideoCreateOrConnectWithoutRehabInput | Prisma.RehabVideoCreateOrConnectWithoutRehabInput[];
    createMany?: Prisma.RehabVideoCreateManyRehabInputEnvelope;
    connect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
};
export type RehabVideoUncheckedCreateNestedManyWithoutRehabInput = {
    create?: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput> | Prisma.RehabVideoCreateWithoutRehabInput[] | Prisma.RehabVideoUncheckedCreateWithoutRehabInput[];
    connectOrCreate?: Prisma.RehabVideoCreateOrConnectWithoutRehabInput | Prisma.RehabVideoCreateOrConnectWithoutRehabInput[];
    createMany?: Prisma.RehabVideoCreateManyRehabInputEnvelope;
    connect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
};
export type RehabVideoUpdateManyWithoutRehabNestedInput = {
    create?: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput> | Prisma.RehabVideoCreateWithoutRehabInput[] | Prisma.RehabVideoUncheckedCreateWithoutRehabInput[];
    connectOrCreate?: Prisma.RehabVideoCreateOrConnectWithoutRehabInput | Prisma.RehabVideoCreateOrConnectWithoutRehabInput[];
    upsert?: Prisma.RehabVideoUpsertWithWhereUniqueWithoutRehabInput | Prisma.RehabVideoUpsertWithWhereUniqueWithoutRehabInput[];
    createMany?: Prisma.RehabVideoCreateManyRehabInputEnvelope;
    set?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    disconnect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    delete?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    connect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    update?: Prisma.RehabVideoUpdateWithWhereUniqueWithoutRehabInput | Prisma.RehabVideoUpdateWithWhereUniqueWithoutRehabInput[];
    updateMany?: Prisma.RehabVideoUpdateManyWithWhereWithoutRehabInput | Prisma.RehabVideoUpdateManyWithWhereWithoutRehabInput[];
    deleteMany?: Prisma.RehabVideoScalarWhereInput | Prisma.RehabVideoScalarWhereInput[];
};
export type RehabVideoUncheckedUpdateManyWithoutRehabNestedInput = {
    create?: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput> | Prisma.RehabVideoCreateWithoutRehabInput[] | Prisma.RehabVideoUncheckedCreateWithoutRehabInput[];
    connectOrCreate?: Prisma.RehabVideoCreateOrConnectWithoutRehabInput | Prisma.RehabVideoCreateOrConnectWithoutRehabInput[];
    upsert?: Prisma.RehabVideoUpsertWithWhereUniqueWithoutRehabInput | Prisma.RehabVideoUpsertWithWhereUniqueWithoutRehabInput[];
    createMany?: Prisma.RehabVideoCreateManyRehabInputEnvelope;
    set?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    disconnect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    delete?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    connect?: Prisma.RehabVideoWhereUniqueInput | Prisma.RehabVideoWhereUniqueInput[];
    update?: Prisma.RehabVideoUpdateWithWhereUniqueWithoutRehabInput | Prisma.RehabVideoUpdateWithWhereUniqueWithoutRehabInput[];
    updateMany?: Prisma.RehabVideoUpdateManyWithWhereWithoutRehabInput | Prisma.RehabVideoUpdateManyWithWhereWithoutRehabInput[];
    deleteMany?: Prisma.RehabVideoScalarWhereInput | Prisma.RehabVideoScalarWhereInput[];
};
export type RehabVideoCreateWithoutRehabInput = {
    id?: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
};
export type RehabVideoUncheckedCreateWithoutRehabInput = {
    id?: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
};
export type RehabVideoCreateOrConnectWithoutRehabInput = {
    where: Prisma.RehabVideoWhereUniqueInput;
    create: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput>;
};
export type RehabVideoCreateManyRehabInputEnvelope = {
    data: Prisma.RehabVideoCreateManyRehabInput | Prisma.RehabVideoCreateManyRehabInput[];
};
export type RehabVideoUpsertWithWhereUniqueWithoutRehabInput = {
    where: Prisma.RehabVideoWhereUniqueInput;
    update: Prisma.XOR<Prisma.RehabVideoUpdateWithoutRehabInput, Prisma.RehabVideoUncheckedUpdateWithoutRehabInput>;
    create: Prisma.XOR<Prisma.RehabVideoCreateWithoutRehabInput, Prisma.RehabVideoUncheckedCreateWithoutRehabInput>;
};
export type RehabVideoUpdateWithWhereUniqueWithoutRehabInput = {
    where: Prisma.RehabVideoWhereUniqueInput;
    data: Prisma.XOR<Prisma.RehabVideoUpdateWithoutRehabInput, Prisma.RehabVideoUncheckedUpdateWithoutRehabInput>;
};
export type RehabVideoUpdateManyWithWhereWithoutRehabInput = {
    where: Prisma.RehabVideoScalarWhereInput;
    data: Prisma.XOR<Prisma.RehabVideoUpdateManyMutationInput, Prisma.RehabVideoUncheckedUpdateManyWithoutRehabInput>;
};
export type RehabVideoScalarWhereInput = {
    AND?: Prisma.RehabVideoScalarWhereInput | Prisma.RehabVideoScalarWhereInput[];
    OR?: Prisma.RehabVideoScalarWhereInput[];
    NOT?: Prisma.RehabVideoScalarWhereInput | Prisma.RehabVideoScalarWhereInput[];
    id?: Prisma.StringFilter<"RehabVideo"> | string;
    rehabAssessmentId?: Prisma.StringFilter<"RehabVideo"> | string;
    url?: Prisma.StringFilter<"RehabVideo"> | string;
    testType?: Prisma.StringFilter<"RehabVideo"> | string;
    capturedAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"RehabVideo"> | Date | string;
};
export type RehabVideoCreateManyRehabInput = {
    id?: string;
    url: string;
    testType: string;
    capturedAt: Date | string;
    createdAt?: Date | string;
};
export type RehabVideoUpdateWithoutRehabInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoUncheckedUpdateWithoutRehabInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoUncheckedUpdateManyWithoutRehabInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    testType?: Prisma.StringFieldUpdateOperationsInput | string;
    capturedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RehabVideoSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rehabAssessmentId?: boolean;
    url?: boolean;
    testType?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabVideo"]>;
export type RehabVideoSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rehabAssessmentId?: boolean;
    url?: boolean;
    testType?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabVideo"]>;
export type RehabVideoSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rehabAssessmentId?: boolean;
    url?: boolean;
    testType?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rehabVideo"]>;
export type RehabVideoSelectScalar = {
    id?: boolean;
    rehabAssessmentId?: boolean;
    url?: boolean;
    testType?: boolean;
    capturedAt?: boolean;
    createdAt?: boolean;
};
export type RehabVideoOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rehabAssessmentId" | "url" | "testType" | "capturedAt" | "createdAt", ExtArgs["result"]["rehabVideo"]>;
export type RehabVideoInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
};
export type RehabVideoIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
};
export type RehabVideoIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rehab?: boolean | Prisma.RehabAssessmentDefaultArgs<ExtArgs>;
};
export type $RehabVideoPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RehabVideo";
    objects: {
        rehab: Prisma.$RehabAssessmentPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rehabAssessmentId: string;
        url: string;
        testType: string;
        capturedAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["rehabVideo"]>;
    composites: {};
};
export type RehabVideoGetPayload<S extends boolean | null | undefined | RehabVideoDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload, S>;
export type RehabVideoCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RehabVideoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RehabVideoCountAggregateInputType | true;
};
export interface RehabVideoDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RehabVideo'];
        meta: {
            name: 'RehabVideo';
        };
    };
    /**
     * Find zero or one RehabVideo that matches the filter.
     * @param {RehabVideoFindUniqueArgs} args - Arguments to find a RehabVideo
     * @example
     * // Get one RehabVideo
     * const rehabVideo = await prisma.rehabVideo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RehabVideoFindUniqueArgs>(args: Prisma.SelectSubset<T, RehabVideoFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one RehabVideo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RehabVideoFindUniqueOrThrowArgs} args - Arguments to find a RehabVideo
     * @example
     * // Get one RehabVideo
     * const rehabVideo = await prisma.rehabVideo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RehabVideoFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RehabVideoFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RehabVideo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoFindFirstArgs} args - Arguments to find a RehabVideo
     * @example
     * // Get one RehabVideo
     * const rehabVideo = await prisma.rehabVideo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RehabVideoFindFirstArgs>(args?: Prisma.SelectSubset<T, RehabVideoFindFirstArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first RehabVideo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoFindFirstOrThrowArgs} args - Arguments to find a RehabVideo
     * @example
     * // Get one RehabVideo
     * const rehabVideo = await prisma.rehabVideo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RehabVideoFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RehabVideoFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more RehabVideos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RehabVideos
     * const rehabVideos = await prisma.rehabVideo.findMany()
     *
     * // Get first 10 RehabVideos
     * const rehabVideos = await prisma.rehabVideo.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const rehabVideoWithIdOnly = await prisma.rehabVideo.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RehabVideoFindManyArgs>(args?: Prisma.SelectSubset<T, RehabVideoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a RehabVideo.
     * @param {RehabVideoCreateArgs} args - Arguments to create a RehabVideo.
     * @example
     * // Create one RehabVideo
     * const RehabVideo = await prisma.rehabVideo.create({
     *   data: {
     *     // ... data to create a RehabVideo
     *   }
     * })
     *
     */
    create<T extends RehabVideoCreateArgs>(args: Prisma.SelectSubset<T, RehabVideoCreateArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many RehabVideos.
     * @param {RehabVideoCreateManyArgs} args - Arguments to create many RehabVideos.
     * @example
     * // Create many RehabVideos
     * const rehabVideo = await prisma.rehabVideo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RehabVideoCreateManyArgs>(args?: Prisma.SelectSubset<T, RehabVideoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many RehabVideos and returns the data saved in the database.
     * @param {RehabVideoCreateManyAndReturnArgs} args - Arguments to create many RehabVideos.
     * @example
     * // Create many RehabVideos
     * const rehabVideo = await prisma.rehabVideo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RehabVideos and only return the `id`
     * const rehabVideoWithIdOnly = await prisma.rehabVideo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RehabVideoCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RehabVideoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a RehabVideo.
     * @param {RehabVideoDeleteArgs} args - Arguments to delete one RehabVideo.
     * @example
     * // Delete one RehabVideo
     * const RehabVideo = await prisma.rehabVideo.delete({
     *   where: {
     *     // ... filter to delete one RehabVideo
     *   }
     * })
     *
     */
    delete<T extends RehabVideoDeleteArgs>(args: Prisma.SelectSubset<T, RehabVideoDeleteArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one RehabVideo.
     * @param {RehabVideoUpdateArgs} args - Arguments to update one RehabVideo.
     * @example
     * // Update one RehabVideo
     * const rehabVideo = await prisma.rehabVideo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RehabVideoUpdateArgs>(args: Prisma.SelectSubset<T, RehabVideoUpdateArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more RehabVideos.
     * @param {RehabVideoDeleteManyArgs} args - Arguments to filter RehabVideos to delete.
     * @example
     * // Delete a few RehabVideos
     * const { count } = await prisma.rehabVideo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RehabVideoDeleteManyArgs>(args?: Prisma.SelectSubset<T, RehabVideoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RehabVideos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RehabVideos
     * const rehabVideo = await prisma.rehabVideo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RehabVideoUpdateManyArgs>(args: Prisma.SelectSubset<T, RehabVideoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more RehabVideos and returns the data updated in the database.
     * @param {RehabVideoUpdateManyAndReturnArgs} args - Arguments to update many RehabVideos.
     * @example
     * // Update many RehabVideos
     * const rehabVideo = await prisma.rehabVideo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RehabVideos and only return the `id`
     * const rehabVideoWithIdOnly = await prisma.rehabVideo.updateManyAndReturn({
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
    updateManyAndReturn<T extends RehabVideoUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RehabVideoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one RehabVideo.
     * @param {RehabVideoUpsertArgs} args - Arguments to update or create a RehabVideo.
     * @example
     * // Update or create a RehabVideo
     * const rehabVideo = await prisma.rehabVideo.upsert({
     *   create: {
     *     // ... data to create a RehabVideo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RehabVideo we want to update
     *   }
     * })
     */
    upsert<T extends RehabVideoUpsertArgs>(args: Prisma.SelectSubset<T, RehabVideoUpsertArgs<ExtArgs>>): Prisma.Prisma__RehabVideoClient<runtime.Types.Result.GetResult<Prisma.$RehabVideoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of RehabVideos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoCountArgs} args - Arguments to filter RehabVideos to count.
     * @example
     * // Count the number of RehabVideos
     * const count = await prisma.rehabVideo.count({
     *   where: {
     *     // ... the filter for the RehabVideos we want to count
     *   }
     * })
    **/
    count<T extends RehabVideoCountArgs>(args?: Prisma.Subset<T, RehabVideoCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RehabVideoCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a RehabVideo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RehabVideoAggregateArgs>(args: Prisma.Subset<T, RehabVideoAggregateArgs>): Prisma.PrismaPromise<GetRehabVideoAggregateType<T>>;
    /**
     * Group by RehabVideo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RehabVideoGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RehabVideoGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RehabVideoGroupByArgs['orderBy'];
    } : {
        orderBy?: RehabVideoGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RehabVideoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRehabVideoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the RehabVideo model
     */
    readonly fields: RehabVideoFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for RehabVideo.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RehabVideoClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rehab<T extends Prisma.RehabAssessmentDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RehabAssessmentDefaultArgs<ExtArgs>>): Prisma.Prisma__RehabAssessmentClient<runtime.Types.Result.GetResult<Prisma.$RehabAssessmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the RehabVideo model
 */
export interface RehabVideoFieldRefs {
    readonly id: Prisma.FieldRef<"RehabVideo", 'String'>;
    readonly rehabAssessmentId: Prisma.FieldRef<"RehabVideo", 'String'>;
    readonly url: Prisma.FieldRef<"RehabVideo", 'String'>;
    readonly testType: Prisma.FieldRef<"RehabVideo", 'String'>;
    readonly capturedAt: Prisma.FieldRef<"RehabVideo", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"RehabVideo", 'DateTime'>;
}
/**
 * RehabVideo findUnique
 */
export type RehabVideoFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabVideo to fetch.
     */
    where: Prisma.RehabVideoWhereUniqueInput;
};
/**
 * RehabVideo findUniqueOrThrow
 */
export type RehabVideoFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabVideo to fetch.
     */
    where: Prisma.RehabVideoWhereUniqueInput;
};
/**
 * RehabVideo findFirst
 */
export type RehabVideoFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabVideo to fetch.
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabVideos to fetch.
     */
    orderBy?: Prisma.RehabVideoOrderByWithRelationInput | Prisma.RehabVideoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RehabVideos.
     */
    cursor?: Prisma.RehabVideoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabVideos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabVideos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RehabVideos.
     */
    distinct?: Prisma.RehabVideoScalarFieldEnum | Prisma.RehabVideoScalarFieldEnum[];
};
/**
 * RehabVideo findFirstOrThrow
 */
export type RehabVideoFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabVideo to fetch.
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabVideos to fetch.
     */
    orderBy?: Prisma.RehabVideoOrderByWithRelationInput | Prisma.RehabVideoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RehabVideos.
     */
    cursor?: Prisma.RehabVideoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabVideos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabVideos.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RehabVideos.
     */
    distinct?: Prisma.RehabVideoScalarFieldEnum | Prisma.RehabVideoScalarFieldEnum[];
};
/**
 * RehabVideo findMany
 */
export type RehabVideoFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which RehabVideos to fetch.
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RehabVideos to fetch.
     */
    orderBy?: Prisma.RehabVideoOrderByWithRelationInput | Prisma.RehabVideoOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RehabVideos.
     */
    cursor?: Prisma.RehabVideoWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RehabVideos from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RehabVideos.
     */
    skip?: number;
    distinct?: Prisma.RehabVideoScalarFieldEnum | Prisma.RehabVideoScalarFieldEnum[];
};
/**
 * RehabVideo create
 */
export type RehabVideoCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a RehabVideo.
     */
    data: Prisma.XOR<Prisma.RehabVideoCreateInput, Prisma.RehabVideoUncheckedCreateInput>;
};
/**
 * RehabVideo createMany
 */
export type RehabVideoCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many RehabVideos.
     */
    data: Prisma.RehabVideoCreateManyInput | Prisma.RehabVideoCreateManyInput[];
};
/**
 * RehabVideo createManyAndReturn
 */
export type RehabVideoCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabVideo
     */
    select?: Prisma.RehabVideoSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabVideo
     */
    omit?: Prisma.RehabVideoOmit<ExtArgs> | null;
    /**
     * The data used to create many RehabVideos.
     */
    data: Prisma.RehabVideoCreateManyInput | Prisma.RehabVideoCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabVideoIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * RehabVideo update
 */
export type RehabVideoUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a RehabVideo.
     */
    data: Prisma.XOR<Prisma.RehabVideoUpdateInput, Prisma.RehabVideoUncheckedUpdateInput>;
    /**
     * Choose, which RehabVideo to update.
     */
    where: Prisma.RehabVideoWhereUniqueInput;
};
/**
 * RehabVideo updateMany
 */
export type RehabVideoUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update RehabVideos.
     */
    data: Prisma.XOR<Prisma.RehabVideoUpdateManyMutationInput, Prisma.RehabVideoUncheckedUpdateManyInput>;
    /**
     * Filter which RehabVideos to update
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * Limit how many RehabVideos to update.
     */
    limit?: number;
};
/**
 * RehabVideo updateManyAndReturn
 */
export type RehabVideoUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RehabVideo
     */
    select?: Prisma.RehabVideoSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the RehabVideo
     */
    omit?: Prisma.RehabVideoOmit<ExtArgs> | null;
    /**
     * The data used to update RehabVideos.
     */
    data: Prisma.XOR<Prisma.RehabVideoUpdateManyMutationInput, Prisma.RehabVideoUncheckedUpdateManyInput>;
    /**
     * Filter which RehabVideos to update
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * Limit how many RehabVideos to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RehabVideoIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * RehabVideo upsert
 */
export type RehabVideoUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the RehabVideo to update in case it exists.
     */
    where: Prisma.RehabVideoWhereUniqueInput;
    /**
     * In case the RehabVideo found by the `where` argument doesn't exist, create a new RehabVideo with this data.
     */
    create: Prisma.XOR<Prisma.RehabVideoCreateInput, Prisma.RehabVideoUncheckedCreateInput>;
    /**
     * In case the RehabVideo was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RehabVideoUpdateInput, Prisma.RehabVideoUncheckedUpdateInput>;
};
/**
 * RehabVideo delete
 */
export type RehabVideoDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which RehabVideo to delete.
     */
    where: Prisma.RehabVideoWhereUniqueInput;
};
/**
 * RehabVideo deleteMany
 */
export type RehabVideoDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which RehabVideos to delete
     */
    where?: Prisma.RehabVideoWhereInput;
    /**
     * Limit how many RehabVideos to delete.
     */
    limit?: number;
};
/**
 * RehabVideo without action
 */
export type RehabVideoDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=RehabVideo.d.ts.map