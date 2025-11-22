import { v4 as uuid } from "uuid";
import { AITask, runTask } from "./aiClient";
import { Artifact, ArtifactKind, Event, Workflow } from "./types";
import { getEventById, getWorkflows, saveArtifact } from "./storage";

const builtIn: Workflow[] = [
  {
    id: "summarize-anything",
    name: "Summarize Anything",
    description: "One-tap summarization for any capture.",
    workspaceId: "any",
    inputFilter: { allowedTypes: ["text", "pdf", "image", "audio", "url"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "summarize",
        template: "Summarize this content into crisp bullet points.\n\n{{normalizedText}}",
        outputKind: "summary",
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "rewrite-improve",
    name: "Rewrite & Improve",
    description: "Clarify tone and tighten writing.",
    workspaceId: "any",
    inputFilter: { allowedTypes: ["text", "url"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "rewrite",
        template: "Rewrite the content for clarity and confidence. Return the improved draft only.\n\n{{normalizedText}}",
        outputKind: "rewrite",
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "email-draft",
    name: "Email Draft Composer",
    description: "Turn captures into actionable emails.",
    workspaceId: "any",
    inputFilter: { allowedTypes: ["text", "pdf", "url"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "email",
        template: "Draft a concise email with subject and body based on this content.\n\n{{normalizedText}}",
        outputKind: "emailDraft",
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "task-extractor",
    name: "Task Extractor",
    description: "Extract action items from any capture.",
    workspaceId: "any",
    inputFilter: { allowedTypes: ["text", "pdf", "image", "audio", "url"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "tasks",
        template: "List the tasks implied by this content as bullet points.\n\n{{normalizedText}}",
        outputKind: "taskList",
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "contract-outline",
    name: "Contract Outline",
    description: "Create a structured contract outline for business docs.",
    workspaceId: "business",
    inputFilter: { allowedTypes: ["text", "pdf"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "contract",
        template: "Draft a contract outline with parties, scope, deliverables, payment, and timelines.\n\n{{normalizedText}}",
        outputKind: "contract",
      },
    ],
    isBuiltIn: true,
  },
  {
    id: "insight-generator",
    name: "Insight Generator",
    description: "Surface creative angles and hooks.",
    workspaceId: "creator",
    inputFilter: { allowedTypes: ["text", "url", "image"] },
    steps: [
      {
        id: "step-1",
        type: "ai",
        aiTask: "insight",
        template: "Provide 5 insights, angles, or hooks from this content.\n\n{{normalizedText}}",
        outputKind: "insight",
      },
    ],
    isBuiltIn: true,
  },
];

export function getBuiltInWorkflows(): Workflow[] {
  return builtIn;
}

const defaultTemplates: Record<AITask, string> = {
  summarize: "Summarize the following content in bullet points:\n\n{{normalizedText}}",
  rewrite: "Rewrite the following content with clarity:\n\n{{normalizedText}}",
  email: "Draft an email with subject and body based on:\n\n{{normalizedText}}",
  tasks: "Extract bullet tasks from:\n\n{{normalizedText}}",
  contract: "Provide a contract outline from:\n\n{{normalizedText}}",
  insight: "Provide insights and angles from:\n\n{{normalizedText}}",
};

function inferKind(task: AITask): ArtifactKind {
  switch (task) {
    case "summarize":
      return "summary";
    case "rewrite":
      return "rewrite";
    case "email":
      return "emailDraft";
    case "tasks":
      return "taskList";
    case "contract":
      return "contract";
    case "insight":
      return "insight";
    default:
      return "other";
  }
}

export async function runWorkflowOnEvent(
  workflow: Workflow,
  event: Event
): Promise<Artifact[]> {
  const artifacts: Artifact[] = [];
  for (const step of workflow.steps) {
    if (step.type === "ai" && step.aiTask) {
      const prompt = (step.template || defaultTemplates[step.aiTask] || "")
        .replace(/{{normalizedText}}/g, event.normalizedText);
      const content = await runTask(step.aiTask, prompt);
      const artifact: Artifact = {
        id: uuid(),
        eventId: event.id,
        workspaceId: event.workspaceId,
        kind: step.outputKind || inferKind(step.aiTask),
        title: `${workflow.name} • ${step.aiTask}`,
        content,
        createdAt: new Date().toISOString(),
      };
      artifacts.push(artifact);
      await saveArtifact(artifact);
    } else if (step.type === "transform") {
      const artifact: Artifact = {
        id: uuid(),
        eventId: event.id,
        workspaceId: event.workspaceId,
        kind: step.outputKind || "other",
        title: `${workflow.name} • transform`,
        content: `Transformed: ${event.normalizedText.slice(0, 400)}`,
        createdAt: new Date().toISOString(),
      };
      artifacts.push(artifact);
      await saveArtifact(artifact);
    } else if (step.type === "route") {
      continue;
    }
  }
  return artifacts;
}

export async function runWorkflowByIdOnEventId(
  workflowId: string,
  eventId: string
): Promise<Artifact[]> {
  const [workflowList, event] = await Promise.all([
    getWorkflows(),
    getEventById(eventId),
  ]);
  if (!event) {
    throw new Error("Event not found");
  }
  const workflow = workflowList.find((w) => w.id === workflowId);
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  return runWorkflowOnEvent(workflow, event);
}
