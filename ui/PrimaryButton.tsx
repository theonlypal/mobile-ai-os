"use client";
import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-[var(--workspace-accent)] text-slate-900 font-semibold rounded-xl px-4 py-3 w-full shadow-card border border-slate-900 ${className}`}
      {...props}
    />
  );
}
