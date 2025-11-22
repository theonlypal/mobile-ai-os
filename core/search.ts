import { Artifact, Event } from "./types";

export interface SearchResult {
  events: Event[];
  artifacts: Artifact[];
}

export function searchMemory(query: string, events: Event[], artifacts: Artifact[]): SearchResult {
  const q = query.toLowerCase();
  if (!q) return { events, artifacts };
  const eventMatches = events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.normalizedText.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
  );
  const artifactMatches = artifacts.filter(
    (a) => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
  );
  return { events: eventMatches, artifacts: artifactMatches };
}
