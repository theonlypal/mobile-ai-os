import { useEffect, useState } from "react";
import { getArtifactsForEvent } from "../core/storage";
import { Artifact, Event } from "../core/types";
import { formatDateTime, truncate } from "../utils/format";
import ArtifactPill from "./ArtifactPill";

export default function EventCard({ event, onSelect }: { event: Event; onSelect?: (event: Event) => void }) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);

  useEffect(() => {
    getArtifactsForEvent(event.id).then(setArtifacts);
  }, [event.id]);

  return (
    <button className="card w-full text-left p-4" onClick={() => onSelect?.(event)}>
      <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
        <span className="px-2 py-1 rounded-full bg-slate-900 border border-slate-700 capitalize">{event.type}</span>
        <span>{formatDateTime(event.createdAt)}</span>
      </div>
      <h3 className="text-lg font-semibold text-slate-50 mb-1">{event.title}</h3>
      <p className="text-sm text-slate-300 mb-3">{truncate(event.normalizedText, 140)}</p>
      {artifacts.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {artifacts.slice(0, 3).map((artifact) => (
            <ArtifactPill key={artifact.id} artifact={artifact} />
          ))}
        </div>
      )}
    </button>
  );
}
