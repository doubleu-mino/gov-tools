import { Check, CircleAlert, X } from "lucide-react";
import { ReactNode } from "react";

export type StatusTone = "success" | "warning" | "danger" | "neutral" | "brand";

const toneClass: Record<StatusTone, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-600",
  neutral: "bg-ink-50 text-ink-600",
  brand: "bg-brand-50 text-brand-600",
};

export function Pill({ tone = "neutral", children }: { tone?: StatusTone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${toneClass[tone]}`}>{children}</span>;
}

export function CheckRow({ ok, label, detail }: { ok: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="flex items-center gap-2 text-ink-700">
        <span className={`flex h-5 w-5 items-center justify-center rounded-full ${ok ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
          {ok ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
        </span>
        {label}
      </span>
      <span className={`text-right ${ok ? "text-ink-500" : "font-semibold text-rose-500"}`}>{detail}</span>
    </li>
  );
}

export function StatRow({ label, value, strong, muted }: { label: ReactNode; value: ReactNode; strong?: boolean; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span className={`text-[15px] ${muted ? "text-ink-400" : "text-ink-600"}`}>{label}</span>
      <span className={`tabular text-right ${strong ? "text-lg font-bold text-ink-900" : "text-[15px] font-semibold text-ink-700"}`}>{value}</span>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2 rounded-2xl bg-ink-50 px-4 py-3 text-[13px] leading-relaxed text-ink-500">
      <CircleAlert size={16} className="mt-0.5 shrink-0 text-ink-400" />
      <span>{children}</span>
    </p>
  );
}
