"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { NumberField, SelectField, Segmented, Toggle } from "@/components/ui/Field";
import { CheckRow, Notice, Pill } from "@/components/ui/Status";
import { CalculatorLayout } from "@/components/tool/ToolShell";
import { ApplicantType, baseIncome, calcRental, INCOME_BANDS, incomeRatio, RentalResult } from "@/lib/calc/rentalHousing";
import { n } from "@/lib/format";
import { URBAN_WORKER_INCOME_YEAR } from "@/lib/policy-data";

const manwonWon = (won: number) => `${Math.round(won / 10000).toLocaleString()}만원`;

function VerdictPill({ v }: { v: RentalResult["verdict"] }) {
  if (v === "eligible") return <Pill tone="success">자격 충족</Pill>;
  if (v === "conditional") return <Pill tone="warning">조건부 · 소득 소폭 초과</Pill>;
  return <Pill tone="danger">자격 미달</Pill>;
}

function IncomeGauge({ ratio, members }: { ratio: number; members: number }) {
  const scaleMax = 140;
  const pos = Math.min(ratio, scaleMax) / scaleMax;
  const base = baseIncome(members);
  return (
    <div>
      <div className="relative mt-8 h-3 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400">
        {INCOME_BANDS.map((b) => (
          <span key={b} className="absolute top-0 h-3 w-0.5 bg-white/90" style={{ left: `${(b / scaleMax) * 100}%` }} />
        ))}
        <span
          className="absolute -top-8 -translate-x-1/2 rounded-lg bg-ink-900 px-2 py-1 text-xs font-bold whitespace-nowrap text-white transition-[left] duration-500"
          style={{ left: `${pos * 100}%` }}
        >
          나 {ratio.toFixed(1)}%
        </span>
        <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-ink-900 shadow transition-[left] duration-500" style={{ left: `${pos * 100}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {INCOME_BANDS.map((b) => {
          const ok = ratio <= b;
          return (
            <div key={b} className={`rounded-2xl p-3 text-center ${ok ? "bg-emerald-50" : "bg-ink-50"}`}>
              <p className={`text-[13px] font-bold ${ok ? "text-emerald-600" : "text-ink-400"}`}>{b}%</p>
              <p className="tabular mt-0.5 text-xs text-ink-500">{manwonWon((base * b) / 100)}</p>
              <p className={`mt-1 text-xs font-bold ${ok ? "text-emerald-600" : "text-ink-300"}`}>{ok ? "이하 ✓" : "초과"}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RentalHousingCalculator() {
  const [members, setMembers] = useState(3);
  const [income, setIncome] = useState<number | null>(420);
  const [asset, setAsset] = useState<number | null>(15000);
  const [car, setCar] = useState<number | null>(1500);
  const [applicant, setApplicant] = useState<ApplicantType>("newlywed");
  const [dual, setDual] = useState(true);
  const [recipient, setRecipient] = useState(false);

  const input = {
    members,
    monthlyIncome: n(income) * 10000,
    totalAsset: n(asset),
    carValue: n(car),
    applicant,
    dualIncome: dual,
    welfareRecipient: recipient,
  };
  const results = calcRental(input);
  const ratio = incomeRatio(input);
  const okCount = results.filter((r) => r.verdict === "eligible").length;

  return (
    <CalculatorLayout
      inputs={
        <>
          <Card>
            <CardTitle sub="세대원 전원의 소득·자산을 합산해 입력하세요.">가구 정보</CardTitle>
            <div className="space-y-6">
              <SelectField
                label="가구원 수 (태아 포함)"
                value={members}
                onChange={setMembers}
                options={[1, 2, 3, 4, 5, 6, 7, 8].map((v) => ({ value: v, label: v === 8 ? "8인 이상" : `${v}인 가구` }))}
              />
              <Segmented
                label="신청자 유형"
                value={applicant}
                onChange={setApplicant}
                options={[
                  { value: "general", label: "일반" },
                  { value: "youth", label: "청년", sub: "19~39세" },
                  { value: "newlywed", label: "신혼부부", sub: "7년 이내" },
                  { value: "senior", label: "고령자", sub: "65세+" },
                ]}
              />
              <NumberField
                label="세대 월평균소득 (세전)"
                value={income}
                onChange={setIncome}
                unit="만원/월"
                hint="근로·사업·재산·연금 소득 등을 모두 합한 월평균 금액"
              />
              <NumberField label="총자산 (부채 차감)" value={asset} onChange={setAsset} unit="만원" manwon hint="부동산 + 금융자산 + 기타자산 − 부채" />
              <NumberField label="자동차가액 (보유 차량 합산)" value={car} onChange={setCar} unit="만원" manwon hint="보험개발원 차량기준가액, 없으면 0" />
              <div className="space-y-3">
                {applicant === "newlywed" && <Toggle label="맞벌이 가구" desc="부부 모두 소득이 있어요 (소득 기준 완화)" checked={dual} onChange={setDual} />}
                <Toggle label="수급자·차상위·한부모 가구" desc="생계·의료급여 수급자, 차상위계층, 한부모가족 등" checked={recipient} onChange={setRecipient} />
              </div>
            </div>
          </Card>
        </>
      }
      result={
        <>
          <Card>
            <p className="text-[15px] font-semibold text-ink-500">{members}인 가구 도시근로자 월평균소득 대비</p>
            <p className="tabular mt-1 text-[44px] leading-none font-extrabold tracking-tight text-ink-900">
              {ratio.toFixed(1)}
              <span className="text-2xl font-bold text-ink-300">%</span>
            </p>
            <p className="mt-2 text-sm text-ink-500">
              기준(100%) {manwonWon(baseIncome(members))} · 내 소득 {manwonWon(input.monthlyIncome)}
            </p>
            <IncomeGauge ratio={ratio} members={members} />
          </Card>

          <Card>
            <CardTitle sub={`${okCount}개 유형의 자격 요건을 충족해요.`}>공공임대 유형별 매칭 결과</CardTitle>
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r.id} className={`rounded-2xl p-4 ring-1 ${r.verdict === "eligible" ? "bg-emerald-50/40 ring-emerald-100" : "ring-ink-100"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-ink-900">{r.name}</h3>
                      <p className="mt-0.5 text-[13px] text-ink-500">{r.desc}</p>
                    </div>
                    <VerdictPill v={r.verdict} />
                  </div>
                  <ul className="mt-2 divide-y divide-ink-100/70">
                    {r.checks.map((c) => (
                      <CheckRow key={c.label} {...c} />
                    ))}
                  </ul>
                  <p className="mt-2 rounded-xl bg-white/80 px-3 py-2 text-[13px] leading-relaxed text-ink-600">💡 {r.tip}</p>
                </div>
              ))}
            </div>
          </Card>
          <Notice>
            소득 기준은 {URBAN_WORKER_INCOME_YEAR}을 적용했으며, 1·2인 가구는 유형별로 가산 비율이 반영됩니다. 실제 자격은 모집공고문의 기준연도·지역·
            세부 순위 요건에 따라 달라질 수 있어요. 최종 확인은 LH청약플러스·SH인터넷청약·마이홈포털에서 해주세요.
          </Notice>
        </>
      }
    />
  );
}
