import {
  BEOTIMMOK,
  DIDIMDOL,
  IncomeBandRate,
  NEWBORN_BEOTIMMOK,
  NEWBORN_DIDIMDOL,
} from "@/lib/policy-data";

export type LoanPurpose = "buy" | "jeonse";
export type Region = "capital" | "local";

export type PolicyLoanInput = {
  purpose: LoanPurpose;
  region: Region;
  income: number; // 부부합산 연소득 (만원)
  netAsset: number; // 순자산 (만원)
  price: number; // 주택가격 또는 전세보증금 (만원)
  area: number; // 전용면적 (㎡)
  newborn: boolean; // 대출 신청일 기준 2년 내 출산
  kids: number; // 미성년 자녀 수
  newlywed: boolean; // 혼인 7년 이내 또는 3개월 내 결혼예정
  firstHome: boolean; // 생애최초 주택구입
  subscription: boolean; // 청약통장 1년 이상 보유
  termYears: number; // 구입자금 만기
};

export type LoanResult = {
  id: string;
  name: string;
  eligible: boolean;
  checks: { label: string; ok: boolean; detail: string }[];
  limit: number; // 만원
  limitReason: string;
  baseRate: number;
  prefRate: number;
  finalRate: number;
  prefs: string[];
  monthly: number; // 원
  monthlyLabel: string;
  note?: string;
};

function bandRate(bands: IncomeBandRate[], income: number): number | null {
  const band = bands.find((b) => income <= b.maxIncome);
  return band ? band.baseRate : null;
}

function termAdd(termYears: number): number {
  if (termYears >= 30) return 0.3;
  if (termYears >= 20) return 0.2;
  if (termYears >= 15) return 0.1;
  return 0;
}

/** 원리금균등 월 상환액 (원) */
export function amortized(principalManwon: number, ratePct: number, years: number): number {
  const p = principalManwon * 10000;
  const r = ratePct / 100 / 12;
  const m = years * 12;
  if (p <= 0 || m <= 0) return 0;
  if (r === 0) return p / m;
  return (p * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
}

const fmt = (v: number) => {
  const eok = Math.floor(v / 10000);
  const man = v % 10000;
  return [eok ? `${eok}억` : "", man ? `${man.toLocaleString()}만` : ""].join(" ").trim() + "원";
};

function kidPref(kids: number, p: { kids1: number; kids2: number; kids3: number }) {
  if (kids >= 3) return { v: p.kids3, label: `다자녀(3명 이상) -${p.kids3}%p` };
  if (kids === 2) return { v: p.kids2, label: `2자녀 -${p.kids2}%p` };
  if (kids === 1) return { v: p.kids1, label: `1자녀 -${p.kids1}%p` };
  return null;
}

function didimdol(i: PolicyLoanInput): LoanResult {
  const d = DIDIMDOL;
  const twoKids = i.kids >= 2;
  const incomeMax = i.newlywed ? d.income.newlywed : i.firstHome || twoKids ? d.income.firstOrTwoKids : d.income.general;
  const priceMax = i.newlywed || twoKids ? d.housePrice.newlywedOrTwoKids : d.housePrice.general;
  const checks = [
    { label: "부부합산 연소득", ok: i.income <= incomeMax, detail: `${fmt(incomeMax)} 이하` },
    { label: "순자산", ok: i.netAsset <= d.netAssetMax, detail: `${fmt(d.netAssetMax)} 이하` },
    { label: "주택가격", ok: i.price <= priceMax, detail: `${fmt(priceMax)} 이하` },
    { label: "전용면적", ok: i.area <= d.areaMax, detail: `${d.areaMax}㎡ 이하` },
  ];
  const lim = d.limit[i.region];
  const productLimit = i.newlywed || twoKids ? lim.newlywedOrTwoKids : i.firstHome ? lim.first : lim.general;
  const ltv = i.firstHome ? (i.region === "capital" ? d.ltv.firstCapital : d.ltv.firstLocal) : d.ltv.general;
  const ltvLimit = Math.floor((i.price * ltv) / 100) * 100;
  const limit = Math.min(productLimit, ltvLimit);
  const base = (bandRate(d.rates, i.income) ?? d.rates[d.rates.length - 1].baseRate) + termAdd(i.termYears);

  const prefs: string[] = [];
  let pref = 0;
  const kp = kidPref(i.kids, d.pref);
  if (kp) { pref += kp.v; prefs.push(kp.label); }
  if (i.firstHome) { pref += d.pref.first; prefs.push(`생애최초 -${d.pref.first}%p`); }
  if (i.newlywed) { pref += d.pref.newlywed; prefs.push(`신혼가구 -${d.pref.newlywed}%p`); }
  if (i.subscription) { pref += d.pref.subscription; prefs.push(`청약통장 -${d.pref.subscription}%p`); }
  const finalRate = Math.max(d.minRate, +(base - pref).toFixed(2));

  return {
    id: "didimdol",
    name: d.name,
    eligible: checks.every((c) => c.ok),
    checks,
    limit,
    limitReason: limit === ltvLimit && ltvLimit < productLimit ? `LTV ${ltv * 100}% 적용` : "상품 최대한도",
    baseRate: +base.toFixed(2),
    prefRate: +pref.toFixed(2),
    finalRate,
    prefs,
    monthly: amortized(limit, finalRate, i.termYears),
    monthlyLabel: `${i.termYears}년 원리금균등 월 상환액`,
    note: i.region === "capital" ? "수도권은 축소된 한도가 적용됩니다." : undefined,
  };
}

function newbornDidimdol(i: PolicyLoanInput): LoanResult {
  const d = NEWBORN_DIDIMDOL;
  const checks = [
    { label: "2년 내 출산", ok: i.newborn, detail: "대출 신청일 기준 2년 내 출산(입양)" },
    { label: "부부합산 연소득", ok: i.income <= d.incomeMax, detail: `${fmt(d.incomeMax)} 이하` },
    { label: "순자산", ok: i.netAsset <= d.netAssetMax, detail: `${fmt(d.netAssetMax)} 이하` },
    { label: "주택가격", ok: i.price <= d.housePriceMax, detail: `${fmt(d.housePriceMax)} 이하` },
    { label: "전용면적", ok: i.area <= d.areaMax, detail: `${d.areaMax}㎡ 이하` },
  ];
  const productLimit = d.limit[i.region];
  const ltv = i.firstHome ? (i.region === "capital" ? DIDIMDOL.ltv.firstCapital : DIDIMDOL.ltv.firstLocal) : DIDIMDOL.ltv.general;
  const ltvLimit = Math.floor((i.price * ltv) / 100) * 100;
  const limit = Math.min(productLimit, ltvLimit);
  const base = (bandRate(d.rates, i.income) ?? d.rates[d.rates.length - 1].baseRate) + termAdd(i.termYears);
  const finalRate = +base.toFixed(2);
  return {
    id: "newborn-didimdol",
    name: d.name,
    eligible: checks.every((c) => c.ok),
    checks,
    limit,
    limitReason: limit === ltvLimit && ltvLimit < productLimit ? `LTV ${ltv * 100}% 적용` : "상품 최대한도",
    baseRate: finalRate,
    prefRate: 0,
    finalRate,
    prefs: ["특례금리 5년 적용 · 추가 출산 시 1명당 0.2%p 인하 및 기간 연장"],
    monthly: amortized(limit, finalRate, i.termYears),
    monthlyLabel: `${i.termYears}년 원리금균등 월 상환액`,
    note: `특례금리는 ${d.specialYears}년간 적용되며 이후 일반 디딤돌 금리로 전환됩니다.`,
  };
}

function beotimmok(i: PolicyLoanInput): LoanResult {
  const d = BEOTIMMOK;
  const twoKids = i.kids >= 2;
  const incomeMax = i.newlywed ? d.income.newlywed : twoKids ? d.income.twoKids : d.income.general;
  const depMax = i.newlywed || twoKids ? d.depositMax[i.region].newlywedOrTwoKids : d.depositMax[i.region].general;
  const checks = [
    { label: "부부합산 연소득", ok: i.income <= incomeMax, detail: `${fmt(incomeMax)} 이하` },
    { label: "순자산", ok: i.netAsset <= d.netAssetMax, detail: `${fmt(d.netAssetMax)} 이하` },
    { label: "전세보증금", ok: i.price <= depMax, detail: `${fmt(depMax)} 이하` },
    { label: "전용면적", ok: i.area <= 85, detail: "85㎡ 이하" },
  ];
  const lim = d.limit[i.region];
  const productLimit = i.newlywed ? lim.newlywed : twoKids ? lim.twoKids : lim.general;
  const depLimit = Math.floor((i.price * d.depositRatio) / 100) * 100;
  const limit = Math.min(productLimit, depLimit);
  const base = bandRate(d.rates, i.income) ?? d.rates[d.rates.length - 1].baseRate;
  const prefs: string[] = [];
  let pref = 0;
  const kp = kidPref(i.kids, d.pref);
  if (kp) { pref += kp.v; prefs.push(kp.label); }
  const finalRate = Math.max(d.minRate, +(base - pref).toFixed(2));
  return {
    id: "beotimmok",
    name: d.name,
    eligible: checks.every((c) => c.ok),
    checks,
    limit,
    limitReason: limit === depLimit && depLimit < productLimit ? "보증금의 80% 이내" : "상품 최대한도",
    baseRate: base,
    prefRate: +pref.toFixed(2),
    finalRate,
    prefs,
    monthly: (limit * 10000 * finalRate) / 100 / 12,
    monthlyLabel: "월 이자 (만기일시상환)",
    note: i.newlywed ? "신혼부부 전용 버팀목 기준으로 판정했습니다." : undefined,
  };
}

function newbornBeotimmok(i: PolicyLoanInput): LoanResult {
  const d = NEWBORN_BEOTIMMOK;
  const depMax = d.depositMax[i.region];
  const checks = [
    { label: "2년 내 출산", ok: i.newborn, detail: "대출 신청일 기준 2년 내 출산(입양)" },
    { label: "부부합산 연소득", ok: i.income <= d.incomeMax, detail: `${fmt(d.incomeMax)} 이하` },
    { label: "순자산", ok: i.netAsset <= d.netAssetMax, detail: `${fmt(d.netAssetMax)} 이하` },
    { label: "전세보증금", ok: i.price <= depMax, detail: `${fmt(depMax)} 이하` },
    { label: "전용면적", ok: i.area <= 85, detail: "85㎡ 이하" },
  ];
  const depLimit = Math.floor((i.price * d.depositRatio) / 100) * 100;
  const limit = Math.min(d.limitMax, depLimit);
  const finalRate = bandRate(d.rates, i.income) ?? d.rates[d.rates.length - 1].baseRate;
  return {
    id: "newborn-beotimmok",
    name: d.name,
    eligible: checks.every((c) => c.ok),
    checks,
    limit,
    limitReason: limit === depLimit && depLimit < d.limitMax ? "보증금의 80% 이내" : "상품 최대한도",
    baseRate: finalRate,
    prefRate: 0,
    finalRate,
    prefs: ["특례금리 5년 적용 · 추가 출산 시 1명당 0.2%p 인하 및 기간 연장"],
    monthly: (limit * 10000 * finalRate) / 100 / 12,
    monthlyLabel: "월 이자 (만기일시상환)",
    note: `특례금리는 ${d.specialYears}년간 적용됩니다.`,
  };
}

export function calcPolicyLoans(i: PolicyLoanInput): LoanResult[] {
  const list = i.purpose === "buy" ? [newbornDidimdol(i), didimdol(i)] : [newbornBeotimmok(i), beotimmok(i)];
  // 자격 있는 상품 → 금리 낮은 순
  return list.sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.finalRate - b.finalRate);
}
