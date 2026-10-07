import type { KnowledgeStatus } from './knowledge';

export type ProgressStats = {
    total: number;
    captured: number;
    understood: number;
    complete: number;
};

export type GrowthPoint = {
    date: string;
    created: number;
    cumulative: number;
};

export type KnowledgeSummary = {
    id: number;
    title: string;
    definition_snippet: string;
    status: KnowledgeStatus;
    updated_at: string | null;
};

export type RecentInsight = {
    id: number;
    content: string;
    created_at: string | null;
    knowledge: { id: number; title: string } | null;
};

export type CategoryStat = {
    id: number;
    name: string;
    color: string;
    icon: string;
    knowledge_count: number;
};

export type DashboardProps = {
    progress: ProgressStats;
    growth: GrowthPoint[];
    recentKnowledge: KnowledgeSummary[];
    recentInsights: RecentInsight[];
    topCategories: CategoryStat[];
};
