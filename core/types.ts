export type WorkspaceId = "personal" | "creator" | "business";

export type EventType = "text" | "pdf" | "image" | "audio" | "url";
export type ArtifactKind =
  | "summary"
  | "rewrite"
  | "emailDraft"
  | "taskList"
  | "contract"
  | "insight"
  | "other";

export interface Event {
  id: string;
  workspaceId: WorkspaceId;
  type: EventType;
  source: "share" | "paste" | "upload" | "command" | "note";
  title: string;
  rawPayload: string;
  normalizedText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Artifact {
  id: string;
  eventId: string;
  workspaceId: WorkspaceId;
  kind: ArtifactKind;
  title: string;
  content: string;
  meta?: Record<string, any>;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  type: "ai" | "transform" | "route";
  aiTask?: "summarize" | "rewrite" | "email" | "tasks" | "contract" | "insight";
  template?: string;
  outputKind?: ArtifactKind;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workspaceId: WorkspaceId | "any";
  inputFilter: {
    allowedTypes: EventType[];
  };
  steps: WorkflowStep[];
  isBuiltIn: boolean;
}

export interface Workspace {
  id: WorkspaceId;
  label: string;
  accentColor: string;
  description: string;
  defaultTags: string[];
}
