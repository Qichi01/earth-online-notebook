export type DiaryEntry = {
  id: string;
  date: string;
  time: string;
  diaryText: string;
  location: string | null;
  createdAt: number;
  updatedAt: number;
};

export type AchievementResult = {
  entryId: string;
  date: string;
  titles: string[];
  description: string;
  xp: number;
  tags: string[];
  location: { city: string | null };
  achievement_version: string;
};

export type ProfileState = {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  lastSource?: string;
  updatedAt?: number;
};

export type ProviderConfig = {
  providerType: "user_key";
  apiKey: string;
  baseUrl: string;
  path: string;
  model: string;
  authHeader: string;
  authPrefix: string;
};

export type GeneratePayload = {
  diaryText: string;
  date: string;
  location: string | null;
  provider: ProviderConfig;
};
