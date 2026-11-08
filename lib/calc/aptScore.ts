export type AptScoreInput = {
  /** 무주택기간(년). -1 = 유주택자 또는 만30세 미만 미혼 */
  homelessYears: number;
  /** 본인 제외 부양가족 수 */
  dependents: number;
  /** 청약통장 가입기간(개월) */
  accountMonths: number;
  /** 배우자 청약통장 가입기간(개월), 없으면 0 */
  spouseAccountMonths: number;
};

export const MAX = { homeless: 32, dependents: 35, account: 17, total: 84 };

/** 무주택기간 점수: 1년 미만 2점, 1년마다 2점 가산, 15년 이상 32점 */
export function homelessScore(years: number): number {
  if (years < 0) return 0;
  return Math.min(MAX.homeless, 2 + 2 * Math.floor(years));
}

/** 부양가족 점수: 0명 5점, 1명당 5점, 6명 이상 35점 */
export function dependentsScore(count: number): number {
  return Math.min(MAX.dependents, 5 + 5 * Math.max(0, Math.floor(count)));
}

/** 청약통장 가입기간 점수: 6개월 미만 1점, 6개월~1년 2점, 이후 1년마다 1점, 15년 이상 17점 */
export function accountScore(months: number): number {
  if (months < 6) return 1;
  if (months < 12) return 2;
  return Math.min(MAX.account, 2 + Math.floor(months / 12));
}

/** 배우자 통장 가산점: 배우자 가입기간 점수의 50%, 최대 3점 (2024.3.25 시행) */
export function spouseBonus(months: number): number {
  if (months <= 0) return 0;
  return Math.min(3, Math.floor(accountScore(months) / 2));
}

export function calcAptScore(input: AptScoreInput) {
  const homeless = homelessScore(input.homelessYears);
  const dependents = dependentsScore(input.dependents);
  const own = accountScore(input.accountMonths);
  const bonus = spouseBonus(input.spouseAccountMonths);
  const account = Math.min(MAX.account, own + bonus);
  const total = homeless + dependents + account;
  return { homeless, dependents, account, accountOwn: own, spouseBonus: account - own, total };
}

export type CutlineTier = {
  region: string;
  example: string;
  min: number;
  max: number;
};

/** 최근 분양 사례 기반 참고 범위 (단지·평형·경쟁률에 따라 크게 달라짐) */
export const CUTLINE_TIERS: CutlineTier[] = [
  { region: "서울 강남3구·용산 인기단지", example: "한강변·재건축 대단지 59~84㎡", min: 69, max: 84 },
  { region: "서울 비강남 인기단지", example: "마포·성동·동작 등 역세권", min: 60, max: 72 },
  { region: "서울 외곽·중소단지", example: "노원·도봉·구로 등", min: 50, max: 64 },
  { region: "경기 핵심 (과천·분당·광명·하남)", example: "준강남·신도시 선호지", min: 58, max: 72 },
  { region: "경기·인천 신도시", example: "동탄·검단·운정 등", min: 35, max: 58 },
  { region: "지방 광역시 선호단지", example: "부산 해운대·대구 수성 등", min: 30, max: 55 },
];

export function tierStatus(score: number, tier: CutlineTier): "safe" | "possible" | "hard" {
  if (score >= tier.max) return "safe";
  if (score >= tier.min) return "possible";
  return "hard";
}
