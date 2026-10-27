"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DocsAndSearchView } from "@/components/DocsAndSearchView";
import { PullRequestsView } from "@/components/PullRequestsView";
import { DependenciesView } from "@/components/DependenciesView";
import { QualityView } from "@/components/QualityView";
import { SecurityView } from "@/components/SecurityView";
import { Sidebar, TabType } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { OverviewView } from "@/components/OverviewView";
import { AddRepoModal } from "@/components/AddRepoModal";
import { 
  Repository, 
  SecurityFinding, 
  TechnicalDebtItem, 
  DependencyItem, 
  PullRequestAnalysis 
} from "@/types/codeintel";
import { GitHubAnalysisResult } from "@/lib/githubAnalyzer";
import { Sparkles, Plus, Globe, ShieldAlert, Cpu } from "lucide-react";

// Lazy-load heavy components (React Flow graph & AI chat)
const ArchitectureView = dynamic(
  () => import("@/components/ArchitectureView").then(mod => ({ default: mod.ArchitectureView })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1222]">
        <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

const AiAssistantView = dynamic(
  () => import("@/components/AiAssistantView").then(mod => ({ default: mod.AiAssistantView })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1222]">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    ),
  }
);

export default function CodeIntelApp() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [currentRepo, setCurrentRepo] = useState<Repository | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Per-repo dynamic findings storage
  const [repoDataMap, setRepoDataMap] = useState<Record<string, {
    securityFindings: SecurityFinding[];
    techDebt: TechnicalDebtItem[];
    dependencies: DependencyItem[];
    pullRequests: PullRequestAnalysis[];
  }>>({});

  // Load saved repositories from localStorage on mount
  useEffect(() => {
    try {
      const savedRepos = localStorage.getItem("codeintel_repositories");
      const savedMap = localStorage.getItem("codeintel_repo_map");
      if (savedRepos) {
        const parsed = JSON.parse(savedRepos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          queueMicrotask(() => {
            setRepositories(parsed);
            setCurrentRepo(parsed[0]);
          });
        }
      }
      if (savedMap) {
        const parsedMap = JSON.parse(savedMap);
        queueMicrotask(() => {
          setRepoDataMap(parsedMap);
        });
      }
    } catch (e) {
      console.error("Failed to load saved repos:", e);
    }
    queueMicrotask(() => {
      setIsHydrated(true);
    });
  }, []);

  // Save to localStorage when repositories change
  const handleAddRepositorySuccess = (result: GitHubAnalysisResult) => {
    const updatedRepos = [result.repository, ...repositories.filter(r => r.id !== result.repository.id)];
    const updatedMap = {
      ...repoDataMap,
      [result.repository.id]: {
        securityFindings: result.securityFindings,
        techDebt: result.techDebt,
        dependencies: result.dependencies,
        pullRequests: result.pullRequests,
      }
    };

    setRepositories(updatedRepos);
    setCurrentRepo(result.repository);
    setRepoDataMap(updatedMap);
    setActiveTab("overview");

    try {
      localStorage.setItem("codeintel_repositories", JSON.stringify(updatedRepos));
      localStorage.setItem("codeintel_repo_map", JSON.stringify(updatedMap));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const activeData = currentRepo ? repoDataMap[currentRepo.id] : null;
  const securityFindings = activeData?.securityFindings || [];
  const techDebt = activeData?.techDebt || [];
  const dependencies = activeData?.dependencies || [];
  const pullRequests = activeData?.pullRequests || [];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        securityCount={securityFindings.length}
      />

      {/* 2. Top Navigation & Action Header */}
      <Header 
        repositories={repositories} 
        currentRepo={currentRepo} 
        onSelectRepo={(repo) => setCurrentRepo(repo)} 
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* 3. Main Intelligence Body */}
      <main className="ml-64 p-8 flex-1 overflow-y-auto">
        {/* Empty State: No Repositories Added Yet */}
        {repositories.length === 0 && (
          <div className="max-w-3xl mx-auto my-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-cyan-500/20 text-white">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white">
                Connect Your GitHub Repository
              </h1>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Analyze any public repository or private repo. CodeIntel runs live static analysis, extracts dependencies, detects secret leaks, maps system architecture, and builds an AI intelligence layer.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition cursor-pointer flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add GitHub Repository</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 text-left">
              <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Real GitHub Connect</h4>
                <p className="text-xs text-slate-400">
                  Fetches live repository branches, file trees, commits, and language percentage breakdowns.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-white">Live Vulnerability Audit</h4>
                <p className="text-xs text-slate-400">
                  Audits your real dependencies for known CVE advisories and checks for committed secrets.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0c1222] border border-slate-800 space-y-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Interactive Graph & AI</h4>
                <p className="text-xs text-slate-400">
                  Topology visualization and repository-aware AI chat with verified file citations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Tab Switcher when a repository is active */}
        {currentRepo && (
          <>
            {activeTab === "overview" && (
              <OverviewView 
                repo={currentRepo} 
                securityFindings={securityFindings} 
                techDebt={techDebt} 
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === "architecture" && (
              <ArchitectureView />
            )}

            {activeTab === "security" && (
              <SecurityView 
                findings={securityFindings} 
                securityScore={currentRepo.healthScores.security} 
              />
            )}

            {activeTab === "assistant" && (
              <AiAssistantView repo={currentRepo} />
            )}

            {activeTab === "quality" && (
              <QualityView 
                debtItems={techDebt} 
                qualityScore={currentRepo.healthScores.codeQuality} 
              />
            )}

            {activeTab === "dependencies" && (
              <DependenciesView 
                dependencies={dependencies} 
                depScore={currentRepo.healthScores.dependencies} 
              />
            )}

            {activeTab === "pull-requests" && (
              <PullRequestsView pullRequests={pullRequests} />
            )}

            {activeTab === "docs" && (
              <DocsAndSearchView repo={currentRepo} mode="docs" />
            )}

            {activeTab === "search" && (
              <DocsAndSearchView repo={currentRepo} mode="search" />
            )}
          </>
        )}
      </main>

      {/* Add Repository Modal */}
      <AddRepoModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={handleAddRepositorySuccess}
      />
    </div>
  );
}
