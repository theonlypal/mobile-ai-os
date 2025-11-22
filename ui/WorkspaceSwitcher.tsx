"use client";
import { useState } from "react";
import { getWorkspaces } from "../core/workspaces";
import { useWorkspaceContext } from "./ShellProvider";
import { Modal } from "./Modal";

export default function WorkspaceSwitcher() {
  const { workspace, setWorkspaceById } = useWorkspaceContext();
  const [open, setOpen] = useState(false);
  const workspaces = getWorkspaces();

  return (
    <>
      <button
        className="px-3 py-2 rounded-full bg-[var(--workspace-accent)]/20 text-sm text-[var(--workspace-accent)] border border-[var(--workspace-accent)]/30"
        onClick={() => setOpen(true)}
      >
        {workspace.label}
      </button>
      <Modal open={open} title="Switch workspace" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              className={`w-full text-left card p-3 border ${
                workspace.id === ws.id ? "border-[var(--workspace-accent)]" : "border-slate-800"
              }`}
              onClick={() => {
                setWorkspaceById(ws.id);
                setOpen(false);
              }}
            >
              <p className="font-semibold">{ws.label}</p>
              <p className="text-sm text-slate-300">{ws.description}</p>
              <div className="flex gap-2 mt-2 text-xs text-slate-300">
                {ws.defaultTags.map((t) => (
                  <span key={t} className="px-2 py-1 bg-slate-800 rounded-full">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
