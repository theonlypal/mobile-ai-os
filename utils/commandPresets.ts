import { AITask } from "../core/aiClient";

export interface CommandPreset {
  label: string;
  placeholder: string;
  task: AITask;
  hint?: string;
}

export const commandPresets: CommandPreset[] = [
  {
    label: "Summarize",
    placeholder: "Summarize this…",
    task: "summarize",
    hint: "Great for quick digestion",
  },
  {
    label: "Rewrite",
    placeholder: "Rewrite in a sharper tone…",
    task: "rewrite",
    hint: "Clarify tone and tighten",
  },
  {
    label: "Email",
    placeholder: "Draft a reply…",
    task: "email",
    hint: "Subject + body in one click",
  },
  {
    label: "Tasks",
    placeholder: "What needs to happen?",
    task: "tasks",
    hint: "Extracts action items",
  },
  {
    label: "Insights",
    placeholder: "New angles, hooks…",
    task: "insight",
    hint: "Creative exploration",
  },
];
