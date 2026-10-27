"use client";

import React, { useState } from "react";
import {
    GitBranch,
    ChevronDown,
    Play,
    CheckCircle2,
    Loader2,
    Lock,
    Globe,
    Sparkles,
    X,
    Plus
} from "lucide-react";
import { Repository } from "@/types/codeintel";
import { getHealthGrade } from "@/lib/utils";

interface HeaderProps {
    repositories: Repository[];
    currentRepo: Repository | null;
    onSelectRepo: (repo: Repository) => void;
    onOpenAddModal: () => void;
}

export function Header({ repositories, currentRepo, onSelectRepo, onOpenAddModal }: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanStep, setScanStep] = useState(0);

    const grade = currentRepo ? getHealthGrade(currentRepo.healthScores.overall) : null;

    const pipelineStages = [
        "Cloning repository & file manifest indexing...",
        "AST parsing syntax trees (TypeScript, Go, Python)...",
        "Extracting symbol relations & dependency graph...",
        "Static security analysis & secret scanner (Gitleaks/Semgrep)...",
        "Running cyclomatic complexity & debt estimation...",
        "Building interactive architecture topology...",
        "Generating AI contextual embeddings for RAG...",
        "Intelligence report compiled & ready!",
    ];

    const handleStartScan = () => {
        setIsScanning(true);
        setScanStep(0);

        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            if (current < pipelineStages.length) {
                setScanStep(current);
            } else {
                clearInterval(interval);
                setTimeout(() => setIsScanning(false), 800);
            }
        }, 600);
    };

    return (
        <>
            <header className="h-16 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 ml-64">
                {/* Repo Selector Dropdown */}
                <div className="relative">
                    {currentRepo ? (
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 transition-colors"
                        >
                            {currentRepo.isPrivate ? (
                                <Lock className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Globe className="w-4 h-4 text-emerald-400" />
                            )}
                            <span className="font-semibold text-sm text-slate-100">
                                {currentRepo.fullName}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-slate-400 font-mono border-l border-slate-800 pl-2">
                                <GitBranch className="w-3.5 h-3.5" />
                                <span>{currentRepo.defaultBranch}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    ) : (
                        <button
                            onClick={onOpenAddModal}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-sm font-semibold transition cursor-pointer"
                        >
                            <Plus className="w-4 h-4 text-cyan-400" />
                            <span>Connect Repository</span>
                        </button>
                    )}

                    {dropdownOpen && (
                        <div className="absolute left-0 mt-2 w-80 rounded-xl border border-slate-800 bg-[#0c1222] shadow-2xl z-50 p-1.5">
                            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase flex items-center justify-between">
                                <span>Connected Repositories</span>
                                <span className="font-mono text-cyan-400">{repositories.length}</span>
                            </div>
                            {repositories.map((repo) => (
                                <button
                                    key={repo.id}
                                    onClick={() => {
                                        onSelectRepo(repo);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between hover:bg-slate-800/60 transition ${currentRepo?.id === repo.id ? "bg-slate-800/90 text-cyan-400" : "text-slate-300"
                                        }`}
                                >
                                    <div className="truncate">
                                        <p className="font-medium text-sm truncate">{repo.fullName}</p>
                                        <p className="text-xs text-slate-500">{repo.primaryLanguage} • {repo.stats.filesCount} files</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${getHealthGrade(repo.healthScores.overall).color}`}>
                                        {repo.healthScores.overall}
                                    </span>
                                </button>
                            ))}

                            <div className="pt-1 mt-1 border-t border-slate-800">
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onOpenAddModal();
                                    }}
                                    className="w-full text-left p-2 rounded-lg flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/10 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Connect New GitHub Repository</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Health Score Pill & Actions */}
                <div className="flex items-center gap-4">
                    {grade && currentRepo && (
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-800/80 bg-slate-900/60">
                            <span className="text-xs text-slate-400">Health Index:</span>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${grade.color}`}>
                                    {grade.grade} ({currentRepo.healthScores.overall}/100)
                                </span>
                                <span className="text-xs text-slate-400">{grade.label}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onOpenAddModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Add Repo</span>
                    </button>

                    {currentRepo && (
                        <button
                            onClick={handleStartScan}
                            disabled={isScanning}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition cursor-pointer"
                        >
                            {isScanning ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                            <span>Re-scan</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Analysis Pipeline Modal (PRD Section 41) */}
            {isScanning && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0c1222] border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-500/10">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                                <h3 className="font-semibold text-slate-100">Running Repository Intelligence Pipeline</h3>
                            </div>
                            <button onClick={() => setIsScanning(false)} className="text-slate-500 hover:text-slate-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="py-6 space-y-3">
                            {pipelineStages.map((stage, idx) => {
                                const isPassed = idx < scanStep;
                                const isCurrent = idx === scanStep;

                                return (
                                    <div key={idx} className="flex items-center gap-3 text-xs">
                                        {isPassed ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        ) : isCurrent ? (
                                            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                                        )}
                                        <span className={isCurrent ? "text-cyan-300 font-medium" : isPassed ? "text-slate-400" : "text-slate-600"}>
                                            {stage}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
                                style={{ width: `${((scanStep + 1) / pipelineStages.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
