/** 만원 단위 금액 → "3억 2,500만원" */
export function formatManwon(manwon: number): string {
  if (!Number.isFinite(manwon)) return "-";
  const sign = manwon < 0 ? "-" : "";
  const v = Math.round(Math.abs(manwon));
  const eok = Math.floor(v / 10000);
  const man = v % 10000;
  if (eok === 0 && man === 0) return "0원";
  const parts: string[] = [];
  if (eok) parts.push(`${eok.toLocaleString("ko-KR")}억`);
  if (man) parts.push(`${man.toLocaleString("ko-KR")}만`);
  return `${sign}${parts.join(" ")}원`;
}

/** 원 단위 금액 → "1,234,500원" */
export function formatWon(won: number): string {
  if (!Number.isFinite(won)) return "-";
  return `${Math.round(won).toLocaleString("ko-KR")}원`;
}

export function formatPercent(v: number, digits = 2): string {
  return `${v.toFixed(digits).replace(/\.?0+$/, "")}%`;
}

export function n(v: number | null | undefined): number {
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}
