"use client";

import React from "react";
import {
    LayoutDashboard,
    Network,
    ShieldAlert,
    FileCode2,
    Layers,
    Bot,
    GitPullRequest,
    BookOpen,
    Search,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

export type TabType =
    | "overview"
    | "architecture"
    | "security"
    | "quality"
    | "dependencies"
    | "search"
    | "assistant"
    | "pull-requests"
    | "docs";

interface SidebarProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    securityCount: number;
}

export function Sidebar({ activeTab, setActiveTab, securityCount }: SidebarProps) {
    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "architecture", label: "Architecture Graph", icon: Network, badge: "Interactive" },
        { id: "security", label: "Security & Secrets", icon: ShieldAlert, count: securityCount },
        { id: "quality", label: "Quality & Tech Debt", icon: FileCode2 },
        { id: "dependencies", label: "Dependencies", icon: Layers },
        { id: "search", label: "Code & Symbol Search", icon: Search },
        { id: "assistant", label: "AI Repo Assistant", icon: Bot, isAi: true },
        { id: "pull-requests", label: "PR Risk Review", icon: GitPullRequest },
        { id: "docs", label: "Doc Generator", icon: BookOpen },
    ];

    return (
        <aside className="w-64 border-r border-slate-800/80 bg-[#090d16] flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        CodeIntel
                    </span>
                    <span className="block text-[10px] text-cyan-400 font-mono uppercase tracking-widest -mt-1">
                        Engineered v1.0
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Intelligence Suite
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={cn(
                                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/5"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon
                                    className={cn(
                                        "w-4 h-4 transition-colors",
                                        isActive
                                            ? "text-cyan-400"
                                            : item.isAi
                                                ? "text-indigo-400"
                                                : "text-slate-400 group-hover:text-slate-200"
                                    )}
                                />
                                <span>{item.label}</span>
                            </div>

                            {item.count !== undefined && item.count > 0 && (
                                <span className="px-1.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    {item.count}
                                </span>
                            )}

                            {item.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer Info / Github Sync */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <GithubIcon className="w-4 h-4 text-slate-300" />
                    <div className="truncate">
                        <p className="text-slate-200 font-medium truncate">GitHub Connected</p>
                        <p className="text-[11px] text-slate-500">OAuth App Verified</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
