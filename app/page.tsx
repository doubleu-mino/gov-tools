import { BadgeCheck, EyeOff, Zap } from "lucide-react";
import { ToolExplorer } from "@/components/home/ToolExplorer";

const BADGES = [
  { icon: BadgeCheck, title: "평생 100% 무료 시뮬레이터", desc: "유료 결제·광고성 상담 연결 없이 끝까지 무료" },
  { icon: Zap, title: "인증서·회원가입 없는 즉시 조회", desc: "본인인증 없이 숫자만 입력하면 바로 결과" },
  { icon: EyeOff, title: "개인정보 보관 제로", desc: "입력 데이터는 브라우저를 닫는 즉시 완전 파기" },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,#dbe9fe_0%,rgba(255,255,255,0)_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-[13px] font-bold text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            2026년 최신 정책 기준 반영
          </p>
          <h1 className="animate-rise mt-5 text-[34px] leading-[1.25] font-extrabold tracking-[-0.03em] text-ink-900 [animation-delay:60ms] sm:text-[56px] sm:leading-[1.15]">
            복잡한 정책 공고문 대신,
            <br />
            <span className="text-brand-500">1초 만에 확인하는</span> 내 지원금
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500 [animation-delay:120ms] sm:text-lg">
            소득과 가구 조건만 넣으면 신청 자격부터 예상 수령액까지 한눈에 계산해 드립니다.
          </p>

          <ul className="animate-rise mt-10 grid gap-3 [animation-delay:180ms] sm:grid-cols-3">
            {BADGES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl bg-ink-50/70 p-4 ring-1 ring-ink-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 shadow-sm">
                  <Icon size={18} strokeWidth={2.4} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink-900">{title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-500">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900">어떤 지원금이 궁금하세요?</h2>
        <p className="mt-1.5 text-[15px] text-ink-500">카테고리를 고르면 바로 쓸 수 있는 계산기를 보여드려요.</p>
        <ToolExplorer />
      </section>
    </>
  );
}
