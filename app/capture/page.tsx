"use client";
import { Suspense, useEffect, useState } from "react";
import ScreenShell from "../../ui/ScreenShell";
import { useWorkspaceContext } from "../../ui/ShellProvider";
import { createEventFromText, saveEvent } from "../../core/storage";
import { runWorkflowByIdOnEventId } from "../../core/workflowEngine";
import PrimaryButton from "../../ui/PrimaryButton";
import { useSearchParams } from "next/navigation";

export default function CapturePage() {
  return (
    <ScreenShell title="Capture">
      <Suspense fallback={<div className="card p-4">Preparing capture…</div>}>
        <CaptureContent />
      </Suspense>
    </ScreenShell>
  );
}

function CaptureContent() {
  const params = useSearchParams();
  const { workspace } = useWorkspaceContext();
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    const text = params.get("text");
    if (!text) return;
    const title = params.get("title") || text.slice(0, 60);
    const type = (params.get("type") as any) || "text";
    const event = createEventFromText(text, workspace.id, { title, type, source: "share" });
    saveEvent(event).then(() => {
      runWorkflowByIdOnEventId("summarize-anything", event.id).catch(() => null);
      setCreatedId(event.id);
    });
  }, [params, workspace.id]);

  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-lg font-semibold">Capture via Share</h3>
      <p className="text-sm text-slate-300">
        Drop into this route from shortcuts or share sheets to instantly add content to your OS.
      </p>
      {createdId ? (
        <div className="space-y-2">
          <p className="text-sm text-emerald-300">Captured! Default summary is processing.</p>
          <PrimaryButton className="w-auto" onClick={() => window.location.assign("/")}>Go home</PrimaryButton>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Include ?text=... in the URL to capture automatically.</p>
      )}
    </div>
  );
}
