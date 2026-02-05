export default function ProgressBar({
  value,
  max
}: {
  value: number;
  max: number;
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-earth-accent-soft">
      <div
        className="h-full rounded-full bg-earth-accent transition"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
