import { v4 as uuid } from "uuid";
import { Artifact, Event, Workflow, WorkspaceId } from "./types";
import { getBuiltInWorkflows } from "./workflowEngine";
import { getWorkspaces } from "./workspaces";

const EVENTS_KEY = "aios-events";
const ARTIFACTS_KEY = "aios-artifacts";
const WORKFLOWS_KEY = "aios-workflows";

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedData() {
  if (typeof window === "undefined") return;
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  if (events.length) return;
  const now = new Date();
  const sampleEvents: Event[] = [];
  getWorkspaces().forEach((workspace) => {
    const baseTime = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    const titles = [
      `${workspace.label} kickoff note`,
      `${workspace.label} recent capture`
    ];
    titles.forEach((title, idx) => {
      const id = uuid();
      sampleEvents.push({
        id,
        workspaceId: workspace.id,
        type: idx % 2 === 0 ? "text" : "url",
        source: "note",
        title,
        rawPayload: JSON.stringify({ title }),
        normalizedText: `${title} with quick details and priorities for ${workspace.label}`,
        tags: workspace.defaultTags.slice(0, 2),
        createdAt: new Date(baseTime.getTime() + idx * 1000 * 60 * 60).toISOString(),
        updatedAt: new Date(baseTime.getTime() + idx * 1000 * 60 * 60).toISOString(),
      });
    });
  });
  setLocal(EVENTS_KEY, sampleEvents);

  const sampleArtifacts: Artifact[] = sampleEvents.map((event) => ({
    id: uuid(),
    eventId: event.id,
    workspaceId: event.workspaceId,
    kind: "summary",
    title: "Auto summary",
    content: `${event.title} summarized for quick review.`,
    createdAt: event.createdAt,
  }));
  setLocal(ARTIFACTS_KEY, sampleArtifacts);

  const workflows = getBuiltInWorkflows();
  setLocal(WORKFLOWS_KEY, workflows);
}

function ensureSeeded() {
  if (typeof window === "undefined") return;
  seedData();
}

export async function getEvents(workspaceId?: WorkspaceId): Promise<Event[]> {
  ensureSeeded();
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  if (!workspaceId) return events;
  return events.filter((e) => e.workspaceId === workspaceId);
}

export async function getEventById(id: string): Promise<Event | null> {
  ensureSeeded();
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  return events.find((e) => e.id === id) ?? null;
}

export async function saveEvent(event: Event): Promise<void> {
  ensureSeeded();
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  const existingIdx = events.findIndex((e) => e.id === event.id);
  if (existingIdx >= 0) {
    events[existingIdx] = event;
  } else {
    events.unshift(event);
  }
  setLocal(EVENTS_KEY, events);
}

export async function deleteEvent(id: string): Promise<void> {
  ensureSeeded();
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  const filtered = events.filter((e) => e.id !== id);
  setLocal(EVENTS_KEY, filtered);
  const artifacts = getLocal<Artifact[]>(ARTIFACTS_KEY, []);
  setLocal(ARTIFACTS_KEY, artifacts.filter((a) => a.eventId !== id));
}

export async function getArtifactsForEvent(eventId: string): Promise<Artifact[]> {
  ensureSeeded();
  const artifacts = getLocal<Artifact[]>(ARTIFACTS_KEY, []);
  return artifacts.filter((a) => a.eventId === eventId);
}

export async function saveArtifact(artifact: Artifact): Promise<void> {
  ensureSeeded();
  const artifacts = getLocal<Artifact[]>(ARTIFACTS_KEY, []);
  const existingIdx = artifacts.findIndex((a) => a.id === artifact.id);
  if (existingIdx >= 0) {
    artifacts[existingIdx] = artifact;
  } else {
    artifacts.unshift(artifact);
  }
  setLocal(ARTIFACTS_KEY, artifacts);
}

export async function getWorkflows(workspaceId?: WorkspaceId | "any"): Promise<Workflow[]> {
  ensureSeeded();
  const workflows = getLocal<Workflow[]>(WORKFLOWS_KEY, getBuiltInWorkflows());
  if (!workspaceId) return workflows;
  return workflows.filter((w) => w.workspaceId === "any" || w.workspaceId === workspaceId);
}

export async function saveWorkflow(workflow: Workflow): Promise<void> {
  ensureSeeded();
  const workflows = getLocal<Workflow[]>(WORKFLOWS_KEY, getBuiltInWorkflows());
  const existingIdx = workflows.findIndex((w) => w.id === workflow.id);
  if (existingIdx >= 0) {
    workflows[existingIdx] = workflow;
  } else {
    workflows.push(workflow);
  }
  setLocal(WORKFLOWS_KEY, workflows);
}

export async function resetToBuiltInWorkflows(): Promise<void> {
  const builtIns = getBuiltInWorkflows();
  setLocal(WORKFLOWS_KEY, builtIns);
}

export function createEventFromText(
  text: string,
  workspaceId: WorkspaceId,
  opts?: { type?: Event["type"]; source?: Event["source"]; title?: string; tags?: string[] }
): Event {
  const now = new Date().toISOString();
  const title = opts?.title || text.slice(0, 60) || "Quick capture";
  return {
    id: uuid(),
    workspaceId,
    type: opts?.type ?? "text",
    source: opts?.source ?? "note",
    title,
    rawPayload: text,
    normalizedText: text.trim(),
    tags: opts?.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function getLatestEvent(workspaceId: WorkspaceId): Event | null {
  const events = getLocal<Event[]>(EVENTS_KEY, []);
  const filtered = events.filter((e) => e.workspaceId === workspaceId);
  return filtered[0] ?? null;
}

export function clearAllData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(EVENTS_KEY);
  window.localStorage.removeItem(ARTIFACTS_KEY);
  window.localStorage.removeItem(WORKFLOWS_KEY);
  window.localStorage.removeItem("aios-selected-workspace");
}

ensureSeeded();
