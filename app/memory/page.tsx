"use client";
import { useEffect, useState } from "react";
import ScreenShell from "../../ui/ScreenShell";
import TextInput from "../../ui/TextInput";
import { useWorkspaceContext } from "../../ui/ShellProvider";
import { getArtifactsForEvent, getEvents } from "../../core/storage";
import { Artifact, Event } from "../../core/types";
import { searchMemory } from "../../core/search";
import { truncate } from "../../utils/format";

const spacesByWorkspace: Record<string, string[]> = {
  personal: ["Job hunt", "School", "Health"],
  creator: ["Content ideas", "Scripts"],
  business: ["Clients", "Deals"],
};

export default function MemoryPage() {
  const { workspace } = useWorkspaceContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ events: Event[]; artifacts: Artifact[] }>({ events: [], artifacts: [] });

  useEffect(() => {
    async function load() {
      const evts = await getEvents(workspace.id);
      setEvents(evts);
      const allArtifacts: Artifact[] = [];
      for (const evt of evts) {
        const arts = await getArtifactsForEvent(evt.id);
        allArtifacts.push(...arts);
      }
      setArtifacts(allArtifacts);
      setResults(searchMemory(query, evts, allArtifacts));
    }
    load();
  }, [workspace.id]);

  useEffect(() => {
    setResults(searchMemory(query, events, artifacts));
  }, [query, events, artifacts]);

  return (
    <ScreenShell title="Memory">
      <div className="card p-4 space-y-3">
        <TextInput placeholder="Search across events and artifacts" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <section className="space-y-3">
        <h2 className="section-title">Spaces</h2>
        <div className="flex gap-2 flex-wrap">
          {(spacesByWorkspace[workspace.id] || []).map((space) => (
            <button
              key={space}
              className="px-3 py-2 rounded-xl bg-slate-800 text-sm"
              onClick={() => setQuery(space)}
            >
              {space}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="section-title">Events</h2>
        <div className="space-y-2">
          {results.events.map((evt) => (
            <div key={evt.id} className="card p-3">
              <p className="text-xs text-slate-400">{evt.type}</p>
              <p className="font-semibold">{evt.title}</p>
              <p className="text-sm text-slate-300">{truncate(evt.normalizedText, 140)}</p>
            </div>
          ))}
          {results.events.length === 0 && <p className="text-sm text-slate-500">No event matches yet.</p>}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="section-title">Artifacts</h2>
        <div className="space-y-2">
          {results.artifacts.map((art) => (
            <div key={art.id} className="card p-3">
              <p className="text-xs text-slate-400">{art.kind}</p>
              <p className="font-semibold">{art.title}</p>
              <p className="text-sm text-slate-300">{truncate(art.content, 160)}</p>
            </div>
          ))}
          {results.artifacts.length === 0 && <p className="text-sm text-slate-500">No artifact matches yet.</p>}
        </div>
      </section>
    </ScreenShell>
  );
}
