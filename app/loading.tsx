import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
          Loading Intelligence Suite...
        </p>
      </div>
    </div>
  );
}
