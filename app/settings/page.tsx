"use client";
import { useEffect, useState } from "react";
import ScreenShell from "../../ui/ScreenShell";
import { useWorkspaceContext } from "../../ui/ShellProvider";
import { clearAllData, getWorkflows } from "../../core/storage";
import PrimaryButton from "../../ui/PrimaryButton";
import { Modal } from "../../ui/Modal";

export default function SettingsPage() {
  const { workspace } = useWorkspaceContext();
  const [hasKey, setHasKey] = useState(false);
  const [open, setOpen] = useState(false);
  const [workflowCount, setWorkflowCount] = useState(0);

  useEffect(() => {
    setHasKey(!!process.env.AI_API_KEY);
    getWorkflows().then((w) => setWorkflowCount(w.length));
  }, []);

  return (
    <ScreenShell title="Settings & Workspaces">
      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">AI Settings</h3>
        <p className="text-sm text-slate-300">Unified AI endpoint drives workflows and command bar.</p>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            hasKey ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-200"
          }`}
        >
          {hasKey ? "AI_API_KEY detected on server" : "Using demo responses"}
        </span>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">Workspaces</h3>
        <p className="text-sm text-slate-300">Switch between Personal, Creator, and Business contexts.</p>
        <div className="px-3 py-2 rounded-lg bg-slate-800 text-sm inline-block">Current: {workspace.label}</div>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">PWA</h3>
        <p className="text-sm text-slate-300">Add to home screen for a full-screen, chrome-free OS feel.</p>
        <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
          <li>iOS: Tap share → Add to Home Screen.</li>
          <li>Android/Chrome: Menu → Install App.</li>
        </ul>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[{ name: "Free", bullets: ["Local data", "Core AI"], cta: "Stay free" },
            { name: "Pro", bullets: ["Creator workflows", "Sharing", "Sync (coming soon)"], cta: "Contact" },
            { name: "Business", bullets: ["Team workspaces", "Shared memory (coming soon)"], cta: "Contact" }].map((plan) => (
            <div key={plan.name} className="card p-3 space-y-2">
              <p className="font-semibold">{plan.name}</p>
              <ul className="list-disc list-inside text-sm text-slate-300">
                {plan.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <a className="text-[var(--workspace-accent)] text-sm" href="mailto:founder@example.com">
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">Data</h3>
        <p className="text-sm text-slate-300">Clear local events, artifacts, workflows, and workspace selection.</p>
        <PrimaryButton className="w-auto px-4 bg-red-500 text-white" onClick={() => setOpen(true)}>
          Clear local data
        </PrimaryButton>
      </section>

      <section className="card p-4 space-y-2">
        <h3 className="text-lg font-semibold">About</h3>
        <p className="text-sm text-slate-300">Mobile AI OS – an AI layer that sits on top of your phone.</p>
        <p className="text-sm text-slate-400">Version v1.0.0</p>
        <p className="text-sm text-slate-400">Workflows available: {workflowCount}</p>
      </section>

      <Modal open={open} title="Confirm reset" onClose={() => setOpen(false)}>
        <p className="text-sm text-slate-300">This will remove all local events, artifacts, and workflows.</p>
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-2 rounded-lg bg-slate-800 text-sm" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <PrimaryButton
            className="w-auto px-4 bg-red-500 text-white"
            onClick={() => {
              clearAllData();
              setOpen(false);
            }}
          >
            Clear
          </PrimaryButton>
        </div>
      </Modal>
    </ScreenShell>
  );
}
