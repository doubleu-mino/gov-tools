import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { ReactNode } from "react";
import { getTool, TOOLS } from "@/lib/tools";
import { POLICY_BASE_LABEL } from "@/lib/policy-data";
import { ToolIcon } from "./ToolIcon";

type ToolShellProps = {
  slug: string;
  children: ReactNode;
  guide: ReactNode;
  guideTitle: string;
};

/** 도구 페이지 공통 레이아웃: 헤더 → 계산기 → SEO 가이드 → 관련 도구 */
export function ToolShell({ slug, children, guide, guideTitle }: ToolShellProps) {
  const tool = getTool(slug);
  const related = TOOLS.filter((t) => t.ready && t.slug !== slug);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <nav aria-label="breadcrumb" className="flex items-center gap-1 pt-6 text-[13px] text-ink-400">
        <Link href="/" className="hover:text-ink-600">
          홈
        </Link>
        <ChevronRight size={14} />
        <span>주거·부동산</span>
      </nav>

      <header className="flex items-start gap-4 pt-4 pb-8">
        <ToolIcon icon={tool.icon} accent={tool.accent} size="lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-[32px] sm:leading-tight">{tool.title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500 sm:text-base">{tool.summary}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-500 ring-1 ring-ink-100">
            <ShieldCheck size={14} className="text-emerald-500" />
            입력값은 저장되지 않아요 · {POLICY_BASE_LABEL}
          </p>
        </div>
      </header>

      {children}

      <article className="mx-auto mt-16 max-w-3xl">
        <p className="text-sm font-bold text-brand-500">전문 가이드</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-[28px] sm:leading-snug">{guideTitle}</h2>
        <div className="guide mt-2">{guide}</div>
      </article>

      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-4 text-lg font-bold text-ink-900">함께 쓰면 좋은 계산기</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {related.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}/`}
              className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <ToolIcon icon={t.icon} accent={t.accent} />
              <span className="text-sm font-semibold leading-snug text-ink-700 group-hover:text-ink-900">{t.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/** 계산기 2단 레이아웃: 좌측 입력 / 우측 결과(데스크톱에서 sticky) */
export function CalculatorLayout({ inputs, result }: { inputs: ReactNode; result: ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <div className="space-y-5">{inputs}</div>
      <div className="space-y-5 lg:sticky lg:top-24">{result}</div>
    </div>
  );
}
