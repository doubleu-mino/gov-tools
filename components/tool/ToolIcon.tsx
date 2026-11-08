import { Baby, Building2, HeartHandshake, Landmark, PiggyBank, Receipt, Trophy, Wallet } from "lucide-react";
import type { ToolIcon as ToolIconName, ToolMeta } from "@/lib/tools";

const ICONS: Record<ToolIconName, typeof Trophy> = {
  trophy: Trophy,
  landmark: Landmark,
  building: Building2,
  receipt: Receipt,
  wallet: Wallet,
  baby: Baby,
  heart: HeartHandshake,
  piggy: PiggyBank,
};

const ACCENT: Record<ToolMeta["accent"], string> = {
  blue: "bg-brand-50 text-brand-500",
  violet: "bg-violet-50 text-violet-500",
  emerald: "bg-emerald-50 text-emerald-500",
  amber: "bg-amber-50 text-amber-500",
  rose: "bg-rose-50 text-rose-400",
  sky: "bg-sky-50 text-sky-500",
};

export function ToolIcon({ icon, accent, size = "md" }: { icon: ToolIconName; accent: ToolMeta["accent"]; size?: "md" | "lg" }) {
  const Icon = ICONS[icon];
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-12 w-12 rounded-2xl";
  return (
    <span className={`flex shrink-0 items-center justify-center ${box} ${ACCENT[accent]}`}>
      <Icon size={size === "lg" ? 28 : 24} strokeWidth={2.2} />
    </span>
  );
}
