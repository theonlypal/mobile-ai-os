"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useWorkspaceContext } from "./ShellProvider";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import CommandBar from "./CommandBar";
import BottomNav from "./BottomNav";

interface Props {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ScreenShell({ title, action, children }: Props) {
  const pathname = usePathname();
  const { workspace } = useWorkspaceContext();

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-900">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />
            <div>
              <p className="text-xs text-slate-400">{workspace.label} workspace</p>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/capture" className="text-sm text-[var(--workspace-accent)] font-semibold">Capture</Link>
            {action}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-4 space-y-6">{children}</div>
      <CommandBar />
      <BottomNav currentPath={pathname} />
    </div>
  );
}
