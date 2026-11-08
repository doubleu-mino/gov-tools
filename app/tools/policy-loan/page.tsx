import type { Metadata } from "next";
import { ToolShell } from "@/components/tool/ToolShell";
import { PolicyLoanCalculator } from "@/components/tools/PolicyLoanCalculator";
import { BEOTIMMOK, DIDIMDOL, NEWBORN_BEOTIMMOK, NEWBORN_DIDIMDOL } from "@/lib/policy-data";
import { formatManwon } from "@/lib/format";

export const metadata: Metadata = {
  title: "디딤돌·버팀목·신생아특례 대출 자격 판독기 (한도·금리 계산)",
  description:
    "부부합산 연소득, 순자산, 주택가격(전세보증금), 출산 여부를 입력하면 디딤돌·신생아특례 디딤돌·버팀목·신생아특례 버팀목 대출 신청 가능 여부와 예상 한도·우대금리를 계산합니다.",
  alternates: { canonical: "/tools/policy-loan/" },
};

export default function Page() {
  return (
    <ToolShell slug="policy-loan" guideTitle="2026 정부지원 정책대출(디딤돌·신생아특례) 자격 조건 및 금리 비교 가이드" guide={<Guide />}>
      <PolicyLoanCalculator />
    </ToolShell>
  );
}

function Guide() {
  const m = formatManwon;
  return (
    <>
      <p>
        주택도시기금 정책대출은 시중은행 주택담보대출보다 금리가 1~3%p가량 낮아, 조건만 맞으면 가장 먼저 검토해야 할 선택지입니다. 핵심 상품은 주택
        구입용 <strong>디딤돌</strong>, 전세용 <strong>버팀목</strong>, 그리고 2년 내 출산 가구를 위한 <strong>신생아 특례</strong> 상품입니다.
      </p>

      <h2>상품별 자격 조건 한눈에 비교</h2>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>소득 (부부합산)</th>
            <th>순자산</th>
            <th>대상 주택</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>디딤돌</td>
            <td>
              {m(DIDIMDOL.income.general)} 이하
              <br />
              (생애최초·2자녀 {m(DIDIMDOL.income.firstOrTwoKids)}, 신혼 {m(DIDIMDOL.income.newlywed)})
            </td>
            <td>{m(DIDIMDOL.netAssetMax)} 이하</td>
            <td>
              {m(DIDIMDOL.housePrice.general)} 이하 (신혼·2자녀 {m(DIDIMDOL.housePrice.newlywedOrTwoKids)}), 85㎡ 이하
            </td>
          </tr>
          <tr>
            <td>신생아 특례 디딤돌</td>
            <td>{m(NEWBORN_DIDIMDOL.incomeMax)} 이하</td>
            <td>{m(NEWBORN_DIDIMDOL.netAssetMax)} 이하</td>
            <td>{m(NEWBORN_DIDIMDOL.housePriceMax)} 이하, 85㎡ 이하</td>
          </tr>
          <tr>
            <td>버팀목</td>
            <td>
              {m(BEOTIMMOK.income.general)} 이하
              <br />
              (2자녀 {m(BEOTIMMOK.income.twoKids)}, 신혼 {m(BEOTIMMOK.income.newlywed)})
            </td>
            <td>{m(BEOTIMMOK.netAssetMax)} 이하</td>
            <td>수도권 보증금 {m(BEOTIMMOK.depositMax.capital.general)} 이하 (신혼·2자녀 {m(BEOTIMMOK.depositMax.capital.newlywedOrTwoKids)})</td>
          </tr>
          <tr>
            <td>신생아 특례 버팀목</td>
            <td>{m(NEWBORN_BEOTIMMOK.incomeMax)} 이하</td>
            <td>{m(NEWBORN_BEOTIMMOK.netAssetMax)} 이하</td>
            <td>
              보증금 수도권 {m(NEWBORN_BEOTIMMOK.depositMax.capital)}·지방 {m(NEWBORN_BEOTIMMOK.depositMax.local)} 이하
            </td>
          </tr>
        </tbody>
      </table>

      <h2>한도는 어떻게 정해지나요?</h2>
      <p>
        구입자금은 <strong>상품별 최대한도와 LTV(주택가격 대비 대출 비율) 중 낮은 금액</strong>이 한도입니다. 2025년 6월 가계부채 관리방안 이후 수도권
        디딤돌 한도는 일반 {m(DIDIMDOL.limit.capital.general)}, 생애최초 {m(DIDIMDOL.limit.capital.first)}, 신혼·2자녀{" "}
        {m(DIDIMDOL.limit.capital.newlywedOrTwoKids)}, 신생아 특례 {m(NEWBORN_DIDIMDOL.limit.capital)}로 축소되었습니다. 전세자금은{" "}
        <strong>전세보증금의 80% 이내</strong>에서 상품별 최대한도가 적용됩니다.
      </p>

      <h2>금리 비교와 우대금리 받는 법</h2>
      <ul>
        <li>
          <strong>소득이 낮을수록, 만기가 짧을수록</strong> 기본금리가 낮아집니다. 디딤돌은 10년 만기 대비 30년 만기가 약 0.3%p 높습니다.
        </li>
        <li>
          디딤돌 우대금리: 자녀 수(1자녀 0.3%p·2자녀 0.5%p·3자녀 이상 0.7%p), 생애최초 0.2%p, 신혼가구 0.2%p, 청약통장 가입 우대 등이 중복
          적용됩니다.
        </li>
        <li>
          신생아 특례는 <strong>특례금리가 5년간</strong> 적용되고, 대출 기간 중 아이를 더 낳으면 1명당 0.2%p 추가 인하와 함께 특례 기간이 연장됩니다.
        </li>
      </ul>

      <h2>신청 전 꼭 확인할 3가지</h2>
      <ol>
        <li>
          <strong>무주택 세대주 요건</strong>: 신청인과 세대원 전원이 무주택이어야 합니다. 분양권·입주권도 주택으로 볼 수 있습니다.
        </li>
        <li>
          <strong>소득 산정 기준</strong>: 부부합산 세전 연소득이며, 직장인은 원천징수영수증, 사업자는 소득금액증명원 기준입니다.
        </li>
        <li>
          <strong>순자산 계산</strong>: 세대원 전체의 부동산·예금·자동차 등에서 부채를 뺀 금액으로, 기준은 매년 통계청 자료를 반영해 바뀝니다.
        </li>
      </ol>
      <p>
        정책 기준은 수시로 바뀌므로 최종 신청 전 주택도시기금 홈페이지(기금e든든)의 자가진단과 취급은행 상담을 꼭 거치세요.
      </p>
    </>
  );
}
