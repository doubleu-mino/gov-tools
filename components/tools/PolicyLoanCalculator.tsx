"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { NumberField, Segmented, Toggle } from "@/components/ui/Field";
import { CheckRow, Notice, Pill, StatRow } from "@/components/ui/Status";
import { CalculatorLayout } from "@/components/tool/ToolShell";
import { calcPolicyLoans, LoanPurpose, LoanResult, Region } from "@/lib/calc/policyLoan";
import { formatManwon, formatPercent, formatWon, n } from "@/lib/format";

function LoanCard({ r, best }: { r: LoanResult; best: boolean }) {
  return (
    <Card className={`animate-rise ${best ? "ring-2 ring-brand-500" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {r.eligible ? <Pill tone="success">신청 가능</Pill> : <Pill tone="danger">자격 미달</Pill>}
            {best && <Pill tone="brand">가장 유리해요</Pill>}
          </div>
          <h3 className="mt-2 text-lg font-bold text-ink-900">{r.name}</h3>
        </div>
        {r.eligible ? <CheckCircle2 className="shrink-0 text-emerald-500" size={28} /> : <XCircle className="shrink-0 text-ink-200" size={28} />}
      </div>

      {r.eligible ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-ink-50 p-4">
              <p className="text-[13px] text-ink-500">예상 최대 한도</p>
              <p className="tabular mt-1 text-xl font-extrabold text-ink-900">{formatManwon(r.limit)}</p>
              <p className="mt-0.5 text-xs text-ink-400">{r.limitReason}</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-[13px] text-brand-600">예상 적용 금리</p>
              <p className="tabular mt-1 text-xl font-extrabold text-brand-600">연 {formatPercent(r.finalRate)}</p>
              {r.prefRate > 0 && <p className="mt-0.5 text-xs text-brand-500">기본 {formatPercent(r.baseRate)} − 우대 {formatPercent(r.prefRate)}p</p>}
            </div>
          </div>
          <div className="mt-3 divide-y divide-ink-100">
            <StatRow label={r.monthlyLabel} value={`약 ${formatWon(Math.round(r.monthly / 100) * 100)}`} />
          </div>
          {r.prefs.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.prefs.map((p) => (
                <span key={p} className="rounded-lg bg-ink-50 px-2 py-1 text-xs font-semibold text-ink-600">
                  {p}
                </span>
              ))}
            </div>
          )}
          {r.note && <p className="mt-3 text-[13px] text-ink-500">{r.note}</p>}
        </>
      ) : null}

      <details className="group mt-4" open={!r.eligible}>
        <summary className="cursor-pointer list-none text-sm font-semibold text-ink-500 hover:text-ink-700">
          자격 요건 상세 <span className="inline-block transition group-open:rotate-180">⌄</span>
        </summary>
        <ul className="mt-2 divide-y divide-ink-50">
          {r.checks.map((c) => (
            <CheckRow key={c.label} {...c} />
          ))}
        </ul>
      </details>
    </Card>
  );
}

export function PolicyLoanCalculator() {
  const [purpose, setPurpose] = useState<LoanPurpose>("buy");
  const [region, setRegion] = useState<Region>("capital");
  const [income, setIncome] = useState<number | null>(6500);
  const [netAsset, setNetAsset] = useState<number | null>(25000);
  const [price, setPrice] = useState<number | null>(55000);
  const [area, setArea] = useState<number | null>(84);
  const [newborn, setNewborn] = useState(true);
  const [kids, setKids] = useState(1);
  const [newlywed, setNewlywed] = useState(true);
  const [firstHome, setFirstHome] = useState(true);
  const [subscription, setSubscription] = useState(true);
  const [term, setTerm] = useState(30);

  const results = useMemo(
    () =>
      calcPolicyLoans({
        purpose,
        region,
        income: n(income),
        netAsset: n(netAsset),
        price: n(price),
        area: n(area),
        newborn,
        kids,
        newlywed,
        firstHome,
        subscription,
        termYears: term,
      }),
    [purpose, region, income, netAsset, price, area, newborn, kids, newlywed, firstHome, subscription, term],
  );

  const ready = income !== null && netAsset !== null && price !== null && price > 0;
  const eligibleCount = results.filter((r) => r.eligible).length;

  return (
    <CalculatorLayout
      inputs={
        <>
          <Card>
            <CardTitle>대출 목적과 지역</CardTitle>
            <div className="space-y-6">
              <Segmented
                label="대출 목적"
                value={purpose}
                onChange={(v) => {
                  setPurpose(v);
                  setPrice(v === "buy" ? 55000 : 25000);
                }}
                options={[
                  { value: "buy", label: "주택 구입", sub: "디딤돌" },
                  { value: "jeonse", label: "전세 자금", sub: "버팀목" },
                ]}
              />
              <Segmented
                label="주택 소재지"
                value={region}
                onChange={setRegion}
                options={[
                  { value: "capital", label: "수도권", sub: "서울·경기·인천" },
                  { value: "local", label: "비수도권" },
                ]}
              />
            </div>
          </Card>

          <Card>
            <CardTitle sub="금액은 만원 단위로 입력해 주세요.">소득·자산·주택 정보</CardTitle>
            <div className="space-y-6">
              <NumberField label="부부합산 연소득 (세전)" value={income} onChange={setIncome} unit="만원" manwon placeholder="6500" />
              <NumberField
                label="순자산 (자산 − 부채)"
                value={netAsset}
                onChange={setNetAsset}
                unit="만원"
                manwon
                hint="부동산·예금·자동차 등 세대원 전체 자산에서 부채를 뺀 금액"
              />
              <NumberField
                label={purpose === "buy" ? "주택 가격 (매매가)" : "전세 보증금"}
                value={price}
                onChange={setPrice}
                unit="만원"
                manwon
              />
              <NumberField label="전용면적" value={area} onChange={setArea} unit="㎡" decimal max={500} />
              {purpose === "buy" && (
                <Segmented
                  label="대출 만기"
                  value={term}
                  onChange={setTerm}
                  options={[
                    { value: 10, label: "10년" },
                    { value: 15, label: "15년" },
                    { value: 20, label: "20년" },
                    { value: 30, label: "30년" },
                  ]}
                />
              )}
            </div>
          </Card>

          <Card>
            <CardTitle sub="해당되는 항목을 켜면 특례 자격과 우대금리가 반영돼요.">가구 조건</CardTitle>
            <div className="space-y-3">
              <Toggle label="2년 내 출산(입양)" desc="대출 신청일 기준 2년 이내 출생 자녀가 있어요" checked={newborn} onChange={setNewborn} />
              <Toggle label="신혼가구" desc="혼인 7년 이내 또는 3개월 내 결혼 예정" checked={newlywed} onChange={setNewlywed} />
              {purpose === "buy" && <Toggle label="생애최초 주택 구입" desc="세대원 전원 주택 소유 이력 없음" checked={firstHome} onChange={setFirstHome} />}
              {purpose === "buy" && <Toggle label="청약통장 보유" desc="주택청약종합저축 가입 1년 이상" checked={subscription} onChange={setSubscription} />}
              <div className="pt-3">
                <Segmented
                  label="미성년 자녀 수"
                  value={kids}
                  onChange={setKids}
                  options={[
                    { value: 0, label: "없음" },
                    { value: 1, label: "1명" },
                    { value: 2, label: "2명" },
                    { value: 3, label: "3명+" },
                  ]}
                />
              </div>
            </div>
          </Card>
        </>
      }
      result={
        <>
          <Card className="bg-ink-900 ring-0">
            <p className="text-[15px] font-semibold text-white/60">판정 결과</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-white">
              {!ready ? "정보를 입력해 주세요" : eligibleCount > 0 ? `${eligibleCount}개 상품을 신청할 수 있어요` : "신청 가능한 상품이 없어요"}
            </p>
            {ready && eligibleCount > 0 && (
              <p className="mt-2 text-sm text-white/60">
                최대 {formatManwon(Math.max(...results.filter((r) => r.eligible).map((r) => r.limit)))}까지, 최저 연{" "}
                {formatPercent(Math.min(...results.filter((r) => r.eligible).map((r) => r.finalRate)))} 금리가 예상돼요.
              </p>
            )}
          </Card>
          {ready && results.map((r, idx) => <LoanCard key={r.id} r={r} best={idx === 0 && r.eligible && eligibleCount > 1} />)}
          <Notice>
            무주택 세대주 요건, 신용도, DSR, 담보 평가에 따라 실제 한도와 금리는 달라질 수 있어요. 금리는 기금 고시금리를 바탕으로 한 근사치이며, 최종
            조건은 주택도시기금 기금e든든 또는 취급은행에서 확인하세요.
          </Notice>
        </>
      }
    />
  );
}
