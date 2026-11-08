import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[15px] font-bold text-ink-900">복지계산기 GovTools</p>
            <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-500">
              모든 계산은 이용자의 브라우저 안에서만 이루어지며, 입력한 정보는 서버로 전송되거나 저장되지 않습니다. 계산 결과는 참고용 모의 계산이며 실제
              자격과 금액은 각 기관의 최종 심사 결과에 따릅니다.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-600">
            <Link href="/about/" className="hover:text-ink-900">
              서비스 소개
            </Link>
            <Link href="/terms/" className="hover:text-ink-900">
              이용약관
            </Link>
            <Link href="/privacy/" className="font-bold text-ink-700 hover:text-ink-900">
              개인정보처리방침
            </Link>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-1 border-t border-ink-100 pt-6 text-[13px] text-ink-400 sm:flex-row sm:justify-between">
          <span>
            문의{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink-500 underline-offset-2 hover:underline">
              {CONTACT_EMAIL}
            </a>
          </span>
          <span>© {new Date().getFullYear()} GovTools. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
