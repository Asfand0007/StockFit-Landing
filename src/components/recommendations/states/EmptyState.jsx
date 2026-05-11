export default function EmptyState({ message }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
      <p className="text-white/70">{message}</p>
    </div>
  );
}