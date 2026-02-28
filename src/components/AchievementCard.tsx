import {
  getAchievementCategory,
  getAchievementScene,
  getCategoryLabel,
  getCurrentBadgeTier
} from "@/lib/achievementVisuals";
import type { AchievementResult } from "@/lib/types";

function formatPosterDate(date: string) {
  return date.split("-").join(".");
}

export default function AchievementCard({
  achievement,
  achievements
}: {
  achievement: AchievementResult;
  achievements?: Record<string, AchievementResult> | AchievementResult[];
}) {
  const category = getAchievementCategory(achievement);
  const scene = getAchievementScene(achievement);
  const badge = achievements ? getCurrentBadgeTier(achievement, achievements) : null;
  const title = achievement.titles[0] ?? "【今日成就】";
  const imageUrl =
    achievement.posterImageUrl ||
    `/api/achievement-card/image?title=${encodeURIComponent(title)}&date=${encodeURIComponent(
      achievement.date
    )}&scene=${encodeURIComponent(achievement.posterScene || scene)}`;

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-stretch">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] border border-black/10 bg-black shadow-soft">
        <img src={imageUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_34%,rgba(0,0,0,0.34)_100%)]" />

        <div className="absolute left-4 right-4 top-14 md:left-6 md:right-6 md:top-18">
          <div
            className="max-w-[58%] text-[22px] font-black leading-[1.08] tracking-tight text-[#fff6de] md:text-[30px]"
            style={{
              textShadow:
                "-2px 0 #4b2d12, 0 2px #4b2d12, 2px 0 #4b2d12, 0 -2px #4b2d12, 0 8px 18px rgba(0,0,0,0.28)"
            }}
          >
            {title}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 rounded-full bg-black/28 px-3 py-1.5 text-[11px] font-semibold text-[#fff6de] backdrop-blur-sm md:bottom-6 md:left-6">
          {formatPosterDate(achievement.date)}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 md:bottom-6 md:right-6">
          <span className="rounded-full bg-[#fff6de]/88 px-3 py-1 text-[11px] font-semibold text-[#573818]">
            EXP +{achievement.xp}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/24 text-sm text-white/90 backdrop-blur-sm">
            ✦
          </span>
        </div>
      </div>

      <div className="flex self-stretch rounded-2xl border border-black/8 bg-white/65 p-4 md:h-full">
        <div className="flex h-full w-full flex-col justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-earth-accent-soft px-3 py-1 font-semibold text-earth-accent">
              {getCategoryLabel(category)}
            </span>
            {badge ? (
              <span className="rounded-full border border-earth-accent/20 px-3 py-1 font-semibold text-earth-accent">
                徽章：{badge.name}
              </span>
            ) : null}
          </div>

          <div className="text-sm leading-7 text-earth-muted">{achievement.description}</div>
        </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {achievement.location.city ? (
              <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">坐标：{achievement.location.city}</span>
            ) : null}
            {achievement.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
