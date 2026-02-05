"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AchievementCard from "@/components/AchievementCard";
import Card from "@/components/Card";
import { formatDate, formatTime, today } from "@/lib/date";
import { buildFallbackAchievement } from "@/lib/fallback";
import {
  clearApiKey,
  getAchievements,
  getApiKey,
  getDiaries,
  getProfile,
  getProviderConfig,
  setAchievements,
  setDiaries,
  setProfile
} from "@/lib/storage";
import { applyXP } from "@/lib/xp";
import type { AchievementResult, DiaryEntry } from "@/lib/types";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<string>(today());
  const [diaryText, setDiaryText] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>(formatTime(new Date()));
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [achievementsMap, setAchievementsMap] = useState<Record<string, AchievementResult>>({});
  const [achievement, setAchievement] = useState<AchievementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [providerConfig, setProviderConfigState] = useState(getProviderConfig());

  useEffect(() => {
    setApiKeyState(getApiKey());
    setProviderConfigState(getProviderConfig());
  }, []);

  const loadEntries = (date: string) => {
    const diaries = getDiaries();
    const filtered = diaries
      .filter((item) => item.date === date)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    setEntries(filtered);
  };

  const startNewEntry = (date: string) => {
    setActiveEntryId(uuidv4());
    setDiaryText("");
    setLocation("");
    setCurrentTime(formatTime(new Date()));
    setAchievement(null);
    setError(null);
    setNotice(null);
    loadEntries(date);
    const currentAchievements = getAchievements();
    setAchievementsMap(currentAchievements);
  };

  useEffect(() => {
    startNewEntry(selectedDate);
  }, [selectedDate]);

  const canGenerate = useMemo(() => diaryText.trim().length >= 5, [diaryText]);
  const isEditingExisting = useMemo(
    () => Boolean(activeEntryId && entries.some((entry) => entry.id === activeEntryId)),
    [activeEntryId, entries]
  );

  const handleSelectEntry = (entry: DiaryEntry) => {
    setActiveEntryId(entry.id);
    setDiaryText(entry.diaryText);
    setLocation(entry.location ?? "");
    setCurrentTime(entry.time);
    setAchievement(achievementsMap[entry.id] ?? null);
    setError(null);
    setNotice(null);
  };

  const handleDiaryChange = (value: string) => {
    if (!isEditingExisting && diaryText.trim().length === 0 && value.trim().length > 0) {
      setCurrentTime(formatTime(new Date()));
    }
    setDiaryText(value);
  };

  const handleSaveDiary = (): DiaryEntry | null => {
    if (!activeEntryId) return null;

    const diaries = getDiaries();
    const now = Date.now();
    const existingIndex = diaries.findIndex((entry) => entry.id === activeEntryId);

    const entry: DiaryEntry = {
      id: activeEntryId,
      date: selectedDate,
      time: currentTime,
      diaryText: diaryText.trim(),
      location: location.trim() || null,
      createdAt: existingIndex >= 0 ? diaries[existingIndex].createdAt : now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      diaries[existingIndex] = entry;
    } else {
      diaries.unshift(entry);
    }

    setDiaries(diaries);
    loadEntries(selectedDate);
    return entry;
  };

  const handleGenerate = async () => {
    setError(null);
    setNotice(null);

    if (!apiKey) {
      setError("还缺一把钥匙：请先在设置页填写 API Key。");
      return;
    }

    if (!canGenerate) {
      setError("再多写两句，成就系统就能更懂你。");
      return;
    }

    const entry = handleSaveDiary();
    if (!entry) return;

    const existingAchievement = achievementsMap[entry.id];
    if (existingAchievement) {
      const confirmed = window.confirm("这条记录已经生成过成就，要重新生成吗？");
      if (!confirmed) return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/achievement/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaryText: diaryText.trim(),
          date: selectedDate,
          location: location.trim() || null,
          provider: {
            providerType: "user_key",
            apiKey,
            baseUrl: providerConfig.baseUrl,
            path: providerConfig.path,
            model: providerConfig.model,
            authHeader: providerConfig.authHeader,
            authPrefix: providerConfig.authPrefix
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || "生成失败，请稍后重试");
      }

      const result = (await response.json()) as AchievementResult;
      const enriched: AchievementResult = {
        ...result,
        entryId: entry.id,
        date: entry.date
      };

      const achievements = getAchievements();
      achievements[entry.id] = enriched;
      setAchievements(achievements);
      setAchievementsMap(achievements);
      setAchievement(enriched);

      const profile = getProfile();
      const updatedProfile = applyXP(profile, enriched.xp);
      updatedProfile.lastSource = `${formatDate(entry.date)} ${entry.time} 日记成就`;
      setProfile(updatedProfile);
      setNotice(`成就到账，经验 +${enriched.xp}。`);
    } catch (err) {
      const fallback = buildFallbackAchievement(entry.id, entry.date, entry.location);
      const achievements = getAchievements();
      achievements[entry.id] = fallback;
      setAchievements(achievements);
      setAchievementsMap(achievements);
      setAchievement(fallback);

      const profile = getProfile();
      const updatedProfile = applyXP(profile, fallback.xp);
      updatedProfile.lastSource = `${formatDate(entry.date)} ${entry.time} 日记成就`;
      setProfile(updatedProfile);
      setNotice(`成就到账，经验 +${fallback.xp}。`);
    } finally {
      setLoading(false);
    }
  };

  const handleNewEntry = () => {
    startNewEntry(selectedDate);
  };

  const handleClearKey = () => {
    clearApiKey();
    setApiKeyState(null);
  };

  return (
    <div className="grid gap-6">
      <Card title="今日记录">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="grid gap-2 text-sm">
              日期
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2"
              />
            </label>
            <div className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm">
              记录时间：<span className="font-semibold">{currentTime}</span>
            </div>
            <button
              type="button"
              onClick={handleNewEntry}
              className="rounded-full border border-earth-accent/40 px-4 py-2 text-sm text-earth-accent"
            >
              新的记录
            </button>
          </div>

          {entries.length > 0 ? (
            <div className="rounded-lg border border-black/10 bg-white/70 px-4 py-3 text-sm">
              <div className="mb-2 font-semibold">今日记录</div>
              <div className="flex flex-wrap gap-2">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => handleSelectEntry(entry)}
                    className={`rounded-full px-3 py-1 text-xs transition ${
                      activeEntryId === entry.id
                        ? "bg-earth-accent text-white"
                        : "bg-black/5 text-earth-muted"
                    }`}
                  >
                    {entry.time} · {achievementsMap[entry.id]?.titles?.[0] ?? "还没解锁"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="grid gap-2 text-sm">
            日记内容
            <textarea
              rows={6}
              value={diaryText}
              onChange={(event) => handleDiaryChange(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="写下今天发生的事情、感受或小小的行动"
            />
            <span className="text-xs text-earth-muted">
              {diaryText.trim().length < 10
                ? "再多两句，成就系统就能更懂你。"
                : "记录已就绪，准备开奖。"}
            </span>
          </label>

          <label className="grid gap-2 text-sm">
            地点（可选）
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2"
              placeholder="城市或地点"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-full bg-earth-accent px-6 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "生成中..." : "开奖本次成就"}
            </button>
            <button
              type="button"
              onClick={handleSaveDiary}
              className="rounded-full border border-earth-accent/40 px-5 py-2 text-sm text-earth-accent"
            >
              先存一下
            </button>
            {apiKey ? (
              <button
                type="button"
                onClick={handleClearKey}
                className="text-xs text-earth-muted underline"
              >
                清除本地 API Key
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {notice ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {notice}
            </div>
          ) : null}
        </div>
      </Card>

      <Card title="成就卡">
        {achievement ? (
          <AchievementCard achievement={achievement} />
        ) : (
          <div className="rounded-lg border border-dashed border-black/10 bg-white/50 px-4 py-8 text-center text-sm text-earth-muted">
            等你提交记录，这里会弹出本次成就。
          </div>
        )}
      </Card>
    </div>
  );
}
