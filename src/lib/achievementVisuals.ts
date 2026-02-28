import type { AchievementResult } from "@/lib/types";

export type AchievementCategory =
  | "cooking"
  | "movement"
  | "social"
  | "exploration"
  | "focus"
  | "rest"
  | "growth"
  | "daily";

export type BadgeTier = {
  id: string;
  name: string;
  threshold: number;
  icon: VisualIconName;
};

export type VisualIconName =
  | "spark"
  | "pan"
  | "shoe"
  | "map"
  | "tea"
  | "book"
  | "chat"
  | "leaf"
  | "star";

export type AchievementScene =
  | "mountain-night"
  | "city-night"
  | "cafe-table"
  | "bakery-cozy"
  | "mentor-talk"
  | "kitchen"
  | "street-walk"
  | "desk-focus"
  | "cozy-rest"
  | "growth-garden";

type CategoryConfig = {
  label: string;
  keywords: string[];
  palette: {
    background: string;
    border: string;
    accent: string;
    accentSoft: string;
    text: string;
  };
  badges: BadgeTier[];
  defaultIcons: VisualIconName[];
};

const CATEGORY_CONFIG: Record<AchievementCategory, CategoryConfig> = {
  cooking: {
    label: "厨艺系",
    keywords: ["做饭", "下厨", "烤", "煮", "炒", "炖", "汤", "烘焙", "厨房", "吃饭", "餐", "咖啡", "奶茶"],
    palette: {
      background: "#f7ede1",
      border: "#ddb98c",
      accent: "#b7743a",
      accentSoft: "#f1d6b5",
      text: "#5c3920"
    },
    badges: [
      { id: "cooking-1", name: "热锅新手", threshold: 1, icon: "pan" },
      { id: "cooking-2", name: "火候稳手", threshold: 3, icon: "spark" },
      { id: "cooking-3", name: "锅气大师", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["pan", "spark", "tea"]
  },
  movement: {
    label: "行动系",
    keywords: ["走", "跑", "运动", "健身", "散步", "骑车", "爬", "通勤", "训练", "拉伸"],
    palette: {
      background: "#e8f4ec",
      border: "#9cc7a5",
      accent: "#4b8a60",
      accentSoft: "#cde6d3",
      text: "#244731"
    },
    badges: [
      { id: "movement-1", name: "起步玩家", threshold: 1, icon: "shoe" },
      { id: "movement-2", name: "脚步发光体", threshold: 3, icon: "leaf" },
      { id: "movement-3", name: "耐力常驻者", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["shoe", "leaf", "spark"]
  },
  social: {
    label: "社交系",
    keywords: ["朋友", "聊天", "见面", "聚", "约", "电话", "家人", "同事", "沟通", "拜访"],
    palette: {
      background: "#efe9fb",
      border: "#c5b1e8",
      accent: "#7257b2",
      accentSoft: "#ddd0f3",
      text: "#39285f"
    },
    badges: [
      { id: "social-1", name: "开场白选手", threshold: 1, icon: "chat" },
      { id: "social-2", name: "气氛稳住员", threshold: 3, icon: "spark" },
      { id: "social-3", name: "关系维护师", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["chat", "spark", "leaf"]
  },
  exploration: {
    label: "探索系",
    keywords: ["出门", "旅行", "地图", "城市", "地方", "街区", "店", "展", "逛", "路线", "地铁"],
    palette: {
      background: "#e8f0fb",
      border: "#aac3e8",
      accent: "#4d76b8",
      accentSoft: "#d3e0f5",
      text: "#243d67"
    },
    badges: [
      { id: "exploration-1", name: "地标踩点员", threshold: 1, icon: "map" },
      { id: "exploration-2", name: "路线解锁者", threshold: 3, icon: "spark" },
      { id: "exploration-3", name: "城市漫游家", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["map", "spark", "shoe"]
  },
  focus: {
    label: "专注系",
    keywords: ["工作", "学习", "写", "完成", "推进", "任务", "项目", "复盘", "开会", "整理", "读书"],
    palette: {
      background: "#f0efe8",
      border: "#c8c4a8",
      accent: "#7a7152",
      accentSoft: "#dfdcc8",
      text: "#47402c"
    },
    badges: [
      { id: "focus-1", name: "待办清理员", threshold: 1, icon: "book" },
      { id: "focus-2", name: "专注续航体", threshold: 3, icon: "spark" },
      { id: "focus-3", name: "推进发动机", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["book", "spark", "leaf"]
  },
  rest: {
    label: "休整系",
    keywords: ["休息", "睡", "泡澡", "放空", "发呆", "照顾自己", "恢复", "吃药", "早睡", "午睡"],
    palette: {
      background: "#edf3f1",
      border: "#aac7c1",
      accent: "#5f887d",
      accentSoft: "#d7e7e2",
      text: "#294941"
    },
    badges: [
      { id: "rest-1", name: "回血学徒", threshold: 1, icon: "tea" },
      { id: "rest-2", name: "状态修理员", threshold: 3, icon: "leaf" },
      { id: "rest-3", name: "续命艺术家", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["tea", "leaf", "spark"]
  },
  growth: {
    label: "成长系",
    keywords: ["记录", "反思", "成长", "尝试", "练习", "坚持", "开始", "勇敢", "表达", "决定"],
    palette: {
      background: "#eef6e8",
      border: "#b7d29b",
      accent: "#6e9850",
      accentSoft: "#dcedcf",
      text: "#355025"
    },
    badges: [
      { id: "growth-1", name: "新芽记录员", threshold: 1, icon: "leaf" },
      { id: "growth-2", name: "经验采集者", threshold: 3, icon: "spark" },
      { id: "growth-3", name: "成长常驻客", threshold: 6, icon: "star" }
    ],
    defaultIcons: ["leaf", "book", "spark"]
  },
  daily: {
    label: "日常系",
    keywords: [],
    palette: {
      background: "#eef1ef",
      border: "#c9d2cd",
      accent: "#61766d",
      accentSoft: "#dde4df",
      text: "#30403a"
    },
    badges: [],
    defaultIcons: ["spark", "leaf", "star"]
  }
};

const ICON_KEYWORDS: Array<{ icon: VisualIconName; keywords: string[] }> = [
  { icon: "pan", keywords: ["饭", "面", "菜", "煮", "炒", "烘焙", "厨房", "咖啡", "奶茶"] },
  { icon: "shoe", keywords: ["走", "跑", "散步", "骑", "通勤", "爬", "运动"] },
  { icon: "map", keywords: ["出门", "城市", "地图", "地铁", "店", "旅行", "展"] },
  { icon: "chat", keywords: ["聊天", "见面", "朋友", "沟通", "电话", "家人", "同事"] },
  { icon: "book", keywords: ["写", "读", "学习", "工作", "整理", "项目", "复盘"] },
  { icon: "tea", keywords: ["休息", "泡澡", "睡", "喝", "照顾自己", "恢复"] },
  { icon: "leaf", keywords: ["成长", "记录", "练习", "开始", "坚持", "尝试"] },
  { icon: "spark", keywords: ["完成", "成就", "解锁", "推进", "成功"] }
];

function normalizeText(achievement: AchievementResult, extraText?: string) {
  return [achievement.titles.join(" "), achievement.description, achievement.tags.join(" "), achievement.location.city ?? ""]
    .concat(extraText ? [extraText] : [])
    .join(" ")
    .toLowerCase();
}

export function getAchievementCategory(achievement: AchievementResult, extraText?: string): AchievementCategory {
  const text = normalizeText(achievement, extraText);

  let matchedCategory: AchievementCategory = "daily";
  let matchedScore = 0;

  (Object.keys(CATEGORY_CONFIG) as AchievementCategory[]).forEach((category) => {
    const score = CATEGORY_CONFIG[category].keywords.reduce((total, keyword) => {
      return total + (text.includes(keyword) ? 1 : 0);
    }, 0);

    if (score > matchedScore) {
      matchedScore = score;
      matchedCategory = category;
    }
  });

  return matchedCategory;
}

export function getCategoryLabel(category: AchievementCategory) {
  return CATEGORY_CONFIG[category].label;
}

export function getCategoryPalette(category: AchievementCategory) {
  return CATEGORY_CONFIG[category].palette;
}

export function getAchievementIcons(achievement: AchievementResult, extraText?: string): VisualIconName[] {
  const text = normalizeText(achievement, extraText);
  const matched = ICON_KEYWORDS.filter((entry) => entry.keywords.some((keyword) => text.includes(keyword))).map(
    (entry) => entry.icon
  );

  const unique = Array.from(new Set(matched));
  if (unique.length >= 3) {
    return unique.slice(0, 3);
  }

  const category = getAchievementCategory(achievement, extraText);
  return Array.from(new Set([...unique, ...CATEGORY_CONFIG[category].defaultIcons])).slice(0, 3);
}

export function getAchievementScene(achievement: AchievementResult, extraText?: string): AchievementScene {
  const text = normalizeText(achievement, extraText);

  if (
    ["山", "山顶", "观景", "夜景", "灯火", "星", "爬山", "山路"].some((keyword) => text.includes(keyword))
  ) {
    return "mountain-night";
  }

  if (["城市", "街", "灯", "夜", "夜景", "散步", "地铁", "路线"].some((keyword) => text.includes(keyword))) {
    return "city-night";
  }

  if (["咖啡", "奶茶", "甜点", "店", "餐桌", "约会", "聊天"].some((keyword) => text.includes(keyword))) {
    return "cafe-table";
  }

  if (["面包", "蛋糕", "可颂", "甜品", "烘焙", "香味"].some((keyword) => text.includes(keyword))) {
    return "bakery-cozy";
  }

  if (["面试", "指导", "辅导", "帮助朋友", "模拟面试", "建议", "引路"].some((keyword) => text.includes(keyword))) {
    return "mentor-talk";
  }

  if (["做饭", "下厨", "煮", "炒", "炖", "厨房", "烘焙"].some((keyword) => text.includes(keyword))) {
    return "kitchen";
  }

  if (["散步", "走", "通勤", "骑车", "出门"].some((keyword) => text.includes(keyword))) {
    return "street-walk";
  }

  if (["工作", "学习", "复盘", "写", "整理", "项目", "读书"].some((keyword) => text.includes(keyword))) {
    return "desk-focus";
  }

  if (["休息", "睡", "泡澡", "放空", "恢复", "午睡", "早睡"].some((keyword) => text.includes(keyword))) {
    return "cozy-rest";
  }

  if (["成长", "练习", "记录", "开始", "坚持", "尝试"].some((keyword) => text.includes(keyword))) {
    return "growth-garden";
  }

  const category = getAchievementCategory(achievement, extraText);
  switch (category) {
    case "cooking":
      return "kitchen";
    case "movement":
      return "street-walk";
    case "social":
      return "cafe-table";
    case "exploration":
      return "city-night";
    case "focus":
      return "desk-focus";
    case "rest":
      return "cozy-rest";
    case "growth":
      return "growth-garden";
    default:
      return "city-night";
  }
}

export function getCategoryCount(
  achievement: AchievementResult,
  achievements: Record<string, AchievementResult> | AchievementResult[]
) {
  const values = Array.isArray(achievements) ? achievements : Object.values(achievements);
  const category = getAchievementCategory(achievement);
  return values.filter((item) => getAchievementCategory(item) === category).length;
}

export function getCurrentBadgeTier(
  achievement: AchievementResult,
  achievements: Record<string, AchievementResult> | AchievementResult[]
) {
  const category = getAchievementCategory(achievement);
  const config = CATEGORY_CONFIG[category];
  if (config.badges.length === 0) {
    return null;
  }

  const count = getCategoryCount(achievement, achievements);
  const unlocked = [...config.badges].reverse().find((badge) => count >= badge.threshold);
  return unlocked ?? null;
}

export type UnlockedBadge = BadgeTier & {
  category: AchievementCategory;
  categoryLabel: string;
  count: number;
};

export function getUnlockedBadges(achievements: AchievementResult[]): UnlockedBadge[] {
  const counts = new Map<AchievementCategory, number>();

  achievements.forEach((achievement) => {
    const category = getAchievementCategory(achievement);
    counts.set(category, (counts.get(category) ?? 0) + 1);
  });

  const unlocked: UnlockedBadge[] = [];

  counts.forEach((count, category) => {
    const config = CATEGORY_CONFIG[category];
    config.badges.forEach((badge) => {
      if (count >= badge.threshold) {
        unlocked.push({
          ...badge,
          category,
          categoryLabel: config.label,
          count
        });
      }
    });
  });

  return unlocked.sort((left, right) => {
    if (left.category === right.category) {
      return left.threshold - right.threshold;
    }
    return left.categoryLabel.localeCompare(right.categoryLabel, "zh-CN");
  });
}
