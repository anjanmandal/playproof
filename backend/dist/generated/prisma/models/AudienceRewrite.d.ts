import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model AudienceRewrite
 *
 */
export type AudienceRewriteModel = runtime.Types.Result.DefaultSelection<Prisma.$AudienceRewritePayload>;
export type AggregateAudienceRewrite = {
    _count: AudienceRewriteCountAggregateOutputType | null;
    _min: AudienceRewriteMinAggregateOutputType | null;
    _max: AudienceRewriteMaxAggregateOutputType | null;
};
export type AudienceRewriteMinAggregateOutputType = {
    id: string | null;
    assessmentId: string | null;
    sourceMessage: string | null;
    audience: string | null;
    tone: string | null;
    rewritten: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
};
export type AudienceRewriteMaxAggregateOutputType = {
    id: string | null;
    assessmentId: string | null;
    sourceMessage: string | null;
    audience: string | null;
    tone: string | null;
    rewritten: string | null;
    rawModelOutput: string | null;
    createdAt: Date | null;
};
export type AudienceRewriteCountAggregateOutputType = {
    id: number;
    assessmentId: number;
    sourceMessage: number;
    audience: number;
    tone: number;
    rewritten: number;
    rawModelOutput: number;
    createdAt: number;
    _all: number;
};
export type AudienceRewriteMinAggregateInputType = {
    id?: true;
    assessmentId?: true;
    sourceMessage?: true;
    audience?: true;
    tone?: true;
    rewritten?: true;
    rawModelOutput?: true;
    createdAt?: true;
};
export type AudienceRewriteMaxAggregateInputType = {
    id?: true;
    assessmentId?: true;
    sourceMessage?: true;
    audience?: true;
    tone?: true;
    rewritten?: true;
    rawModelOutput?: true;
    createdAt?: true;
};
export type AudienceRewriteCountAggregateInputType = {
    id?: true;
    assessmentId?: true;
    sourceMessage?: true;
    audience?: true;
    tone?: true;
    rewritten?: true;
    rawModelOutput?: true;
    createdAt?: true;
    _all?: true;
};
export type AudienceRewriteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AudienceRewrite to aggregate.
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AudienceRewrites to fetch.
     */
    orderBy?: Prisma.AudienceRewriteOrderByWithRelationInput | Prisma.AudienceRewriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.AudienceRewriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AudienceRewrites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AudienceRewrites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AudienceRewrites
    **/
    _count?: true | AudienceRewriteCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: AudienceRewriteMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: AudienceRewriteMaxAggregateInputType;
};
export type GetAudienceRewriteAggregateType<T extends AudienceRewriteAggregateArgs> = {
    [P in keyof T & keyof AggregateAudienceRewrite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAudienceRewrite[P]> : Prisma.GetScalarType<T[P], AggregateAudienceRewrite[P]>;
};
export type AudienceRewriteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AudienceRewriteWhereInput;
    orderBy?: Prisma.AudienceRewriteOrderByWithAggregationInput | Prisma.AudienceRewriteOrderByWithAggregationInput[];
    by: Prisma.AudienceRewriteScalarFieldEnum[] | Prisma.AudienceRewriteScalarFieldEnum;
    having?: Prisma.AudienceRewriteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AudienceRewriteCountAggregateInputType | true;
    _min?: AudienceRewriteMinAggregateInputType;
    _max?: AudienceRewriteMaxAggregateInputType;
};
export type AudienceRewriteGroupByOutputType = {
    id: string;
    assessmentId: string | null;
    sourceMessage: string;
    audience: string;
    tone: string | null;
    rewritten: string;
    rawModelOutput: string | null;
    createdAt: Date;
    _count: AudienceRewriteCountAggregateOutputType | null;
    _min: AudienceRewriteMinAggregateOutputType | null;
    _max: AudienceRewriteMaxAggregateOutputType | null;
};
type GetAudienceRewriteGroupByPayload<T extends AudienceRewriteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AudienceRewriteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AudienceRewriteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AudienceRewriteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AudienceRewriteGroupByOutputType[P]>;
}>>;
export type AudienceRewriteWhereInput = {
    AND?: Prisma.AudienceRewriteWhereInput | Prisma.AudienceRewriteWhereInput[];
    OR?: Prisma.AudienceRewriteWhereInput[];
    NOT?: Prisma.AudienceRewriteWhereInput | Prisma.AudienceRewriteWhereInput[];
    id?: Prisma.StringFilter<"AudienceRewrite"> | string;
    assessmentId?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    sourceMessage?: Prisma.StringFilter<"AudienceRewrite"> | string;
    audience?: Prisma.StringFilter<"AudienceRewrite"> | string;
    tone?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    rewritten?: Prisma.StringFilter<"AudienceRewrite"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"AudienceRewrite"> | Date | string;
};
export type AudienceRewriteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceMessage?: Prisma.SortOrder;
    audience?: Prisma.SortOrder;
    tone?: Prisma.SortOrderInput | Prisma.SortOrder;
    rewritten?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AudienceRewriteWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AudienceRewriteWhereInput | Prisma.AudienceRewriteWhereInput[];
    OR?: Prisma.AudienceRewriteWhereInput[];
    NOT?: Prisma.AudienceRewriteWhereInput | Prisma.AudienceRewriteWhereInput[];
    assessmentId?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    sourceMessage?: Prisma.StringFilter<"AudienceRewrite"> | string;
    audience?: Prisma.StringFilter<"AudienceRewrite"> | string;
    tone?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    rewritten?: Prisma.StringFilter<"AudienceRewrite"> | string;
    rawModelOutput?: Prisma.StringNullableFilter<"AudienceRewrite"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"AudienceRewrite"> | Date | string;
}, "id">;
export type AudienceRewriteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrderInput | Prisma.SortOrder;
    sourceMessage?: Prisma.SortOrder;
    audience?: Prisma.SortOrder;
    tone?: Prisma.SortOrderInput | Prisma.SortOrder;
    rewritten?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.AudienceRewriteCountOrderByAggregateInput;
    _max?: Prisma.AudienceRewriteMaxOrderByAggregateInput;
    _min?: Prisma.AudienceRewriteMinOrderByAggregateInput;
};
export type AudienceRewriteScalarWhereWithAggregatesInput = {
    AND?: Prisma.AudienceRewriteScalarWhereWithAggregatesInput | Prisma.AudienceRewriteScalarWhereWithAggregatesInput[];
    OR?: Prisma.AudienceRewriteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AudienceRewriteScalarWhereWithAggregatesInput | Prisma.AudienceRewriteScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AudienceRewrite"> | string;
    assessmentId?: Prisma.StringNullableWithAggregatesFilter<"AudienceRewrite"> | string | null;
    sourceMessage?: Prisma.StringWithAggregatesFilter<"AudienceRewrite"> | string;
    audience?: Prisma.StringWithAggregatesFilter<"AudienceRewrite"> | string;
    tone?: Prisma.StringNullableWithAggregatesFilter<"AudienceRewrite"> | string | null;
    rewritten?: Prisma.StringWithAggregatesFilter<"AudienceRewrite"> | string;
    rawModelOutput?: Prisma.StringNullableWithAggregatesFilter<"AudienceRewrite"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AudienceRewrite"> | Date | string;
};
export type AudienceRewriteCreateInput = {
    id?: string;
    assessmentId?: string | null;
    sourceMessage: string;
    audience: string;
    tone?: string | null;
    rewritten: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
};
export type AudienceRewriteUncheckedCreateInput = {
    id?: string;
    assessmentId?: string | null;
    sourceMessage: string;
    audience: string;
    tone?: string | null;
    rewritten: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
};
export type AudienceRewriteUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceMessage?: Prisma.StringFieldUpdateOperationsInput | string;
    audience?: Prisma.StringFieldUpdateOperationsInput | string;
    tone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rewritten?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AudienceRewriteUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceMessage?: Prisma.StringFieldUpdateOperationsInput | string;
    audience?: Prisma.StringFieldUpdateOperationsInput | string;
    tone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rewritten?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AudienceRewriteCreateManyInput = {
    id?: string;
    assessmentId?: string | null;
    sourceMessage: string;
    audience: string;
    tone?: string | null;
    rewritten: string;
    rawModelOutput?: string | null;
    createdAt?: Date | string;
};
export type AudienceRewriteUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceMessage?: Prisma.StringFieldUpdateOperationsInput | string;
    audience?: Prisma.StringFieldUpdateOperationsInput | string;
    tone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rewritten?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AudienceRewriteUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    assessmentId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sourceMessage?: Prisma.StringFieldUpdateOperationsInput | string;
    audience?: Prisma.StringFieldUpdateOperationsInput | string;
    tone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rewritten?: Prisma.StringFieldUpdateOperationsInput | string;
    rawModelOutput?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AudienceRewriteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    sourceMessage?: Prisma.SortOrder;
    audience?: Prisma.SortOrder;
    tone?: Prisma.SortOrder;
    rewritten?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AudienceRewriteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    sourceMessage?: Prisma.SortOrder;
    audience?: Prisma.SortOrder;
    tone?: Prisma.SortOrder;
    rewritten?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AudienceRewriteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    assessmentId?: Prisma.SortOrder;
    sourceMessage?: Prisma.SortOrder;
    audience?: Prisma.SortOrder;
    tone?: Prisma.SortOrder;
    rewritten?: Prisma.SortOrder;
    rawModelOutput?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type AudienceRewriteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    sourceMessage?: boolean;
    audience?: boolean;
    tone?: boolean;
    rewritten?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["audienceRewrite"]>;
export type AudienceRewriteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    sourceMessage?: boolean;
    audience?: boolean;
    tone?: boolean;
    rewritten?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["audienceRewrite"]>;
export type AudienceRewriteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    assessmentId?: boolean;
    sourceMessage?: boolean;
    audience?: boolean;
    tone?: boolean;
    rewritten?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["audienceRewrite"]>;
export type AudienceRewriteSelectScalar = {
    id?: boolean;
    assessmentId?: boolean;
    sourceMessage?: boolean;
    audience?: boolean;
    tone?: boolean;
    rewritten?: boolean;
    rawModelOutput?: boolean;
    createdAt?: boolean;
};
export type AudienceRewriteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "assessmentId" | "sourceMessage" | "audience" | "tone" | "rewritten" | "rawModelOutput" | "createdAt", ExtArgs["result"]["audienceRewrite"]>;
export type $AudienceRewritePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AudienceRewrite";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        assessmentId: string | null;
        sourceMessage: string;
        audience: string;
        tone: string | null;
        rewritten: string;
        rawModelOutput: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["audienceRewrite"]>;
    composites: {};
};
export type AudienceRewriteGetPayload<S extends boolean | null | undefined | AudienceRewriteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload, S>;
export type AudienceRewriteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AudienceRewriteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AudienceRewriteCountAggregateInputType | true;
};
export interface AudienceRewriteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AudienceRewrite'];
        meta: {
            name: 'AudienceRewrite';
        };
    };
    /**
     * Find zero or one AudienceRewrite that matches the filter.
     * @param {AudienceRewriteFindUniqueArgs} args - Arguments to find a AudienceRewrite
     * @example
     * // Get one AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AudienceRewriteFindUniqueArgs>(args: Prisma.SelectSubset<T, AudienceRewriteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one AudienceRewrite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AudienceRewriteFindUniqueOrThrowArgs} args - Arguments to find a AudienceRewrite
     * @example
     * // Get one AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AudienceRewriteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AudienceRewriteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AudienceRewrite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteFindFirstArgs} args - Arguments to find a AudienceRewrite
     * @example
     * // Get one AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AudienceRewriteFindFirstArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteFindFirstArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AudienceRewrite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteFindFirstOrThrowArgs} args - Arguments to find a AudienceRewrite
     * @example
     * // Get one AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AudienceRewriteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more AudienceRewrites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AudienceRewrites
     * const audienceRewrites = await prisma.audienceRewrite.findMany()
     *
     * // Get first 10 AudienceRewrites
     * const audienceRewrites = await prisma.audienceRewrite.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const audienceRewriteWithIdOnly = await prisma.audienceRewrite.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AudienceRewriteFindManyArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a AudienceRewrite.
     * @param {AudienceRewriteCreateArgs} args - Arguments to create a AudienceRewrite.
     * @example
     * // Create one AudienceRewrite
     * const AudienceRewrite = await prisma.audienceRewrite.create({
     *   data: {
     *     // ... data to create a AudienceRewrite
     *   }
     * })
     *
     */
    create<T extends AudienceRewriteCreateArgs>(args: Prisma.SelectSubset<T, AudienceRewriteCreateArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many AudienceRewrites.
     * @param {AudienceRewriteCreateManyArgs} args - Arguments to create many AudienceRewrites.
     * @example
     * // Create many AudienceRewrites
     * const audienceRewrite = await prisma.audienceRewrite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AudienceRewriteCreateManyArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many AudienceRewrites and returns the data saved in the database.
     * @param {AudienceRewriteCreateManyAndReturnArgs} args - Arguments to create many AudienceRewrites.
     * @example
     * // Create many AudienceRewrites
     * const audienceRewrite = await prisma.audienceRewrite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AudienceRewrites and only return the `id`
     * const audienceRewriteWithIdOnly = await prisma.audienceRewrite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AudienceRewriteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a AudienceRewrite.
     * @param {AudienceRewriteDeleteArgs} args - Arguments to delete one AudienceRewrite.
     * @example
     * // Delete one AudienceRewrite
     * const AudienceRewrite = await prisma.audienceRewrite.delete({
     *   where: {
     *     // ... filter to delete one AudienceRewrite
     *   }
     * })
     *
     */
    delete<T extends AudienceRewriteDeleteArgs>(args: Prisma.SelectSubset<T, AudienceRewriteDeleteArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one AudienceRewrite.
     * @param {AudienceRewriteUpdateArgs} args - Arguments to update one AudienceRewrite.
     * @example
     * // Update one AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AudienceRewriteUpdateArgs>(args: Prisma.SelectSubset<T, AudienceRewriteUpdateArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more AudienceRewrites.
     * @param {AudienceRewriteDeleteManyArgs} args - Arguments to filter AudienceRewrites to delete.
     * @example
     * // Delete a few AudienceRewrites
     * const { count } = await prisma.audienceRewrite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AudienceRewriteDeleteManyArgs>(args?: Prisma.SelectSubset<T, AudienceRewriteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AudienceRewrites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AudienceRewrites
     * const audienceRewrite = await prisma.audienceRewrite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AudienceRewriteUpdateManyArgs>(args: Prisma.SelectSubset<T, AudienceRewriteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AudienceRewrites and returns the data updated in the database.
     * @param {AudienceRewriteUpdateManyAndReturnArgs} args - Arguments to update many AudienceRewrites.
     * @example
     * // Update many AudienceRewrites
     * const audienceRewrite = await prisma.audienceRewrite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AudienceRewrites and only return the `id`
     * const audienceRewriteWithIdOnly = await prisma.audienceRewrite.updateManyAndReturn({
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
    updateManyAndReturn<T extends AudienceRewriteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AudienceRewriteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one AudienceRewrite.
     * @param {AudienceRewriteUpsertArgs} args - Arguments to update or create a AudienceRewrite.
     * @example
     * // Update or create a AudienceRewrite
     * const audienceRewrite = await prisma.audienceRewrite.upsert({
     *   create: {
     *     // ... data to create a AudienceRewrite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AudienceRewrite we want to update
     *   }
     * })
     */
    upsert<T extends AudienceRewriteUpsertArgs>(args: Prisma.SelectSubset<T, AudienceRewriteUpsertArgs<ExtArgs>>): Prisma.Prisma__AudienceRewriteClient<runtime.Types.Result.GetResult<Prisma.$AudienceRewritePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of AudienceRewrites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteCountArgs} args - Arguments to filter AudienceRewrites to count.
     * @example
     * // Count the number of AudienceRewrites
     * const count = await prisma.audienceRewrite.count({
     *   where: {
     *     // ... the filter for the AudienceRewrites we want to count
     *   }
     * })
    **/
    count<T extends AudienceRewriteCountArgs>(args?: Prisma.Subset<T, AudienceRewriteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AudienceRewriteCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a AudienceRewrite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AudienceRewriteAggregateArgs>(args: Prisma.Subset<T, AudienceRewriteAggregateArgs>): Prisma.PrismaPromise<GetAudienceRewriteAggregateType<T>>;
    /**
     * Group by AudienceRewrite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudienceRewriteGroupByArgs} args - Group by arguments.
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
    groupBy<T extends AudienceRewriteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AudienceRewriteGroupByArgs['orderBy'];
    } : {
        orderBy?: AudienceRewriteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AudienceRewriteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudienceRewriteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AudienceRewrite model
     */
    readonly fields: AudienceRewriteFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for AudienceRewrite.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AudienceRewriteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
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
 * Fields of the AudienceRewrite model
 */
export interface AudienceRewriteFieldRefs {
    readonly id: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly assessmentId: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly sourceMessage: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly audience: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly tone: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly rewritten: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly rawModelOutput: Prisma.FieldRef<"AudienceRewrite", 'String'>;
    readonly createdAt: Prisma.FieldRef<"AudienceRewrite", 'DateTime'>;
}
/**
 * AudienceRewrite findUnique
 */
export type AudienceRewriteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter, which AudienceRewrite to fetch.
     */
    where: Prisma.AudienceRewriteWhereUniqueInput;
};
/**
 * AudienceRewrite findUniqueOrThrow
 */
export type AudienceRewriteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter, which AudienceRewrite to fetch.
     */
    where: Prisma.AudienceRewriteWhereUniqueInput;
};
/**
 * AudienceRewrite findFirst
 */
export type AudienceRewriteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter, which AudienceRewrite to fetch.
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AudienceRewrites to fetch.
     */
    orderBy?: Prisma.AudienceRewriteOrderByWithRelationInput | Prisma.AudienceRewriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AudienceRewrites.
     */
    cursor?: Prisma.AudienceRewriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AudienceRewrites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AudienceRewrites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AudienceRewrites.
     */
    distinct?: Prisma.AudienceRewriteScalarFieldEnum | Prisma.AudienceRewriteScalarFieldEnum[];
};
/**
 * AudienceRewrite findFirstOrThrow
 */
export type AudienceRewriteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter, which AudienceRewrite to fetch.
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AudienceRewrites to fetch.
     */
    orderBy?: Prisma.AudienceRewriteOrderByWithRelationInput | Prisma.AudienceRewriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AudienceRewrites.
     */
    cursor?: Prisma.AudienceRewriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AudienceRewrites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AudienceRewrites.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AudienceRewrites.
     */
    distinct?: Prisma.AudienceRewriteScalarFieldEnum | Prisma.AudienceRewriteScalarFieldEnum[];
};
/**
 * AudienceRewrite findMany
 */
export type AudienceRewriteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter, which AudienceRewrites to fetch.
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AudienceRewrites to fetch.
     */
    orderBy?: Prisma.AudienceRewriteOrderByWithRelationInput | Prisma.AudienceRewriteOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AudienceRewrites.
     */
    cursor?: Prisma.AudienceRewriteWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AudienceRewrites from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AudienceRewrites.
     */
    skip?: number;
    distinct?: Prisma.AudienceRewriteScalarFieldEnum | Prisma.AudienceRewriteScalarFieldEnum[];
};
/**
 * AudienceRewrite create
 */
export type AudienceRewriteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * The data needed to create a AudienceRewrite.
     */
    data: Prisma.XOR<Prisma.AudienceRewriteCreateInput, Prisma.AudienceRewriteUncheckedCreateInput>;
};
/**
 * AudienceRewrite createMany
 */
export type AudienceRewriteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many AudienceRewrites.
     */
    data: Prisma.AudienceRewriteCreateManyInput | Prisma.AudienceRewriteCreateManyInput[];
};
/**
 * AudienceRewrite createManyAndReturn
 */
export type AudienceRewriteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * The data used to create many AudienceRewrites.
     */
    data: Prisma.AudienceRewriteCreateManyInput | Prisma.AudienceRewriteCreateManyInput[];
};
/**
 * AudienceRewrite update
 */
export type AudienceRewriteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * The data needed to update a AudienceRewrite.
     */
    data: Prisma.XOR<Prisma.AudienceRewriteUpdateInput, Prisma.AudienceRewriteUncheckedUpdateInput>;
    /**
     * Choose, which AudienceRewrite to update.
     */
    where: Prisma.AudienceRewriteWhereUniqueInput;
};
/**
 * AudienceRewrite updateMany
 */
export type AudienceRewriteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update AudienceRewrites.
     */
    data: Prisma.XOR<Prisma.AudienceRewriteUpdateManyMutationInput, Prisma.AudienceRewriteUncheckedUpdateManyInput>;
    /**
     * Filter which AudienceRewrites to update
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * Limit how many AudienceRewrites to update.
     */
    limit?: number;
};
/**
 * AudienceRewrite updateManyAndReturn
 */
export type AudienceRewriteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * The data used to update AudienceRewrites.
     */
    data: Prisma.XOR<Prisma.AudienceRewriteUpdateManyMutationInput, Prisma.AudienceRewriteUncheckedUpdateManyInput>;
    /**
     * Filter which AudienceRewrites to update
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * Limit how many AudienceRewrites to update.
     */
    limit?: number;
};
/**
 * AudienceRewrite upsert
 */
export type AudienceRewriteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * The filter to search for the AudienceRewrite to update in case it exists.
     */
    where: Prisma.AudienceRewriteWhereUniqueInput;
    /**
     * In case the AudienceRewrite found by the `where` argument doesn't exist, create a new AudienceRewrite with this data.
     */
    create: Prisma.XOR<Prisma.AudienceRewriteCreateInput, Prisma.AudienceRewriteUncheckedCreateInput>;
    /**
     * In case the AudienceRewrite was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.AudienceRewriteUpdateInput, Prisma.AudienceRewriteUncheckedUpdateInput>;
};
/**
 * AudienceRewrite delete
 */
export type AudienceRewriteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
    /**
     * Filter which AudienceRewrite to delete.
     */
    where: Prisma.AudienceRewriteWhereUniqueInput;
};
/**
 * AudienceRewrite deleteMany
 */
export type AudienceRewriteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AudienceRewrites to delete
     */
    where?: Prisma.AudienceRewriteWhereInput;
    /**
     * Limit how many AudienceRewrites to delete.
     */
    limit?: number;
};
/**
 * AudienceRewrite without action
 */
export type AudienceRewriteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudienceRewrite
     */
    select?: Prisma.AudienceRewriteSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the AudienceRewrite
     */
    omit?: Prisma.AudienceRewriteOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=AudienceRewrite.d.ts.map