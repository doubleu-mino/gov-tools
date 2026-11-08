import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolMeta } from "@/lib/tools";
import { ToolIcon } from "@/components/tool/ToolIcon";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const body = (
    <>
      <div className="flex items-start justify-between">
        <ToolIcon icon={tool.icon} accent={tool.accent} />
        {tool.ready ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-400 transition group-hover:bg-brand-500 group-hover:text-white">
            <ArrowRight size={18} />
          </span>
        ) : (
          <span className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-bold text-ink-400">준비 중</span>
        )}
      </div>
      <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-ink-900">{tool.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">{tool.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <span key={tag} className="rounded-lg bg-ink-50 px-2 py-1 text-xs font-semibold text-ink-500">
            #{tag}
          </span>
        ))}
      </div>
    </>
  );

  const base = "group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-100 transition";

  if (!tool.ready) {
    return (
      <div className={`${base} opacity-60`} aria-disabled>
        {body}
      </div>
    );
  }
  return (
    <Link href={`/tools/${tool.slug}/`} className={`${base} hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.15)]`}>
      {body}
    </Link>
  );
}
