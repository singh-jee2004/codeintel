"use client";

import React from "react";
import {
    ShieldAlert,
    Activity,
    Layers,
    Code2,
    FileCode,
    ArrowRight,
    TrendingUp,
    AlertTriangle
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell
} from "recharts";
import { Repository, SecurityFinding, TechnicalDebtItem } from "@/types/codeintel";
import { getHealthGrade, formatNumber } from "@/lib/utils";
import { TabType } from "./Sidebar";

interface OverviewViewProps {
    repo: Repository;
    securityFindings: SecurityFinding[];
    techDebt: TechnicalDebtItem[];
    onNavigateTab: (tab: TabType) => void;
}

export function OverviewView({
    repo,
    securityFindings,
    techDebt,
    onNavigateTab
}: OverviewViewProps) {
    const grade = getHealthGrade(repo.healthScores.overall);

    // Data for the category score breakdown chart
    const categoryData = [
        { name: "Architecture", score: repo.healthScores.architecture, color: "#06b6d4" },
        { name: "Code Quality", score: repo.healthScores.codeQuality, color: "#6366f1" },
        { name: "Maintainability", score: repo.healthScores.maintainability, color: "#8b5cf6" },
        { name: "Documentation", score: repo.healthScores.documentation, color: "#10b981" },
        { name: "Test Coverage", score: repo.healthScores.testCoverage, color: "#3b82f6" },
        { name: "Security", score: repo.healthScores.security, color: repo.healthScores.security < 80 ? "#f43f5e" : "#10b981" },
        { name: "Dependencies", score: repo.healthScores.dependencies, color: repo.healthScores.dependencies < 80 ? "#f59e0b" : "#10b981" },
    ];

    const criticalIssuesCount = securityFindings.filter(f => f.severity === "critical" || f.severity === "high").length;

    return (
        <div className="space-y-6">
            {/* Top Banner: Overall Health Score & Primary Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Composite Score Card */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-black/40">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Composite Repository Score
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${grade.color}`}>
                                Grade {grade.grade}
                            </span>
                        </div>

                        <div className="mt-4 flex items-baseline gap-3">
                            <span className="text-5xl font-black tracking-tight text-white font-mono">
                                {repo.healthScores.overall}
                            </span>
                            <span className="text-slate-500 text-lg">/ 100</span>
                        </div>

                        <p className="mt-2 text-sm text-slate-300">
                            System health is <span className="font-semibold text-cyan-400">{grade.label}</span>.
                            {criticalIssuesCount > 0 ? ` Found ${criticalIssuesCount} priority security finding(s) requiring remediation.` : " No critical blockers found."}
                        </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Last automated audit</span>
                        <span className="text-slate-200 font-mono">{repo.lastAnalyzedAt}</span>
                    </div>
                </div>

                {/* Repository Vitals */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 grid grid-cols-2 gap-4 shadow-lg shadow-black/40">
                    <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Code2 className="w-4 h-4 text-cyan-400" />
                            <span>Lines of Code</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-white mt-2">
                            {formatNumber(repo.stats.linesOfCode)}
                        </p>
                        <span className="text-[11px] text-slate-500">{repo.stats.filesCount} source files</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                            <span>Security Risks</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-rose-400 mt-2">
                            {securityFindings.length}
                        </p>
                        <span className="text-[11px] text-rose-400/80">{criticalIssuesCount} High / Critical</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <FileCode className="w-4 h-4 text-amber-400" />
                            <span>Tech Debt Items</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-amber-400 mt-2">
                            {techDebt.length}
                        </p>
                        <span className="text-[11px] text-slate-500">Architecture bottlenecks</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span>Test Coverage</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">
                            {repo.healthScores.testCoverage}%
                        </p>
                        <span className="text-[11px] text-slate-500">Automated suites</span>
                    </div>
                </div>

                {/* Language Breakdown */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-lg shadow-black/40 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Language Composition
                        </span>

                        {/* Language Segmented Bar */}
                        <div className="w-full h-3 rounded-full overflow-hidden flex mt-4 bg-slate-800">
                            {repo.stats.languages.map((lang) => (
                                <div
                                    key={lang.name}
                                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                                    title={`${lang.name}: ${lang.percentage}%`}
                                />
                            ))}
                        </div>

                        <div className="mt-4 space-y-2">
                            {repo.stats.languages.map((lang) => (
                                <div key={lang.name} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                        <span className="text-slate-300 font-medium">{lang.name}</span>
                                    </div>
                                    <span className="text-slate-400 font-mono">{lang.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
                        <span>Branch: <span className="text-slate-300 font-mono">{repo.defaultBranch}</span></span>
                        <span>Contributors: <span className="text-slate-300 font-mono">{repo.stats.contributorsCount}</span></span>
                    </div>
                </div>
            </div>

            {/* Category Performance Breakdown Chart */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-lg shadow-black/40">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-cyan-400" />
                            Category Health Breakdown
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Multi-dimensional analysis scores calculated from static analysis, dependency trees, and test heuristics.
                        </p>
                    </div>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderColor: '#334155',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: '#f8fafc'
                                }}
                            />
                            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Action Finding Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Urgent Security Finding Alert */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6 relative flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-400" />
                                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Top Priority Security Alert</span>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                CRITICAL
                            </span>
                        </div>

                        {securityFindings[0] && (
                            <div>
                                <h4 className="font-semibold text-white text-sm">
                                    {securityFindings[0].title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                    {securityFindings[0].description}
                                </p>
                                <div className="mt-3 px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-[11px] text-cyan-400 truncate">
                                    {securityFindings[0].file}:{securityFindings[0].line}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onNavigateTab("security")}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                    >
                        <span>View All {securityFindings.length} Security Findings</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Top Technical Debt Alert */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 relative flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Top Architectural Bottleneck</span>
                            </div>
                            <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                HIGH DEBT
                            </span>
                        </div>

                        {techDebt[0] && (
                            <div>
                                <h4 className="font-semibold text-white text-sm">
                                    {techDebt[0].title}
                                </h4>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                    {techDebt[0].description}
                                </p>
                                <div className="mt-3 px-3 py-1.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-[11px] text-amber-300 truncate">
                                    {techDebt[0].affectedModule}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => onNavigateTab("quality")}
                        className="mt-5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                    >
                        <span>Explore Technical Debt & Code Smells</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
