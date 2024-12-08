interface Filter {
    selectFields?: string[];
    filterFields?: FilterField[];
    pagination?: Pagination;
    sorts?: Sort[];
}

interface FilterField {
    field: string;
    operator: 'equals' | 'not' | 'contains' | 'null';
    value: string | number | boolean;
}

interface Pagination {
    page: number;
    pageSize: number;
}

interface Sort {
    field: string;
    order: string;
}

export { Filter };
