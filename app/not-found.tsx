import React from "react";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7 text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tight font-mono">
            404
          </h1>
          <p className="text-lg font-bold text-slate-200">Page Not Found</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            The intelligence module you&apos;re looking for doesn&apos;t exist
            or has been relocated.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
