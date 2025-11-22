"use client";
import { useEffect, useMemo, useState } from "react";
import ScreenShell from "../../ui/ScreenShell";
import { Event } from "../../core/types";
import { createEventFromText, getEvents, saveEvent } from "../../core/storage";
import EventCard from "../../ui/EventCard";
import TextArea from "../../ui/TextArea";
import TextInput from "../../ui/TextInput";
import PrimaryButton from "../../ui/PrimaryButton";
import { useWorkspaceContext } from "../../ui/ShellProvider";
import { useToast } from "../../ui/Toast";

const filters: (Event["type"] | "all")[] = ["all", "text", "pdf", "image", "audio", "url"];

export default function InboxPage() {
  const { workspace } = useWorkspaceContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [captureText, setCaptureText] = useState("");
  const [captureUrl, setCaptureUrl] = useState("");
  const [captureNote, setCaptureNote] = useState("");
  const { push } = useToast();

  useEffect(() => {
    getEvents(workspace.id).then(setEvents);
  }, [workspace.id]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesFilter = filter === "all" ? true : event.type === filter;
      const matchesQuery = query
        ? event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.normalizedText.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesFilter && matchesQuery;
    });
  }, [events, filter, query]);

  async function createCapture(text: string, type: Event["type"]) {
    if (!text.trim()) return;
    const event = createEventFromText(text, workspace.id, { type, source: "paste" });
    await saveEvent(event);
    push({ title: "Captured", description: event.title, tone: "success" });
    const nextEvents = await getEvents(workspace.id);
    setEvents(nextEvents);
  }

  return (
    <ScreenShell title="Inbox">
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TextInput
            placeholder="Search captures"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <select
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            {filters.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card p-4 space-y-2">
          <p className="text-sm text-slate-300">Paste text</p>
          <TextArea value={captureText} onChange={(e) => setCaptureText(e.target.value)} />
          <PrimaryButton onClick={() => createCapture(captureText, "text")}>Save</PrimaryButton>
        </div>
        <div className="card p-4 space-y-2">
          <p className="text-sm text-slate-300">Paste URL</p>
          <TextInput value={captureUrl} onChange={(e) => setCaptureUrl(e.target.value)} placeholder="https://" />
          <PrimaryButton onClick={() => createCapture(captureUrl, "url")}>Save</PrimaryButton>
        </div>
        <div className="card p-4 space-y-2">
          <p className="text-sm text-slate-300">Quick note</p>
          <TextArea value={captureNote} onChange={(e) => setCaptureNote(e.target.value)} />
          <PrimaryButton onClick={() => createCapture(captureNote, "text")}>Save</PrimaryButton>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-400">No captures match your filters.</p>}
      </div>
    </ScreenShell>
  );
}
