import { AchievementResult } from "@/lib/types";

export default function AchievementCard({
  achievement
}: {
  achievement: AchievementResult;
}) {
  return (
    <div className="rounded-xl border border-earth-accent/20 bg-earth-accent-soft/40 p-5">
      <div className="mb-2 text-sm text-earth-muted">地球 Online · 成就播报</div>
      <div className="mb-3 flex flex-wrap gap-2">
        {achievement.titles.map((title) => (
          <span
            key={title}
            className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-earth-accent"
          >
            {title}
          </span>
        ))}
      </div>
      <p className="mb-4 text-sm leading-relaxed text-earth-text">
        {achievement.description}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm text-earth-muted">
        <span>经验 +{achievement.xp}</span>
        {achievement.location.city ? (
          <span>坐标：{achievement.location.city}</span>
        ) : null}
        {achievement.tags.length > 0 ? (
          <span>关键词：{achievement.tags.join(" · ")}</span>
        ) : null}
      </div>
    </div>
  );
}
