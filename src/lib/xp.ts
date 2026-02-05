import { ProfileState } from "@/lib/types";

export function calculateNextLevelXP(level: number): number {
  return 100 + (level - 1) * 50;
}

export function applyXP(profile: ProfileState, gained: number): ProfileState {
  let level = profile.level;
  let currentXP = profile.currentXP + gained;
  let nextLevelXP = calculateNextLevelXP(level);

  while (currentXP >= nextLevelXP) {
    currentXP -= nextLevelXP;
    level += 1;
    nextLevelXP = calculateNextLevelXP(level);
  }

  return {
    ...profile,
    level,
    currentXP,
    nextLevelXP
  };
}
