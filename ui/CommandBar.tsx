"use client";
import { useEffect, useMemo, useState } from "react";
import { useWorkspaceContext } from "./ShellProvider";
import { commandPresets } from "../utils/commandPresets";
import { AITask } from "../core/aiClient";
import { createEventFromText, getEvents, getLatestEvent, saveArtifact, saveEvent } from "../core/storage";
import PrimaryButton from "./PrimaryButton";
import TextArea from "./TextArea";
import { useToast } from "./Toast";
import { v4 as uuid } from "uuid";

export default function CommandBar() {
  const { workspace } = useWorkspaceContext();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AITask>("summarize");
  const [attach, setAttach] = useState(true);
  const [input, setInput] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const { push } = useToast();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-command-bar", handler as EventListener);
    return () => window.removeEventListener("open-command-bar", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    getEvents(workspace.id).then((evts) => setAttach(evts.length > 0));
  }, [open, workspace.id]);

  const suggestions = useMemo(() => commandPresets.slice(0, 4), []);

  async function submit() {
    if (!input.trim()) return;
    const baseInput = input.trim();
    setRecent((prev) => [baseInput, ...prev.slice(0, 4)]);
    let finalInput = baseInput;
    let targetEvent = attach ? getLatestEvent(workspace.id) : null;
    if (attach && targetEvent) {
      finalInput = `${baseInput}\n\nContext:\n${targetEvent.normalizedText}`;
    }
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: mode, input: finalInput }),
    });
    const data = await response.json();
    const resultText = data.result || data.error || "No response";
    setResult(resultText);

    if (targetEvent && attach) {
      await saveArtifact({
        id: uuid(),
        eventId: targetEvent.id,
        workspaceId: workspace.id,
        kind: mode === "tasks" ? "taskList" : mode === "email" ? "emailDraft" : "summary",
        title: `${mode} result`,
        content: resultText,
        createdAt: new Date().toISOString(),
      });
      push({ title: "Saved to latest event", tone: "success" });
    } else {
      const event = createEventFromText(baseInput, workspace.id, { source: "command" });
      await saveEvent(event);
      await saveArtifact({
        id: uuid(),
        eventId: event.id,
        workspaceId: workspace.id,
        kind: "summary",
        title: `${mode} result`,
        content: resultText,
        createdAt: new Date().toISOString(),
      });
      push({ title: "Saved as new note", tone: "success" });
    }
  }

  return (
    <>
      <button
        className="fixed right-5 bottom-28 z-40 rounded-full bg-[var(--workspace-accent)] text-slate-900 font-semibold px-4 py-3 shadow-card"
        onClick={() => setOpen(true)}
      >
        Command
      </button>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="card w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400">Command Bar</p>
                <h3 className="text-lg font-semibold">Ask or command your OS</h3>
              </div>
              <button className="text-sm text-slate-400" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2 flex-wrap items-center">
                <select
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as AITask)}
                >
                  {commandPresets.map((preset) => (
                    <option key={preset.task} value={preset.task}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" checked={attach} onChange={(e) => setAttach(e.target.checked)} /> Attach to latest
                </label>
                <button
                  className="text-sm text-[var(--workspace-accent)]"
                  onClick={() => {
                    if (suggestions[0]) {
                      setMode(suggestions[0].task);
                      setInput(suggestions[0].placeholder);
                    }
                  }}
                >
                  Suggest
                </button>
              </div>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={commandPresets.find((c) => c.task === mode)?.placeholder || "Type a command"}
              />
              <PrimaryButton className="w-full" onClick={submit}>
                Run {mode}
              </PrimaryButton>
              {result && (
                <div className="card p-3 space-y-2">
                  <p className="text-xs text-slate-400">Result</p>
                  <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-2 rounded-lg bg-slate-800 text-sm"
                      onClick={() => navigator.clipboard.writeText(result)}
                    >
                      Copy
                    </button>
                    <button
                      className="px-3 py-2 rounded-lg bg-slate-800 text-sm"
                      onClick={() => {
                        const noteEvent = createEventFromText(result, workspace.id, {
                          source: "command",
                          title: "Command result note",
                        });
                        saveEvent(noteEvent);
                        push({ title: "Saved as note", tone: "success" });
                      }}
                    >
                      Save as note
                    </button>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 mb-2">Recent commands</p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((cmd, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-xs text-slate-200"
                      onClick={() => setInput(cmd)}
                    >
                      {cmd}
                    </button>
                  ))}
                  {recent.length === 0 && <p className="text-sm text-slate-500">Run something to see history.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
