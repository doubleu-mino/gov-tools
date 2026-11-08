import type { Metadata } from "next";
import { ToolShell } from "@/components/tool/ToolShell";
import { RentalHousingCalculator } from "@/components/tools/RentalHousingCalculator";
import { RENTAL_ASSET } from "@/lib/policy-data";
import { formatManwon } from "@/lib/format";

export const metadata: Metadata = {
  title: "LH·SH 공공임대 자격 판독기 (국민임대·행복주택·영구임대·매입임대)",
  description:
    "가구원 수와 월평균소득을 입력하면 도시근로자 월평균소득 50%·70%·100%·120% 기준과 자동 비교하고, 총자산·자동차가액까지 반영해 신청 가능한 공공임대 유형을 알려드립니다.",
  alternates: { canonical: "/tools/rental-housing/" },
};

export default function Page() {
  return (
    <ToolShell slug="rental-housing" guideTitle="공공임대주택 유형별 소득·자산 기준 및 당첨 확률 높이는 전략" guide={<Guide />}>
      <RentalHousingCalculator />
    </ToolShell>
  );
}

function Guide() {
  const m = formatManwon;
  return (
    <>
      <p>
        공공임대주택은 LH(한국토지주택공사)와 SH(서울주택도시공사) 등 공공기관이 시세보다 저렴하게 공급하는 임대주택입니다. 유형마다{" "}
        <strong>소득 기준(도시근로자 가구원수별 월평균소득 대비 %)</strong>, <strong>총자산</strong>, <strong>자동차가액</strong> 세 가지를 모두
        충족해야 하며, 세대원 전원의 소득과 자산을 합산합니다.
      </p>

      <h2>유형별 소득·자산 기준</h2>
      <table>
        <thead>
          <tr>
            <th>유형</th>
            <th>소득 기준</th>
            <th>총자산</th>
            <th>임대료 수준</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>영구임대</td>
            <td>수급자 등 1순위 / 일반 50% 이하</td>
            <td>{m(RENTAL_ASSET.permanent)}</td>
            <td>시세 약 30%</td>
          </tr>
          <tr>
            <td>국민임대</td>
            <td>70% 이하 (1인 90%, 2인 80%)</td>
            <td>{m(RENTAL_ASSET.national)}</td>
            <td>시세 60~80%</td>
          </tr>
          <tr>
            <td>행복주택 (청년)</td>
            <td>100% 이하 (1인 120%, 2인 110%)</td>
            <td>{m(RENTAL_ASSET.happyYouth)}</td>
            <td>시세 60~80%</td>
          </tr>
          <tr>
            <td>행복주택 (신혼부부)</td>
            <td>100% 이하 (맞벌이 120%)</td>
            <td>{m(RENTAL_ASSET.happyNewlywed)}</td>
            <td>시세 60~80%</td>
          </tr>
          <tr>
            <td>매입임대 (일반)</td>
            <td>수급자 등 1순위 / 50% 이하 2순위</td>
            <td>{m(RENTAL_ASSET.purchaseGeneral)}</td>
            <td>시세 30~40%</td>
          </tr>
          <tr>
            <td>신혼·신생아 매입임대 I</td>
            <td>70% 이하 (맞벌이 90%)</td>
            <td>{m(RENTAL_ASSET.purchaseNewlywed)}</td>
            <td>시세 30~40%</td>
          </tr>
        </tbody>
      </table>
      <p>
        자동차가액 기준은 공통적으로 <strong>{m(RENTAL_ASSET.carMax)} 이하</strong>이며, 기준 금액은 매년 공고마다 갱신되므로 모집공고문의 수치를
        최우선으로 확인하세요.
      </p>

      <h2>소득 산정 시 주의할 점</h2>
      <ul>
        <li>
          <strong>가구원 수</strong>에는 신청자 본인, 배우자, 같은 등본에 있는 직계존비속이 포함되며 임신 중인 태아도 포함됩니다.
        </li>
        <li>
          <strong>월평균소득</strong>은 근로소득뿐 아니라 사업·재산·연금·기타소득을 모두 합산합니다. 육아휴직 급여 등 일부 소득은 제외될 수 있습니다.
        </li>
        <li>
          <strong>총자산</strong>은 토지·건물(공시가격), 금융자산, 자동차 등을 더하고 부채를 뺀 금액입니다.
        </li>
      </ul>

      <h2>당첨 확률을 높이는 전략</h2>
      <ol>
        <li>
          <strong>배점 항목을 미리 채우세요.</strong> 국민임대는 해당 시·군 거주기간, 청약통장 납입횟수, 미성년 자녀 수, 부양가족 등이 배점에
          반영됩니다. 청약통장은 매월 꾸준히 납입해 두는 것이 유리합니다.
        </li>
        <li>
          <strong>경쟁이 덜한 단지와 평형을 노리세요.</strong> 신규 단지보다 재공급·예비입주자 모집, 도심보다 외곽 단지의 경쟁률이 크게 낮은 경우가
          많습니다.
        </li>
        <li>
          <strong>소득 구간을 확인하세요.</strong> 같은 국민임대라도 전용 50㎡ 미만은 소득 50% 이하 가구에 우선 공급됩니다. 내 소득 비율에 맞는
          평형을 고르면 순위가 올라갑니다.
        </li>
        <li>
          <strong>알림을 등록하세요.</strong> LH청약플러스·SH인터넷청약·마이홈포털의 공고 알림을 설정하면 모집 기간을 놓치지 않습니다.
        </li>
      </ol>
    </>
  );
}
