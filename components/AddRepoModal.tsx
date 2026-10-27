"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Sparkles,
    KeyRound,
    Loader2,
    AlertCircle,
    ExternalLink,
    Globe,
    Lock,
    ShieldCheck
} from "lucide-react";
import { parseGitHubUrl, analyzeRealGitHubRepo, GitHubAnalysisResult } from "@/lib/githubAnalyzer";

interface AddRepoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (result: GitHubAnalysisResult) => void;
}

export function AddRepoModal({ isOpen, onClose, onSuccess }: AddRepoModalProps) {
    const [repoInput, setRepoInput] = useState("");
    const [tokenInput, setTokenInput] = useState("");
    const [showTokenField, setShowTokenField] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPrivateError, setIsPrivateError] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState("");

    // Load saved token from localStorage
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem("codeintel_github_token");
            if (savedToken) {
                setTokenInput(savedToken);
            }
        } catch (e) {
            //
        }
    }, []);

    if (!isOpen) return null;

    const quickPicks = [
        "shadcn-ui/ui",
        "facebook/react",
        "expressjs/express",
        "tailwindlabs/tailwindcss",
    ];

    const handleSubmit = async (targetRepo?: string) => {
        const input = targetRepo || repoInput;
        if (!input.trim()) return;

        const parsed = parseGitHubUrl(input);
        if (!parsed) {
            setErrorMessage("Please enter a valid GitHub URL or format: 'owner/repo' (e.g. facebook/react)");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setIsPrivateError(false);
        setAnalysisProgress(`Authenticating with GitHub for ${parsed.owner}/${parsed.repo}...`);

        try {
            setTimeout(() => setAnalysisProgress("Fetching file manifest & encrypted contents..."), 600);
            setTimeout(() => setAnalysisProgress("Auditing dependencies & computing health metrics..."), 1200);

            const activeToken = tokenInput.trim() || undefined;
            const result = await analyzeRealGitHubRepo(parsed.owner, parsed.repo, activeToken);

            // Persist token if analysis succeeded
            if (activeToken) {
                try {
                    localStorage.setItem("codeintel_github_token", activeToken);
                } catch (e) {
                    //
                }
            }

            onSuccess(result);
            onClose();
        } catch (err: any) {
            const msg = err.message || "Failed to analyze repository.";

            // Auto-detect private repo or missing access error
            if (msg.includes("NOT_FOUND_OR_PRIVATE") || msg.includes("PRIVATE_REPO_DETECTED") || msg.includes("ACCESS_DENIED")) {
                setIsPrivateError(true);
                setShowTokenField(true);
                setErrorMessage(msg.replace("NOT_FOUND_OR_PRIVATE: ", "").replace("PRIVATE_REPO_DETECTED: ", "").replace("ACCESS_DENIED: ", ""));
            } else if (msg.includes("INVALID_TOKEN")) {
                setShowTokenField(true);
                setErrorMessage("The saved GitHub token is invalid. Please clear it or enter a valid token.");
                try {
                    localStorage.removeItem("codeintel_github_token");
                    setTokenInput("");
                } catch (e) {}
            } else {
                setErrorMessage(msg);
            }
        } finally {
            setIsLoading(false);
            setAnalysisProgress("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0c1222] border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-cyan-500/10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-white">Connect GitHub Repository</h3>
                            <p className="text-xs text-slate-400">Supports both Public & Private repositories</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Private Repo Alert Banner */}
                {isPrivateError && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <Lock className="w-4 h-4" />
                            <span>Private Repository Detected</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            GitHub hides private repos behind a 404 error without authorization. Paste your GitHub Personal Access Token (classic or fine-grained with <code>repo</code> access) below to analyze it.
                        </p>
                        <a
                            href="https://github.com/settings/tokens/new?scopes=repo&description=CodeIntel-Analysis"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                        >
                            <span>Generate GitHub Token with 'repo' scope</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}

                {/* Standard Error Notification */}
                {errorMessage && !isPrivateError && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-300">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Input Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                            GitHub Repository URL or Slug:
                        </label>
                        <div className="relative">
                            <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                value={repoInput}
                                onChange={(e) => setRepoInput(e.target.value)}
                                placeholder="e.g. facebook/react or https://github.com/my-org/private-repo"
                                disabled={isLoading}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </div>

                    {/* Quick Picks for testing */}
                    <div className="space-y-1.5">
                        <span className="text-[11px] text-slate-500 block">Try an open source repo:</span>
                        <div className="flex flex-wrap gap-2">
                            {quickPicks.map((q) => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => {
                                        setRepoInput(q);
                                        handleSubmit(q);
                                    }}
                                    disabled={isLoading}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 font-mono text-[11px] text-cyan-300 transition hover:border-cyan-500/40"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* GitHub Token Field */}
                    <div className="pt-2 border-t border-slate-800/80">
                        <button
                            type="button"
                            onClick={() => setShowTokenField(!showTokenField)}
                            className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between w-full"
                        >
                            <div className="flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="font-medium">GitHub Personal Access Token (for Private Repos)</span>
                            </div>
                            <span className="text-[10px] text-cyan-400 font-mono">
                                {showTokenField ? "Hide" : tokenInput ? "Token Configured" : "Add Token"}
                            </span>
                        </button>

                        {showTokenField && (
                            <div className="mt-2.5 space-y-1.5">
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={tokenInput}
                                        onChange={(e) => setTokenInput(e.target.value)}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxxxxxx"
                                        disabled={isLoading}
                                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                                    />
                                    {tokenInput && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTokenInput("");
                                                try {
                                                    localStorage.removeItem("codeintel_github_token");
                                                } catch (e) {}
                                            }}
                                            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-xs border border-slate-700"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        <ShieldCheck className="w-3 h-3" /> Token stored locally in browser
                                    </span>
                                    <a
                                        href="https://github.com/settings/tokens/new?scopes=repo&description=CodeIntel"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:underline flex items-center gap-1"
                                    >
                                        <span>Create token</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading Progress State */}
                {isLoading && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-cyan-400 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span>{analysisProgress || "Connecting to repository..."}</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={isLoading || !repoInput.trim()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                    >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>Analyze Codebase</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
