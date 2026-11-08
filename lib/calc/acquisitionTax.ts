import { ACQ_TAX } from "@/lib/policy-data";

export type AcqTaxInput = {
  price: number; // 매매가액 (만원)
  over85: boolean; // 전용 85㎡ 초과
  firstHome: boolean; // 생애최초 요건 충족 (본인·배우자 주택 소유 이력 없음)
  region: "capital" | "local";
  houseType: "apartment" | "other"; // 아파트 / 아파트 외 (연립·다세대·단독·도시형생활주택)
  area60: boolean; // 전용 60㎡ 이하
};

export type AcqTaxResult = {
  acqRate: number; // 취득세율 %
  acqTax: number; // 감면 전 취득세 (원)
  relief: number; // 감면액 (원)
  reliefCap: number; // 감면 한도 (원)
  reliefLabel: string;
  acqTaxAfter: number;
  eduTax: number; // 지방교육세
  ruralTax: number; // 농어촌특별세
  total: number; // 최종 납부 (감면 후)
  totalBefore: number; // 감면 없을 때
  eligibleRelief: boolean;
  reliefReason: string;
};

/** 1주택 유상취득 기본세율 (%) */
export function acquisitionRate(priceManwon: number): number {
  const eok = priceManwon / 10000;
  if (eok <= 6) return 1;
  if (eok <= 9) {
    // (취득가액 × 2/3억 − 3) %, 소수점 다섯째 자리 반올림
    return Math.round((eok * (2 / 3) - 3) * 10000) / 10000;
  }
  return 3;
}

/** 지방교육세율 (%): 취득세율 × 10% (6억 이하 0.1%, 9억 초과 0.3%) */
export function educationRate(acqRate: number): number {
  return Math.round(acqRate * 0.1 * 10000) / 10000;
}

export function calcAcquisitionTax(i: AcqTaxInput): AcqTaxResult {
  const priceWon = i.price * 10000;
  const acqRate = acquisitionRate(i.price);
  const acqTax = Math.floor((priceWon * acqRate) / 100);
  const eduTax = Math.floor((priceWon * educationRate(acqRate)) / 100);
  const ruralTax = i.over85 ? Math.floor(priceWon * 0.002) : 0;

  const priceOk = i.price <= ACQ_TAX.firstHomePriceMax;
  const eligibleRelief = i.firstHome && priceOk && i.price > 0;

  const small =
    i.houseType === "other" &&
    i.area60 &&
    !i.over85 &&
    i.price <= (i.region === "capital" ? ACQ_TAX.smallHome.priceCapital : ACQ_TAX.smallHome.priceLocal);

  const reliefCap = (small ? ACQ_TAX.smallHomeReliefMax : ACQ_TAX.firstHomeReliefMax) * 10000;
  const relief = eligibleRelief ? Math.min(acqTax, reliefCap) : 0;

  let reliefReason = "";
  if (!i.firstHome) reliefReason = "생애최초 요건(본인·배우자 주택 소유 이력 없음)을 충족해야 합니다.";
  else if (!priceOk) reliefReason = "취득가액이 12억 원을 초과해 감면 대상이 아닙니다.";
  else if (small) reliefReason = "생애최초 소형주택 특례로 감면 한도가 300만 원으로 확대됩니다.";
  else reliefReason = "생애최초 주택 구입 감면(200만 원 한도)이 적용됩니다.";

  const acqTaxAfter = acqTax - relief;
  return {
    acqRate,
    acqTax,
    relief,
    reliefCap,
    reliefLabel: small ? "생애최초 소형주택 감면 (300만원 한도)" : "생애최초 감면 (200만원 한도)",
    acqTaxAfter,
    eduTax,
    ruralTax,
    total: acqTaxAfter + eduTax + ruralTax,
    totalBefore: acqTax + eduTax + ruralTax,
    eligibleRelief,
    reliefReason,
  };
}
