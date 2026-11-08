import { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">{title}</h1>
      {updated && <p className="mt-2 text-sm text-ink-400">시행일 {updated}</p>}
      <div className="guide mt-6 rounded-3xl bg-white p-6 ring-1 ring-ink-100 sm:p-10">{children}</div>
    </div>
  );
}
