/**
 * 정책 기준 데이터 (단일 소스)
 * ─────────────────────────────────────────────────────────────
 * 모든 금액 단위: 만원 (월소득 표는 원)
 * 정책 수치는 매년(때로는 분기마다) 바뀝니다. 공고가 갱신되면 이 파일만 수정하세요.
 * 확인처: 주택도시기금(nhuf.molit.go.kr), 마이홈포털(myhome.go.kr),
 *        LH청약플러스(apply.lh.or.kr), 위택스(wetax.go.kr)
 */

export const POLICY_BASE_LABEL = "2026년 공고 기준";
export const POLICY_UPDATED_AT = "2026-11";

/* ───────────── 정책대출 (주택도시기금) ───────────── */

export type IncomeBandRate = { maxIncome: number; baseRate: number };

export const DIDIMDOL = {
  name: "내집마련 디딤돌대출",
  netAssetMax: 48800, // 순자산 4.88억
  income: { general: 6000, firstOrTwoKids: 7000, newlywed: 8500 },
  housePrice: { general: 50000, newlywedOrTwoKids: 60000 },
  areaMax: 85,
  // 한도 (수도권은 2025.6.27 가계부채 관리방안에 따른 축소 한도)
  limit: {
    capital: { general: 20000, first: 24000, newlywedOrTwoKids: 32000 },
    local: { general: 25000, first: 30000, newlywedOrTwoKids: 40000 },
  },
  ltv: { general: 0.7, firstLocal: 0.8, firstCapital: 0.7 },
  // 10년 만기 기준 기본금리, 만기 15/20/30년은 +0.1%p씩 가산
  rates: [
    { maxIncome: 2000, baseRate: 2.85 },
    { maxIncome: 4000, baseRate: 3.2 },
    { maxIncome: 6000, baseRate: 3.5 },
    { maxIncome: 7000, baseRate: 3.75 },
    { maxIncome: 8500, baseRate: 3.85 },
  ] as IncomeBandRate[],
  minRate: 1.5,
  pref: { kids1: 0.3, kids2: 0.5, kids3: 0.7, first: 0.2, newlywed: 0.2, subscription: 0.3 },
};

export const NEWBORN_DIDIMDOL = {
  name: "신생아 특례 디딤돌대출",
  netAssetMax: 48800,
  incomeMax: 20000, // 부부합산 2억 (2025~2027 한시 상향)
  housePriceMax: 90000,
  areaMax: 85,
  limit: { capital: 40000, local: 50000 },
  rates: [
    { maxIncome: 2000, baseRate: 1.8 },
    { maxIncome: 4000, baseRate: 2.1 },
    { maxIncome: 6000, baseRate: 2.4 },
    { maxIncome: 8500, baseRate: 2.7 },
    { maxIncome: 13000, baseRate: 3.2 },
    { maxIncome: 20000, baseRate: 4.3 },
  ] as IncomeBandRate[],
  specialYears: 5,
};

export const BEOTIMMOK = {
  name: "버팀목 전세자금대출",
  netAssetMax: 34500, // 순자산 3.45억
  income: { general: 5000, twoKids: 6000, newlywed: 7500 },
  depositMax: {
    capital: { general: 30000, newlywedOrTwoKids: 40000 },
    local: { general: 20000, newlywedOrTwoKids: 30000 },
  },
  limit: {
    capital: { general: 12000, newlywed: 30000, twoKids: 30000 },
    local: { general: 8000, newlywed: 20000, twoKids: 20000 },
  },
  depositRatio: 0.8,
  rates: [
    { maxIncome: 2000, baseRate: 2.5 },
    { maxIncome: 4000, baseRate: 2.8 },
    { maxIncome: 6000, baseRate: 3.1 },
    { maxIncome: 7500, baseRate: 3.3 },
  ] as IncomeBandRate[],
  minRate: 1.0,
  pref: { kids1: 0.3, kids2: 0.5, kids3: 0.7 },
};

export const NEWBORN_BEOTIMMOK = {
  name: "신생아 특례 버팀목대출",
  netAssetMax: 34500,
  incomeMax: 20000,
  depositMax: { capital: 50000, local: 40000 },
  limitMax: 30000,
  depositRatio: 0.8,
  rates: [
    { maxIncome: 2000, baseRate: 1.3 },
    { maxIncome: 4000, baseRate: 1.6 },
    { maxIncome: 6000, baseRate: 1.9 },
    { maxIncome: 8500, baseRate: 2.4 },
    { maxIncome: 13000, baseRate: 3.0 },
    { maxIncome: 20000, baseRate: 4.0 },
  ] as IncomeBandRate[],
  specialYears: 5,
};

/* ───────────── 공공임대 ───────────── */

/**
 * 도시근로자 가구원수별 가구당 월평균소득 (100%, 원, 태아 포함)
 * ⚠️ 매년 LH/마이홈 공고의 표로 반드시 갱신하세요. (공고 직전 연도 통계 적용)
 */
export const URBAN_WORKER_INCOME_YEAR = "도시근로자 월평균소득 기준표";
export const URBAN_WORKER_INCOME: Record<number, number> = {
  1: 3_482_964,
  2: 5_415_712,
  3: 7_004_509,
  4: 8_248_467,
  5: 8_775_071,
  6: 9_563_282,
  7: 10_351_493,
  8: 11_139_704,
};

export const RENTAL_ASSET = {
  carMax: 3803, // 자동차가액 (만원)
  national: 36100, // 국민임대 총자산
  happyYouth: 25400, // 행복주택 청년
  happyNewlywed: 36100, // 행복주택 신혼·고령자 등
  permanent: 25500, // 영구임대
  purchaseGeneral: 25500, // 매입임대(일반)
  purchaseYouth: 25400, // 청년 매입임대
  purchaseNewlywed: 36100, // 신혼·신생아 매입임대
};

/* ───────────── 취득세 ───────────── */

export const ACQ_TAX = {
  firstHomePriceMax: 120000, // 12억 이하
  firstHomeReliefMax: 200, // 200만원
  smallHomeReliefMax: 300, // 소형주택 300만원
  smallHome: { areaMax: 60, priceCapital: 60000, priceLocal: 30000 },
};
