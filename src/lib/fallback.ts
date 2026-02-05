import type { AchievementResult } from "@/lib/types";

const titlesPool = [
  "【认真生活的居民】",
  "【照顾自己的人】",
  "【地球 Online 旅行者】",
  "【温柔推进者】",
  "【坚持记录的人】"
];

const descriptions = [
  "今天你把日常照顾得很稳，也让待办前进了一小格。步子不大但很踏实，经验条当场+1格。",
  "你没有被琐事困住，而是把注意力放回到自己身上。这个选择，会在地球 Online 的地图上点亮一小块。",
  "你愿意记录，说明你在认真对待自己。哪怕只是微小的动作，也在慢慢积累经验，让生活更有方向感。"
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
    achievement_version: "v0"
  };
}
