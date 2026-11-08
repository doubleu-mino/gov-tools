import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_DESCRIPTION, SITE_NAME_FULL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME_FULL} | 1초 만에 확인하는 내 지원금`,
    template: `%s | 복지계산기`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["복지계산기", "청약 가점 계산기", "디딤돌대출", "신생아특례대출", "버팀목", "공공임대", "행복주택", "취득세 계산기", "생애최초"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME_FULL,
    title: "복잡한 정책 공고문 대신, 1초 만에 확인하는 내 지원금",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-screen font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
