"use client";

import React from "react";
import {
    GitPullRequest,
    AlertTriangle,
    FileCode,
    Sparkles,
    User
} from "lucide-react";
import { PullRequestAnalysis } from "@/types/codeintel";

interface PullRequestsViewProps {
    pullRequests: PullRequestAnalysis[];
}

export function PullRequestsView({ pullRequests }: PullRequestsViewProps) {
    const pr = pullRequests[0]; // Active PR for demo

    return (
        <div className="space-y-6">
            {/* Top PR Header */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                            <GitPullRequest className="w-4 h-4 text-cyan-400" />
                            <span>PR #{pr.prNumber}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 flex items-center gap-1">
                                <User className="w-3 h-3" /> {pr.author}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-white">{pr.title}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
                            <span className="text-[10px] text-slate-400 uppercase block">PR Risk Score</span>
                            <span className="text-lg font-black font-mono text-rose-400">
                                {pr.riskScore} / 100
                            </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            HIGH RISK
                        </span>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/30 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-rose-200 leading-relaxed">
                        {pr.riskSummary}
                    </p>
                </div>
            </div>

            {/* Changed Files & AI Review Comments Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Changed Files with Risk Ratings */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400" />
                        Changed Files & Impact ({pr.changedFiles.length})
                    </h3>

                    <div className="space-y-3">
                        {pr.changedFiles.map((file, i) => (
                            <div
                                key={i}
                                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-slate-200 truncate">{file.path}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${file.risk === "high"
                                            ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                        }`}>
                                        {file.risk}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                                    <span className="text-emerald-400">+{file.additions} lines</span>
                                    <span className="text-rose-400">-{file.deletions} lines</span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {file.flags.map((flag, idx) => (
                                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                                            {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Pull Request Reviewer Output */}
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-6 shadow-xl space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        AI Automated Code Review Comments
                    </h3>

                    <div className="space-y-4">
                        {pr.aiReviewComments.map((comment, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2.5"
                            >
                                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 border-b border-slate-800 pb-2">
                                    <span>{comment.file}:{comment.line}</span>
                                    <span className="text-[10px] text-slate-500 font-sans">Automated Finding</span>
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {comment.comment}
                                </p>

                                {comment.suggestedFix && (
                                    <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800/80 font-mono text-[11px] text-emerald-300">
                                        <span className="block text-[10px] text-emerald-400 font-bold mb-1">
                                            Suggested Fix:
                                        </span>
                                        <pre className="overflow-x-auto"><code>{comment.suggestedFix}</code></pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
