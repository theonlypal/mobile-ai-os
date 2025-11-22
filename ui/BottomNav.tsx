"use client";
import Link from "next/link";

const tabs = [
  { href: "/", label: "Now", icon: "⚡" },
  { href: "/inbox", label: "Inbox", icon: "📥" },
  { href: "/workflows", label: "Workflows", icon: "🛠️" },
  { href: "/memory", label: "Memory", icon: "🧠" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function BottomNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur border-t border-slate-900">
      <div className="max-w-3xl mx-auto px-2 py-2 grid grid-cols-5 gap-2 text-xs">
        {tabs.map((tab) => {
          const active = currentPath === tab.href || (tab.href !== "/" && currentPath.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href as any}
              className={`flex flex-col items-center gap-1 py-2 rounded-xl ${
                active ? "bg-[var(--workspace-accent)]/20 text-[var(--workspace-accent)]" : "text-slate-300"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
