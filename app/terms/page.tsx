import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  alternates: { canonical: "/terms/" },
};

export default function Page() {
  return (
    <LegalPage title="이용약관" updated="2026년 11월 8일">
      <h2>제1조 (목적)</h2>
      <p>
        이 약관은 복지계산기(GovTools, 이하 &ldquo;서비스&rdquo;)가 제공하는 정책 지원금·세금·대출 모의 계산 서비스의 이용 조건과 절차, 이용자와
        서비스 운영자의 권리·의무를 정하는 것을 목적으로 합니다.
      </p>
      <h2>제2조 (서비스의 내용)</h2>
      <p>서비스는 이용자가 입력한 정보를 바탕으로 정부 정책의 신청 자격, 예상 금액 등을 이용자의 브라우저에서 계산하여 보여주는 정보 제공 서비스입니다.</p>
      <h2>제3조 (이용 요금)</h2>
      <p>서비스는 무료로 제공되며 별도의 회원가입을 요구하지 않습니다.</p>
      <h2>제4조 (결과의 성격 및 책임의 한계)</h2>
      <ol>
        <li>서비스의 계산 결과는 공개된 정책 기준을 바탕으로 한 참고용 모의 계산이며, 법적 효력이나 자격·금액을 보증하지 않습니다.</li>
        <li>실제 자격 및 금액은 관계 기관의 심사와 최신 공고에 따라 결정되며, 정책 변경이 서비스에 즉시 반영되지 않을 수 있습니다.</li>
        <li>운영자는 계산 결과를 근거로 한 이용자의 의사결정에 대해 법적 책임을 지지 않습니다.</li>
      </ol>
      <h2>제5조 (이용자의 의무)</h2>
      <p>이용자는 서비스를 정상적인 용도로만 이용해야 하며, 서비스의 운영을 방해하는 행위를 해서는 안 됩니다.</p>
      <h2>제6조 (약관의 변경)</h2>
      <p>운영자는 필요한 경우 약관을 변경할 수 있으며, 변경 시 서비스 화면에 공지합니다.</p>
      <h2>문의</h2>
      <p>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
