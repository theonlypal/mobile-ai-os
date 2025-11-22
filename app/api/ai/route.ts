import { NextRequest, NextResponse } from "next/server";
import { AITask, runTask } from "../../../core/aiClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task, input, extra } = body as { task: AITask; input: string; extra?: Record<string, any> };
    const result = await runTask(task, input, extra);
    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
