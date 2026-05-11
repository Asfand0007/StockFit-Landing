export default function LoadingState({ text }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-black/20 p-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-white/75">{text}</p>
      </div>
    </div>
  );
}