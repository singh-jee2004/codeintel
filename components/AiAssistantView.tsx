"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Bot,
    Send,
    User,
    Sparkles,
    FileCode,
    ArrowUpRight,
    RefreshCw,
    Lightbulb
} from "lucide-react";
import { Repository, AIMessage, SourceReference } from "@/types/codeintel";

interface AiAssistantViewProps {
    repo: Repository;
}

function getInitialMessages(repo: Repository): AIMessage[] {
    return [
        {
            id: "ai-init-1",
            role: "assistant",
            content: `Hello! I am your **CodeIntel Architecture & Security Assistant**. I have fully parsed and indexed **${repo.fullName}** across ${repo.stats.filesCount} files.\n\nYou can ask me questions like:\n- *'How does authentication and token verification work?'*\n- *'Where are database migrations executed?'*\n- *'Show me the biggest security risks.'*\n- *'What is the refactoring plan for the largest module?'*`,
            timestamp: "Just now",
        },
    ];
}

export function AiAssistantView({ repo }: AiAssistantViewProps) {
    const initialMessages = getInitialMessages(repo);
    const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
    const [inputPrompt, setInputPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCitation, setSelectedCitation] = useState<SourceReference | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const quickQuestions = [
        "How does authentication and token verification work?",
        "Where is Stripe webhook signature validation implemented?",
        "Which files access the database and Supabase client?",
        "What is the refactoring plan for the monolithic billing controller?",
    ];

    const msgCounter = useRef(1);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating]);

    // Simulated RAG engine responses based on repo context
    const handleSendMessage = useCallback((textToSend?: string) => {
        const prompt = textToSend || inputPrompt;
        if (!prompt.trim() || isGenerating) return;

        msgCounter.current += 1;
        const userMessage: AIMessage = {
            id: `usr-${msgCounter.current}`,
            role: "user",
            content: prompt,
            timestamp: "Just now",
        };

        setMessages((prev) => [...prev, userMessage]);
        if (!textToSend) setInputPrompt("");
        setIsGenerating(true);

        // Realistic RAG retrieval simulation
        setTimeout(() => {
            let aiReply: AIMessage;

            const lower = prompt.toLowerCase();
            msgCounter.current += 1;
            const replyId = `ai-${msgCounter.current}`;
            if (lower.includes("auth") || lower.includes("token") || lower.includes("jwt")) {
                aiReply = {
                    id: replyId,
                    role: "assistant",
                    content: `In **${repo.fullName}**, authentication is managed through an **RBAC token verification pipeline**.\n\n1. **Token Ingestion**: Incoming requests are intercepted by \`src/api/middleware/cors.ts\` and passed to \`src/modules/auth/jwt.verifier.ts\`.\n2. **Signature Verification**: Tokens are verified using \`jsonwebtoken\`.\n\n> ⚠️ **Security Finding Detected**: At line 45 of \`src/modules/auth/jwt.verifier.ts\`, the algorithm configuration allows \`['HS256', 'none']\`. The \`'none'\` algorithm must be removed to prevent signature bypass attacks.\n\n3. **Permission Evaluation**: Once decoded, user claims pass to \`src/modules/auth/rbac.evaluator.ts#canAccessResource\` which computes organizational roles.`,
                    timestamp: "Just now",
                    citations: [
                        { file: "src/modules/auth/jwt.verifier.ts", lines: "14-58", symbolName: "verifyAuthToken" },
                        { file: "src/modules/auth/rbac.evaluator.ts", lines: "22-90", symbolName: "canAccessResource" },
                    ],
                };
            } else if (lower.includes("stripe") || lower.includes("billing") || lower.includes("refactor")) {
                aiReply = {
                    id: `ai-${Date.now()}`,
                    role: "assistant",
                    content: `The billing system in **${repo.fullName}** is centered in \`src/modules/billing/billing.controller.ts\` (1,840 lines) and \`src/modules/billing/tax.service.ts\`.\n\n### 🛠️ Recommended Refactoring Plan:\n1. **Extract Webhook Handling**: Isolate raw buffer HMAC validation into \`src/api/webhooks/stripe-handler.ts\`.\n2. **Delegate Tax Calculation**: Move external rate-limited calls out of the main request loop.\n3. **Decouple PDF Generation**: Dispatch invoice creation to a background worker queue.\n\nHere is an optimized pattern for Stripe webhook verification:`,
                    timestamp: "Just now",
                    citations: [
                        { file: "src/modules/billing/billing.controller.ts", lines: "42-120", symbolName: "handleStripeEvent" },
                        { file: "src/modules/billing/tax.service.ts", lines: "15-68", symbolName: "computeSalesTax" },
                    ],
                    refactoringSuggestion: {
                        file: "src/api/webhooks/stripe.ts",
                        beforeCode: `// Before: Fragile direct JSON parse\nconst event = req.body;\nif (event.type === 'invoice.payment_succeeded') {\n  await processInvoice(event);\n}`,
                        afterCode: `// After: Strict Buffer HMAC validation with error boundary\nconst buf = await req.arrayBuffer();\nconst sig = req.headers.get("stripe-signature");\nconst event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, env.STRIPE_WEBHOOK_SECRET);\nawait eventQueue.enqueue("billing.process", event);`,
                        explanation: "Prevents webhook forgery and moves execution off the synchronous edge thread.",
                    },
                };
            } else if (lower.includes("database") || lower.includes("supabase") || lower.includes("sql")) {
                aiReply = {
                    id: `ai-${Date.now()}`,
                    role: "assistant",
                    content: `Database operations in **${repo.fullName}** interact with **PostgreSQL 16** via Supabase and Prisma:\n\n- **Client Initialization**: \`src/server/db/supabase-client.ts\` creates the database connection pool.\n- **Schema Definitions**: Found in \`prisma/schema.prisma\` containing User, Organization, and Subscription models.\n- **Data Access Layer**: Repositories like \`src/modules/users/profile.repo.ts\` encapsulate queries.\n\n> 🚨 **Critical Alert**: \`src/server/db/supabase-client.ts:18\` has a hardcoded service role secret. Rotate this immediately.`,
                    timestamp: "Just now",
                    citations: [
                        { file: "src/server/db/supabase-client.ts", lines: "12-32", symbolName: "getSupabaseAdmin" },
                        { file: "src/modules/users/profile.repo.ts", lines: "20-75", symbolName: "findUserById" },
                    ],
                };
            } else {
                aiReply = {
                    id: `ai-${Date.now()}`,
                    role: "assistant",
                    content: `I retrieved and analyzed the indexed AST symbols for **"${prompt}"** across 382 files in **${repo.name}**.\n\nThe codebase follows a clean layered domain architecture with services located under \`src/modules/\` and HTTP route handlers in \`src/api/\`.\n\nAll external integrations (PostgreSQL, Redis, Stripe) use dependency injection patterns, allowing safe unit testing with mocks.`,
                    timestamp: "Just now",
                    citations: [
                        { file: "src/api/router.ts", lines: "10-44" },
                        { file: "src/infra/cache/redis.ts", lines: "8-35" },
                    ],
                };
            }

            setMessages((prev) => [...prev, aiReply]);
            setIsGenerating(false);
        }, 700);
    }, [inputPrompt, isGenerating, repo.fullName, repo.name]);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden shadow-2xl">
            {/* Top Header */}
            <div className="h-14 px-6 border-b border-slate-800 bg-[#090d16]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                        <Bot className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            CodeIntel Repository Copilot
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                                RAG Indexed
                            </span>
                        </h3>
                    </div>
                </div>

                <button
                    onClick={() => setMessages(initialMessages)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Session</span>
                </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg) => {
                    const isUser = msg.role === "user";

                    return (
                        <div
                            key={msg.id}
                            className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            {!isUser && (
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-cyan-500/10">
                                    <Bot className="w-4 h-4" />
                                </div>
                            )}

                            <div
                                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${isUser
                                        ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium"
                                        : "bg-[#070b14] border border-slate-800 text-slate-200 shadow-lg"
                                    }`}
                            >
                                <div className="whitespace-pre-wrap">{msg.content}</div>

                                {/* Refactoring Before / After Code Box */}
                                {msg.refactoringSuggestion && (
                                    <div className="mt-3 p-3 rounded-xl bg-black/60 border border-slate-800 space-y-2">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 border-b border-slate-800 pb-1.5">
                                            <span>Refactor: {msg.refactoringSuggestion.file}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                                            <div className="p-2 rounded bg-rose-950/20 border border-rose-900/30 text-rose-300">
                                                <span className="block text-[10px] text-rose-400 font-bold mb-1">Before:</span>
                                                <pre className="overflow-x-auto"><code>{msg.refactoringSuggestion.beforeCode}</code></pre>
                                            </div>
                                            <div className="p-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-emerald-300">
                                                <span className="block text-[10px] text-emerald-400 font-bold mb-1">Proposed AI Refactor:</span>
                                                <pre className="overflow-x-auto"><code>{msg.refactoringSuggestion.afterCode}</code></pre>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-400 italic">
                                            💡 {msg.refactoringSuggestion.explanation}
                                        </p>
                                    </div>
                                )}

                                {/* Clickable Citations */}
                                {msg.citations && msg.citations.length > 0 && (
                                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] uppercase font-mono text-slate-400">
                                            Verified Citations:
                                        </span>
                                        {msg.citations.map((cite, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedCitation(cite)}
                                                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 font-mono text-[11px] text-cyan-300 transition"
                                            >
                                                <FileCode className="w-3 h-3 text-cyan-400" />
                                                <span>{cite.file}</span>
                                                {cite.lines && <span className="text-slate-500">:{cite.lines}</span>}
                                                <ArrowUpRight className="w-2.5 h-2.5 text-slate-400" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {isUser && (
                                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {isGenerating && (
                    <div className="flex gap-3 items-center text-xs text-slate-400">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                            <Sparkles className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="p-3 rounded-2xl bg-[#070b14] border border-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                            <span>Retrieving AST context & generating verified response...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="px-6 py-2 border-t border-slate-800/60 bg-[#090d16]/50 flex items-center gap-2 overflow-x-auto">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-[11px] text-slate-500 flex-shrink-0 font-medium">Try asking:</span>
                {quickQuestions.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition hover:border-cyan-500/40"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t border-slate-800 bg-[#090d16]">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex items-center gap-3"
                >
                    <input
                        type="text"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        placeholder={`Ask anything about ${repo.name} architecture, security, or data flow...`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputPrompt.trim() || isGenerating}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Send</span>
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
            </div>

            {/* Citation Preview Modal */}
            {selectedCitation && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0c1222] border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                                <FileCode className="w-4 h-4 text-cyan-400" />
                                <h4 className="font-semibold text-white text-sm font-mono">{selectedCitation.file}</h4>
                            </div>
                            <button
                                onClick={() => setSelectedCitation(null)}
                                className="text-slate-400 hover:text-white text-xs"
                            >
                                Close
                            </button>
                        </div>
                        <div className="mt-4 p-3 bg-black/60 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
                            <p className="text-slate-500 text-[10px]">Indexed Symbol:</p>
                            <p className="font-bold text-white mt-0.5">{selectedCitation.symbolName || "Module Root"}</p>
                            <p className="text-slate-500 text-[10px] mt-2">Active Range:</p>
                            <p className="text-slate-300">Lines {selectedCitation.lines || "1 - end"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
