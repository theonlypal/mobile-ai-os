"use client";
import { useEffect, useMemo, useState } from "react";
import ScreenShell from "../../ui/ScreenShell";
import WorkflowCard from "../../ui/WorkflowCard";
import TextArea from "../../ui/TextArea";
import PrimaryButton from "../../ui/PrimaryButton";
import { Workflow } from "../../core/types";
import { getWorkflows, resetToBuiltInWorkflows, saveWorkflow } from "../../core/storage";
import { useWorkspaceContext } from "../../ui/ShellProvider";
import { useToast } from "../../ui/Toast";
import { runWorkflowOnEvent } from "../../core/workflowEngine";
import { getLatestEvent } from "../../core/storage";
import { v4 as uuid } from "uuid";

export default function WorkflowsPage() {
  const { workspace } = useWorkspaceContext();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [json, setJson] = useState(`{
  "id": "custom-idea",
  "name": "Idea Expander",
  "description": "Expand notes into richer ideas",
  "workspaceId": "any",
  "inputFilter": { "allowedTypes": ["text"] },
  "steps": [
    { "id": "step-1", "type": "ai", "aiTask": "insight", "template": "Generate 3 expanded ideas:\n{{normalizedText}}" }
  ],
  "isBuiltIn": false
}`);
  const { push } = useToast();

  useEffect(() => {
    getWorkflows().then(setWorkflows);
  }, []);

  const builtIns = useMemo(() => workflows.filter((w) => w.isBuiltIn), [workflows]);
  const custom = useMemo(() => workflows.filter((w) => !w.isBuiltIn), [workflows]);

  async function saveCustom() {
    try {
      const parsed = JSON.parse(json) as Workflow;
      if (!parsed.id || !parsed.name || !parsed.steps) throw new Error("Missing required fields");
      parsed.isBuiltIn = false;
      if (!parsed.workspaceId) parsed.workspaceId = "any";
      await saveWorkflow(parsed);
      setWorkflows(await getWorkflows());
      push({ title: "Workflow saved", tone: "success" });
    } catch (err: any) {
      push({ title: "Invalid JSON", description: err.message, tone: "warn" });
    }
  }

  async function runOnLatest(workflow: Workflow) {
    const event = getLatestEvent(workspace.id);
    if (!event) {
      push({ title: "No events", description: "Capture something first", tone: "warn" });
      return;
    }
    await runWorkflowOnEvent(workflow, event);
    push({ title: `Ran ${workflow.name}`, tone: "success" });
  }

  return (
    <ScreenShell title="Workflows">
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="section-title">Built-in workflows</h2>
          <button className="text-sm text-[var(--workspace-accent)]" onClick={() => resetToBuiltInWorkflows().then(() => getWorkflows().then(setWorkflows))}>
            Reset built-ins
          </button>
        </div>
        <div className="space-y-3">
          {builtIns.map((w) => (
            <WorkflowCard key={w.id} workflow={w} onRun={() => runOnLatest(w)} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="section-title">Your workflows</h2>
        <div className="space-y-3">
          {custom.map((w) => (
            <WorkflowCard key={w.id} workflow={w} onRun={() => runOnLatest(w)} />
          ))}
          {custom.length === 0 && <p className="text-sm text-slate-400">No custom workflows yet.</p>}
        </div>
      </section>

      <section className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">Workflow JSON editor</h3>
        <p className="text-sm text-slate-400">Paste or edit a workflow definition. Save to add it to your workspace.</p>
        <TextArea value={json} onChange={(e) => setJson(e.target.value)} className="font-mono text-xs min-h-[220px]" />
        <div className="flex gap-2">
          <PrimaryButton className="w-auto px-4" onClick={saveCustom}>
            Save workflow
          </PrimaryButton>
          <button
            className="px-4 py-3 rounded-xl bg-slate-800 text-sm"
            onClick={() =>
              setJson((prev) => {
                try {
                  const obj = JSON.parse(prev) as Workflow;
                  obj.id = `custom-${uuid().slice(0, 6)}`;
                  return JSON.stringify(obj, null, 2);
                } catch {
                  return prev;
                }
              })
            }
          >
            Randomize id
          </button>
        </div>
      </section>
    </ScreenShell>
  );
}
