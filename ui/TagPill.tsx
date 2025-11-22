export default function TagPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-200 border border-slate-700">
      {label}
    </span>
  );
}
