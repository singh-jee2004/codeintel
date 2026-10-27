// ==========================================
// 1. Core Repository & Metrics Models
// ==========================================

export interface HealthScoreBreakdown {
    overall: number; // 0 - 100
    security: number;
    architecture: number;
    codeQuality: number;
    dependencies: number;
    maintainability: number;
    documentation: number;
    testCoverage: number;
}

export interface RepositoryStats {
    filesCount: number;
    linesOfCode: number;
    languages: { name: string; percentage: number; color: string }[];
    branchesCount: number;
    contributorsCount: number;
}

export interface Repository {
    id: string;
    name: string;
    fullName: string; // e.g. "facebook/react"
    description: string;
    defaultBranch: string;
    primaryLanguage: string;
    stars: number;
    forks: number;
    openIssues: number;
    lastAnalyzedAt: string;
    healthScores: HealthScoreBreakdown;
    stats: RepositoryStats;
    isPrivate: boolean;
}

// ==========================================
// 2. Security Findings
// ==========================================

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export interface SecurityFinding {
    id: string;
    title: string;
    severity: SeverityLevel;
    category: "Secret Leak" | "SQL Injection" | "XSS" | "CORS Misconfig" | "Auth Flaw" | "Insecure Dependency";
    file: string;
    line: number;
    codeSnippet?: string;
    description: string;
    impact: string;
    remediation: string;
    isConfirmed: boolean;
    discoveredAt: string;
}

// ==========================================
// 3. Code Quality & Technical Debt
// ==========================================

export type DebtPriority = "urgent" | "high" | "medium" | "low";

export interface CodeQualityIssue {
    id: string;
    file: string;
    line?: number;
    functionName?: string;
    type: "cyclomatic_complexity" | "oversized_module" | "duplicate_code" | "dead_code" | "poor_error_handling";
    cyclomaticComplexity?: number; // e.g., 24 (threshold 10)
    impact: string;
    recommendation: string;
    estimatedRefactorHours: number;
}

export interface TechnicalDebtItem {
    id: string;
    title: string;
    priority: DebtPriority;
    category: "Architecture" | "Duplication" | "Complexity" | "Dependencies" | "Documentation";
    affectedModule: string;
    description: string;
    remediationAction: string;
    impactScore: number; // 1 - 10
}

// ==========================================
// 4. Architecture Graph (React Flow Compatible)
// ==========================================

export type ArchitectureNodeType =
    | "frontend"
    | "api_gateway"
    | "microservice"
    | "database"
    | "cache"
    | "external_api"
    | "queue";

export interface ArchitectureNodeData {
    label: string;
    type: ArchitectureNodeType;
    files: string[];
    responsibilities: string[];
    riskLevel: "low" | "medium" | "high";
    metrics: {
        complexityScore: number;
        linesOfCode: number;
        dependenciesCount: number;
    };
    technologies: string[];
}

export interface ArchitectureEdgeData {
    relation: "calls" | "queries" | "publishes" | "subscribes" | "imports";
    latencyRisk?: "low" | "medium" | "high";
}

// ==========================================
// 5. Dependency Intelligence
// ==========================================

export interface DependencyItem {
    id: string;
    name: string;
    currentVersion: string;
    latestVersion: string;
    isOutdated: boolean;
    hasVulnerability: boolean;
    vulnerabilitySeverity?: SeverityLevel;
    advisoryTitle?: string;
    license: string;
    isDirect: boolean; // direct vs transitive
    dependentsCount: number;
}

// ==========================================
// 6. AI Codebase Assistant & RAG
// ==========================================

export interface SourceReference {
    file: string;
    lines?: string; // e.g. "14-38"
    symbolName?: string;
}

export interface AIMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    citations?: SourceReference[];
    refactoringSuggestion?: {
        file: string;
        beforeCode: string;
        afterCode: string;
        explanation: string;
    };
}

// ==========================================
// 7. Pull Request Analysis
// ==========================================

export interface PullRequestAnalysis {
    id: string;
    prNumber: number;
    title: string;
    author: string;
    riskScore: number; // 0 - 100
    riskSummary: string;
    changedFiles: {
        path: string;
        additions: number;
        deletions: number;
        risk: "low" | "medium" | "high";
        flags: string[];
    }[];
    aiReviewComments: {
        file: string;
        line: number;
        comment: string;
        suggestedFix?: string;
    }[];
}
