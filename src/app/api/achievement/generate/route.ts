import { NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";
import type { ProviderRequest } from "@/lib/provider";

function buildPrompt(diaryText: string, date: string, location: string | null) {
  return `你是“地球 Online”的成就生成器。请根据用户日记内容，生成成就 JSON。\n\n输出要求（必须）：\n- 只输出 JSON，不要任何解释文本\n- 字段必须完整：titles, description, xp, tags, location.city, achievement_version\n- titles 数组长度固定为 1，只给一个最准确、最有记忆点的成就称号\n- 不要把同一件事拆成多个称号，不要并列总结\n- xp 为整数，范围 10～40\n- description 1 段中文，45～90 字\n- description 不要复述日记原文，不要把事件按时间顺序重讲一遍\n- description 要像“成就结算语”：先点出这件事厉害/可爱/好笑在哪里，再轻轻补一刀幽默感\n- tags 为 2～4 个中文短词，尽量具体、可视化，优先名词/动作，例如：山顶、灯火、散步、咖啡、朋友、复盘\n\n风格要求：\n- 像游戏成就播报 + 轻松吐槽，参考：\n  - “今天也是勤劳的牛马（划掉）打工人！”\n  - “头发之神保佑你！”\n  - “猫猫哲学家们不这样认为！”\n- 有温度、有成就感、略带幽默，但不要油腻\n- 不讽刺，不说教，不使用“你应该/你必须”\n\n成就称号规则：\n- 使用【】包裹\n- 偏“身份/角色”或“场景见证者”命名，例如【山顶观灯者】【深夜收尾员】\n- 4～8 个字为宜，优先具体、有画面感，避免空泛词，例如“幸福见证者”“美好体验家”这类尽量少用\n\n用户信息：\n- 日期：${date}\n- 地点：${location ?? "无"}\n- 日记：${diaryText}`;
}

function parseJsonContent(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end >= 0) {
      return JSON.parse(content.slice(start, end + 1));
    }
    throw new Error("MODEL_OUTPUT_PARSE_FAILED");
  }
}

function sanitizeResult(result: any) {
  const titleCandidate = Array.isArray(result?.titles) ? result.titles[0] : result?.titles;
  const titleText = String(titleCandidate || "【今日成就解锁】").trim();
  const normalizedTitle = titleText.startsWith("【") && titleText.endsWith("】")
    ? titleText
    : `【${titleText.replace(/[【】]/g, "")}】`;

  const rawDescription = String(result?.description || "").trim();
  const description = rawDescription
    .replace(/\s+/g, " ")
    .slice(0, 120) || "这波操作已经写进了地球 Online 的今日小传，系统决定给你发一点经验，顺手再鼓个掌。";

  const tags = Array.isArray(result?.tags)
    ? result.tags.map((item: unknown) => String(item).trim()).filter(Boolean).slice(0, 4)
    : [];

  return {
    titles: [normalizedTitle],
    description,
    xp: Number.isFinite(Number(result?.xp)) ? Math.max(10, Math.min(40, Number(result.xp))) : 15,
    tags,
    location: {
      city: typeof result?.location?.city === "string" ? result.location.city : null
    },
    achievement_version: String(result?.achievement_version || "v2")
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { diaryText, date, location, provider } = body;

    if (!provider?.apiKey) {
      return NextResponse.json(
        { error: "MISSING_API_KEY", message: "请先在设置页填写 API Key" },
        { status: 400 }
      );
    }

    if (!diaryText || !date) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "日记内容或日期为空" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(diaryText, date, location ?? null);

    const providerRequest: ProviderRequest = {
      providerType: "openai_compatible",
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl,
      path: provider.path,
      model: provider.model,
      auth: {
        header: provider.authHeader || "Authorization",
        prefix: provider.authPrefix || "Bearer "
      }
    };
    const providerInstance = getProvider(providerRequest);
    const { content } = await providerInstance.generateJson(prompt, providerRequest);
    const result = sanitizeResult(parseJsonContent(content));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "服务异常，请稍后重试" },
      { status: 500 }
    );
  }
}
