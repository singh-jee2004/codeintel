"use client";

import React, { useState, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Position,
    Handle,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
    Server,
    Database,
    Globe,
    Cpu,
    Layers,
    ExternalLink,
    FileCode,
    X,
    Search,
} from "lucide-react";
import { ArchitectureNodeData } from "@/types/codeintel";

// Custom Node Renderer with modern dark cyber styling
function CustomArchitectureNode({ data }: { data: ArchitectureNodeData & { isSelected?: boolean } }) {
    const getIcon = () => {
        switch (data.type) {
            case "frontend": return <Globe className="w-4 h-4 text-cyan-400" />;
            case "api_gateway": return <Layers className="w-4 h-4 text-indigo-400" />;
            case "microservice": return <Cpu className="w-4 h-4 text-emerald-400" />;
            case "database": return <Database className="w-4 h-4 text-amber-400" />;
            case "cache": return <Server className="w-4 h-4 text-purple-400" />;
            case "external_api": return <ExternalLink className="w-4 h-4 text-rose-400" />;
            default: return <Server className="w-4 h-4 text-slate-400" />;
        }
    };

    const getBorderColor = () => {
        if (data.riskLevel === "high") return "border-rose-500/50 shadow-rose-500/10";
        if (data.riskLevel === "medium") return "border-amber-500/50 shadow-amber-500/10";
        return "border-slate-800 hover:border-cyan-500/50";
    };

    return (
        <div className={`px-4 py-3 rounded-xl bg-[#0c1222] border ${getBorderColor()} shadow-xl min-w-[210px] transition-all cursor-pointer`}>
            <Handle type="target" position={Position.Top} className="!bg-cyan-500 !w-2 !h-2" />

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span className="text-xs font-bold text-white tracking-wide">{data.label}</span>
                </div>
                {data.riskLevel === "high" && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High Risk Module" />
                )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="capitalize">{data.type.replace("_", " ")}</span>
                <span>{data.metrics.linesOfCode} LOC</span>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-2 !h-2" />
        </div>
    );
}

const nodeTypes = {
    customNode: CustomArchitectureNode,
};

export function ArchitectureView() {
    const [selectedNode, setSelectedNode] = useState<ArchitectureNodeData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Initial nodes representing an enterprise SaaS microservices topology
    const initialNodes: Node[] = useMemo(() => [
        {
            id: "node-frontend",
            type: "customNode",
            position: { x: 340, y: 30 },
            data: {
                label: "Next.js Web Client",
                type: "frontend",
                files: ["app/page.tsx", "components/Dashboard.tsx", "hooks/useAuth.ts"],
                responsibilities: ["Client-side hydration", "Route state management", "Real-time SSE subscription"],
                riskLevel: "low",
                metrics: { complexityScore: 4, linesOfCode: 8400, dependenciesCount: 24 },
                technologies: ["Next.js 16", "React 19", "Tailwind CSS"],
            },
        },
        {
            id: "node-gateway",
            type: "customNode",
            position: { x: 340, y: 150 },
            data: {
                label: "API Gateway & Router",
                type: "api_gateway",
                files: ["src/api/middleware/cors.ts", "src/api/middleware/rate-limiter.ts", "src/api/router.ts"],
                responsibilities: ["CORS enforcement", "Token rate limiting", "Route dispatching"],
                riskLevel: "medium",
                metrics: { complexityScore: 7, linesOfCode: 3200, dependenciesCount: 6 },
                technologies: ["Fastify", "Redis RateLimiter"],
            },
        },
        {
            id: "node-auth",
            type: "customNode",
            position: { x: 100, y: 280 },
            data: {
                label: "Auth & RBAC Service",
                type: "microservice",
                files: ["src/modules/auth/jwt.verifier.ts", "src/modules/auth/rbac.evaluator.ts"],
                responsibilities: ["JWT verification", "Role policy evaluation", "Tenant isolation checks"],
                riskLevel: "high",
                metrics: { complexityScore: 18, linesOfCode: 4800, dependenciesCount: 8 },
                technologies: ["Node.js", "jsonwebtoken", "Bcrypt"],
            },
        },
        {
            id: "node-billing",
            type: "customNode",
            position: { x: 340, y: 280 },
            data: {
                label: "Billing & Stripe Engine",
                type: "microservice",
                files: ["src/modules/billing/billing.controller.ts", "src/modules/billing/tax.service.ts"],
                responsibilities: ["Subscription lifecycle", "Stripe webhook handling", "Tax calculation"],
                riskLevel: "high",
                metrics: { complexityScore: 28, linesOfCode: 12400, dependenciesCount: 14 },
                technologies: ["Stripe SDK", "Invoicing Worker"],
            },
        },
        {
            id: "node-users",
            type: "customNode",
            position: { x: 580, y: 280 },
            data: {
                label: "User Management Service",
                type: "microservice",
                files: ["src/modules/users/search.service.ts", "src/modules/users/profile.repo.ts"],
                responsibilities: ["Organization team membership", "Profile sync", "Directory search"],
                riskLevel: "medium",
                metrics: { complexityScore: 9, linesOfCode: 6100, dependenciesCount: 5 },
                technologies: ["Prisma", "TypeScript"],
            },
        },
        {
            id: "node-cache",
            type: "customNode",
            position: { x: 100, y: 440 },
            data: {
                label: "Redis Cache Cluster",
                type: "cache",
                files: ["src/infra/cache/redis.ts"],
                responsibilities: ["Session state caching", "Rate limit counters", "Idempotency locks"],
                riskLevel: "low",
                metrics: { complexityScore: 2, linesOfCode: 850, dependenciesCount: 2 },
                technologies: ["Redis 7", "ioredis"],
            },
        },
        {
            id: "node-postgres",
            type: "customNode",
            position: { x: 420, y: 440 },
            data: {
                label: "PostgreSQL Event Store",
                type: "database",
                files: ["prisma/schema.prisma", "supabase/migrations/001_init.sql"],
                responsibilities: ["ACID transactions", "Multi-tenant tables", "Row Level Security policies"],
                riskLevel: "medium",
                metrics: { complexityScore: 5, linesOfCode: 2400, dependenciesCount: 1 },
                technologies: ["PostgreSQL 16", "pgvector", "Supabase RLS"],
            },
        },
        {
            id: "node-stripe-api",
            type: "customNode",
            position: { x: 700, y: 440 },
            data: {
                label: "Stripe Billing API",
                type: "external_api",
                files: ["src/integrations/stripe.ts"],
                responsibilities: ["Payment intent capture", "Checkout sessions", "Customer portal"],
                riskLevel: "low",
                metrics: { complexityScore: 3, linesOfCode: 920, dependenciesCount: 1 },
                technologies: ["Stripe v2024"],
            },
        },
    ], []);

    const initialEdges: Edge[] = useMemo(() => [
        { id: "e1", source: "node-frontend", target: "node-gateway", animated: true, style: { stroke: "#06b6d4", strokeWidth: 2 } },
        { id: "e2", source: "node-gateway", target: "node-auth", style: { stroke: "#6366f1", strokeWidth: 2 } },
        { id: "e3", source: "node-gateway", target: "node-billing", style: { stroke: "#6366f1", strokeWidth: 2 } },
        { id: "e4", source: "node-gateway", target: "node-users", style: { stroke: "#6366f1", strokeWidth: 2 } },
        { id: "e5", source: "node-auth", target: "node-cache", style: { stroke: "#a855f7", strokeWidth: 2 } },
        { id: "e6", source: "node-billing", target: "node-postgres", style: { stroke: "#eab308", strokeWidth: 2 } },
        { id: "e7", source: "node-billing", target: "node-stripe-api", style: { stroke: "#f43f5e", strokeWidth: 2 } },
        { id: "e8", source: "node-users", target: "node-postgres", style: { stroke: "#eab308", strokeWidth: 2 } },
    ], []);

    const [nodes] = useNodesState(initialNodes);
    const [edges] = useEdgesState(initialEdges);

    // Filter nodes based on search query
    const filteredNodes = useMemo(() => {
        if (!searchQuery.trim()) return nodes;
        return nodes.map((node) => {
            const data = (node.data || {}) as { label?: string; type?: string };
            const labelMatch = data.label?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
            const typeMatch = data.type?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
            return {
                ...node,
                hidden: !(labelMatch || typeMatch),
            };
        });
    }, [nodes, searchQuery]);

    return (
        <div className="space-y-4">
            {/* Top Header & Search Control */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0c1222] border border-slate-800 p-4 rounded-2xl">
                <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" />
                        Interactive Codebase Architecture Topology
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Auto-inferred from static imports, route handlers, and database connections. Click any node to inspect.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter modules..."
                            className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-56"
                        />
                    </div>
                </div>
            </div>

            {/* Main Canvas & Inspection Drawer */}
            <div className="relative h-[620px] rounded-2xl border border-slate-800 bg-[#070b14] overflow-hidden shadow-2xl">
                <ReactFlow
                    nodes={filteredNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodeClick={(_, node) => setSelectedNode(node.data as unknown as ArchitectureNodeData)}
                    fitView
                    className="bg-[#070b14]"
                >
                    <Background color="#1e293b" gap={20} size={1} />
                    <Controls className="!bg-[#0c1222] !border-slate-800 !text-white fill-white" />
                    <MiniMap
                        nodeColor="#334155"
                        maskColor="rgba(11, 17, 32, 0.85)"
                        className="!bg-[#0c1222] !border-slate-800 !rounded-xl overflow-hidden"
                    />
                </ReactFlow>

                {/* Node Inspection Drawer */}
                {selectedNode && (
                    <div className="absolute top-4 right-4 bottom-4 w-96 bg-[#0c1222]/95 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-right duration-200">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div>
                                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-400">
                                        {selectedNode.type.replace("_", " ")}
                                    </span>
                                    <h3 className="font-bold text-lg text-white mt-0.5">{selectedNode.label}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedNode(null)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Vitals */}
                            <div className="grid grid-cols-2 gap-3 my-4">
                                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase">Complexity</span>
                                    <p className="text-base font-bold font-mono text-white mt-1">
                                        {selectedNode.metrics.complexityScore} / 10
                                    </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase">Risk Level</span>
                                    <p className={`text-base font-bold font-mono mt-1 capitalize ${selectedNode.riskLevel === "high" ? "text-rose-400" : selectedNode.riskLevel === "medium" ? "text-amber-400" : "text-emerald-400"
                                        }`}>
                                        {selectedNode.riskLevel}
                                    </p>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div className="space-y-2 mt-4">
                                <span className="text-xs font-semibold text-slate-300">Core Responsibilities</span>
                                <ul className="space-y-1.5">
                                    {selectedNode.responsibilities.map((r, i) => (
                                        <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                            <span>{r}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Files */}
                            <div className="space-y-2 mt-5">
                                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                                    Key Source Files ({selectedNode.files.length})
                                </span>
                                <div className="space-y-1.5">
                                    {selectedNode.files.map((file, i) => (
                                        <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 truncate">
                                            {file}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tech stack */}
                            <div className="mt-5">
                                <span className="text-xs font-semibold text-slate-300">Technologies</span>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {selectedNode.technologies.map((t, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedNode(null)}
                            className="mt-6 w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                        >
                            Close Drawer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
