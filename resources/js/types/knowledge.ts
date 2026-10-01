export type KnowledgeStatus = 'captured' | 'understood' | 'complete';

export type Category = {
    id: number;
    name: string;
    color: string;
    icon: string;
};

export type KnowledgeInsight = {
    id: number;
    content: string;
    created_at: string | null;
    updated_at: string | null;
};

export type KnowledgeVersion = {
    id: number;
    version: number;
    content: string;
    created_at: string | null;
};

export type KnowledgeListItem = {
    id: number;
    title: string;
    definition_snippet: string;
    status: KnowledgeStatus;
    created_at: string | null;
    categories: Category[];
};

export type KnowledgeDetail = {
    id: number;
    title: string;
    definition: string;
    my_understanding: string | null;
    source: string | null;
    url: string | null;
    status: KnowledgeStatus;
    created_at: string | null;
    updated_at: string | null;
    categories: Category[];
    insights: KnowledgeInsight[];
    definition_versions: KnowledgeVersion[];
    understanding_versions: KnowledgeVersion[];
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type KnowledgeFormData = {
    title: string;
    definition: string;
    my_understanding: string;
    source: string;
    url: string;
    category_ids: number[];
};
