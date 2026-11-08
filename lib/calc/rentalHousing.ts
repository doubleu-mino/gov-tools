import { RENTAL_ASSET, URBAN_WORKER_INCOME } from "@/lib/policy-data";

export type ApplicantType = "general" | "youth" | "newlywed" | "senior";

export type RentalInput = {
  members: number;
  monthlyIncome: number; // 원
  totalAsset: number; // 만원
  carValue: number; // 만원
  applicant: ApplicantType;
  dualIncome: boolean;
  welfareRecipient: boolean; // 생계·의료급여 수급자, 차상위, 한부모 등
};

export type Verdict = "eligible" | "conditional" | "ineligible";

export type RentalResult = {
  id: string;
  name: string;
  desc: string;
  verdict: Verdict;
  incomeLimitPct: number;
  incomeLimit: number; // 원
  assetLimit: number; // 만원
  checks: { label: string; ok: boolean; detail: string }[];
  tip: string;
};

export function baseIncome(members: number): number {
  const m = Math.min(Math.max(1, Math.floor(members)), 8);
  return URBAN_WORKER_INCOME[m];
}

export function incomeRatio(i: RentalInput): number {
  const base = baseIncome(i.members);
  return base > 0 ? (i.monthlyIncome / base) * 100 : 0;
}

/** 1인 +20%p, 2인 +10%p 가산 (국민임대·행복주택 등) */
function smallHouseholdBonus(members: number) {
  if (members <= 1) return 20;
  if (members === 2) return 10;
  return 0;
}

const won = (v: number) => `${Math.round(v / 10000).toLocaleString()}만원`;
const manwon = (v: number) => (v >= 10000 ? `${(v / 10000).toFixed(2).replace(/\.?0+$/, "")}억원` : `${v.toLocaleString()}만원`);

function build(
  id: string,
  name: string,
  desc: string,
  i: RentalInput,
  pct: number,
  assetLimit: number,
  opts: { requires?: { ok: boolean; label: string; detail: string }; tip: string; recipientPass?: boolean },
): RentalResult {
  const limit = (baseIncome(i.members) * pct) / 100;
  const checks = [] as RentalResult["checks"];
  if (opts.requires) checks.push(opts.requires);
  const incomeOk = opts.recipientPass && i.welfareRecipient ? true : i.monthlyIncome <= limit;
  checks.push({
    label: "월평균소득",
    ok: incomeOk,
    detail: opts.recipientPass && i.welfareRecipient ? "수급자 등 1순위 자격" : `${pct}% (${won(limit)}) 이하`,
  });
  checks.push({ label: "총자산", ok: i.totalAsset <= assetLimit, detail: `${manwon(assetLimit)} 이하` });
  checks.push({ label: "자동차가액", ok: i.carValue <= RENTAL_ASSET.carMax, detail: `${manwon(RENTAL_ASSET.carMax)} 이하` });

  const failed = checks.filter((c) => !c.ok);
  let verdict: Verdict = "eligible";
  if (failed.length > 0) {
    // 소득만 10%p 이내 초과 → 조건부 (가점·배점 유형 또는 예비자)
    const nearMiss = failed.length === 1 && failed[0].label === "월평균소득" && i.monthlyIncome <= limit * 1.1;
    verdict = nearMiss ? "conditional" : "ineligible";
  }
  return { id, name, desc, verdict, incomeLimitPct: pct, incomeLimit: limit, assetLimit, checks, tip: opts.tip };
}

export function calcRental(i: RentalInput): RentalResult[] {
  const bonus = smallHouseholdBonus(i.members);
  const results: RentalResult[] = [];

  // 영구임대: 수급자 등 1순위, 일반은 50%(1인 70%·2인 60%) 이하
  results.push(
    build("permanent", "영구임대", "보증금·임대료가 시세의 약 30%로 가장 저렴한 장기 임대", i, 50 + bonus, RENTAL_ASSET.permanent, {
      recipientPass: true,
      tip: "수급자·한부모·국가유공자 등이 우선 공급 대상입니다. 일반 소득자는 대기기간이 길 수 있어요.",
    }),
  );

  // 국민임대: 70%(1인 90%·2인 80%)
  results.push(
    build("national", "국민임대", "최장 30년 거주, 시세 60~80% 수준의 중장기 임대", i, 70 + bonus, RENTAL_ASSET.national, {
      tip: "전용 50㎡ 미만은 소득 50% 이하 가구에 우선 공급됩니다. 해당 지역 거주기간·청약통장 납입횟수가 배점에 반영돼요.",
    }),
  );

  // 행복주택
  if (i.applicant === "youth") {
    results.push(
      build("happy", "행복주택 (청년)", "역세권·직주근접 시세 60~80% 임대, 최대 6년(자녀 有 10년)", i, 100 + bonus, RENTAL_ASSET.happyYouth, {
        requires: { label: "청년 요건", ok: true, detail: "만 19~39세 미혼 무주택자" },
        tip: "청년 본인 소득 기준으로 판정하며, 소득이 낮을수록 1순위 가능성이 높아집니다.",
      }),
    );
  } else if (i.applicant === "newlywed") {
    results.push(
      build("happy", "행복주택 (신혼부부)", "역세권·직주근접 시세 60~80% 임대, 최대 6년(자녀 有 10년)", i, i.dualIncome ? 120 : 100, RENTAL_ASSET.happyNewlywed, {
        requires: { label: "신혼 요건", ok: true, detail: "혼인 7년 이내 또는 예비신혼부부" },
        tip: "맞벌이는 120%까지 가능하며, 자녀가 있으면 최대 10년 거주할 수 있어요.",
      }),
    );
  } else if (i.applicant === "senior") {
    results.push(
      build("happy", "행복주택 (고령자)", "만 65세 이상 무주택 세대구성원 대상 최대 20년", i, 100 + bonus, RENTAL_ASSET.happyNewlywed, {
        requires: { label: "고령자 요건", ok: true, detail: "만 65세 이상 무주택 세대구성원" },
        tip: "주거급여 수급자는 소득 무관하게 신청 가능한 물량이 있습니다.",
      }),
    );
  } else {
    results.push(
      build("happy", "행복주택", "청년·신혼부부·고령자 등 계층별 모집 (일반가구는 일부 물량)", i, 100 + bonus, RENTAL_ASSET.happyNewlywed, {
        requires: { label: "계층 요건", ok: false, detail: "청년·신혼부부·고령자·주거급여수급자 등" },
        tip: "'신청자 유형'을 청년/신혼부부/고령자로 바꾸면 해당 계층 기준으로 다시 판정합니다.",
      }),
    );
  }

  // 매입임대
  if (i.applicant === "youth") {
    results.push(
      build("purchase", "청년 매입임대", "도심 기존주택 매입 후 시세 40~50%로 임대", i, 100, RENTAL_ASSET.purchaseYouth, {
        requires: { label: "청년 요건", ok: true, detail: "만 19~39세 미혼 무주택자" },
        tip: "1순위는 수급자·차상위 가구 청년, 2순위는 본인과 부모 소득이 100% 이하인 청년입니다.",
      }),
    );
  } else if (i.applicant === "newlywed") {
    const pct = i.dualIncome ? 90 : 70;
    results.push(
      build("purchase", "신혼·신생아 매입임대 I", "시세 30~40% 임대, 최장 20년", i, pct, RENTAL_ASSET.purchaseNewlywed, {
        requires: { label: "신혼 요건", ok: true, detail: "혼인 7년 이내·예비신혼·한부모" },
        tip: "소득 기준을 넘는다면 시세 70~80%인 '신혼·신생아 매입임대 II'(100%, 맞벌이 120%)를 확인해보세요.",
      }),
    );
  } else {
    results.push(
      build("purchase", "기존주택 매입임대 (일반)", "시세 30~40% 임대, 최장 20년", i, 50 + bonus, RENTAL_ASSET.purchaseGeneral, {
        recipientPass: true,
        tip: "1순위는 수급자·한부모·차상위, 2순위는 소득 50% 이하(장애인 100%) 가구입니다.",
      }),
    );
  }

  return results;
}

export const INCOME_BANDS = [50, 70, 100, 120];
