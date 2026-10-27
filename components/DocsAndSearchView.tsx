"use client";

import React, { useState } from "react";
import {
    BookOpen,
    Search,
    Copy,
    Check
} from "lucide-react";
import { Repository } from "@/types/codeintel";

interface DocsAndSearchViewProps {
    repo: Repository;
    mode: "docs" | "search";
}

export function DocsAndSearchView({ repo, mode }: DocsAndSearchViewProps) {
    const [docTab, setDocTab] = useState<"readme" | "arch" | "api" | "setup">("readme");
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const sampleDocs = {
        readme: `# ${repo.name}\n\n> ${repo.description}\n\n## 🛠️ Tech Stack\n- **Framework**: Next.js 16 (App Router), React 19, TypeScript\n- **Database**: PostgreSQL 16 with Supabase & pgvector\n- **Cache & Queues**: Redis 7 Cluster\n- **Payments**: Stripe Billing API\n\n## 🚀 Quickstart\n\`\`\`bash\ngit clone https://github.com/${repo.fullName}.git\ncd ${repo.name}\nnpm install\ncp .env.example .env.local\nnpm run dev\n\`\`\``,
        arch: `# System Architecture Specification\n\n## Overview\n${repo.name} utilizes a layered modular architecture with decoupled event processing.\n\n### Core Components:\n1. **API Gateway**: Fastify router handling CORS, authentication claims, and rate limiting.\n2. **Auth Service**: JWT validation with role-based access policy evaluation.\n3. **Billing Controller**: Webhook receiver and tax calculation delegator.\n4. **Event Store**: PostgreSQL multi-tenant tables governed by Row-Level Security (RLS).`,
        api: `# Codebase API Specification\n\n- \`POST /api/v1/auth/login\` - User authentication & JWT issuance\n- \`GET /api/v1/users/profile\` - Active tenant profile query\n- \`POST /api/v1/billing/checkout\` - Stripe checkout session initiator\n- \`POST /api/webhooks/stripe\` - Signature-validated billing event handler`,
        setup: `# Developer Setup & Environment\n\n### Required Environment Variables:\n- \`DATABASE_URL\` - PostgreSQL connection string\n- \`SUPABASE_SERVICE_ROLE_KEY\` - Backend high-privilege token (Keep secret!)\n- \`STRIPE_SECRET_KEY\` - Stripe API test/live key\n- \`STRIPE_WEBHOOK_SECRET\` - Webhook endpoint secret\n- \`REDIS_URL\` - Redis cache connection URI`
    };

    const sampleSymbols = [
        { name: "verifyAuthToken", file: "src/modules/auth/jwt.verifier.ts", line: 18, type: "Function", lang: "TypeScript" },
        { name: "handleStripeEvent", file: "src/modules/billing/billing.controller.ts", line: 42, type: "Function", lang: "TypeScript" },
        { name: "canAccessResource", file: "src/modules/auth/rbac.evaluator.ts", line: 24, type: "Function", lang: "TypeScript" },
        { name: "getSupabaseAdmin", file: "src/server/db/supabase-client.ts", line: 12, type: "Export", lang: "TypeScript" },
        { name: "computeSalesTax", file: "src/modules/billing/tax.service.ts", line: 15, type: "Function", lang: "TypeScript" },
        { name: "findUserById", file: "src/modules/users/profile.repo.ts", line: 20, type: "Function", lang: "TypeScript" },
    ];

    const filteredSymbols = sampleSymbols.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.file.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(sampleDocs[docTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (mode === "search") {
        return (
            <div className="space-y-6">
                <div className="bg-[#0c1222] border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                    <div>
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <Search className="w-5 h-5 text-cyan-400" />
                            AST Symbol & Natural Language Code Search
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Search across functions, classes, interfaces, and imports indexed from {repo.name}.
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search symbols (e.g., verifyAuthToken, Stripe, database)..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredSymbols.map((sym, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl border border-slate-800 bg-[#0c1222] flex items-center justify-between hover:border-slate-700 transition"
                        >
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                    {sym.type}
                                </span>
                                <div>
                                    <h4 className="font-mono text-xs font-bold text-cyan-300">{sym.name}</h4>
                                    <p className="font-mono text-[11px] text-slate-500">{sym.file}:{sym.line}</p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 font-mono">{sym.lang}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c1222] border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white">AI-Generated Codebase Documentation</span>
                </div>

                <div className="flex items-center gap-2">
                    {(["readme", "arch", "api", "setup"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setDocTab(tab)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition ${docTab === tab
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                                }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy Markdown"}</span>
                    </button>
                </div>
            </div>

            {/* Markdown Document Preview */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-[#070b14] shadow-2xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {sampleDocs[docTab]}
            </div>
        </div>
    );
}
