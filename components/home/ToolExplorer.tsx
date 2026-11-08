"use client";

import { useState } from "react";
import { CATEGORIES, CategoryId, TOOLS } from "@/lib/tools";
import { ToolCard } from "./ToolCard";

export function ToolExplorer() {
  const [active, setActive] = useState<CategoryId>("all");
  const list = active === "all" ? TOOLS : TOOLS.filter((t) => t.category === active);
  const sorted = [...list].sort((a, b) => Number(b.ready) - Number(a.ready));

  return (
    <div className="mt-6">
      <div role="tablist" aria-label="카테고리" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {CATEGORIES.map((c) => {
          const on = c.id === active;
          const count = c.id === "all" ? TOOLS.length : TOOLS.filter((t) => t.category === c.id).length;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-[15px] font-semibold transition ${
                on ? "bg-ink-900 text-white" : "bg-white text-ink-600 ring-1 ring-ink-100 hover:bg-ink-50"
              }`}
            >
              {c.label}
              <span className={`ml-1.5 text-[13px] ${on ? "text-white/60" : "text-ink-400"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
