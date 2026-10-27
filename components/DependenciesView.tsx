"use client";

import React, { useState } from "react";
import {
    ShieldAlert,
    CheckCircle2,
    Search,
    PackageCheck
} from "lucide-react";
import { DependencyItem } from "@/types/codeintel";

interface DependenciesViewProps {
    dependencies: DependencyItem[];
    depScore: number;
}

export function DependenciesView({ dependencies, depScore }: DependenciesViewProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDeps = dependencies.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.license.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const vulnerableCount = dependencies.filter(d => d.hasVulnerability).length;
    const outdatedCount = dependencies.filter(d => d.isOutdated).length;

    return (
        <div className="space-y-6">
            {/* Vitals Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Dependency Health</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-black font-mono text-white">{depScore}</span>
                        <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <span className="text-[11px] text-amber-400 mt-1 block">Patches Pending</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Total Packages</span>
                    <p className="text-3xl font-black font-mono text-white mt-2">{dependencies.length}</p>
                    <span className="text-[11px] text-slate-500">Directly declared</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-rose-400 uppercase">Vulnerable CVEs</span>
                    <p className="text-3xl font-black font-mono text-rose-400 mt-2">{vulnerableCount}</p>
                    <span className="text-[11px] text-rose-400/80">Immediate upgrades needed</span>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0c1222] p-5 shadow-lg">
                    <span className="text-xs font-semibold text-amber-400 uppercase">Outdated Packages</span>
                    <p className="text-3xl font-black font-mono text-amber-400 mt-2">{outdatedCount}</p>
                    <span className="text-[11px] text-slate-500">Newer major/minor exists</span>
                </div>
            </div>

            {/* Search Header */}
            <div className="flex items-center justify-between bg-[#0c1222] border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 font-semibold uppercase">
                    Ecosystem Manifest Packages
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search package or license..."
                        className="pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-64"
                    />
                </div>
            </div>

            {/* Dependencies Table */}
            <div className="rounded-2xl border border-slate-800 bg-[#0c1222] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs">
                    <thead className="bg-[#090d16] border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                        <tr>
                            <th className="p-4">Package</th>
                            <th className="p-4">Installed</th>
                            <th className="p-4">Latest</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">License</th>
                            <th className="p-4 text-right">Referenced In</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                        {filteredDeps.map((dep) => (
                            <tr key={dep.id} className="hover:bg-slate-800/30 transition">
                                <td className="p-4 font-bold text-white font-sans flex items-center gap-2">
                                    <PackageCheck className="w-4 h-4 text-cyan-400" />
                                    <span>{dep.name}</span>
                                </td>
                                <td className="p-4 text-slate-300">{dep.currentVersion}</td>
                                <td className="p-4 text-slate-400">{dep.latestVersion}</td>
                                <td className="p-4 font-sans">
                                    {dep.hasVulnerability ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-flex items-center gap-1">
                                            <ShieldAlert className="w-3 h-3" />
                                            CVE Warning
                                        </span>
                                    ) : dep.isOutdated ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                            Outdated
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Up to date
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-slate-400">{dep.license}</td>
                                <td className="p-4 text-right text-slate-300 font-sans">
                                    {dep.dependentsCount} files
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
