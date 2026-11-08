import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <p className="text-5xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-ink-500">주소가 바뀌었거나 아직 준비 중인 계산기일 수 있어요.</p>
      <Link href="/" className="mt-8 inline-block rounded-2xl bg-brand-500 px-6 py-3.5 font-bold text-white hover:bg-brand-600">
        홈으로 가기
      </Link>
    </div>
  );
}
