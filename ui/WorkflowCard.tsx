import { Workflow } from "../core/types";
import PrimaryButton from "./PrimaryButton";
import TagPill from "./TagPill";

export default function WorkflowCard({ workflow, onRun }: { workflow: Workflow; onRun?: () => void }) {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="text-lg font-semibold">{workflow.name}</h3>
          <p className="text-sm text-slate-300">{workflow.description}</p>
          <div className="flex gap-2 flex-wrap mt-2 text-xs text-slate-400">
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">{workflow.workspaceId}</span>
            <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700">
              {workflow.inputFilter.allowedTypes.join(", ")}
            </span>
          </div>
        </div>
        <PrimaryButton className="w-auto px-3 py-2 text-sm" onClick={onRun}>
          Run
        </PrimaryButton>
      </div>
      {!workflow.isBuiltIn && <TagPill label="Custom" />}
    </div>
  );
}
