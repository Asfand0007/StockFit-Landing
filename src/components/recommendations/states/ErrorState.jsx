export default function ErrorState({ message, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6">
      <p className="text-red-200">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg border border-red-300/40 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}