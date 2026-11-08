import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function Card({ children, className = "", as: Tag = "div" }: CardProps) {
  return (
    <Tag className={`rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-ink-100 sm:p-7 ${className}`}>
      {children}
    </Tag>
  );
}

export function CardTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold tracking-tight text-ink-900">{children}</h2>
      {sub && <p className="mt-1 text-sm text-ink-500">{sub}</p>}
    </div>
  );
}
