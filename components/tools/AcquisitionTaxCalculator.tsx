"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { NumberField, Segmented, Toggle } from "@/components/ui/Field";
import { Notice, Pill, StatRow } from "@/components/ui/Status";
import { CalculatorLayout } from "@/components/tool/ToolShell";
import { calcAcquisitionTax } from "@/lib/calc/acquisitionTax";
import { formatPercent, formatWon, n } from "@/lib/format";
import { ACQ_TAX } from "@/lib/policy-data";

export function AcquisitionTaxCalculator() {
  const [price, setPrice] = useState<number | null>(55000);
  const [over85, setOver85] = useState(false);
  const [firstHome, setFirstHome] = useState(true);
  const [region, setRegion] = useState<"capital" | "local">("capital");
  const [houseType, setHouseType] = useState<"apartment" | "other">("apartment");
  const [area60, setArea60] = useState(false);

  const r = calcAcquisitionTax({ price: n(price), over85, firstHome, region, houseType, area60 });
  const priceOk = n(price) <= ACQ_TAX.firstHomePriceMax;
  const hasPrice = n(price) > 0;

  return (
    <CalculatorLayout
      inputs={
        <Card>
          <CardTitle sub="1세대 1주택(생애최초) 유상 매매 기준으로 계산해요.">주택 정보</CardTitle>
          <div className="space-y-6">
            <div>
              <NumberField label="매매가액 (취득가액)" value={price} onChange={setPrice} unit="만원" manwon placeholder="55000" />
              {hasPrice && (
                <div className="mt-2">
                  {priceOk ? <Pill tone="success">12억 이하 · 감면 가격요건 충족</Pill> : <Pill tone="danger">12억 초과 · 생애최초 감면 불가</Pill>}
                </div>
              )}
            </div>
            <Segmented
              label="전용면적"
              value={over85 ? "over" : "under"}
              onChange={(v) => {
                setOver85(v === "over");
                if (v === "over") setArea60(false);
              }}
              options={[
                { value: "under", label: "85㎡ 이하", sub: "농특세 비과세" },
                { value: "over", label: "85㎡ 초과", sub: "농특세 0.2%" },
              ]}
            />
            <Toggle
              label="생애최초 주택 구입"
              desc="본인과 배우자 모두 주택을 소유한 적이 없어요"
              checked={firstHome}
              onChange={setFirstHome}
            />
            <div className="rounded-2xl border border-dashed border-ink-200 p-4">
              <p className="text-sm font-bold text-ink-700">소형주택 특례 (300만원 한도) 확인</p>
              <p className="mt-0.5 text-[13px] text-ink-500">아파트 외 주택 · 전용 60㎡ 이하 · 수도권 6억 / 비수도권 3억 이하</p>
              <div className="mt-4 space-y-4">
                <Segmented
                  label="주택 유형"
                  value={houseType}
                  onChange={setHouseType}
                  options={[
                    { value: "apartment", label: "아파트" },
                    { value: "other", label: "아파트 외", sub: "연립·다세대·단독 등" },
                  ]}
                />
                <Segmented
                  label="소재지"
                  value={region}
                  onChange={setRegion}
                  options={[
                    { value: "capital", label: "수도권" },
                    { value: "local", label: "비수도권" },
                  ]}
                />
                {!over85 && <Toggle label="전용 60㎡ 이하" checked={area60} onChange={setArea60} />}
              </div>
            </div>
          </div>
        </Card>
      }
      result={
        <>
          <Card>
            <p className="text-[15px] font-semibold text-ink-500">최종 납부 예상액</p>
            <p className="tabular mt-1 text-[44px] leading-none font-extrabold tracking-tight text-ink-900">{formatWon(r.total)}</p>
            {r.relief > 0 ? (
              <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                감면 전 {formatWon(r.totalBefore)} → {formatWon(r.relief)} 절약
              </p>
            ) : (
              hasPrice && <p className="mt-3 text-sm text-ink-500">{r.reliefReason}</p>
            )}

            <div className="mt-6 divide-y divide-ink-100 border-t border-ink-100">
              <StatRow label={`취득세 (세율 ${formatPercent(r.acqRate, 4)})`} value={formatWon(r.acqTax)} />
              {r.relief > 0 && <StatRow label={<span className="text-emerald-600">{r.reliefLabel}</span>} value={<span className="text-emerald-600">−{formatWon(r.relief)}</span>} />}
              <StatRow label="지방교육세" value={formatWon(r.eduTax)} />
              <StatRow label={`농어촌특별세 ${over85 ? "(0.2%)" : "(비과세)"}`} value={formatWon(r.ruralTax)} muted={!over85} />
              <StatRow label="합계" value={formatWon(r.total)} strong />
            </div>
            {r.eligibleRelief && <p className="mt-3 text-[13px] text-ink-500">{r.reliefReason}</p>}
          </Card>

          <Card>
            <CardTitle>매매가 구간별 기본 취득세율</CardTitle>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { range: "6억 이하", rate: "1%", edu: "교육세 0.1%", active: n(price) <= 60000 },
                { range: "6억~9억", rate: "1~3%", edu: "구간별 누진", active: n(price) > 60000 && n(price) <= 90000 },
                { range: "9억 초과", rate: "3%", edu: "교육세 0.3%", active: n(price) > 90000 },
              ].map((b) => (
                <div key={b.range} className={`rounded-2xl p-3 ${b.active && hasPrice ? "bg-brand-500 text-white" : "bg-ink-50 text-ink-600"}`}>
                  <p className="text-[13px] font-semibold opacity-80">{b.range}</p>
                  <p className="mt-1 text-xl font-extrabold">{b.rate}</p>
                  <p className="mt-0.5 text-xs opacity-70">{b.edu}</p>
                </div>
              ))}
            </div>
          </Card>

          <Notice>
            감면받은 뒤 3개월 이내 전입하지 않거나, 3년 이내 매각·증여·임대(일부 제외)하면 감면세액이 추징됩니다. 지방교육세·농어촌특별세는 감면 전 본세
            기준으로 단순 계산했으며, 실제 고지액은 관할 시·군·구청 또는 위택스에서 확인하세요.
          </Notice>
        </>
      }
    />
  );
}
