import { AchievementResult, DiaryEntry, ProfileState } from "@/lib/types";

const API_KEY = "earthonline_api_key";
const PROVIDER_CONFIG_KEY = "earthonline_provider_config";
const PROFILE_KEY = "earthonline_profile";
const DIARIES_KEY = "earthonline_diaries";
const ACHIEVEMENTS_KEY = "earthonline_achievements";
const LAST_SYNC_KEY = "earthonline_last_sync";

const defaultProfile: ProfileState = {
  level: 1,
  currentXP: 0,
  nextLevelXP: 100
};

export const defaultProviderConfig = {
  providerType: "user_key",
  apiKey: "",
  baseUrl: "https://open.bigmodel.cn/api/paas/v4",
  path: "/chat/completions",
  model: "glm-4.5-flash",
  authHeader: "Authorization",
  authPrefix: "Bearer "
} as const;

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isLegacyDiary(entry: DiaryEntry | (DiaryEntry & { time?: string })): entry is DiaryEntry {
  return typeof (entry as DiaryEntry).time === "string";
}

function formatTimeFromTimestamp(ts: number): string {
  const date = new Date(ts);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function migrateDiariesIfNeeded(raw: DiaryEntry[]): DiaryEntry[] {
  let changed = false;
  const migrated = raw.map((entry) => {
    if (isLegacyDiary(entry)) {
      return entry;
    }
    changed = true;
    const createdAt = entry.createdAt || Date.now();
    return {
      ...entry,
      time: formatTimeFromTimestamp(createdAt)
    };
  });

  if (changed && typeof window !== "undefined") {
    window.localStorage.setItem(DIARIES_KEY, JSON.stringify(migrated));
  }

  return migrated;
}

function isDateKey(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key);
}

function migrateAchievementsIfNeeded(
  raw: Record<string, AchievementResult>,
  diaries: DiaryEntry[]
): Record<string, AchievementResult> {
  const legacyKeys = Object.keys(raw).filter((key) => isDateKey(key));
  if (legacyKeys.length === 0) return raw;

  const byDate = new Map<string, DiaryEntry>();
  for (const entry of diaries) {
    if (!byDate.has(entry.date)) {
      byDate.set(entry.date, entry);
    }
  }

  const migrated: Record<string, AchievementResult> = {};
  for (const key of Object.keys(raw)) {
    const achievement = raw[key];
    if (isDateKey(key)) {
      const entry = byDate.get(key);
      if (!entry) continue;
      migrated[entry.id] = {
        ...achievement,
        entryId: entry.id,
        date: entry.date
      };
    } else {
      migrated[key] = achievement;
    }
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(migrated));
  }

  return migrated;
}

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(API_KEY);
}

export function setApiKey(value: string): void {
  window.localStorage.setItem(API_KEY, value);
}

export function clearApiKey(): void {
  window.localStorage.removeItem(API_KEY);
}

export function getProviderConfig() {
  if (typeof window === "undefined") return { ...defaultProviderConfig };
  const stored = safeParse(window.localStorage.getItem(PROVIDER_CONFIG_KEY), defaultProviderConfig);
  return { ...defaultProviderConfig, ...stored };
}

export function setProviderConfig(config: typeof defaultProviderConfig): void {
  window.localStorage.setItem(PROVIDER_CONFIG_KEY, JSON.stringify(config));
}

export function getProfile(): ProfileState {
  if (typeof window === "undefined") return defaultProfile;
  return safeParse(window.localStorage.getItem(PROFILE_KEY), defaultProfile);
}

export function setProfile(profile: ProfileState): void {
  const payload = { ...profile, updatedAt: profile.updatedAt ?? Date.now() };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
}

export function getDiaries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = safeParse(window.localStorage.getItem(DIARIES_KEY), [] as DiaryEntry[]);
  return migrateDiariesIfNeeded(raw);
}

export function setDiaries(entries: DiaryEntry[]): void {
  window.localStorage.setItem(DIARIES_KEY, JSON.stringify(entries));
}

export function getAchievements(): Record<string, AchievementResult> {
  if (typeof window === "undefined") return {};
  const diaries = getDiaries();
  const raw = safeParse(
    window.localStorage.getItem(ACHIEVEMENTS_KEY),
    {} as Record<string, AchievementResult>
  );
  return migrateAchievementsIfNeeded(raw, diaries);
}

export function setAchievements(map: Record<string, AchievementResult>): void {
  window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(map));
}

export function formatEntryDateTime(entry: DiaryEntry): string {
  return `${entry.date} ${entry.time}`;
}

export function getLastSyncAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LAST_SYNC_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function setLastSyncAt(value: number): void {
  window.localStorage.setItem(LAST_SYNC_KEY, String(value));
}
