"use client";

import { useEffect, useState } from "react";
import AchievementCard from "@/components/AchievementCard";
import Card from "@/components/Card";
import { formatDate } from "@/lib/date";
import { getAchievements, getDiaries } from "@/lib/storage";
import type { AchievementResult, DiaryEntry } from "@/lib/types";

type GroupedEntries = {
  date: string;
  items: DiaryEntry[];
};

export default function HistoryPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [achievements, setAchievementsState] = useState<Record<string, AchievementResult>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadedDiaries = getDiaries().sort((a, b) => b.updatedAt - a.updatedAt);
    const loadedAchievements = getAchievements();
    setDiaries(loadedDiaries);
    setAchievementsState(loadedAchievements);
    setSelectedId(loadedDiaries[0]?.id ?? null);
  }, []);

  const selectedDiary = diaries.find((entry) => entry.id === selectedId);
  const selectedAchievement = selectedId ? achievements[selectedId] : null;

  const grouped: GroupedEntries[] = diaries.reduce((acc, entry) => {
    const existing = acc.find((group) => group.date === entry.date);
    if (existing) {
      existing.items.push(entry);
    } else {
      acc.push({ date: entry.date, items: [entry] });
    }
    return acc;
  }, [] as GroupedEntries[]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <Card title="成就档案">
        {grouped.length === 0 ? (
          <div className="text-sm text-earth-muted">这里还空着，先写一篇日记试试吧。</div>
        ) : (
          <div className="space-y-4">
            {grouped.map((group) => (
              <div key={group.date} className="space-y-2">
                <div className="text-xs font-semibold text-earth-muted">
                  {formatDate(group.date)}
                </div>
                <ul className="space-y-2">
                  {group.items.map((entry) => {
                    const achievement = achievements[entry.id];
                    return (
                      <li key={entry.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(entry.id)}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                            selectedId === entry.id
                              ? "bg-earth-accent-soft text-earth-accent"
                              : "hover:bg-black/5"
                          }`}
                        >
                          <div className="font-semibold">{entry.time}</div>
                          <div className="text-xs text-earth-muted">
                            {achievement?.titles?.[0] ?? "尚未生成成就"}
                          </div>
                          <div className="text-xs text-earth-muted">
                            经验 +{achievement?.xp ?? 0}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6">
        <Card title="当日记录">
          {selectedDiary ? (
            <div className="space-y-4 text-sm">
              <div className="text-earth-muted">
                {formatDate(selectedDiary.date)} {selectedDiary.time}
              </div>
              <div className="whitespace-pre-wrap rounded-lg bg-white/70 p-4">
                {selectedDiary.diaryText}
              </div>
              {selectedDiary.location ? (
                <div className="text-earth-muted">地点：{selectedDiary.location}</div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm text-earth-muted">先从左边点一天，我帮你翻出来。</div>
          )}
        </Card>

        <Card title="成就回放">
          {selectedAchievement ? (
            <AchievementCard achievement={selectedAchievement} />
          ) : (
            <div className="rounded-lg border border-dashed border-black/10 bg-white/50 px-4 py-8 text-center text-sm text-earth-muted">
              当天还没有成就记录。
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
