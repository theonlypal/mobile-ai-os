"use client";
import { useEffect, useMemo, useState } from "react";
import ScreenShell from "../ui/ScreenShell";
import PrimaryButton from "../ui/PrimaryButton";
import { getEvents } from "../core/storage";
import type { Event } from "../core/types";
import EventCard from "../ui/EventCard";
import { useWorkspaceContext } from "../ui/ShellProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { workspace } = useWorkspaceContext();
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();

  useEffect(() => {
    getEvents(workspace.id).then(setEvents);
  }, [workspace.id]);

  const suggestions = useMemo(
    () => [
      "Summarize last PDF",
      "Draft reply to your most recent email-like event",
      "Extract tasks from your last capture",
    ],
    []
  );

  return (
    <ScreenShell title="AI OS">
      <div className="gradient-border">
        <div className="card bg-slate-900/70 p-5 space-y-3">
          <p className="text-sm text-slate-400">Capture or Command</p>
          <div className="flex gap-3">
            <PrimaryButton className="w-1/2" onClick={() => router.push("/capture")}>New Capture</PrimaryButton>
            <PrimaryButton
              className="w-1/2 bg-slate-800 text-slate-100"
              onClick={() => window.dispatchEvent(new Event("open-command-bar"))}
            >
              Open Command Bar
            </PrimaryButton>
          </div>
        </div>
      </div>

      <section>
        <h2 className="section-title mb-2">Smart Suggestions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestions.map((s) => (
            <div key={s} className="card p-4 text-sm text-slate-200 border border-slate-800/70">
              {s}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title mb-2">Recent Activity</h2>
        <div className="space-y-3">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          {events.length === 0 && <p className="text-sm text-slate-400">No events yet—capture something!</p>}
        </div>
      </section>
    </ScreenShell>
  );
}
