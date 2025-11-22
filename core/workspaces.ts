import { Workspace, WorkspaceId } from "./types";

const STORAGE_KEY = "aios-selected-workspace";

const workspaces: Workspace[] = [
  {
    id: "personal",
    label: "Personal",
    accentColor: "#0d9488",
    description: "Life, school, and friends.",
    defaultTags: ["life", "school", "friends"],
  },
  {
    id: "creator",
    label: "Creator",
    accentColor: "#8b5cf6",
    description: "Content, scripts, and ideas.",
    defaultTags: ["content", "scripts", "ideas"],
  },
  {
    id: "business",
    label: "Business",
    accentColor: "#0ea5e9",
    description: "Clients, deals, invoices, legal.",
    defaultTags: ["client", "deal", "invoices", "legal"],
  },
];

export function getWorkspaces(): Workspace[] {
  return workspaces;
}

export function getWorkspaceById(id: WorkspaceId): Workspace {
  const found = workspaces.find((w) => w.id === id);
  if (!found) return workspaces[0];
  return found;
}

export function getDefaultWorkspace(): Workspace {
  return workspaces[0];
}

export function getStoredWorkspaceId(): WorkspaceId {
  if (typeof window === "undefined") return getDefaultWorkspace().id;
  const saved = window.localStorage.getItem(STORAGE_KEY) as WorkspaceId | null;
  return saved ?? getDefaultWorkspace().id;
}

export function setStoredWorkspaceId(id: WorkspaceId) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, id);
}
