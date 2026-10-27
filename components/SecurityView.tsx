"use client";

import React, { useState } from "react";
import {
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    FileCode,
    Search,
    ChevronDown,
    ChevronUp,
    Sparkles
} from "lucide-react";
import { SecurityFinding, SeverityLevel } from "@/types/codeintel";

interface SecurityViewProps {
    findings: SecurityFinding[];
    securityScore: number;
}

export function SecurityView({ findings, securityScore }: SecurityViewProps) {
    const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(findings[0]?.id || null);

    const severityCounts = {
        critical: findings.filter(f => f.severity === "critical").length,
        high: findings.filter(f => f.severity === "high").length,
        medium: findings.filter(f => f.severity === "medium").length,
        low: findings.filter(f => f.severity === "low").length,
    };

    const filteredFindings = findings.filter(f => {
        const matchesSeverity = selectedSeverity === "all" || f.severity === selectedSeverity;
        const matchesQuery =
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSeverity && matchesQuery;
    });

    const getSeverityBadge = (sev: SeverityLevel) => {
        switch (sev) {
            case "critical":
                return "bg-rose-500/20 text-rose-400 border-rose-500/30";
            case "high":
                return "bg-orange-500/20 text-orange-400 border-orange-500/30";
            case "medium":
                return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "low":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            default:
                return "bg-slate-500/20 text-slate-400 border-slate-500/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Banner: Score & Severity Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Security Health Score */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase">Security Score</span>
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-black font-mono text-white">{securityScore}</span>
                        <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <span className="text-[11px] text-rose-400 mt-1">Requires Remediation</span>
                </div>

                {/* Critical */}
                <button
                    onClick={() => setSelectedSeverity(selectedSeverity === "critical" ? "all" : "critical")}
                    className={`rounded-2xl border p-5 text-left transition shadow-lg ${selectedSeverity === "critical"
                            ? "border-rose-500 bg-rose-500/10"
                            : "border-slate-800 bg-[#0c1222] hover:border-slate-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-400 uppercase">Critical</span>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>
                    <p className="text-3xl font-black font-mono text-white mt-2">{severityCounts.critical}</p>
                    <span className="text-[11px] text-slate-500">Immediate threat</span>
                </button>

                {/* High */}
                <button
                    onClick={() => setSelectedSeverity(selectedSeverity === "high" ? "all" : "high")}
                    className={`rounded-2xl border p-5 text-left transition shadow-lg ${selectedSeverity === "high"
                            ? "border-orange-500 bg-orange-500/10"
                            : "border-slate-800 bg-[#0c1222] hover:border-slate-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-400 uppercase">High</span>
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <p className="text-3xl font-black font-mono text-white mt-2">{severityCounts.high}</p>
                    <span className="text-[11px] text-slate-500">Exploitable logic</span>
                </button>

                {/* Medium */}
                <button
                    onClick={() => setSelectedSeverity(selectedSeverity === "medium" ? "all" : "medium")}
                    className={`rounded-2xl border p-5 text-left transition shadow-lg ${selectedSeverity === "medium"
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-slate-800 bg-[#0c1222] hover:border-slate-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase">Medium</span>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-3xl font-black font-mono text-white mt-2">{severityCounts.medium}</p>
                    <span className="text-[11px] text-slate-500">Policy weakness</span>
                </button>

                {/* Low / Info */}
                <button
                    onClick={() => setSelectedSeverity(selectedSeverity === "low" ? "all" : "low")}
                    className={`rounded-2xl border p-5 text-left transition shadow-lg ${selectedSeverity === "low"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-800 bg-[#0c1222] hover:border-slate-700"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-400 uppercase">Low</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-black font-mono text-white mt-2">{severityCounts.low}</p>
                    <span className="text-[11px] text-slate-500">Best practice gap</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c1222] border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 mr-2">Severity:</span>
                    {(["all", "critical", "high", "medium", "low"] as const).map((sev) => (
                        <button
                            key={sev}
                            onClick={() => setSelectedSeverity(sev)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${selectedSeverity === sev
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                                }`}
                        >
                            {sev}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search findings or files..."
                        className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-64"
                    />
                </div>
            </div>

            {/* Findings Accordion List */}
            <div className="space-y-4">
                {filteredFindings.map((finding) => {
                    const isExpanded = expandedId === finding.id;

                    return (
                        <div
                            key={finding.id}
                            className={`rounded-2xl border transition shadow-lg ${isExpanded
                                    ? "border-slate-700 bg-[#0c1222]"
                                    : "border-slate-800/80 bg-[#0c1222]/60 hover:border-slate-700"
                                }`}
                        >
                            {/* Finding Header */}
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                                className="p-5 flex items-center justify-between cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase border ${getSeverityBadge(finding.severity)}`}>
                                        {finding.severity}
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                                            {finding.title}
                                            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                                                {finding.category}
                                            </span>
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                                            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                                            <span>{finding.file}:{finding.line}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-slate-500">
                                        {finding.isConfirmed ? "Confirmed Vulnerability" : "Potential Finding"}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                </div>
                            </div>

                            {/* Finding Expanded Detail */}
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                                    {/* Vulnerable Code Snippet */}
                                    {finding.codeSnippet && (
                                        <div>
                                            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
                                                Flagged Code Pattern:
                                            </span>
                                            <pre className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto">
                                                <code>{finding.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Impact Analysis */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                                            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                                Threat Impact & Blast Radius
                                            </span>
                                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                                {finding.impact}
                                            </p>
                                        </div>

                                        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/30">
                                            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                                AI Remediation Guidance
                                            </span>
                                            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                                {finding.remediation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredFindings.length === 0 && (
                    <div className="p-12 text-center text-slate-500 text-xs bg-[#0c1222] border border-slate-800 rounded-2xl">
                        No security findings matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
