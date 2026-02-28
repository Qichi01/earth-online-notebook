"use client";

import { useEffect, useState } from "react";
import { VisualIcon } from "@/components/AchievementArtwork";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { getUnlockedBadges } from "@/lib/achievementVisuals";
import { getAchievements, getProfile } from "@/lib/storage";
import { calculateNextLevelXP } from "@/lib/xp";

export default function ProfilePage() {
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [nextXP, setNextXP] = useState(100);
  const [lastSource, setLastSource] = useState<string | undefined>(undefined);
  const [badges, setBadges] = useState<ReturnType<typeof getUnlockedBadges>>([]);

  useEffect(() => {
    const profile = getProfile();
    setLevel(profile.level);
    setCurrentXP(profile.currentXP);
    setNextXP(profile.nextLevelXP || calculateNextLevelXP(profile.level));
    setLastSource(profile.lastSource);
    setBadges(getUnlockedBadges(Object.values(getAchievements())));
  }, []);

  return (
    <div className="grid gap-6">
      <Card title="我的角色">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-earth-accent-soft text-xl font-semibold text-earth-accent">
            Lv.{level}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="text-sm text-earth-muted">当前等级</div>
              <div className="text-2xl font-semibold">Lv.{level}</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>经验值</span>
                <span>
                  {currentXP} / {nextXP}
                </span>
              </div>
              <ProgressBar value={currentXP} max={nextXP} />
            </div>
            {lastSource ? (
              <div className="text-sm text-earth-muted">最近来源：{lastSource}</div>
            ) : (
              <div className="text-sm text-earth-muted">还没拿到成就，先写一条开局记录吧。</div>
            )}
          </div>
        </div>
      </Card>

      <Card title="角色提示">
        <ul className="space-y-2 text-sm text-earth-muted">
          <li>每一条日记都会被翻译成成就与经验值。</li>
          <li>经验条只会上涨，不掉级，安心上分。</li>
          <li>成就卡就是你在地球 Online 的足迹证明。</li>
        </ul>
      </Card>

      <Card title="徽章柜">
        {badges.length === 0 ? (
          <div className="text-sm text-earth-muted">你还没解锁徽章。先写几条记录，系统会开始给你发装备。</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {badges.map((badge) => (
              <div key={badge.id} className="rounded-xl border border-earth-accent/20 bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-earth-accent-soft text-earth-accent">
                      <VisualIcon icon={badge.icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm text-earth-muted">{badge.categoryLabel}</div>
                      <div className="text-base font-semibold">{badge.name}</div>
                    </div>
                  </div>
                  <div className="rounded-full bg-earth-accent-soft px-3 py-1 text-xs font-semibold text-earth-accent">
                    该系记录 {badge.count} 次
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
