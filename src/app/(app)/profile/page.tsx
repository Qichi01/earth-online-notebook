"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { getProfile } from "@/lib/storage";
import { calculateNextLevelXP } from "@/lib/xp";

export default function ProfilePage() {
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [nextXP, setNextXP] = useState(100);
  const [lastSource, setLastSource] = useState<string | undefined>(undefined);

  useEffect(() => {
    const profile = getProfile();
    setLevel(profile.level);
    setCurrentXP(profile.currentXP);
    setNextXP(profile.nextLevelXP || calculateNextLevelXP(profile.level));
    setLastSource(profile.lastSource);
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
    </div>
  );
}
