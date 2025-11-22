export default function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="section-title">{title}</h2>
      {action}
    </div>
  );
}
