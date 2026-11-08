import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "서비스 소개",
  description: "복지계산기(GovTools)는 복잡한 정책 공고문을 누구나 1초 만에 이해할 수 있도록 돕는 무료 시뮬레이터입니다.",
  alternates: { canonical: "/about/" },
};

export default function Page() {
  return (
    <LegalPage title="서비스 소개">
      <p>
        <strong>복지계산기(GovTools)</strong>는 수십 페이지의 정책 공고문을 읽지 않아도, 소득과 가구 조건만 입력하면 내가 받을 수 있는 지원금과 신청
        자격을 바로 확인할 수 있도록 만든 무료 시뮬레이터입니다.
      </p>
      <h2>우리가 지키는 원칙</h2>
      <ul>
        <li>
          <strong>평생 100% 무료</strong>: 모든 계산기는 결제나 회원가입 없이 이용할 수 있습니다.
        </li>
        <li>
          <strong>즉시 조회</strong>: 공동인증서·본인인증 없이 숫자만 입력하면 결과가 바로 나옵니다.
        </li>
        <li>
          <strong>개인정보 보관 제로</strong>: 모든 계산은 이용자의 브라우저 안에서만 이루어지며, 입력값은 서버로 전송·저장되지 않고 브라우저를 닫는
          즉시 사라집니다.
        </li>
      </ul>
      <h2>계산 결과에 대하여</h2>
      <p>
        계산 결과는 공개된 정책 기준을 바탕으로 한 모의 계산이며, 법적 효력이 없습니다. 정책 기준은 수시로 바뀔 수 있으므로 실제 신청 전에는 반드시
        해당 기관의 최신 공고를 확인해 주세요.
      </p>
      <h2>문의</h2>
      <p>
        오류 제보나 새로운 계산기 제안은 <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 보내주세요.
      </p>
    </LegalPage>
  );
}
