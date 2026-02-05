import type { SupabaseClient } from "@supabase/supabase-js";
import type { AchievementResult, DiaryEntry, ProfileState } from "@/lib/types";
import {
  getAchievements,
  getDiaries,
  getProfile,
  setAchievements,
  setDiaries,
  setLastSyncAt,
  setProfile
} from "@/lib/storage";

const PROFILE_TABLE = "profiles";
const DIARIES_TABLE = "diaries";
const ACHIEVEMENTS_TABLE = "achievements";

export async function syncLocalToCloud(client: SupabaseClient) {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const profile = getProfile();
  const diaries = getDiaries();
  const achievements = getAchievements();

  await client.from(PROFILE_TABLE).upsert({
    id: user.id,
    email: user.email,
    level: profile.level,
    current_xp: profile.currentXP,
    next_level_xp: profile.nextLevelXP,
    last_source: profile.lastSource ?? null,
    updated_at: new Date(profile.updatedAt ?? Date.now()).toISOString()
  });

  if (diaries.length > 0) {
    await client.from(DIARIES_TABLE).upsert(
      diaries.map((entry) => ({
        id: entry.id,
        user_id: user.id,
        date: entry.date,
        time: entry.time,
        diary_text: entry.diaryText,
        location: entry.location,
        created_at: new Date(entry.createdAt).toISOString(),
        updated_at: new Date(entry.updatedAt).toISOString()
      }))
    );
  }

  const achievementRows = Object.values(achievements);
  if (achievementRows.length > 0) {
    await client.from(ACHIEVEMENTS_TABLE).upsert(
      achievementRows.map((achievement) => ({
        id: achievement.entryId,
        user_id: user.id,
        entry_id: achievement.entryId,
        date: achievement.date,
        titles: achievement.titles,
        description: achievement.description,
        xp: achievement.xp,
        tags: achievement.tags,
        location_city: achievement.location?.city ?? null,
        achievement_version: achievement.achievement_version,
        created_at: new Date().toISOString()
      }))
    );
  }

  setLastSyncAt(Date.now());
}

export async function pullCloudToLocal(client: SupabaseClient) {
  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user) {
    throw new Error("NOT_AUTHENTICATED");
  }

  const { data: profileRow } = await client
    .from(PROFILE_TABLE)
    .select("level,current_xp,next_level_xp,last_source,updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileRow) {
    const localProfile = getProfile();
    const remoteUpdatedAt = profileRow.updated_at ? new Date(profileRow.updated_at).getTime() : 0;
    if (!localProfile.updatedAt || remoteUpdatedAt > localProfile.updatedAt) {
      setProfile({
        level: profileRow.level,
        currentXP: profileRow.current_xp,
        nextLevelXP: profileRow.next_level_xp,
        lastSource: profileRow.last_source ?? undefined,
        updatedAt: remoteUpdatedAt
      });
    }
  }

  const { data: diaryRows } = await client
    .from(DIARIES_TABLE)
    .select("id,date,time,diary_text,location,created_at,updated_at")
    .eq("user_id", user.id);

  if (diaryRows) {
    const localDiaries = getDiaries();
    const localMap = new Map(localDiaries.map((entry) => [entry.id, entry]));

    diaryRows.forEach((row) => {
      const existing = localMap.get(row.id);
      const remoteUpdatedAt = row.updated_at ? new Date(row.updated_at).getTime() : 0;
      if (!existing || remoteUpdatedAt > existing.updatedAt) {
        localMap.set(row.id, {
          id: row.id,
          date: row.date,
          time: row.time,
          diaryText: row.diary_text,
          location: row.location,
          createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          updatedAt: remoteUpdatedAt || Date.now()
        });
      }
    });

    setDiaries(Array.from(localMap.values()).sort((a, b) => b.updatedAt - a.updatedAt));
  }

  const { data: achievementRows } = await client
    .from(ACHIEVEMENTS_TABLE)
    .select(
      "entry_id,date,titles,description,xp,tags,location_city,achievement_version,created_at"
    )
    .eq("user_id", user.id);

  if (achievementRows) {
    const localAchievements = getAchievements();
    achievementRows.forEach((row) => {
      if (!localAchievements[row.entry_id]) {
        localAchievements[row.entry_id] = {
          entryId: row.entry_id,
          date: row.date,
          titles: row.titles,
          description: row.description,
          xp: row.xp,
          tags: row.tags,
          location: { city: row.location_city ?? null },
          achievement_version: row.achievement_version
        };
      }
    });
    setAchievements(localAchievements);
  }

  setLastSyncAt(Date.now());
}
