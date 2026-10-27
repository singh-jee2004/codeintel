"use client";

import React, { useState } from "react";
import {
    FileCode2,
    Sparkles
} from "lucide-react";
import { TechnicalDebtItem } from "@/types/codeintel";

interface QualityViewProps {
    debtItems: TechnicalDebtItem[];
    qualityScore: number;
}

export function QualityView({ debtItems, qualityScore }: QualityViewProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const totalEstimatedHours = debtItems.length * 6; // average refactor estimate

    const filteredItems = selectedCategory === "all"
        ? debtItems
        : debtItems.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase());

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case "urgent": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
            case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
            case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        }
    };

    return (
        <div className="space-y-6">
            {/* Vitals Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Quality Index</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-black font-mono text-white">{qualityScore}</span>
                        <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 block">Good Maintainability</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-amber-400 uppercase">Identified Debt Items</span>
                    <p className="text-3xl font-black font-mono text-white mt-2">{debtItems.length}</p>
                    <span className="text-[11px] text-slate-500">Modules needing refactoring</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-cyan-400 uppercase">Estimated Dev Effort</span>
                    <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-3xl font-black font-mono text-cyan-400">~{totalEstimatedHours}</span>
                        <span className="text-xs text-slate-400">Hours</span>
                    </div>
                    <span className="text-[11px] text-slate-500">To clear urgent backlog</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-indigo-400 uppercase">Max Cyclomatic Risk</span>
                    <p className="text-3xl font-black font-mono text-indigo-400 mt-2">28</p>
                    <span className="text-[11px] text-slate-500">rbac.evaluator (Safe &le; 10)</span>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="flex items-center gap-2 bg-[#0c1222] border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 mr-2">Category:</span>
                {["all", "Architecture", "Complexity", "Duplication"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${selectedCategory === cat
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Debt Cards */}
            <div className="space-y-4">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-lg space-y-4"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                                    <FileCode2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h3 className="font-bold text-white text-sm">{item.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getPriorityBadge(item.priority)}`}>
                                            {item.priority}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                                            {item.category}
                                        </span>
                                    </div>
                                    <p className="font-mono text-xs text-cyan-400 mt-1">
                                        {item.affectedModule}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-[10px] text-slate-500 block uppercase">Debt Impact</span>
                                <span className="text-sm font-bold font-mono text-amber-400">
                                    {item.impactScore} / 10
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            {item.description}
                        </p>

                        <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="text-[11px] font-bold text-cyan-300 block">
                                    Recommended Action Plan:
                                </span>
                                <p className="text-xs text-slate-300 mt-0.5">
                                    {item.remediationAction}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
