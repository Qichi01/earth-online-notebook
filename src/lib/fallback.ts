import type { AchievementResult } from "@/lib/types";

const titlesPool = [
  "【认真生活的居民】",
  "【照顾自己的人】",
  "【地球 Online 旅行者】",
  "【温柔推进者】",
  "【坚持记录的人】"
];

const descriptions = [
  "系统判定：今天这局没有白开。你把日常稳稳接住，经验条当场往前蹿了一小格，已经算很会过生活了。",
  "你今天不是在硬撑，而是在认真经营自己。地球 Online 对这种稳定发挥一向很大方，先发经验再说。",
  "这条记录看起来平静，实际属于闷声拿分型选手。生活没敲锣打鼓，但系统已经偷偷给你结算了。"
];

export function buildFallbackAchievement(
  entryId: string,
  date: string,
  location: string | null
): AchievementResult {
  const title = titlesPool[Math.floor(Math.random() * titlesPool.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  const xp = 15;

  return {
    entryId,
    date,
    titles: [title],
    description,
    xp,
    tags: ["记录", "日常"],
    location: { city: location || null },
    achievement_version: "v0",
    posterScene: "city-night"
  };
}
