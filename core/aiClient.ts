export type AITask = "summarize" | "rewrite" | "email" | "tasks" | "contract" | "insight";

const DEMO_RESPONSES: Record<AITask, string> = {
  summarize: "[demo] Summary: key points distilled for you.",
  rewrite: "[demo] Rewritten content with improved clarity and tone.",
  email: "[demo] Subject: Quick follow-up\nBody: Here's a concise draft ready to send.",
  tasks: "[demo] • Task one\n• Task two\n• Task three",
  contract: "[demo] Contract outline with scope, payment, and timelines.",
  insight: "[demo] Insights: hooks, angles, and ideas to explore.",
};

export async function runTask(task: AITask, input: string, extra?: Record<string, any>): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return DEMO_RESPONSES[task] || "[demo] AI not configured";
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `You are an assistant performing task: ${task}.` },
          { role: "user", content: input },
        ],
        ...extra,
      }),
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response";
    return result;
  } catch (err: any) {
    return `AI error: ${err.message || err.toString()}`;
  }
}
