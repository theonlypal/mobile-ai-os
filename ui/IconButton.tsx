"use client";
import { ButtonHTMLAttributes } from "react";

export default function IconButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-full p-2 bg-slate-900/60 border border-slate-800 text-slate-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
