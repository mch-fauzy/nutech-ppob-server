interface Filter {
    selectFields?: string[];
    filterFields?: FilterField[];
    pagination?: Pagination;
    sorts?: Sort[];
}
interface FilterField {
    field: string;
    operator: 'equals' | 'not' | 'contains' | 'null';
    value: string | number | boolean | null;
}
interface Pagination {
    page: number;
    pageSize?: number;
}
interface Sort {
    field: string;
    order: 'asc' | 'desc';
}
export { Filter };
