"use client";

import { useMemo, useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { FieldShell, SelectField } from "@/components/ui/Field";
import { Notice, Pill } from "@/components/ui/Status";
import { CalculatorLayout } from "@/components/tool/ToolShell";
import { calcAptScore, CUTLINE_TIERS, MAX, tierStatus } from "@/lib/calc/aptScore";

const HOMELESS_OPTIONS = [
  { value: -1, label: "유주택자 / 만 30세 미만 미혼 (0점)" },
  { value: 0, label: "1년 미만" },
  ...Array.from({ length: 14 }, (_, k) => ({ value: k + 1, label: `${k + 1}년 이상 ~ ${k + 2}년 미만` })),
  { value: 15, label: "15년 이상" },
];

const ACCOUNT_OPTIONS = [
  { value: 0, label: "6개월 미만" },
  { value: 6, label: "6개월 이상 ~ 1년 미만" },
  ...Array.from({ length: 14 }, (_, k) => ({ value: (k + 1) * 12, label: `${k + 1}년 이상 ~ ${k + 2}년 미만` })),
  { value: 180, label: "15년 이상" },
];

const SPOUSE_OPTIONS = [{ value: -1, label: "해당 없음 (미혼 또는 배우자 통장 없음)" }, ...ACCOUNT_OPTIONS];

function ScoreBar({ label, score, max, color }: { label: string; score: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[15px]">
        <span className="text-ink-600">{label}</span>
        <span className="tabular font-bold text-ink-900">
          {score}
          <span className="font-medium text-ink-400"> / {max}점</span>
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink-50">
        <div className={`h-full rounded-full ${color} transition-[width] duration-500 ease-out`} style={{ width: `${(score / max) * 100}%` }} />
      </div>
    </div>
  );
}

export function AptScoreCalculator() {
  const [homeless, setHomeless] = useState(5);
  const [dependents, setDependents] = useState(2);
  const [account, setAccount] = useState(60);
  const [spouse, setSpouse] = useState(-1);

  const r = useMemo(
    () => calcAptScore({ homelessYears: homeless, dependents, accountMonths: account, spouseAccountMonths: spouse < 0 ? 0 : spouse }),
    [homeless, dependents, account, spouse],
  );
  const pct = (r.total / MAX.total) * 100;
  const gap = Math.max(0, MAX.homeless - r.homeless) + Math.max(0, MAX.account - r.account);

  return (
    <CalculatorLayout
      inputs={
        <Card>
          <CardTitle sub="해당 구간을 선택하면 점수가 즉시 계산돼요.">내 조건 입력</CardTitle>
          <div className="space-y-6">
            <SelectField
              label="무주택 기간"
              value={homeless}
              options={HOMELESS_OPTIONS}
              onChange={setHomeless}
              hint="만 30세가 된 날과 혼인신고일 중 빠른 날부터 계산해요."
            />

            <FieldShell label="부양가족 수 (본인 제외)" hint="배우자·직계존속(3년 이상 같은 등본)·미혼 자녀를 포함해요.">
              <div role="radiogroup" aria-label="부양가족 수" className="grid grid-cols-7 gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map((v) => (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={dependents === v}
                    onClick={() => setDependents(v)}
                    className={`rounded-xl py-3 text-[15px] font-bold transition active:scale-95 ${
                      dependents === v ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30" : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    {v === 6 ? "6+" : v}
                  </button>
                ))}
              </div>
            </FieldShell>

            <SelectField label="본인 청약통장 가입기간" value={account} options={ACCOUNT_OPTIONS} onChange={setAccount} />

            <SelectField
              label="배우자 청약통장 가입기간"
              value={spouse}
              options={SPOUSE_OPTIONS}
              onChange={setSpouse}
              hint="배우자 통장 기간의 50%(최대 3점)를 합산해요. 통장 점수 합계는 17점이 상한이에요."
            />
          </div>
        </Card>
      }
      result={
        <>
          <Card className="overflow-hidden">
            <p className="text-[15px] font-semibold text-ink-500">내 청약 가점</p>
            <p className="tabular mt-1 text-[56px] leading-none font-extrabold tracking-tight text-ink-900">
              {r.total}
              <span className="ml-1 text-2xl font-bold text-ink-300">/ 84점</span>
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink-50">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-sm text-ink-500">
              상위 기준 대비 <strong className="text-ink-900">{pct.toFixed(0)}%</strong>
              {gap > 0 && (
                <>
                  {" "}
                  · 기간이 쌓이면 최대 <strong className="text-brand-600">+{gap}점</strong> 더 받을 수 있어요
                </>
              )}
            </p>
            <div className="mt-6 space-y-4 border-t border-ink-100 pt-6">
              <ScoreBar label="무주택 기간" score={r.homeless} max={MAX.homeless} color="bg-brand-500" />
              <ScoreBar label="부양가족 수" score={r.dependents} max={MAX.dependents} color="bg-violet-500" />
              <ScoreBar label="청약통장 가입기간" score={r.account} max={MAX.account} color="bg-emerald-500" />
              {r.spouseBonus > 0 && <p className="text-[13px] text-emerald-600">배우자 통장 가산점 +{r.spouseBonus}점이 포함됐어요.</p>}
            </div>
          </Card>

          <Card>
            <CardTitle sub="최근 분양 사례를 바탕으로 한 참고 범위예요. 단지·평형·시기에 따라 크게 달라져요.">인기 지역 당첨 커트라인 가이드</CardTitle>
            <div className="-mx-1 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead>
                  <tr className="text-left text-ink-400">
                    <th className="px-1 pb-2 font-medium">지역·유형</th>
                    <th className="px-1 pb-2 text-right font-medium">커트라인</th>
                    <th className="px-1 pb-2 text-right font-medium">내 점수</th>
                  </tr>
                </thead>
                <tbody>
                  {CUTLINE_TIERS.map((t) => {
                    const s = tierStatus(r.total, t);
                    return (
                      <tr key={t.region} className="border-t border-ink-100">
                        <td className="px-1 py-3">
                          <span className="block font-semibold text-ink-700">{t.region}</span>
                          <span className="text-xs text-ink-400">{t.example}</span>
                        </td>
                        <td className="tabular px-1 py-3 text-right font-semibold text-ink-700">
                          {t.min}~{t.max}점
                        </td>
                        <td className="px-1 py-3 text-right">
                          {s === "safe" && <Pill tone="success">안정권</Pill>}
                          {s === "possible" && <Pill tone="warning">도전 가능</Pill>}
                          {s === "hard" && <Pill tone="danger">-{t.min - r.total}점</Pill>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Notice>
                가점제 외에 추첨제 물량(85㎡ 초과 등)과 신혼·생애최초·다자녀 특별공급도 있어요. 점수가 낮다면 특별공급 자격부터 확인해보세요.
              </Notice>
            </div>
          </Card>
        </>
      }
    />
  );
}
