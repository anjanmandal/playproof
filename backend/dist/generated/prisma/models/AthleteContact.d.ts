import type * as runtime from "@prisma/client/runtime/library";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model AthleteContact
 *
 */
export type AthleteContactModel = runtime.Types.Result.DefaultSelection<Prisma.$AthleteContactPayload>;
export type AggregateAthleteContact = {
    _count: AthleteContactCountAggregateOutputType | null;
    _min: AthleteContactMinAggregateOutputType | null;
    _max: AthleteContactMaxAggregateOutputType | null;
};
export type AthleteContactMinAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    name: string | null;
    relationship: string | null;
    email: string | null;
    phone: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AthleteContactMaxAggregateOutputType = {
    id: string | null;
    athleteId: string | null;
    name: string | null;
    relationship: string | null;
    email: string | null;
    phone: string | null;
    role: $Enums.Role | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type AthleteContactCountAggregateOutputType = {
    id: number;
    athleteId: number;
    name: number;
    relationship: number;
    email: number;
    phone: number;
    role: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type AthleteContactMinAggregateInputType = {
    id?: true;
    athleteId?: true;
    name?: true;
    relationship?: true;
    email?: true;
    phone?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AthleteContactMaxAggregateInputType = {
    id?: true;
    athleteId?: true;
    name?: true;
    relationship?: true;
    email?: true;
    phone?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type AthleteContactCountAggregateInputType = {
    id?: true;
    athleteId?: true;
    name?: true;
    relationship?: true;
    email?: true;
    phone?: true;
    role?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type AthleteContactAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AthleteContact to aggregate.
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AthleteContacts to fetch.
     */
    orderBy?: Prisma.AthleteContactOrderByWithRelationInput | Prisma.AthleteContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.AthleteContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AthleteContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AthleteContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned AthleteContacts
    **/
    _count?: true | AthleteContactCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: AthleteContactMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: AthleteContactMaxAggregateInputType;
};
export type GetAthleteContactAggregateType<T extends AthleteContactAggregateArgs> = {
    [P in keyof T & keyof AggregateAthleteContact]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAthleteContact[P]> : Prisma.GetScalarType<T[P], AggregateAthleteContact[P]>;
};
export type AthleteContactGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AthleteContactWhereInput;
    orderBy?: Prisma.AthleteContactOrderByWithAggregationInput | Prisma.AthleteContactOrderByWithAggregationInput[];
    by: Prisma.AthleteContactScalarFieldEnum[] | Prisma.AthleteContactScalarFieldEnum;
    having?: Prisma.AthleteContactScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AthleteContactCountAggregateInputType | true;
    _min?: AthleteContactMinAggregateInputType;
    _max?: AthleteContactMaxAggregateInputType;
};
export type AthleteContactGroupByOutputType = {
    id: string;
    athleteId: string;
    name: string;
    relationship: string;
    email: string | null;
    phone: string | null;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    _count: AthleteContactCountAggregateOutputType | null;
    _min: AthleteContactMinAggregateOutputType | null;
    _max: AthleteContactMaxAggregateOutputType | null;
};
type GetAthleteContactGroupByPayload<T extends AthleteContactGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AthleteContactGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AthleteContactGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AthleteContactGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AthleteContactGroupByOutputType[P]>;
}>>;
export type AthleteContactWhereInput = {
    AND?: Prisma.AthleteContactWhereInput | Prisma.AthleteContactWhereInput[];
    OR?: Prisma.AthleteContactWhereInput[];
    NOT?: Prisma.AthleteContactWhereInput | Prisma.AthleteContactWhereInput[];
    id?: Prisma.StringFilter<"AthleteContact"> | string;
    athleteId?: Prisma.StringFilter<"AthleteContact"> | string;
    name?: Prisma.StringFilter<"AthleteContact"> | string;
    relationship?: Prisma.StringFilter<"AthleteContact"> | string;
    email?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    phone?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    role?: Prisma.EnumRoleFilter<"AthleteContact"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
};
export type AthleteContactOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    athlete?: Prisma.AthleteOrderByWithRelationInput;
};
export type AthleteContactWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.AthleteContactWhereInput | Prisma.AthleteContactWhereInput[];
    OR?: Prisma.AthleteContactWhereInput[];
    NOT?: Prisma.AthleteContactWhereInput | Prisma.AthleteContactWhereInput[];
    athleteId?: Prisma.StringFilter<"AthleteContact"> | string;
    name?: Prisma.StringFilter<"AthleteContact"> | string;
    relationship?: Prisma.StringFilter<"AthleteContact"> | string;
    email?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    phone?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    role?: Prisma.EnumRoleFilter<"AthleteContact"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
    athlete?: Prisma.XOR<Prisma.AthleteScalarRelationFilter, Prisma.AthleteWhereInput>;
}, "id">;
export type AthleteContactOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.AthleteContactCountOrderByAggregateInput;
    _max?: Prisma.AthleteContactMaxOrderByAggregateInput;
    _min?: Prisma.AthleteContactMinOrderByAggregateInput;
};
export type AthleteContactScalarWhereWithAggregatesInput = {
    AND?: Prisma.AthleteContactScalarWhereWithAggregatesInput | Prisma.AthleteContactScalarWhereWithAggregatesInput[];
    OR?: Prisma.AthleteContactScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AthleteContactScalarWhereWithAggregatesInput | Prisma.AthleteContactScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"AthleteContact"> | string;
    athleteId?: Prisma.StringWithAggregatesFilter<"AthleteContact"> | string;
    name?: Prisma.StringWithAggregatesFilter<"AthleteContact"> | string;
    relationship?: Prisma.StringWithAggregatesFilter<"AthleteContact"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"AthleteContact"> | string | null;
    phone?: Prisma.StringNullableWithAggregatesFilter<"AthleteContact"> | string | null;
    role?: Prisma.EnumRoleWithAggregatesFilter<"AthleteContact"> | $Enums.Role;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AthleteContact"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"AthleteContact"> | Date | string;
};
export type AthleteContactCreateInput = {
    id?: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    athlete: Prisma.AthleteCreateNestedOneWithoutContactsInput;
};
export type AthleteContactUncheckedCreateInput = {
    id?: string;
    athleteId: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteContactUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    athlete?: Prisma.AthleteUpdateOneRequiredWithoutContactsNestedInput;
};
export type AthleteContactUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactCreateManyInput = {
    id?: string;
    athleteId: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteContactUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    athleteId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactListRelationFilter = {
    every?: Prisma.AthleteContactWhereInput;
    some?: Prisma.AthleteContactWhereInput;
    none?: Prisma.AthleteContactWhereInput;
};
export type AthleteContactOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AthleteContactCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteContactMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteContactMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    athleteId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type AthleteContactCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput> | Prisma.AthleteContactCreateWithoutAthleteInput[] | Prisma.AthleteContactUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.AthleteContactCreateOrConnectWithoutAthleteInput | Prisma.AthleteContactCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.AthleteContactCreateManyAthleteInputEnvelope;
    connect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
};
export type AthleteContactUncheckedCreateNestedManyWithoutAthleteInput = {
    create?: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput> | Prisma.AthleteContactCreateWithoutAthleteInput[] | Prisma.AthleteContactUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.AthleteContactCreateOrConnectWithoutAthleteInput | Prisma.AthleteContactCreateOrConnectWithoutAthleteInput[];
    createMany?: Prisma.AthleteContactCreateManyAthleteInputEnvelope;
    connect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
};
export type AthleteContactUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput> | Prisma.AthleteContactCreateWithoutAthleteInput[] | Prisma.AthleteContactUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.AthleteContactCreateOrConnectWithoutAthleteInput | Prisma.AthleteContactCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.AthleteContactUpsertWithWhereUniqueWithoutAthleteInput | Prisma.AthleteContactUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.AthleteContactCreateManyAthleteInputEnvelope;
    set?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    disconnect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    delete?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    connect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    update?: Prisma.AthleteContactUpdateWithWhereUniqueWithoutAthleteInput | Prisma.AthleteContactUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.AthleteContactUpdateManyWithWhereWithoutAthleteInput | Prisma.AthleteContactUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.AthleteContactScalarWhereInput | Prisma.AthleteContactScalarWhereInput[];
};
export type AthleteContactUncheckedUpdateManyWithoutAthleteNestedInput = {
    create?: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput> | Prisma.AthleteContactCreateWithoutAthleteInput[] | Prisma.AthleteContactUncheckedCreateWithoutAthleteInput[];
    connectOrCreate?: Prisma.AthleteContactCreateOrConnectWithoutAthleteInput | Prisma.AthleteContactCreateOrConnectWithoutAthleteInput[];
    upsert?: Prisma.AthleteContactUpsertWithWhereUniqueWithoutAthleteInput | Prisma.AthleteContactUpsertWithWhereUniqueWithoutAthleteInput[];
    createMany?: Prisma.AthleteContactCreateManyAthleteInputEnvelope;
    set?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    disconnect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    delete?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    connect?: Prisma.AthleteContactWhereUniqueInput | Prisma.AthleteContactWhereUniqueInput[];
    update?: Prisma.AthleteContactUpdateWithWhereUniqueWithoutAthleteInput | Prisma.AthleteContactUpdateWithWhereUniqueWithoutAthleteInput[];
    updateMany?: Prisma.AthleteContactUpdateManyWithWhereWithoutAthleteInput | Prisma.AthleteContactUpdateManyWithWhereWithoutAthleteInput[];
    deleteMany?: Prisma.AthleteContactScalarWhereInput | Prisma.AthleteContactScalarWhereInput[];
};
export type AthleteContactCreateWithoutAthleteInput = {
    id?: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteContactUncheckedCreateWithoutAthleteInput = {
    id?: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteContactCreateOrConnectWithoutAthleteInput = {
    where: Prisma.AthleteContactWhereUniqueInput;
    create: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput>;
};
export type AthleteContactCreateManyAthleteInputEnvelope = {
    data: Prisma.AthleteContactCreateManyAthleteInput | Prisma.AthleteContactCreateManyAthleteInput[];
};
export type AthleteContactUpsertWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.AthleteContactWhereUniqueInput;
    update: Prisma.XOR<Prisma.AthleteContactUpdateWithoutAthleteInput, Prisma.AthleteContactUncheckedUpdateWithoutAthleteInput>;
    create: Prisma.XOR<Prisma.AthleteContactCreateWithoutAthleteInput, Prisma.AthleteContactUncheckedCreateWithoutAthleteInput>;
};
export type AthleteContactUpdateWithWhereUniqueWithoutAthleteInput = {
    where: Prisma.AthleteContactWhereUniqueInput;
    data: Prisma.XOR<Prisma.AthleteContactUpdateWithoutAthleteInput, Prisma.AthleteContactUncheckedUpdateWithoutAthleteInput>;
};
export type AthleteContactUpdateManyWithWhereWithoutAthleteInput = {
    where: Prisma.AthleteContactScalarWhereInput;
    data: Prisma.XOR<Prisma.AthleteContactUpdateManyMutationInput, Prisma.AthleteContactUncheckedUpdateManyWithoutAthleteInput>;
};
export type AthleteContactScalarWhereInput = {
    AND?: Prisma.AthleteContactScalarWhereInput | Prisma.AthleteContactScalarWhereInput[];
    OR?: Prisma.AthleteContactScalarWhereInput[];
    NOT?: Prisma.AthleteContactScalarWhereInput | Prisma.AthleteContactScalarWhereInput[];
    id?: Prisma.StringFilter<"AthleteContact"> | string;
    athleteId?: Prisma.StringFilter<"AthleteContact"> | string;
    name?: Prisma.StringFilter<"AthleteContact"> | string;
    relationship?: Prisma.StringFilter<"AthleteContact"> | string;
    email?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    phone?: Prisma.StringNullableFilter<"AthleteContact"> | string | null;
    role?: Prisma.EnumRoleFilter<"AthleteContact"> | $Enums.Role;
    createdAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"AthleteContact"> | Date | string;
};
export type AthleteContactCreateManyAthleteInput = {
    id?: string;
    name: string;
    relationship: string;
    email?: string | null;
    phone?: string | null;
    role: $Enums.Role;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type AthleteContactUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactUncheckedUpdateWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactUncheckedUpdateManyWithoutAthleteInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    relationship?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    role?: Prisma.EnumRoleFieldUpdateOperationsInput | $Enums.Role;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type AthleteContactSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    name?: boolean;
    relationship?: boolean;
    email?: boolean;
    phone?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["athleteContact"]>;
export type AthleteContactSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    name?: boolean;
    relationship?: boolean;
    email?: boolean;
    phone?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["athleteContact"]>;
export type AthleteContactSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    athleteId?: boolean;
    name?: boolean;
    relationship?: boolean;
    email?: boolean;
    phone?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["athleteContact"]>;
export type AthleteContactSelectScalar = {
    id?: boolean;
    athleteId?: boolean;
    name?: boolean;
    relationship?: boolean;
    email?: boolean;
    phone?: boolean;
    role?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type AthleteContactOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "athleteId" | "name" | "relationship" | "email" | "phone" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["athleteContact"]>;
export type AthleteContactInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type AthleteContactIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type AthleteContactIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    athlete?: boolean | Prisma.AthleteDefaultArgs<ExtArgs>;
};
export type $AthleteContactPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AthleteContact";
    objects: {
        athlete: Prisma.$AthletePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        athleteId: string;
        name: string;
        relationship: string;
        email: string | null;
        phone: string | null;
        role: $Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["athleteContact"]>;
    composites: {};
};
export type AthleteContactGetPayload<S extends boolean | null | undefined | AthleteContactDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload, S>;
export type AthleteContactCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AthleteContactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AthleteContactCountAggregateInputType | true;
};
export interface AthleteContactDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AthleteContact'];
        meta: {
            name: 'AthleteContact';
        };
    };
    /**
     * Find zero or one AthleteContact that matches the filter.
     * @param {AthleteContactFindUniqueArgs} args - Arguments to find a AthleteContact
     * @example
     * // Get one AthleteContact
     * const athleteContact = await prisma.athleteContact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AthleteContactFindUniqueArgs>(args: Prisma.SelectSubset<T, AthleteContactFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one AthleteContact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AthleteContactFindUniqueOrThrowArgs} args - Arguments to find a AthleteContact
     * @example
     * // Get one AthleteContact
     * const athleteContact = await prisma.athleteContact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AthleteContactFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AthleteContactFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AthleteContact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactFindFirstArgs} args - Arguments to find a AthleteContact
     * @example
     * // Get one AthleteContact
     * const athleteContact = await prisma.athleteContact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AthleteContactFindFirstArgs>(args?: Prisma.SelectSubset<T, AthleteContactFindFirstArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first AthleteContact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactFindFirstOrThrowArgs} args - Arguments to find a AthleteContact
     * @example
     * // Get one AthleteContact
     * const athleteContact = await prisma.athleteContact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AthleteContactFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AthleteContactFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more AthleteContacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AthleteContacts
     * const athleteContacts = await prisma.athleteContact.findMany()
     *
     * // Get first 10 AthleteContacts
     * const athleteContacts = await prisma.athleteContact.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const athleteContactWithIdOnly = await prisma.athleteContact.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AthleteContactFindManyArgs>(args?: Prisma.SelectSubset<T, AthleteContactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a AthleteContact.
     * @param {AthleteContactCreateArgs} args - Arguments to create a AthleteContact.
     * @example
     * // Create one AthleteContact
     * const AthleteContact = await prisma.athleteContact.create({
     *   data: {
     *     // ... data to create a AthleteContact
     *   }
     * })
     *
     */
    create<T extends AthleteContactCreateArgs>(args: Prisma.SelectSubset<T, AthleteContactCreateArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many AthleteContacts.
     * @param {AthleteContactCreateManyArgs} args - Arguments to create many AthleteContacts.
     * @example
     * // Create many AthleteContacts
     * const athleteContact = await prisma.athleteContact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AthleteContactCreateManyArgs>(args?: Prisma.SelectSubset<T, AthleteContactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many AthleteContacts and returns the data saved in the database.
     * @param {AthleteContactCreateManyAndReturnArgs} args - Arguments to create many AthleteContacts.
     * @example
     * // Create many AthleteContacts
     * const athleteContact = await prisma.athleteContact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many AthleteContacts and only return the `id`
     * const athleteContactWithIdOnly = await prisma.athleteContact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AthleteContactCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AthleteContactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a AthleteContact.
     * @param {AthleteContactDeleteArgs} args - Arguments to delete one AthleteContact.
     * @example
     * // Delete one AthleteContact
     * const AthleteContact = await prisma.athleteContact.delete({
     *   where: {
     *     // ... filter to delete one AthleteContact
     *   }
     * })
     *
     */
    delete<T extends AthleteContactDeleteArgs>(args: Prisma.SelectSubset<T, AthleteContactDeleteArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one AthleteContact.
     * @param {AthleteContactUpdateArgs} args - Arguments to update one AthleteContact.
     * @example
     * // Update one AthleteContact
     * const athleteContact = await prisma.athleteContact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AthleteContactUpdateArgs>(args: Prisma.SelectSubset<T, AthleteContactUpdateArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more AthleteContacts.
     * @param {AthleteContactDeleteManyArgs} args - Arguments to filter AthleteContacts to delete.
     * @example
     * // Delete a few AthleteContacts
     * const { count } = await prisma.athleteContact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AthleteContactDeleteManyArgs>(args?: Prisma.SelectSubset<T, AthleteContactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AthleteContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AthleteContacts
     * const athleteContact = await prisma.athleteContact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AthleteContactUpdateManyArgs>(args: Prisma.SelectSubset<T, AthleteContactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more AthleteContacts and returns the data updated in the database.
     * @param {AthleteContactUpdateManyAndReturnArgs} args - Arguments to update many AthleteContacts.
     * @example
     * // Update many AthleteContacts
     * const athleteContact = await prisma.athleteContact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more AthleteContacts and only return the `id`
     * const athleteContactWithIdOnly = await prisma.athleteContact.updateManyAndReturn({
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
    updateManyAndReturn<T extends AthleteContactUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AthleteContactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one AthleteContact.
     * @param {AthleteContactUpsertArgs} args - Arguments to update or create a AthleteContact.
     * @example
     * // Update or create a AthleteContact
     * const athleteContact = await prisma.athleteContact.upsert({
     *   create: {
     *     // ... data to create a AthleteContact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AthleteContact we want to update
     *   }
     * })
     */
    upsert<T extends AthleteContactUpsertArgs>(args: Prisma.SelectSubset<T, AthleteContactUpsertArgs<ExtArgs>>): Prisma.Prisma__AthleteContactClient<runtime.Types.Result.GetResult<Prisma.$AthleteContactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of AthleteContacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactCountArgs} args - Arguments to filter AthleteContacts to count.
     * @example
     * // Count the number of AthleteContacts
     * const count = await prisma.athleteContact.count({
     *   where: {
     *     // ... the filter for the AthleteContacts we want to count
     *   }
     * })
    **/
    count<T extends AthleteContactCountArgs>(args?: Prisma.Subset<T, AthleteContactCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AthleteContactCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a AthleteContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AthleteContactAggregateArgs>(args: Prisma.Subset<T, AthleteContactAggregateArgs>): Prisma.PrismaPromise<GetAthleteContactAggregateType<T>>;
    /**
     * Group by AthleteContact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AthleteContactGroupByArgs} args - Group by arguments.
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
    groupBy<T extends AthleteContactGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AthleteContactGroupByArgs['orderBy'];
    } : {
        orderBy?: AthleteContactGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AthleteContactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAthleteContactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the AthleteContact model
     */
    readonly fields: AthleteContactFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for AthleteContact.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__AthleteContactClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
 * Fields of the AthleteContact model
 */
export interface AthleteContactFieldRefs {
    readonly id: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly athleteId: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly name: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly relationship: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly email: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly phone: Prisma.FieldRef<"AthleteContact", 'String'>;
    readonly role: Prisma.FieldRef<"AthleteContact", 'Role'>;
    readonly createdAt: Prisma.FieldRef<"AthleteContact", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"AthleteContact", 'DateTime'>;
}
/**
 * AthleteContact findUnique
 */
export type AthleteContactFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which AthleteContact to fetch.
     */
    where: Prisma.AthleteContactWhereUniqueInput;
};
/**
 * AthleteContact findUniqueOrThrow
 */
export type AthleteContactFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which AthleteContact to fetch.
     */
    where: Prisma.AthleteContactWhereUniqueInput;
};
/**
 * AthleteContact findFirst
 */
export type AthleteContactFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which AthleteContact to fetch.
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AthleteContacts to fetch.
     */
    orderBy?: Prisma.AthleteContactOrderByWithRelationInput | Prisma.AthleteContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AthleteContacts.
     */
    cursor?: Prisma.AthleteContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AthleteContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AthleteContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AthleteContacts.
     */
    distinct?: Prisma.AthleteContactScalarFieldEnum | Prisma.AthleteContactScalarFieldEnum[];
};
/**
 * AthleteContact findFirstOrThrow
 */
export type AthleteContactFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which AthleteContact to fetch.
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AthleteContacts to fetch.
     */
    orderBy?: Prisma.AthleteContactOrderByWithRelationInput | Prisma.AthleteContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for AthleteContacts.
     */
    cursor?: Prisma.AthleteContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AthleteContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AthleteContacts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of AthleteContacts.
     */
    distinct?: Prisma.AthleteContactScalarFieldEnum | Prisma.AthleteContactScalarFieldEnum[];
};
/**
 * AthleteContact findMany
 */
export type AthleteContactFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which AthleteContacts to fetch.
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of AthleteContacts to fetch.
     */
    orderBy?: Prisma.AthleteContactOrderByWithRelationInput | Prisma.AthleteContactOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing AthleteContacts.
     */
    cursor?: Prisma.AthleteContactWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` AthleteContacts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` AthleteContacts.
     */
    skip?: number;
    distinct?: Prisma.AthleteContactScalarFieldEnum | Prisma.AthleteContactScalarFieldEnum[];
};
/**
 * AthleteContact create
 */
export type AthleteContactCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a AthleteContact.
     */
    data: Prisma.XOR<Prisma.AthleteContactCreateInput, Prisma.AthleteContactUncheckedCreateInput>;
};
/**
 * AthleteContact createMany
 */
export type AthleteContactCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many AthleteContacts.
     */
    data: Prisma.AthleteContactCreateManyInput | Prisma.AthleteContactCreateManyInput[];
};
/**
 * AthleteContact createManyAndReturn
 */
export type AthleteContactCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AthleteContact
     */
    select?: Prisma.AthleteContactSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AthleteContact
     */
    omit?: Prisma.AthleteContactOmit<ExtArgs> | null;
    /**
     * The data used to create many AthleteContacts.
     */
    data: Prisma.AthleteContactCreateManyInput | Prisma.AthleteContactCreateManyInput[];
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteContactIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * AthleteContact update
 */
export type AthleteContactUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a AthleteContact.
     */
    data: Prisma.XOR<Prisma.AthleteContactUpdateInput, Prisma.AthleteContactUncheckedUpdateInput>;
    /**
     * Choose, which AthleteContact to update.
     */
    where: Prisma.AthleteContactWhereUniqueInput;
};
/**
 * AthleteContact updateMany
 */
export type AthleteContactUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update AthleteContacts.
     */
    data: Prisma.XOR<Prisma.AthleteContactUpdateManyMutationInput, Prisma.AthleteContactUncheckedUpdateManyInput>;
    /**
     * Filter which AthleteContacts to update
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * Limit how many AthleteContacts to update.
     */
    limit?: number;
};
/**
 * AthleteContact updateManyAndReturn
 */
export type AthleteContactUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AthleteContact
     */
    select?: Prisma.AthleteContactSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the AthleteContact
     */
    omit?: Prisma.AthleteContactOmit<ExtArgs> | null;
    /**
     * The data used to update AthleteContacts.
     */
    data: Prisma.XOR<Prisma.AthleteContactUpdateManyMutationInput, Prisma.AthleteContactUncheckedUpdateManyInput>;
    /**
     * Filter which AthleteContacts to update
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * Limit how many AthleteContacts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.AthleteContactIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * AthleteContact upsert
 */
export type AthleteContactUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the AthleteContact to update in case it exists.
     */
    where: Prisma.AthleteContactWhereUniqueInput;
    /**
     * In case the AthleteContact found by the `where` argument doesn't exist, create a new AthleteContact with this data.
     */
    create: Prisma.XOR<Prisma.AthleteContactCreateInput, Prisma.AthleteContactUncheckedCreateInput>;
    /**
     * In case the AthleteContact was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.AthleteContactUpdateInput, Prisma.AthleteContactUncheckedUpdateInput>;
};
/**
 * AthleteContact delete
 */
export type AthleteContactDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which AthleteContact to delete.
     */
    where: Prisma.AthleteContactWhereUniqueInput;
};
/**
 * AthleteContact deleteMany
 */
export type AthleteContactDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which AthleteContacts to delete
     */
    where?: Prisma.AthleteContactWhereInput;
    /**
     * Limit how many AthleteContacts to delete.
     */
    limit?: number;
};
/**
 * AthleteContact without action
 */
export type AthleteContactDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=AthleteContact.d.ts.map