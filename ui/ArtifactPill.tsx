import { Artifact } from "../core/types";
import { truncate } from "../utils/format";

export default function ArtifactPill({ artifact }: { artifact: Artifact }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
      <div className="font-semibold text-[11px] text-slate-200">{artifact.kind}</div>
      <div className="text-slate-300 mt-1">{truncate(artifact.content, 80)}</div>
    </div>
  );
}
