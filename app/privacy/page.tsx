import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy/" },
};

export default function Page() {
  return (
    <LegalPage title="개인정보처리방침" updated="2026년 11월 8일">
      <p>
        복지계산기(GovTools, 이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
      </p>
      <h2>1. 수집하는 개인정보</h2>
      <p>
        서비스는 회원가입 기능이 없으며, <strong>이름·연락처·주민등록번호 등 개인을 식별할 수 있는 정보를 수집하지 않습니다.</strong>
      </p>
      <h2>2. 계산기 입력 정보의 처리</h2>
      <ul>
        <li>소득, 자산, 가구원 수 등 계산기에 입력한 값은 이용자의 브라우저(기기) 메모리 안에서만 계산에 사용됩니다.</li>
        <li>입력값은 서버로 전송되지 않으며, 쿠키·로컬스토리지 등에 저장하지 않습니다.</li>
        <li>페이지를 새로고침하거나 브라우저를 닫으면 입력값은 즉시 사라집니다.</li>
      </ul>
      <h2>3. 자동 수집 정보</h2>
      <p>
        서비스는 정적 웹사이트로 Cloudflare Pages를 통해 제공되며, 호스팅 사업자가 보안 및 서비스 안정성을 위해 접속 IP, 접속 시각, 브라우저 정보
        등 기술적 로그를 일시적으로 처리할 수 있습니다. 운영자는 이를 이용해 개인을 식별하지 않습니다.
      </p>
      <h2>4. 제3자 제공 및 위탁</h2>
      <p>서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 웹 폰트는 공개 CDN(jsDelivr)에서 불러옵니다.</p>
      <h2>5. 개인정보 보호책임자 및 문의</h2>
      <p>
        개인정보 관련 문의는 <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 연락해 주세요.
      </p>
      <h2>6. 방침의 변경</h2>
      <p>이 방침이 변경되는 경우 시행일과 변경 내용을 서비스 화면에 공지합니다.</p>
    </LegalPage>
  );
}
