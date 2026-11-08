"use client";

import { ReactNode, useId } from "react";
import { formatManwon } from "@/lib/format";

type FieldShellProps = { label: string; hint?: ReactNode; htmlFor?: string; children: ReactNode };

export function FieldShell({ label, hint, htmlFor, children }: FieldShellProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-[15px] font-semibold text-ink-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-ink-500">{hint}</p>}
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  unit: string;
  placeholder?: string;
  hint?: ReactNode;
  /** 만원 단위 금액이면 한글 금액 미리보기 표시 */
  manwon?: boolean;
  max?: number;
  decimal?: boolean;
};

export function NumberField({ label, value, onChange, unit, placeholder, hint, manwon, max, decimal }: NumberFieldProps) {
  const id = useId();
  const display = value === null ? "" : value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });

  const handle = (raw: string) => {
    const cleaned = raw.replace(decimal ? /[^0-9.]/g : /[^0-9]/g, "");
    if (cleaned === "") return onChange(null);
    let v = Number(cleaned);
    if (!Number.isFinite(v)) return;
    if (max !== undefined) v = Math.min(v, max);
    onChange(v);
  };

  const preview = manwon && value ? formatManwon(value) : null;

  return (
    <FieldShell label={label} htmlFor={id} hint={preview ? <span className="font-medium text-brand-600">{preview}</span> : hint}>
      <div className="group flex items-center rounded-2xl bg-ink-50 px-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500">
        <input
          id={id}
          inputMode={decimal ? "decimal" : "numeric"}
          autoComplete="off"
          value={display}
          placeholder={placeholder}
          onChange={(e) => handle(e.target.value)}
          className="tabular h-14 w-full min-w-0 bg-transparent text-lg font-semibold text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-300"
        />
        <span className="ml-2 shrink-0 text-[15px] font-medium text-ink-500">{unit}</span>
      </div>
    </FieldShell>
  );
}

type Option<T extends string | number> = { value: T; label: string; sub?: string };

type SegmentedProps<T extends string | number> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  hint?: ReactNode;
  columns?: 2 | 3 | 4;
};

export function Segmented<T extends string | number>({ label, value, options, onChange, hint, columns }: SegmentedProps<T>) {
  const cols = columns ?? (options.length >= 4 ? 4 : options.length === 3 ? 3 : 2);
  const grid = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[cols];
  return (
    <FieldShell label={label} hint={hint}>
      <div role="radiogroup" aria-label={label} className={`grid gap-2 ${grid}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`rounded-2xl px-3 py-3 text-[15px] font-semibold transition active:scale-[0.98] ${
                active ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
              }`}
            >
              {o.label}
              {o.sub && <span className={`mt-0.5 block text-xs font-medium ${active ? "text-white/80" : "text-ink-400"}`}>{o.sub}</span>}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

type SelectFieldProps<T extends string | number> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  hint?: ReactNode;
};

export function SelectField<T extends string | number>({ label, value, options, onChange, hint }: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} hint={hint}>
      <div className="relative">
        <select
          id={id}
          value={String(value)}
          onChange={(e) => {
            const found = options.find((o) => String(o.value) === e.target.value);
            if (found) onChange(found.value);
          }}
          className="h-14 w-full appearance-none rounded-2xl bg-ink-50 px-4 pr-10 text-[16px] font-semibold text-ink-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-brand-500"
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
        </svg>
      </div>
    </FieldShell>
  );
}

type ToggleProps = { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void };

export function Toggle({ label, desc, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-ink-50 px-4 py-3.5 text-left transition hover:bg-ink-100"
    >
      <span>
        <span className="block text-[15px] font-semibold text-ink-700">{label}</span>
        {desc && <span className="mt-0.5 block text-[13px] text-ink-500">{desc}</span>}
      </span>
      <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-brand-500" : "bg-ink-200"}`}>
        <span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}
