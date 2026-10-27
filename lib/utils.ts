import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
}

export function getHealthGrade(score: number): { grade: string; color: string; label: string } {
    if (score >= 90) return { grade: "A+", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", label: "Exceptional" };
    if (score >= 80) return { grade: "A", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", label: "Healthy" };
    if (score >= 70) return { grade: "B", color: "text-blue-400 border-blue-500/30 bg-blue-500/10", label: "Moderate" };
    if (score >= 60) return { grade: "C", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", label: "Attention Needed" };
    return { grade: "D", color: "text-rose-400 border-rose-500/30 bg-rose-500/10", label: "High Risk" };
}
