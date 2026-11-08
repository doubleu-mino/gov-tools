import Link from "next/link";
import { Calculator } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="복지계산기 홈">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Calculator size={18} strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-ink-900">
            복지계산기 <span className="font-semibold text-ink-400">GovTools</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[15px] font-medium text-ink-600">
          <Link href="/#tools" className="rounded-xl px-3 py-2 transition hover:bg-ink-50">
            전체 계산기
          </Link>
          <Link href="/about/" className="hidden rounded-xl px-3 py-2 transition hover:bg-ink-50 sm:block">
            서비스 소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
