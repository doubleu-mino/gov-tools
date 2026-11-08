export type CategoryId = "all" | "housing" | "income" | "family" | "senior";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "housing", label: "주거·부동산" },
  { id: "income", label: "소득·지원금" },
  { id: "family", label: "출산·육아" },
  { id: "senior", label: "복지·시니어" },
];

export type ToolIcon = "trophy" | "landmark" | "building" | "receipt" | "wallet" | "baby" | "heart" | "piggy";

export type ToolMeta = {
  slug: string;
  title: string;
  summary: string;
  category: Exclude<CategoryId, "all">;
  icon: ToolIcon;
  tags: string[];
  ready: boolean;
  accent: "blue" | "violet" | "emerald" | "amber" | "rose" | "sky";
};

export const TOOLS: ToolMeta[] = [
  {
    slug: "apt-score",
    title: "아파트 청약 가점 계산기",
    summary: "무주택기간·부양가족·통장기간으로 84점 만점 중 내 점수와 인기단지 커트라인을 비교해요.",
    category: "housing",
    icon: "trophy",
    tags: ["청약", "84점 만점"],
    ready: true,
    accent: "blue",
  },
  {
    slug: "policy-loan",
    title: "디딤돌·버팀목·신생아특례 대출 판독기",
    summary: "소득·순자산·주택가격만 넣으면 신청 가능한 정책대출과 한도·예상 금리를 알려드려요.",
    category: "housing",
    icon: "landmark",
    tags: ["정책대출", "신생아특례"],
    ready: true,
    accent: "violet",
  },
  {
    slug: "rental-housing",
    title: "LH·SH 공공임대 자격 판독기",
    summary: "도시근로자 월평균소득 대비 내 소득 비율과 국민임대·행복주택·영구임대·매입임대 자격을 확인해요.",
    category: "housing",
    icon: "building",
    tags: ["공공임대", "행복주택"],
    ready: true,
    accent: "emerald",
  },
  {
    slug: "acquisition-tax",
    title: "생애최초 취득세 감면 계산기",
    summary: "매매가와 면적으로 취득세·지방교육세·농특세를 계산하고 200만 원 감면 후 최종 납부액을 보여드려요.",
    category: "housing",
    icon: "receipt",
    tags: ["취득세", "200만원 감면"],
    ready: true,
    accent: "amber",
  },
  {
    slug: "earned-income-credit",
    title: "근로·자녀장려금 계산기",
    summary: "가구 유형과 총급여액으로 받을 수 있는 장려금을 예상해요.",
    category: "income",
    icon: "wallet",
    tags: ["장려금"],
    ready: false,
    accent: "sky",
  },
  {
    slug: "youth-savings",
    title: "청년도약계좌 만기 수령액 계산기",
    summary: "월 납입액과 정부기여금을 합산한 만기 예상액을 확인해요.",
    category: "income",
    icon: "piggy",
    tags: ["청년"],
    ready: false,
    accent: "sky",
  },
  {
    slug: "parent-benefit",
    title: "부모급여·아동수당 수령액 계산기",
    summary: "자녀 생년월일로 월별 수령액과 총 누적 지원금을 계산해요.",
    category: "family",
    icon: "baby",
    tags: ["부모급여"],
    ready: false,
    accent: "rose",
  },
  {
    slug: "basic-pension",
    title: "기초연금 수급 자격 계산기",
    summary: "소득인정액을 계산해 기초연금 선정 여부와 예상 수령액을 알려드려요.",
    category: "senior",
    icon: "heart",
    tags: ["기초연금"],
    ready: false,
    accent: "rose",
  },
];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug)!;
