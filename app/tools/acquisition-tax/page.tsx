import type { Metadata } from "next";
import { ToolShell } from "@/components/tool/ToolShell";
import { AcquisitionTaxCalculator } from "@/components/tools/AcquisitionTaxCalculator";

export const metadata: Metadata = {
  title: "생애최초 주택 취득세 감면 계산기 (200만원 감면 자동 적용)",
  description:
    "매매가액과 전용면적을 입력하면 1~3% 기본 취득세율에 지방교육세·농어촌특별세를 더하고, 생애최초 200만원 감면을 적용한 최종 납부액을 계산합니다.",
  alternates: { canonical: "/tools/acquisition-tax/" },
};

export default function Page() {
  return (
    <ToolShell slug="acquisition-tax" guideTitle="생애최초 주택 취득세 200만원 감면 혜택 요건과 3년 실거주 의무 주의사항" guide={<Guide />}>
      <AcquisitionTaxCalculator />
    </ToolShell>
  );
}

function Guide() {
  return (
    <>
      <p>
        생애 처음으로 주택을 사는 경우, 주택 가격이 <strong>12억 원 이하</strong>라면 소득 기준과 관계없이 취득세를 <strong>최대 200만 원</strong>까지
        감면받을 수 있습니다(지방세특례제한법 제36조의3). 취득세가 200만 원 이하라면 전액 면제됩니다.
      </p>

      <h2>취득세는 어떻게 계산되나요?</h2>
      <table>
        <thead>
          <tr>
            <th>취득가액</th>
            <th>취득세</th>
            <th>지방교육세</th>
            <th>농특세 (85㎡ 초과)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>6억 원 이하</td>
            <td>1%</td>
            <td>0.1%</td>
            <td>0.2%</td>
          </tr>
          <tr>
            <td>6억 초과 ~ 9억 원 이하</td>
            <td>(취득가액 × 2/3억 − 3)%</td>
            <td>취득세율 × 10%</td>
            <td>0.2%</td>
          </tr>
          <tr>
            <td>9억 원 초과</td>
            <td>3%</td>
            <td>0.3%</td>
            <td>0.2%</td>
          </tr>
        </tbody>
      </table>
      <p>
        예를 들어 7억 5천만 원 아파트(전용 84㎡)라면 취득세율은 (7.5 × 2/3 − 3) = 2%로 취득세 1,500만 원, 지방교육세 150만 원이 나오고, 생애최초
        감면 200만 원을 적용하면 최종 납부액은 1,450만 원입니다.
      </p>

      <h2>감면 요건</h2>
      <ul>
        <li>
          <strong>본인과 배우자 모두</strong> 주택을 소유한 사실이 없어야 합니다. 예비 배우자나 결혼 전 배우자의 주택 이력도 포함됩니다.
        </li>
        <li>
          취득가액이 <strong>12억 원 이하</strong>여야 하며, 소득 요건은 없습니다.
        </li>
        <li>
          아파트가 아닌 전용 60㎡ 이하 소형주택(수도권 6억·비수도권 3억 이하)은 감면 한도가 <strong>300만 원</strong>으로 확대됩니다.
        </li>
        <li>
          상속으로 받은 지분, 일정 가격 이하의 소형·저가 주택 소유 이력은 예외적으로 무주택으로 인정될 수 있습니다.
        </li>
      </ul>

      <h2>3년 실거주 의무, 이것만은 꼭 주의하세요</h2>
      <ol>
        <li>
          <strong>3개월 이내 전입</strong>: 취득일(잔금일)부터 3개월 이내에 전입신고를 하고 실제로 거주해야 합니다. 기존 세입자가 있어 바로 입주하지
          못하면 감면이 추징될 수 있습니다.
        </li>
        <li>
          <strong>3년 이상 상시 거주</strong>: 실거주 기간이 3년이 되기 전에 매각·증여하거나 다른 용도(임대 등)로 사용하면 감면받은 세액을 다시
          납부해야 합니다.
        </li>
        <li>
          <strong>추가 주택 취득 주의</strong>: 3개월 이내에 다른 주택을 추가로 취득하면 감면이 취소됩니다. 상속으로 인한 추가 취득은 예외입니다.
        </li>
        <li>
          <strong>추징 시 가산세</strong>: 감면이 취소되면 감면세액과 함께 가산세가 부과될 수 있습니다.
        </li>
      </ol>
      <p>
        감면은 자동으로 적용되지 않습니다. 잔금일 취득세 신고 시 법무사에게 생애최초 감면을 요청하거나, 위택스에서 직접 감면 신청을 해야 합니다.
      </p>
    </>
  );
}
